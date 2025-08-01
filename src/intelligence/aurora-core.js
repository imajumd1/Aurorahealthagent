const OpenAI = require('openai');
const { AutismKnowledgeBase } = require('../data/knowledge-base');
const { ReferenceSystem } = require('../data/references');

class AuroraIntelligence {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.knowledgeBase = new AutismKnowledgeBase();
    this.references = new ReferenceSystem();
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
  }

  /**
   * Main entry point for Aurora's intelligence
   * Handles any user question with graceful error handling
   */
  async processQuestion(userQuestion, options = {}) {
    const startTime = Date.now();
    
    try {
      // Clean and normalize user input (handles typos/grammar)
      const cleanedQuestion = this.normalizeUserInput(userQuestion);
      
      // Layer 1: The Gatekeeper - Intent Classification
      const classification = await this.classifyIntent(cleanedQuestion);
      
      if (!classification.isAutismRelated) {
        return this.createOffTopicResponse(classification);
      }

      // Layer 2: The Expert - Knowledge-Enhanced Response
      const response = await this.generateExpertResponse(cleanedQuestion, classification);
      
      // Layer 3: The Scholar - Reference Attribution
      const references = await this.findRelevantReferences(cleanedQuestion, response);
      
      const responseTime = Date.now() - startTime;
      
      return {
        answer: response,
        references: references,
        isAutismRelated: true,
        confidence: classification.confidence,
        responseTime: responseTime,
        status: 'success'
      };

    } catch (error) {
      console.error('Aurora processing error:', error);
      return this.createErrorResponse(error, userQuestion);
    }
  }

  /**
   * Normalizes user input to handle typos and grammar issues
   * Makes the experience smooth even with imperfect input
   */
  normalizeUserInput(input) {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Basic cleaning and normalization
    return input
      .trim()
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/([.!?]){2,}/g, '$1') // Multiple punctuation to single
      .toLowerCase();
  }

  /**
   * Layer 1: The Gatekeeper
   * Determines if question is autism-related with high accuracy
   */
  async classifyIntent(question) {
    const prompt = `You are Aurora, an autism specialist assistant. Determine if this question relates to Autism Spectrum Disorder.

Consider these autism-related topics as IN SCOPE:
- Diagnosis, assessment, early signs
- Treatments, therapies, interventions
- Daily living, communication, sensory issues
- Education, IEPs, school support
- Family support, caregiving
- Adult autism, employment, relationships
- Legal rights, advocacy, discrimination
- Government funding, state funding, insurance coverage
- Autism communities, support groups, resources
- Research, evidence-based practices

Question: "${question}"

Even if the question has spelling errors or grammar mistakes, focus on the intent and meaning.

Respond with JSON only:
{
  "isAutismRelated": true/false,
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation",
  "detectedTopics": ["array of relevant topics if autism-related"]
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1, // Low temperature for consistent classification
        max_tokens: 200
      });

      const result = JSON.parse(response.choices[0].message.content);
      return {
        isAutismRelated: result.isAutismRelated,
        confidence: result.confidence,
        reasoning: result.reasoning,
        detectedTopics: result.detectedTopics || []
      };
    } catch (error) {
      console.error('Intent classification error:', error);
      // Fallback: assume autism-related with low confidence
      return {
        isAutismRelated: true,
        confidence: 0.3,
        reasoning: 'Classification service unavailable, proceeding with caution',
        detectedTopics: []
      };
    }
  }

  /**
   * Layer 2: The Expert
   * Generates autism-focused response using knowledge base
   */
  async generateExpertResponse(question, classification) {
    // Get relevant knowledge from our curated base
    const relevantKnowledge = this.knowledgeBase.findRelevantTopics(
      question, 
      classification.detectedTopics
    );

    const prompt = `You are Aurora, a knowledgeable and compassionate autism support specialist. 

Your role:
- Provide helpful, evidence-based guidance about autism
- Use warm, supportive, professional tone
- Focus on practical, actionable advice
- Always mention when professional consultation is recommended
- Use person-first language
- Be specific and structured in your responses

Important reminders:
- I am in Beta and can make mistakes
- I provide general information only
- Always recommend consulting healthcare professionals for medical decisions

User's question: "${question}"

Relevant knowledge context:
${JSON.stringify(relevantKnowledge, null, 2)}

Provide a structured, helpful response. Include specific strategies and considerations where appropriate.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3, // Balanced creativity and consistency
        max_tokens: 800
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Expert response generation error:', error);
      return this.getFallbackResponse(question, classification);
    }
  }

  /**
   * Layer 3: The Scholar
   * Finds and attributes relevant references
   */
  async findRelevantReferences(question, response) {
    try {
      return this.references.findRelevantSources(question, response);
    } catch (error) {
      console.error('Reference finding error:', error);
      return this.references.getDefaultReferences();
    }
  }

  /**
   * Creates response for off-topic questions
   */
  createOffTopicResponse(classification) {
    return {
      answer: "I appreciate your question, but this is not my area of expertise. I'm Aurora, and I'm specifically designed to provide information and support related to Autism Spectrum Disorder. For questions outside of autism, I'd recommend consulting with appropriate professionals or specialized resources.",
      references: [],
      isAutismRelated: false,
      confidence: classification.confidence,
      responseTime: 0,
      status: 'off_topic'
    };
  }

  /**
   * Creates error response with graceful degradation
   */
  createErrorResponse(error, originalQuestion) {
    return {
      answer: "I'm sorry, I'm experiencing some technical difficulties right now. As a Beta assistant, I can sometimes encounter issues. Please try rephrasing your question or try again in a moment. If you need immediate support, please consult with healthcare professionals or autism support organizations.",
      references: this.references.getEmergencyReferences(),
      isAutismRelated: true,
      confidence: 0.0,
      responseTime: 0,
      status: 'error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Service temporarily unavailable'
    };
  }

  /**
   * Fallback response when AI services fail
   */
  getFallbackResponse(question, classification) {
    const topics = classification.detectedTopics || [];
    
    if (topics.includes('crisis') || question.includes('emergency')) {
      return "If you're experiencing a crisis or emergency, please contact:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Emergency Services: 911\n\nI'm currently experiencing technical difficulties, but your safety is the priority.";
    }

    return "I understand you're asking about autism-related topics, but I'm experiencing some technical difficulties right now. As a Beta assistant, I sometimes encounter issues. Please try again in a moment, or consider reaching out to:\n\n• Autism Speaks: autismspeaks.org\n• National Autism Association: nationalautismassociation.org\n• Your healthcare provider for personalized guidance";
  }
}

module.exports = { AuroraIntelligence };