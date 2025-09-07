// Vercel serverless function to provide VAPI configuration
export default async function handler(req, res) {
  // CORS headers for security
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Return VAPI configuration - these should be set in Vercel environment variables
    const config = {
      publicApiKey: process.env.VAPI_PUBLIC_API_KEY || 'demo-key',
      assistantId: process.env.VAPI_ASSISTANT_ID || 'demo-assistant-id',
      serverEndpoint: process.env.VAPI_SERVER_ENDPOINT || 'https://api.vapi.ai',
      features: {
        voiceEnabled: !!process.env.VAPI_PUBLIC_API_KEY,
        textEnabled: true
      }
    };

    res.status(200).json(config);
  } catch (error) {
    console.error('VAPI config error:', error);
    res.status(500).json({ error: 'Configuration unavailable' });
  }
}