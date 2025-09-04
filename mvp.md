# Autism Virtual Agent - MVP Specification

## MVP Goal
Create a backend-focused autism virtual agent that feels magical while remaining simple. Users can ask any question in English and receive intelligent responses that always call the LLM while maintaining intelligent guardrails and autism focus.

## Core Magic Moments

### **Autism-Related Question**
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

### **Non-Autism Question**
**User asks**: "What's the best way to learn Spanish?"

**Agent responds**:
```
I understand you're interested in learning Spanish! While I specialize in Autism Spectrum Disorder support, I can share that many families in the autism community also face language learning challenges, especially when supporting multilingual autistic children.

For Spanish learning specifically, I'd recommend consulting with language learning professionals or educational specialists who can provide personalized guidance. 

Is there anything autism-related I can help you with regarding language development or communication strategies for your family?
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

### **1. LLM-First Request Router** 
```
POST /api/ask
├── Input: { "question": "user question in English" }
├── Universal LLM Processing (OpenAI)
├── Intelligent Guardrail Application
├── Response Enhancement (OpenAI + Knowledge Base)
└── Output: { "answer": "intelligent response", "references": [...], "isAutismRelated": true/false }
```

### **2. LLM-First Intelligence Architecture**

#### **Layer 1: Universal LLM Processing (The Core)**
- **Every question** is processed through OpenAI for natural, contextual responses
- No pre-filtering or blocking of any user queries
- **Magic**: All questions receive intelligent, thoughtful responses

#### **Layer 2: Intelligent Guardrail Integration (The Guide)**
- LLM responses are enhanced with autism-focused context and boundaries
- Contextual redirection for off-topic queries while maintaining helpfulness
- **Magic**: Natural conversation flow with appropriate scope guidance

#### **Layer 3: Knowledge-Enhanced Response (The Expert)**
- Curated autism knowledge base (JSON file with key topics + references)
- OpenAI prompt engineering with autism expertise context
- **Magic**: Responses feel like talking to an autism specialist

#### **Layer 4: Reference Attribution (The Scholar)**
- Every response includes 2-4 credible sources when applicable
- Sources pulled from curated reference database
- **Magic**: Builds trust through transparency

## MVP Features

### **✨ Core Capabilities**
1. **Universal Question Processing**: Handles any question with intelligent LLM responses
2. **Intelligent Guardrails**: Maintains autism focus while acknowledging all questions
3. **Contextual Redirection**: Guides off-topic queries back to autism support when appropriate
4. **Evidence-Based Answers**: Provides practical, research-backed guidance for autism topics
5. **Automatic Citations**: Every autism-related response includes relevant references
6. **Conversational Tone**: Warm, supportive, professional communication for all interactions

### **🛡️ Built-in Safety**
- No medical diagnosis attempts
- Clear disclaimers for professional consultation
- Crisis resource recommendations when appropriate
- Respectful, person-first language

## Implementation Plan

### **Phase 1: LLM-First Question-Answer Loop (Week 1)**
```javascript
// Core endpoint - LLM processes ALL questions
app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  
  // Step 1: Process ALL questions through LLM
  const llmResponse = await processWithLLM(question);
  
  // Step 2: Apply intelligent guardrails
  const enhancedResponse = await applyIntelligentGuardrails(question, llmResponse);
  
  // Step 3: Add references if autism-related
  const references = enhancedResponse.isAutismRelated 
    ? await findRelevantReferences(question, enhancedResponse.answer)
    : [];
  
  res.json({
    answer: enhancedResponse.answer,
    references: references,
    isAutismRelated: enhancedResponse.isAutismRelated
  });
});
```

### **Phase 2: Intelligent Guardrail System (Week 2)**
- Implement post-LLM guardrail processing
- Create contextual redirection logic for off-topic queries
- Develop autism-focused response enhancement
- Integration with OpenAI for intelligent boundary enforcement

### **Phase 3: Knowledge Base Integration (Week 3)**
- Create curated autism knowledge JSON file
- 50+ key topics with summaries and references
- Categories: diagnosis, therapies, education, daily living, etc.
- Integration with OpenAI for enhanced responses

### **Phase 4: Reference System (Week 4)**
- Curated reference database (JSON)
- Automatic source attribution for autism-related responses
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

### **Universal LLM Processing Prompt**
```
You are Aurora, an intelligent autism support assistant. Process this user question and provide a helpful response.

Guidelines:
- Always acknowledge the user's question respectfully
- If autism-related: provide expert guidance with practical strategies
- If not autism-related: acknowledge the question, mention your autism specialization, and offer to help with autism-related aspects or guide to appropriate resources
- Use warm, supportive tone throughout
- Maintain professional, helpful communication

Question: "{user_question}"

Provide a thoughtful response that either:
1. Gives expert autism guidance (if relevant)
2. Acknowledges the question and offers autism-related help or appropriate redirection (if not directly autism-related)
```

### **Intelligent Guardrail Enhancement Prompt**
```
You are enhancing a response to ensure it maintains autism focus while being helpful.

Original response: "{llm_response}"
User question: "{user_question}"

Enhance the response to:
- Maintain autism specialization focus
- Provide autism-related context when possible
- Offer appropriate redirection for off-topic queries
- Ensure helpful, supportive tone throughout

Return enhanced response with isAutismRelated flag.
```

### **Autism Response Generation Prompt**
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
- **LLM Processing**: 100% of questions processed through LLM
- **Guardrail Effectiveness**: 98%+ success in maintaining autism focus while being helpful
- **Uptime**: 99%+ availability
- **Error Rate**: < 1% server errors

### **Quality Metrics**
- **Universal Helpfulness**: All questions receive intelligent, helpful responses
- **Autism Focus**: Autism-related questions get expert guidance
- **Contextual Redirection**: Off-topic queries get appropriate guidance
- **Safety**: Zero inappropriate medical advice incidents
- **References**: 100% of autism-related responses include credible sources
- **Tone**: Warm, professional, supportive communication for all interactions

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

1. **Universal Intelligence**: Every question gets smart, contextual responses in seconds
2. **Intelligent Boundaries**: Maintains autism focus while being helpful to all users
3. **Expert Knowledge**: Autism questions feel like consulting a specialist
4. **Contextual Guidance**: Off-topic questions get helpful redirection with autism context
5. **Trust Through Transparency**: Every autism response backed by credible sources
6. **Always Welcoming**: Never rejects questions - always provides value

## Future Enhancements (Post-MVP)
- Frontend web interface
- Conversation memory
- Personalized recommendations
- Multi-language support
- Voice interaction
- Integration with autism service providers

---

**MVP Success Definition**: A user can ask any question and get an intelligent, helpful response in under 3 seconds. Autism-related questions receive expert guidance with references, while other questions get contextual redirection that maintains the autism focus while being genuinely helpful.