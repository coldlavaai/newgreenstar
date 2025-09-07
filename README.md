# Green Star Solar - Premium Solar Panel Website

A modern, mobile-first website for Green Star Solar featuring premium Aiko Neostar 2S solar panels, intelligent chat support, and seamless Vercel deployment.

## 🌟 Features

- **Premium Design**: Sophisticated color palette with mobile-first responsive design
- **AI Chat Assistant**: Intelligent chat widget with voice capabilities (VAPI integration)
- **Rich Content**: Comprehensive information about Aiko Neostar 2S panels and services
- **Modern Tech Stack**: Built for Vercel deployment with serverless functions
- **Security**: Rate limiting, XSS protection, and secure API endpoints

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/greenstar-solar)

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/greenstar-solar.git
   cd greenstar-solar
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set up environment variables (see below)
   - Deploy!

## 🔧 Environment Variables

Set these in your Vercel dashboard for full functionality:

```bash
# Required for voice chat functionality
VAPI_PUBLIC_API_KEY=your_vapi_public_api_key
VAPI_ASSISTANT_ID=your_vapi_assistant_id

# Security (set to your domain)
ALLOWED_ORIGINS=https://your-domain.vercel.app
```

## 📱 VAPI Integration

To enable voice chat:

1. Sign up at [VAPI.ai](https://vapi.ai)
2. Create an assistant in your dashboard
3. Get your public API key and assistant ID
4. Set the environment variables in Vercel
5. Voice chat will automatically activate!

## 🎨 Color Palette

- **Charcoal** (#444c5c) - Primary text and accents  
- **Sage** (#adae88) - Buttons and highlights
- **Black Olive** (#2c3421) - Section backgrounds
- **Outer Space** (#4b5961) - Secondary elements
- **Black** (#06070a) - Footer and dark sections

## 📂 Project Structure

```
greenstar-solar/
├── public/           # Static website files
├── api/             # Vercel serverless functions
├── src/widget/      # Widget components
├── tests/           # Testing files
├── docs/            # Documentation
└── vercel.json      # Vercel configuration
```

## 🚀 Features

### 🏠 Solar Panel Information
- Aiko Neostar 2S specifications (23.1% efficiency)
- 25-year product warranty, 30-year performance warranty
- Battery storage options (Fox ESS, SolarEdge, EcoFlow)
- Professional installation process

### 💬 Intelligent Chat
- Context-aware responses about solar panels
- Pricing information and consultation booking
- Technical specifications and warranty details
- Rate limiting and security protection

### 📱 Mobile Excellence
- Touch-optimized interface
- Responsive chat widget
- Premium animations and micro-interactions
- Progressive Web App capabilities

## 🔒 Security Features

- XSS protection and input sanitization
- Rate limiting (20 requests/minute)
- Secure environment variable management
- CORS protection

## 📞 Contact Information

- **Phone**: 0800 123 4567
- **Email**: info@greenstarsolar.co.uk
- **Address**: Solent Business Park, Whiteley

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

---

Built with ❤️ for sustainable energy solutions.