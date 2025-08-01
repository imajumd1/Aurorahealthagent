const { AutismKnowledgeBase } = require('../data/knowledge-base');
const { ReferenceSystem } = require('../data/references');

class AuroraIntelligence {
  constructor() {
    this.knowledgeBase = new AutismKnowledgeBase();
    this.references = new ReferenceSystem();
    
    // Autism-related keywords for intent classification
    this.autismKeywords = [
      'autism', 'autistic', 'asd', 'spectrum', 'asperger', 'aspergers',
      'sensory', 'stimming', 'meltdown', 'nonverbal', 'communication',
      'social', 'interaction', 'behavior', 'developmental', 'therapy',
      'iep', '504', 'school', 'accommodation', 'special', 'education',
      'early', 'intervention', 'signs', 'symptoms', 'diagnosis'
    ];
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
   * Determines if question is autism-related using keyword matching
   */
  async classifyIntent(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Check for autism-related keywords
    const foundKeywords = this.autismKeywords.filter(keyword => 
      lowerQuestion.includes(keyword)
    );
    
    // Additional fuzzy matching for common misspellings
    const fuzzyMatches = this.checkFuzzyMatches(lowerQuestion);
    const allMatches = [...foundKeywords, ...fuzzyMatches];
    
    // Determine if autism-related based on keyword matches
    const isAutismRelated = allMatches.length > 0;
    const confidence = Math.min(allMatches.length * 0.3, 1.0);
    
    // Detect topic categories
    const detectedTopics = this.detectTopicCategories(lowerQuestion, allMatches);
    
    return {
      isAutismRelated,
      confidence,
      reasoning: isAutismRelated 
        ? `Found autism-related keywords: ${allMatches.join(', ')}`
        : 'No autism-related keywords detected',
      detectedTopics
    };
  }

  /**
   * Check for fuzzy matches of autism-related terms
   */
  checkFuzzyMatches(question) {
    const fuzzyTerms = [
      { pattern: /autis[mt]/g, match: 'autism' },
      { pattern: /asperg/g, match: 'asperger' },
      { pattern: /sensre?y/g, match: 'sensory' },
      { pattern: /stim+ing?/g, match: 'stimming' },
      { pattern: /meltdow?n/g, match: 'meltdown' },
      { pattern: /iep/g, match: 'iep' },
      { pattern: /504/g, match: '504' }
    ];
    
    const matches = [];
    fuzzyTerms.forEach(term => {
      if (term.pattern.test(question)) {
        matches.push(term.match);
      }
    });
    
    return matches;
  }

  /**
   * Detect topic categories based on question content
   */
  detectTopicCategories(question, keywords) {
    const topicMap = {
      'sensory_processing': ['sensory', 'sound', 'noise', 'touch', 'texture', 'overstimulation'],
      'communication': ['communication', 'speech', 'language', 'nonverbal', 'talking'],
      'education_support': ['school', 'education', 'iep', '504', 'teacher', 'classroom'],
      'behavioral_support': ['behavior', 'meltdown', 'tantrum', 'stimming', 'routine'],
      'social_skills': ['social', 'friends', 'interaction', 'play', 'conversation'],
      'early_intervention': ['early', 'signs', 'diagnosis', 'assessment', 'toddler'],
      'adult_support': ['adult', 'employment', 'job', 'work', 'independence'],
      'family_support': ['family', 'parent', 'sibling', 'support', 'help']
    };
    
    const detectedTopics = [];
    Object.keys(topicMap).forEach(topic => {
      const topicKeywords = topicMap[topic];
      const hasTopicKeywords = topicKeywords.some(keyword => 
        question.includes(keyword) || keywords.includes(keyword)
      );
      if (hasTopicKeywords) {
        detectedTopics.push(topic);
      }
    });
    
    return detectedTopics;
  }

  /**
   * Layer 2: The Expert
   * Generates autism-focused response using knowledge base templates
   */
  async generateExpertResponse(question, classification) {
    // Get relevant knowledge from our curated base
    const relevantKnowledge = this.knowledgeBase.findRelevantTopics(
      question, 
      classification.detectedTopics
    );

    // If no relevant knowledge found, provide general guidance
    if (Object.keys(relevantKnowledge).length === 0) {
      return this.getGeneralAutismResponse(question);
    }

    // Build response from knowledge base
    let response = "Based on evidence-based approaches for autism support, here's helpful information:\n\n";
    
    Object.keys(relevantKnowledge).forEach(topicKey => {
      const topic = relevantKnowledge[topicKey];
      
      response += `**${this.formatTopicTitle(topicKey)}:**\n`;
      response += `${topic.summary}\n\n`;
      
      if (topic.strategies && topic.strategies.length > 0) {
        response += "**Strategies:**\n";
        topic.strategies.forEach(strategy => {
          response += `• ${strategy}\n`;
        });
        response += "\n";
      }
    });

    // Add professional consultation reminder
    response += "**Important:** This is general information only. For personalized guidance, please consult with healthcare professionals, therapists, or autism specialists who can assess your specific situation.\n\n";
    
    // Add beta disclaimer
    response += "*As a Beta assistant, I can make mistakes. Always verify important information with qualified professionals.*";

    return response;
  }

  /**
   * Format topic titles for display
   */
  formatTopicTitle(topicKey) {
    return topicKey
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Provide general autism response when no specific knowledge found
   */
  getGeneralAutismResponse(question) {
    return `Thank you for your autism-related question. While I have information on many autism topics, I don't have specific guidance that directly matches your question.

**General Autism Resources:**
• Contact your healthcare provider for personalized advice
• Reach out to local autism support organizations
• Consider consulting with autism specialists (behavioral therapists, speech therapists, occupational therapists)
• Explore resources from reputable organizations like Autism Speaks, the National Autism Association, or the Autistic Self Advocacy Network

**Remember:** Every person with autism is unique, and what works for one individual may not work for another. Professional guidance tailored to your specific situation is always recommended.

*As a Beta assistant, I can make mistakes. For important decisions, please consult with qualified professionals.*`;
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


}

module.exports = { AuroraIntelligence };