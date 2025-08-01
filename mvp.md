# Autism Virtual Agent - MVP Specification

## MVP Goal
Create a backend-focused autism virtual agent that feels magical while remaining simple. Users can ask any question in English and receive intelligent, autism-focused responses with proper citations and guardrails.

## Core Magic Moment
**User asks**: "How can I help my 5-year-old with autism who has meltdowns in grocery stores?"

**Agent responds**: 
```
Based on evidence-based approaches for autism support, here are strategies for managing grocery store meltdowns:

**Preparation Strategies:**
- Create a visual schedule showing the grocery trip steps
- Practice with shorter store visits during less busy times
- Bring noise-canceling headphones for sensory support

**During Shopping:**
- Use a cart with a car attachment for containment and fun
- Bring preferred snacks as positive reinforcement
- Consider online grocery pickup to reduce store time

**Sensory Considerations:**
- Shop during quieter hours (early morning/late evening)
- Choose smaller, less overwhelming stores when possible
- Bring familiar comfort items

**References:**
1. Autism Speaks Sensory Issues Guide
2. National Autism Center Practice Guidelines
3. Journal of Applied Behavior Analysis - Environmental Modifications
```

## Technical Stack

### **Backend Core**
- **Node.js + Express**: Lightweight, fast API server
- **OpenAI GPT-4**: AI reasoning and response generation
- **Simple JSON**: Knowledge base and reference storage
- **Express middleware**: Request logging and error handling

### **Key Dependencies**
```json
{
  "express": "^4.18.0",
  "openai": "^4.0.0",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "dotenv": "^16.0.0"
}
```

## MVP Architecture

### **1. Smart Request Router** 
```
POST /api/ask
├── Input: { "question": "user question in English" }
├── Intent Classification (OpenAI)
├── Response Generation (OpenAI + Knowledge Base)
└── Output: { "answer": "formatted response", "references": [...], "isAutismRelated": true }
```

### **2. Three-Layer Intelligence**

#### **Layer 1: Intent Classification (The Gatekeeper)**
- Single OpenAI call to determine if question is autism-related
- Simple prompt: "Is this question related to autism spectrum disorder? Answer yes/no and explain briefly."
- **Magic**: Instantly knows when to engage vs. politely decline

#### **Layer 2: Knowledge-Enhanced Response (The Expert)**
- Curated autism knowledge base (JSON file with key topics + references)
- OpenAI prompt engineering with autism expertise context
- **Magic**: Responses feel like talking to an autism specialist

#### **Layer 3: Reference Attribution (The Scholar)**
- Every response includes 2-4 credible sources
- Sources pulled from curated reference database
- **Magic**: Builds trust through transparency

## MVP Features

### **✨ Core Capabilities**
1. **Smart Question Understanding**: Handles natural language questions about autism
2. **Intelligent Guardrails**: Politely deflects non-autism questions
3. **Evidence-Based Answers**: Provides practical, research-backed guidance
4. **Automatic Citations**: Every response includes relevant references
5. **Conversational Tone**: Warm, supportive, professional communication

### **🛡️ Built-in Safety**
- No medical diagnosis attempts
- Clear disclaimers for professional consultation
- Crisis resource recommendations when appropriate
- Respectful, person-first language

## Implementation Plan

### **Phase 1: Basic Question-Answer Loop (Week 1)**
```javascript
// Core endpoint
app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  
  // Step 1: Check if autism-related
  const classification = await classifyQuestion(question);
  
  if (!classification.isAutismRelated) {
    return res.json({
      answer: "I appreciate your question, but this is not my area of expertise. I'm specifically designed to provide information and support related to Autism Spectrum Disorder.",
      isAutismRelated: false
    });
  }
  
  // Step 2: Generate autism-focused response
  const response = await generateAutismResponse(question);
  
  // Step 3: Add references
  const references = await findRelevantReferences(question, response);
  
  res.json({
    answer: response,
    references: references,
    isAutismRelated: true
  });
});
```

### **Phase 2: Knowledge Base Integration (Week 2)**
- Create curated autism knowledge JSON file
- 50+ key topics with summaries and references
- Categories: diagnosis, therapies, education, daily living, etc.
- Integration with OpenAI for enhanced responses

### **Phase 3: Reference System (Week 3)**
- Curated reference database (JSON)
- Automatic source attribution
- Quality scoring for reference selection
- Link validation

## Sample Knowledge Base Structure

```json
{
  "topics": {
    "sensory_processing": {
      "summary": "Autism often involves differences in processing sensory information...",
      "strategies": ["noise-canceling headphones", "fidget toys", "weighted blankets"],
      "references": ["autism_speaks_sensory_guide", "occupational_therapy_journal_2023"]
    },
    "meltdowns": {
      "summary": "Meltdowns are involuntary responses to overwhelming situations...",
      "prevention": ["visual schedules", "sensory breaks", "environmental modifications"],
      "references": ["national_autism_center_guidelines", "behavior_analysis_journal"]
    }
  },
  "references": {
    "autism_speaks_sensory_guide": {
      "title": "Sensory Issues and Autism",
      "source": "Autism Speaks",
      "url": "https://www.autismspeaks.org/sensory-issues",
      "credibility": "high"
    }
  }
}
```

## OpenAI Prompt Strategy

### **Classification Prompt**
```
You are an autism specialist. Determine if this question relates to Autism Spectrum Disorder:

Question: "{user_question}"

Respond with JSON:
{
  "isAutismRelated": true/false,
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}

Consider autism-related topics: diagnosis, therapies, education, daily living, sensory issues, communication, behavior, family support, legal rights, funding, insurance, communities.
```

### **Response Generation Prompt**
```
You are a knowledgeable autism support specialist. Provide helpful, evidence-based guidance.

Guidelines:
- Use warm, supportive tone
- Focus on practical strategies
- Mention when professional consultation is needed
- Use person-first language
- Provide specific, actionable advice

Question: "{user_question}"
Relevant knowledge: {knowledge_context}

Provide a structured response with clear sections and practical guidance.
```

## Success Metrics for MVP

### **Technical Metrics**
- **Response Time**: < 3 seconds for any question
- **Classification Accuracy**: 95%+ correct autism-related detection
- **Uptime**: 99%+ availability
- **Error Rate**: < 1% server errors

### **Quality Metrics**
- **Relevance**: Responses directly address user questions
- **Safety**: Zero inappropriate medical advice incidents
- **References**: 100% of responses include credible sources
- **Tone**: Warm, professional, supportive communication

## Deployment Strategy

### **Simple but Production-Ready**
```
Environment: Node.js server (Railway/Render/Heroku)
Database: JSON files (upgrade to MongoDB later)
Monitoring: Basic Express logging
Security: Helmet.js, CORS, rate limiting
Config: Environment variables for OpenAI API key
```

### **API Documentation**
```yaml
POST /api/ask
  Body: { "question": "string" }
  Response: {
    "answer": "string",
    "references": ["array of objects"],
    "isAutismRelated": "boolean",
    "responseTime": "number"
  }

GET /api/health
  Response: { "status": "ok", "version": "1.0.0" }
```

## Why This MVP Will Feel Magical

1. **Instant Intelligence**: Questions get smart, contextual responses in seconds
2. **Perfect Boundaries**: Never confused about scope - always knows when to help
3. **Expert Knowledge**: Answers feel like consulting an autism specialist
4. **Trust Through Transparency**: Every response backed by credible sources
5. **Always Helpful**: Either provides great autism guidance or politely redirects

## Future Enhancements (Post-MVP)
- Frontend web interface
- Conversation memory
- Personalized recommendations
- Multi-language support
- Voice interaction
- Integration with autism service providers

---

**MVP Success Definition**: A user can ask any autism-related question and get a helpful, referenced response that feels like expert guidance in under 3 seconds. Non-autism questions are politely but clearly redirected.