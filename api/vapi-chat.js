// Vercel serverless function for VAPI chat proxy
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message, chatId } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Input sanitization
    const sanitizedMessage = message.replace(/[<>&"']/g, (char) => {
      const chars = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return chars[char] || char;
    });

    // Rate limiting check (simple in-memory for demo)
    const clientId = req.headers['x-forwarded-for'] || 'unknown';
    
    // In production, you would integrate with your actual VAPI backend or AI service here
    // For now, we'll provide intelligent responses based on the message content
    const response = generateIntelligentResponse(sanitizedMessage);

    res.status(200).json({
      response,
      chatId: chatId || Date.now().toString(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat service temporarily unavailable' });
  }
}

function generateIntelligentResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Solar panels and specifications
  if (lowerMessage.includes('solar') || lowerMessage.includes('panel')) {
    return "Excellent question about our solar solutions! Green Star Solar specializes in premium Aiko Neostar 2S N-type panels with 23.1% efficiency and 25-year warranties. These panels are perfect for UK homes and can reduce your electricity bills by up to 90%. Would you like specific technical details or information about installation for your property?";
  }
  
  // Pricing and costs
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote')) {
    return "Solar system pricing varies based on your home's energy needs and roof specifications. Our complete systems typically range from £6,000-£15,000 including professional installation, warranties, and grid connection. We offer free consultations with personalized quotes. Would you like me to connect you with our team for an accurate assessment?";
  }
  
  // Installation process
  if (lowerMessage.includes('install') || lowerMessage.includes('process')) {
    return "Our installation process is streamlined and professional: 1) Free consultation and roof survey, 2) Custom system design using CAD technology, 3) Professional installation by MCS-certified engineers, 4) Grid connection and system commissioning. Installation typically takes 1-2 days. We handle all permits and paperwork. What aspect of the installation would you like to know more about?";
  }
  
  // Battery storage
  if (lowerMessage.includes('battery') || lowerMessage.includes('storage')) {
    return "Battery storage is an excellent addition! We offer Fox ESS, SolarEdge, and EcoFlow battery systems that store excess solar energy for evening use or power cuts. Batteries can increase your savings by 30-40% by reducing grid dependence and allowing you to use cheap overnight tariffs. Our batteries come with 10+ year warranties. Interested in battery specifications?";
  }
  
  // Warranties and guarantees
  if (lowerMessage.includes('warranty') || lowerMessage.includes('guarantee')) {
    return "We provide industry-leading warranties: 25-year product warranty on Aiko Neostar panels, 30-year performance guarantee, 10+ year battery warranties, and comprehensive installation warranty. Our panels have minimal degradation (≤0.3% annually) and we guarantee 90% performance after 25 years. All warranties are backed by our insurance and manufacturer support.";
  }
  
  // Efficiency and performance
  if (lowerMessage.includes('efficiency') || lowerMessage.includes('performance')) {
    return "Our Aiko Neostar 2S panels achieve up to 23.1% efficiency - among the highest in the industry! They feature advanced N-type technology, superior temperature coefficient (-0.26%/°C), and built-in optimization for shaded conditions. This means maximum energy generation even in UK weather conditions. Performance monitoring is included to track your system's output.";
  }
  
  // Savings and bills
  if (lowerMessage.includes('save') || lowerMessage.includes('bill')) {
    return "Solar savings are substantial! Most customers reduce electricity bills by 70-90%. A typical 4kW system saves £800-1,200 annually, paying for itself in 6-8 years. Over 25 years, total savings often exceed £20,000. Battery storage increases savings further by storing excess energy and utilizing cheap overnight tariffs. Your exact savings depend on your current usage and roof orientation.";
  }
  
  // Consultation and contact
  if (lowerMessage.includes('consultation') || lowerMessage.includes('visit') || lowerMessage.includes('contact')) {
    return "We'd love to help with a free consultation! Our process includes a detailed site survey, energy usage analysis, and custom system design. We'll provide accurate quotes, financing options, and timeline estimates. You can reach us at 0800 123 4567, email info@greenstarsolar.co.uk, or book online. We cover all of the UK and offer weekend appointments.";
  }
  
  // Financing options
  if (lowerMessage.includes('finance') || lowerMessage.includes('payment') || lowerMessage.includes('loan')) {
    return "We offer flexible financing options including: 0% APR finance packages, Green Deal loans, solar panel leasing, and Buy Now Pay Later schemes. Many customers pay nothing upfront and still save money from day one through reduced electricity bills. We'll help you find the best financing solution for your situation. Would you like details about our current finance offers?";
  }
  
  // General greeting or help
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
    return "Hello! I'm Sophie, your Green Star Solar expert. I'm here to help with everything about solar panels - from technical specifications and pricing to installation and financing. Whether you're curious about our premium Aiko Neostar panels, want to calculate potential savings, or need installation details, just ask! What would you like to know?";
  }
  
  // Default response
  return "Thank you for your question! I'm here to help with all aspects of solar energy - panel specifications, installation, pricing, warranties, battery storage, and financing options. Our Aiko Neostar 2S panels offer exceptional 23.1% efficiency with 25-year warranties. Feel free to ask about savings calculations, installation timelines, or to schedule a free consultation. What specific information would be most helpful?";
}