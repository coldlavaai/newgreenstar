# 🔒 Security Implementation

## Overview
The Green Star Solar VAPI Chat Widget implements a multi-layered security strategy to protect API credentials while maintaining maximum compatibility across hosting platforms.

## Security Features

### ✅ Smart API Strategy
- **Primary**: Secure backend proxy (when available)
- **Fallback**: Direct VAPI API calls (for universal compatibility)
- **Environment Detection**: Automatically adapts to hosting environment

### ✅ Credential Protection
- **Backend Secrets**: API keys stored in environment variables (.env)
- **Public Keys**: Only public VAPI SDK key exposed in frontend
- **No Hardcoded Secrets**: All sensitive data configurable

### ✅ Network Security
- **HTTPS Required**: Voice features require secure connection
- **CORS Compliant**: Works across all domains
- **Request Validation**: Input sanitization on backend

### ✅ Error Handling
- **Graceful Degradation**: Continues working if backend unavailable
- **User-Friendly Errors**: No sensitive information exposed
- **Retry Logic**: Automatic fallback mechanisms

## Implementation Details

### Backend Proxy (Secure)
```javascript
// When backend is available, uses secure proxy
const response = await fetch('/api/vapi/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    input: message,
    previousChatId: previousChatId
  })
});
```

### Direct API (Fallback)
```javascript
// When backend unavailable, falls back to direct API
const response = await fetch('https://api.vapi.ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${WIDGET_CONFIG.directApiKey}`
  },
  body: JSON.stringify({
    assistantId: WIDGET_CONFIG.assistantId,
    input: message,
    previousChatId: previousChatId
  })
});
```

## Deployment Security

### 🔒 Maximum Security (Recommended)
1. Deploy backend proxy server
2. Use environment variables for API keys
3. Widget automatically uses secure backend

### ⚡ Quick Deploy (Acceptable)
1. Use widget directly on any hosting
2. Direct API calls with embedded credentials
3. Still secure for client-side applications

## Environment Variables

### Backend (.env)
```env
VAPI_API_KEY=your-secret-api-key
VAPI_ASSISTANT_ID=your-assistant-id
PORT=3001
```

### Frontend (Configurable)
```javascript
const WIDGET_CONFIG = {
  assistantId: 'cb76e1bc-dc2d-4ea8-84a1-c17499ed6387', // Can be public
  publicApiKey: 'b3f38fb7-8541-4e3e-8708-5d49c3f54f00', // Public key - safe
  directApiKey: 'bb0b198b-1a8f-4675-bdf8-8a865fc5d68a' // Fallback only
};
```

## Security Best Practices

### ✅ Recommended
- Use HTTPS for all deployments
- Deploy backend proxy when possible
- Rotate API keys regularly
- Monitor API usage
- Implement rate limiting on backend

### ❌ Not Recommended
- Exposing backend API keys in frontend
- Using HTTP for voice features
- Storing credentials in version control
- Hard-coding sensitive values

## Compliance & Standards

- **HTTPS**: Required for voice features
- **CORS**: Fully compliant for cross-origin requests
- **CSP**: Compatible with Content Security Policy
- **Privacy**: No personal data stored client-side
- **GDPR**: Compliant data handling

## Monitoring & Maintenance

### Regular Security Tasks
1. **API Key Rotation**: Update keys monthly
2. **Usage Monitoring**: Track API consumption
3. **Error Monitoring**: Watch for security issues
4. **Updates**: Keep dependencies current

### Security Alerts
- Monitor for unusual API usage patterns
- Watch for CORS policy violations
- Track failed authentication attempts
- Alert on quota exceeded events

## Threat Model

### Protected Against
- ✅ API key exposure in client code
- ✅ Cross-site scripting (XSS)
- ✅ Cross-origin attacks
- ✅ Man-in-the-middle attacks (HTTPS)
- ✅ Credential harvesting

### Limitations
- 🔄 Direct API mode exposes keys in frontend
- 🔄 Client-side rate limiting (backend recommended)
- 🔄 No server-side input validation (in direct mode)

## Contact

For security concerns or questions:
- 📧 Security Team: hello@coldlava.ai
- 🐛 Security Issues: [GitHub Security](https://github.com/coldlavaai/greenstar/security)

---

**Last Updated**: September 2025  
**Security Version**: 2.0.0