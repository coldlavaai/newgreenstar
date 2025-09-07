const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 🔒 SECURITY: Enhanced security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      connectSrc: ["'self'", "https://api.vapi.ai"],
      imgSrc: ["'self'", "https:", "data:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// 🔒 SECURITY: Rate limiting
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per minute
  message: {
    error: 'Too many requests, please try again later',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests, please try again later',
      retryAfter: 60
    });
  }
});

const configLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Limit config requests
  message: { error: 'Too many config requests' }
});

// 🔒 SECURITY: CORS with specific origins (configure for your domains)
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-domain.com',
  'https://coldlavaai.github.io'
  // Add your production domains here
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 🔒 SECURITY: Body parsing with size limits
app.use(express.json({ 
  limit: '1mb',
  verify: (req, res, buf) => {
    // Additional validation can be added here
    req.rawBody = buf;
  }
}));

// 🔒 SECURITY: Input validation and sanitization
const validateChatInput = (req, res, next) => {
  const { input, previousChatId } = req.body;
  
  // Validate input
  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Valid input string is required' });
  }
  
  // Sanitize and validate length
  const trimmedInput = input.trim();
  if (trimmedInput.length === 0) {
    return res.status(400).json({ error: 'Input cannot be empty' });
  }
  
  if (trimmedInput.length > 500) {
    return res.status(400).json({ error: 'Input too long (max 500 characters)' });
  }
  
  // Check for potential XSS or code injection
  if (/<script|javascript:|on\w+=/i.test(trimmedInput)) {
    console.warn(`XSS attempt detected from IP: ${req.ip}, input: ${trimmedInput.substring(0, 100)}`);
    return res.status(400).json({ error: 'Invalid input detected' });
  }
  
  if (trimmedInput.includes('eval(') || trimmedInput.includes('Function(')) {
    console.warn(`Code injection attempt from IP: ${req.ip}, input: ${trimmedInput.substring(0, 100)}`);
    return res.status(400).json({ error: 'Invalid input detected' });
  }
  
  // Validate previousChatId if provided
  if (previousChatId && (!validator.isUUID(previousChatId) && !validator.isAlphanumeric(previousChatId))) {
    return res.status(400).json({ error: 'Invalid chat ID format' });
  }
  
  // Sanitize input
  req.body.input = validator.escape(trimmedInput);
  next();
};

// 🔒 SECURITY: Environment variables validation
const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;
const VAPI_PUBLIC_API_KEY = process.env.VAPI_PUBLIC_API_KEY;

if (!VAPI_API_KEY || !VAPI_ASSISTANT_ID) {
  console.error('🚨 SECURITY ERROR: Missing required environment variables');
  process.exit(1);
}

// 🔒 SECURITY: Request logging and monitoring
const logRequest = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${ip} - UA: ${userAgent.substring(0, 100)}`);
  next();
};

app.use(logRequest);

// 🔒 SECURITY: Security event logging endpoint
app.post('/api/security/log', express.json(), (req, res) => {
  const { event, details, timestamp, url } = req.body;
  const ip = req.ip || req.connection.remoteAddress;
  const logTime = new Date().toISOString();
  
  console.warn(`[SECURITY] ${logTime} - Event: ${event}, IP: ${ip}, URL: ${url}, Details:`, details);
  
  // In production, you might want to send this to a security monitoring service
  // or write to a dedicated security log file
  
  res.status(200).json({ status: 'logged' });
});

// 🔒 ENHANCED: Secure VAPI chat proxy with comprehensive validation
app.post('/api/vapi/chat', chatLimiter, validateChatInput, async (req, res) => {
  try {
    const { input, previousChatId } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    
    console.log(`Chat request from IP: ${ip}, input length: ${input.length}`);
    
    // Call VAPI API with enhanced error handling
    const response = await fetch('https://api.vapi.ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'User-Agent': 'Green-Star-Solar-Widget/2.0'
      },
      body: JSON.stringify({
        assistantId: VAPI_ASSISTANT_ID,
        input: input,
        previousChatId: previousChatId || undefined
      }),
      timeout: 30000 // 30 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`VAPI API error: ${response.status} ${response.statusText}`, errorText);
      
      // Return generic error to prevent information leakage
      if (response.status >= 500) {
        return res.status(503).json({ 
          error: 'Service temporarily unavailable. Please try again later.' 
        });
      } else {
        return res.status(400).json({ 
          error: 'Unable to process request. Please try again.' 
        });
      }
    }

    const data = await response.json();
    
    // Validate and sanitize response before sending to client
    if (data.output && Array.isArray(data.output)) {
      data.output = data.output.map(item => ({
        ...item,
        content: item.content ? validator.escape(item.content) : item.content
      }));
    }
    
    res.json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    
    // Generic error response to prevent information leakage
    res.status(500).json({ 
      error: 'Service temporarily unavailable. Please try again later.' 
    });
  }
});

// 🔒 ENHANCED: Secure config endpoint with minimal data exposure
app.get('/api/vapi/config', configLimiter, (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`Config request from IP: ${ip}`);
  
  // Only return what's absolutely necessary for the widget to function
  res.json({ 
    assistantId: VAPI_ASSISTANT_ID,
    publicApiKey: VAPI_PUBLIC_API_KEY, // Only for voice functionality
    hasSecureBackend: true,
    version: '2.0.0'
  });
});

// 🔒 SECURITY: Health check with minimal information
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// 🔒 SECURITY: Catch all other routes
app.use('*', (req, res) => {
  console.warn(`404 - Route not found: ${req.method} ${req.originalUrl} from IP: ${req.ip}`);
  res.status(404).json({ error: 'Endpoint not found' });
});

// 🔒 SECURITY: Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  });
});

// 🔒 SECURITY: Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

const server = app.listen(PORT, () => {
  console.log(`🔒 Secure VAPI Proxy server running on port ${PORT}`);
  console.log(`🛡️ Security features enabled:
    - Rate limiting: 20 req/min per IP
    - Input validation and sanitization
    - XSS and injection protection
    - CORS origin validation
    - Security headers (Helmet)
    - Request logging
    - Error handling without info leakage`);
});

// 🔒 SECURITY: Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

module.exports = app;