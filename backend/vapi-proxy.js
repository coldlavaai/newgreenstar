const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables (keep these secret!)
const VAPI_API_KEY = process.env.VAPI_API_KEY || 'bb0b198b-1a8f-4675-bdf8-8a865fc5d68a';
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID || 'a555d10b-c769-4959-8595-24673d6fbf37';

// Proxy endpoint for VAPI text chat
app.post('/api/vapi/chat', async (req, res) => {
  try {
    const { input, previousChatId } = req.body;
    
    // Validate input
    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return res.status(400).json({ error: 'Valid input is required' });
    }

    // Call VAPI API
    const response = await fetch('https://api.vapi.ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VAPI_API_KEY}`
      },
      body: JSON.stringify({
        assistantId: VAPI_ASSISTANT_ID,
        input: input.trim(),
        previousChatId: previousChatId || undefined
      })
    });

    if (!response.ok) {
      console.error('VAPI API error:', response.status, response.statusText);
      return res.status(response.status).json({ 
        error: `VAPI API error: ${response.status}` 
      });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get assistant ID for voice calls (still secure as it's server-side)
app.get('/api/vapi/config', (req, res) => {
  res.json({ 
    assistantId: VAPI_ASSISTANT_ID 
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`VAPI Proxy server running on port ${PORT}`);
});