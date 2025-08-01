# Aurora - Autism Support Assistant 🧩

Aurora is a specialized virtual health agent designed to provide evidence-based information and support specifically about Autism Spectrum Disorder. Built with a focus on smooth user experience and graceful handling of user input variations.

## ✨ Key Features

- **Knowledge-Base Powered**: Fast responses from curated autism expertise
- **Three-Layer Intelligence**: Gatekeeper → Expert → Scholar architecture  
- **Autism-Focused Knowledge**: Specialized knowledge base with credible references
- **Instant Responses**: No external API calls = faster performance
- **Safe Guardrails**: Politely redirects non-autism questions
- **Beta Transparency**: Honest about limitations and potential mistakes
- **No API Keys Required**: Simple deployment with no external dependencies

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- That's it! No API keys required 🎉

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd aurora-autism-agent
npm install
```

2. **Optional Configuration:**
You can create a `.env` file for custom settings (all optional):
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
```

3. **Start Aurora:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

4. **Access Aurora:**
Open your browser to: `http://localhost:3000`

## 🏗️ Architecture

### Backend (Node.js + Express)
```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   User Input    │───▶│   Aurora     │───▶│ Built-in Autism │
│ (with typos/    │    │ Intelligence │    │ Knowledge Base  │
│  grammar errors)│    │   System     │    │  + References   │
└─────────────────┘    └──────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Formatted Response│
                    │  + References +   │
                    │   Guardrails     │
                    └──────────────────┘
```

### Three-Layer Intelligence System

1. **🛡️ The Gatekeeper**: Keyword-based classification (autism-related vs off-topic)
2. **🧠 The Expert**: Template-based response from curated knowledge
3. **📚 The Scholar**: Automatic reference attribution from trusted sources

### Frontend
- Clean, accessible design following Aurora branding
- Real-time character counting and input validation
- Smooth loading states and error handling
- Mobile-responsive layout

## 📋 API Endpoints

### Core Functionality
- `POST /api/ask` - Ask Aurora a question
- `GET /api/topics` - Get suggested topics
- `GET /api/aurora` - About Aurora information

### System Status
- `GET /health` - Health check
- `GET /api/status` - Detailed system status
- `GET /api/example` - Example response for testing

## 🧩 Aurora's Scope

### ✅ In Scope (Autism-Related Topics)
- Diagnosis & Assessment
- Treatment & Interventions
- Daily Living & Support
- Educational Support (IEPs, school accommodations)
- Family & Caregiver Resources
- Adult Autism Support
- Legal Rights & Advocacy
- Funding & Insurance Coverage
- Communities & Resources
- Research & Evidence-Based Practices

### ❌ Out of Scope
- Non-autism medical conditions
- General mental health (unless autism-specific)
- Personal medical diagnosis
- General parenting advice
- Unrelated topics (entertainment, general knowledge, etc.)

## 🔧 Configuration

### Required Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Optional Environment Variables
```env
OPENAI_MODEL=gpt-4                    # AI model to use
PORT=3000                            # Server port
NODE_ENV=development                 # Environment
FRONTEND_URL=http://localhost:3000   # CORS configuration
```

## 🛡️ Error Handling & User Experience

### Graceful Input Handling
- **Spelling Mistakes**: Aurora normalizes and processes imperfect input
- **Grammar Errors**: Focus on intent rather than perfect syntax
- **Ambiguous Questions**: Provides helpful clarification

### Error Recovery
- **Service Unavailable**: Graceful fallback responses
- **Rate Limiting**: Clear messaging about request limits
- **Network Issues**: User-friendly error messages

### Loading States
- **Instant Feedback**: Immediate response to user actions
- **Progress Indicators**: Clear visual feedback during processing
- **Smooth Transitions**: Professional loading animations

## 🧪 Testing

### Manual Testing Examples
```bash
# Test autism-related question (should provide detailed response)
curl -X POST http://localhost:3000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are early signs of autism in toddlers?"}'

# Test off-topic question (should politely redirect)
curl -X POST http://localhost:3000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the weather like today?"}'

# Test input with typos (should handle gracefully)
curl -X POST http://localhost:3000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "wat r som sensry stratgies for autizm?"}'
```

### Health Check
```bash
curl http://localhost:3000/health
```

## 📚 Knowledge Base

Aurora uses a curated knowledge base covering:
- **Sensory Processing**: Environmental modifications, tools, strategies
- **Communication**: AAC, speech therapy, social interaction
- **Education**: IEPs, 504 plans, classroom accommodations
- **Behavioral Support**: Positive interventions, coping strategies
- **Social Skills**: Peer interaction, friendship development
- **Early Intervention**: Developmental support, family training
- **Adult Support**: Employment, independence, community participation
- **Family Resources**: Support groups, respite care, advocacy

## 🔗 Reference System

Every response includes credible sources from:
- Government agencies (CDC, NIH, Department of Education)
- Professional organizations (ASHA, AOTA, BACB)
- Autism advocacy organizations (Autism Speaks, ASAN)
- Academic institutions and research journals
- Crisis and emergency resources

## 🚧 Development Status

**Current Version**: 1.0.0-beta

### ✅ Completed Features
- Core backend infrastructure
- Three-layer intelligence system
- Knowledge base and reference system
- Frontend interface with Aurora branding
- Error handling and graceful degradation
- API endpoints and documentation

### 🔄 In Progress
- Performance optimization
- Extended knowledge base content
- Advanced input processing

### 📋 Future Enhancements
- Conversation memory
- Personalized recommendations
- Multi-language support
- Voice interaction
- Integration with autism service providers

## 🤝 Contributing

Aurora is designed to serve the autism community with accuracy and respect. When contributing:

1. **Evidence-Based**: Ensure all information is backed by credible sources
2. **Person-First Language**: Use respectful, person-first language
3. **Community Input**: Consider perspectives from the autism community
4. **Safety First**: Never provide medical diagnosis or treatment advice

## 📞 Support & Resources

### Emergency Resources
- **Crisis**: Text HOME to 741741 (Crisis Text Line)
- **Suicide Prevention**: 988 (National Suicide Prevention Lifeline)
- **Emergency**: 911 or local emergency services

### Autism Organizations
- **Autism Speaks**: autismspeaks.org
- **National Autism Association**: nationalautismassociation.org
- **Autistic Self Advocacy Network**: autisticadvocacy.org

## ⚖️ Disclaimer

Aurora is a Beta assistant that can make mistakes. This service provides general autism information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical decisions.

---

**Made with 💙 for the autism community**