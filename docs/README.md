# 🌟 Green Star Solar VAPI Chat Widget

A professional, **production-ready** AI chat widget powered by VAPI, designed for seamless integration into any website. Features both voice and text chat capabilities with a premium UI/UX and **enterprise-grade security**.

## ✨ Features

- **🎤 Voice Chat** - Real-time voice conversations with AI assistant
- **💬 Text Chat** - Traditional text-based chat interface  
- **📱 Mobile Responsive** - Works perfectly on all devices
- **🎨 Premium Design** - Professional UI with smooth animations
- **🔒 Enterprise Security** - Hardened against XSS, tampering, and abuse
- **🛡️ Zero Credential Exposure** - No API keys in frontend code
- **🚦 Rate Limiting** - Built-in DOS protection and abuse prevention
- **🚀 Universal Compatibility** - Works on any website/hosting platform
- **⚡ Easy Integration** - Simple copy-paste installation
- **📊 Security Monitoring** - Real-time attack detection and logging

## 🏠 Demo

**Live Demo:** [https://coldlavaai.github.io/greenstar/](https://coldlavaai.github.io/greenstar/)

## 📦 What's Included

```
greenstar/
├── index.html                # Demo site with full implementation
├── widget/                   # Widget installation files
│   ├── widget-install.md     # Complete installation guide  
│   ├── widget.html           # Standard widget (requires backend)
│   ├── widget-secure.html    # 🔒 HARDENED widget (production ready)
│   ├── widget.css            # Widget styles (extracted)
│   └── widget.js             # Widget functionality (extracted)
├── backend/                  # 🔒 SECURE backend (REQUIRED for production)
│   ├── vapi-proxy.js         # Basic Node.js proxy server
│   ├── vapi-proxy-secure.js  # 🔒 HARDENED proxy server
│   ├── test-security.js      # Security testing suite
│   ├── package.json          # Backend dependencies
│   └── .env.example          # Environment variables template
├── SECURITY.md               # Security implementation details
├── SECURITY-HARDENED.md      # 🔒 PRODUCTION security guide
└── README.md                 # This file
```

## 🔒 SECURITY FIRST

**⚠️ IMPORTANT**: For production deployments, use the **hardened security version**:

### 🛡️ **PRODUCTION (Secure)**
```bash
# 1. Deploy secure backend
cd backend && npm install
cp .env.example .env  # Add your API keys
npm run start:secure

# 2. Use hardened widget
# Copy contents of widget/widget-secure.html to your site
```

### ⚡ **DEVELOPMENT (Quick Test)**
```bash  
# Use widget/widget.html for development only
# See widget/widget-install.md for platform instructions
```

**📖 Full Security Guide**: [SECURITY-HARDENED.md](./SECURITY-HARDENED.md)

## 🚀 Quick Start

### 🎯 **VERCEL DEPLOYMENT (Recommended)**
```bash
# Deploy to Vercel with GitHub integration:
# 1. Push your code to GitHub repository
# 2. Connect Vercel to your GitHub account
# 3. Import your repository to Vercel
# 4. Configure environment variables for backend
# 5. Deploy and your site is live! ✅
```

### Option 1: Maximum Security (Production)
1. **Deploy Backend**: Follow [SECURITY-HARDENED.md](./SECURITY-HARDENED.md) guide
2. **Install Widget**: Use `widget-secure.html` for tamper-proof deployment
3. **Configure Security**: Set up rate limiting, CORS, and monitoring

### Option 2: Other Platforms
See [widget/widget-install.md](./widget/widget-install.md) for WordPress, Shopify, React, Vue, etc.

### Option 3: View Live Demo
Visit the [live demo](https://coldlavaai.github.io/greenstar/) to see the widget in action.

## 🔧 Platform Support

✅ **Vercel** (🎯 OPTIMIZED - Perfect for modern deployments!)  
✅ **Static Sites** (GitHub Pages, Netlify, Vercel)  
✅ **WordPress** (Custom HTML or plugin)  
✅ **Shopify** (Theme customization)  
✅ **React/Vue/Angular** (Component integration)  
✅ **Webflow, Squarespace, Wix** (Custom code blocks)  
✅ **Custom Applications** (Any HTML/CSS/JS site)  
✅ **CMS Platforms** (Drupal, Joomla, etc.)  

## 🔒 Security

- **Smart API Strategy** - Uses secure backend proxy when available
- **Environment Detection** - Graceful fallbacks for any hosting
- **No Exposed Secrets** - API keys properly handled
- **CORS Compliant** - Works across all domains

## 🎯 Perfect For

- **Solar Companies** - Pre-configured for solar industry
- **Service Businesses** - Easy to customize for any industry  
- **E-commerce** - Product support and sales assistance
- **Lead Generation** - Capture and qualify prospects
- **Customer Support** - 24/7 automated assistance

## 📱 Technical Specs

- **Frontend:** Pure HTML/CSS/JavaScript (no frameworks required)
- **AI Engine:** VAPI (Voice API)
- **Voice:** Real-time speech-to-text and text-to-speech
- **Responsive:** Mobile-first design
- **Performance:** Lightweight, fast loading
- **Accessibility:** ARIA compliant, keyboard navigation

## 🛠️ Customization

The widget is fully customizable:
- Colors and branding
- Button text and positioning
- Voice/text modes
- API endpoints
- UI animations and effects

## 📞 Support

For questions, customization requests, or technical support:
- 📧 Email: hello@coldlava.ai
- 🐛 Issues: [GitHub Issues](https://github.com/coldlavaai/greenstar/issues)
- 💬 Chat: Use the widget on our demo site!

## 📄 License

This widget is available for commercial use. Please contact us for licensing details.

---

**Built with ❤️ by Cold Lava AI**