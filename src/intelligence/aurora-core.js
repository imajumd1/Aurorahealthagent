const { AutismKnowledgeBase } = require('../data/knowledge-base');
const { ReferenceSystem } = require('../data/references');
const OpenAI = require('openai');

class AuroraIntelligence {
  constructor() {
    this.knowledgeBase = new AutismKnowledgeBase();
    this.references = new ReferenceSystem();
    
    // Initialize OpenAI for LLM-first processing
    this.openaiEnabled = false;
    this.openai = null;
    
    try {
      if (process.env.OPENAI_API_KEY) {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });
        this.openaiEnabled = true;
        console.log('🤖 OpenAI integration enabled - LLM-first processing active');
      } else {
        console.log('📚 OpenAI API key not found, using knowledge base only');
      }
    } catch (error) {
      console.error('❌ OpenAI initialization failed:', error.message);
      console.log('📚 Falling back to knowledge base only');
      this.openaiEnabled = false;
      this.openai = null;
    }
    
    // Feedback tracking for reinforcement learning
    this.feedbackData = {
      positive: new Map(), // question -> { count, lastUpdated }
      negative: new Map(), // question -> { count, lastUpdated }
      patterns: new Map(), // pattern -> { positive, negative, total }
      improvements: [] // array of improvement suggestions
    };
  }

  /**
   * Main entry point for Aurora's LLM-first intelligence
   * Processes ALL questions through LLM with intelligent guardrails
   */
  async processQuestion(userQuestion, options = {}) {
    const startTime = Date.now();
    
    try {
      // Clean and normalize user input
      const cleanedQuestion = this.normalizeUserInput(userQuestion);
      
      // Single LLM call with integrated guardrails
      const response = await this.processWithIntegratedLLM(cleanedQuestion);
      
      // Add references if autism-related
      const references = response.isAutismRelated 
        ? await this.findRelevantReferences(cleanedQuestion, response.answer)
        : [];
      
      const responseTime = Date.now() - startTime;
      
      return {
        answer: response.answer,
        references: references,
        isAutismRelated: response.isAutismRelated,
        confidence: response.confidence || 0.8,
        responseTime: responseTime,
        status: 'success'
      };

    } catch (error) {
      console.error('Aurora processing error:', error);
      return this.createErrorResponse(error, userQuestion);
    }
  }

  /**
   * Integrated LLM Processing with Guardrails
   * Single call that handles both response generation and guardrail application
   */
  async processWithIntegratedLLM(question) {
    if (!this.openaiEnabled || !this.openai) {
      // Fallback to knowledge base if OpenAI not available
      const response = this.generateKnowledgeBaseResponse(question);
      return {
        answer: response,
        isAutismRelated: this.isAutismRelated(question),
        confidence: 0.7
      };
    }

    try {
      const prompt = this.buildIntegratedPrompt(question);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are Aurora, an intelligent autism support assistant. Process this user question and provide a helpful response.

Guidelines:
- Always acknowledge the user's question respectfully
- If autism-related: provide expert guidance with practical strategies
- If not autism-related: acknowledge the question, mention your autism specialization, and offer to help with autism-related aspects or guide to appropriate resources
- Use warm, supportive tone throughout
- Maintain professional, helpful communication
- Be conversational and natural in your responses

IMPORTANT: Return ONLY a valid JSON object in this exact format:
{
  "answer": "your response text here",
  "isAutismRelated": true,
  "confidence": 0.8
}

CRITICAL: 
- Return ONLY the JSON object, no other text
- Use proper line breaks in the answer text (not \\n)
- Use regular quotes in the answer text (not \")
- Do not wrap the JSON in additional quotes or text`
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      const response = completion.choices[0].message.content;
      
      try {
        // Clean the response first to handle control characters and formatting
        let cleanedResponse = response
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters except \n and \t
          .replace(/\\n/g, '\n') // Convert \n to actual newlines
          .replace(/\\"/g, '"') // Convert \" to "
          .replace(/\\t/g, '  ') // Convert \t to spaces
          .replace(/^"|"$/g, ''); // Remove leading/trailing quotes
        
        // Try to extract JSON from the cleaned response
        let jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          // Format the answer with proper line breaks for numbered lists
          if (parsed.answer) {
            parsed.answer = this.formatAnswerText(parsed.answer);
          }
          return parsed;
        } else {
          const parsed = JSON.parse(cleanedResponse);
          if (parsed.answer) {
            parsed.answer = this.formatAnswerText(parsed.answer);
          }
          return parsed;
        }
      } catch (parseError) {
        console.log('JSON parsing failed, using response as-is:', parseError.message);
        console.log('Raw response:', response);
        
        // If JSON parsing fails, try to extract just the answer text
        let answerText = response;
        
        // Try to extract answer from JSON-like structure
        const answerMatch = response.match(/"answer":\s*"([^"]*(?:\\.[^"]*)*)"/);
        if (answerMatch) {
          answerText = answerMatch[1]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\t/g, '  ');
        } else {
          // Clean up the response if it looks like a JSON string
          answerText = response
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters except \n and \t
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\t/g, '  ')
            .replace(/^"|"$/g, '');
        }
        
        // Format the answer text
        answerText = this.formatAnswerText(answerText);
        
        return {
          answer: answerText,
          isAutismRelated: this.isAutismRelated(question),
          confidence: 0.7
        };
      }
      
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to knowledge base if OpenAI fails
      const response = this.generateKnowledgeBaseResponse(question);
      return {
        answer: response,
        isAutismRelated: this.isAutismRelated(question),
        confidence: 0.6
      };
    }
  }

  /**
   * Layer 1: Universal LLM Processing
   * Every question gets processed through the LLM for natural, contextual responses
   */
  async processWithLLM(question) {
    if (!this.openaiEnabled || !this.openai) {
      // Fallback to knowledge base if OpenAI not available
      return this.generateKnowledgeBaseResponse(question);
    }

    try {
      const prompt = this.buildUniversalLLMPrompt(question);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are Aurora, an intelligent autism support assistant. Process this user question and provide a helpful response.

Guidelines:
- Always acknowledge the user's question respectfully
- If autism-related: provide expert guidance with practical strategies
- If not autism-related: acknowledge the question, mention your autism specialization, and offer to help with autism-related aspects or guide to appropriate resources
- Use warm, supportive tone throughout
- Maintain professional, helpful communication
- Be conversational and natural in your responses

Remember: You specialize in autism support but can help with any question by providing context or redirection.`
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      return completion.choices[0].message.content;
      
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to knowledge base if OpenAI fails
      return this.generateKnowledgeBaseResponse(question);
    }
  }

  /**
   * Layer 2: Intelligent Guardrail Enhancement
   * Applies autism-focused context and boundaries to LLM responses
   */
  async applyIntelligentGuardrails(question, llmResponse) {
    if (!this.openaiEnabled || !this.openai) {
      // If no OpenAI, use simple keyword-based classification
      const isAutismRelated = this.isAutismRelated(question);
      return {
        answer: llmResponse,
        isAutismRelated: isAutismRelated,
        confidence: isAutismRelated ? 0.8 : 0.6
      };
    }

    try {
      const guardrailPrompt = this.buildGuardrailPrompt(question, llmResponse);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are enhancing a response to ensure it maintains autism focus while being helpful.

Enhance the response to:
- Maintain autism specialization focus
- Provide autism-related context when possible
- Offer appropriate redirection for off-topic queries
- Ensure helpful, supportive tone throughout
- Keep the response natural and conversational

IMPORTANT: Return ONLY a valid JSON object in this exact format:
{
  "answer": "enhanced response text",
  "isAutismRelated": true,
  "confidence": 0.8
}

Do not include any other text, explanations, or formatting outside the JSON object.`
          },
          {
            role: "user", 
            content: guardrailPrompt
          }
        ],
        max_tokens: 800,
        temperature: 0.3
      });

      const response = completion.choices[0].message.content;
      
      try {
        const parsed = JSON.parse(response);
        return parsed;
      } catch (parseError) {
        console.log('JSON parsing failed, using response as-is:', parseError.message);
        // If JSON parsing fails, return the response as-is with basic classification
        return {
          answer: response,
          isAutismRelated: this.isAutismRelated(question),
          confidence: 0.7
        };
      }
      
    } catch (error) {
      console.error('Guardrail enhancement error:', error);
      // Fallback to basic classification
      return {
        answer: llmResponse,
        isAutismRelated: this.isAutismRelated(question),
        confidence: 0.6
      };
    }
  }

  /**
   * Format answer text with proper line breaks for numbered lists
   */
  formatAnswerText(text) {
    if (!text) return text;
    
    // Add line breaks before numbered items (1., 2., 3., etc.)
    let formatted = text.replace(/(\d+\.\s)/g, '\n$1');
    
    // Add line breaks before bullet points (-, *, •)
    formatted = formatted.replace(/(^|\n)([-*•]\s)/g, '$1\n$2');
    
    // Clean up multiple consecutive newlines
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    // Trim leading/trailing whitespace
    formatted = formatted.trim();
    
    return formatted;
  }

  /**
   * Process user feedback for reinforcement learning
   */
  processFeedback(feedbackId, type, question, answer) {
    const timestamp = new Date().toISOString();
    const normalizedQuestion = this.normalizeUserInput(question);
    
    console.log(`📊 Processing feedback: ${type} for question: "${normalizedQuestion}"`);
    
    if (type === 'positive') {
      this.updateFeedbackData(this.feedbackData.positive, normalizedQuestion, timestamp);
    } else if (type === 'negative') {
      this.updateFeedbackData(this.feedbackData.negative, normalizedQuestion, timestamp);
    }
    
    // Update pattern analysis
    this.updatePatternAnalysis(normalizedQuestion, type, answer);
    
    // Generate improvement suggestions if needed
    this.generateImprovementSuggestions();
    
    return {
      status: 'success',
      feedbackId,
      type,
      timestamp,
      totalPositive: this.feedbackData.positive.size,
      totalNegative: this.feedbackData.negative.size
    };
  }

  /**
   * Update feedback data for a specific question
   */
  updateFeedbackData(feedbackMap, question, timestamp) {
    if (feedbackMap.has(question)) {
      const data = feedbackMap.get(question);
      data.count += 1;
      data.lastUpdated = timestamp;
    } else {
      feedbackMap.set(question, {
        count: 1,
        firstSeen: timestamp,
        lastUpdated: timestamp
      });
    }
  }

  /**
   * Update pattern analysis for reinforcement learning
   */
  updatePatternAnalysis(question, feedbackType, answer) {
    // Extract key patterns from the question
    const patterns = this.extractQuestionPatterns(question);
    
    patterns.forEach(pattern => {
      if (!this.feedbackData.patterns.has(pattern)) {
        this.feedbackData.patterns.set(pattern, {
          positive: 0,
          negative: 0,
          total: 0,
          lastUpdated: new Date().toISOString()
        });
      }
      
      const patternData = this.feedbackData.patterns.get(pattern);
      patternData.total += 1;
      patternData.lastUpdated = new Date().toISOString();
      
      if (feedbackType === 'positive') {
        patternData.positive += 1;
      } else {
        patternData.negative += 1;
      }
    });
  }

  /**
   * Extract patterns from questions for analysis
   */
  extractQuestionPatterns(question) {
    const patterns = [];
    const lowerQuestion = question.toLowerCase();
    
    // Question type patterns
    if (lowerQuestion.includes('what')) patterns.push('what_questions');
    if (lowerQuestion.includes('how')) patterns.push('how_questions');
    if (lowerQuestion.includes('why')) patterns.push('why_questions');
    if (lowerQuestion.includes('when')) patterns.push('when_questions');
    if (lowerQuestion.includes('where')) patterns.push('where_questions');
    
    // Topic patterns
    if (lowerQuestion.includes('sensory')) patterns.push('sensory_topics');
    if (lowerQuestion.includes('communication')) patterns.push('communication_topics');
    if (lowerQuestion.includes('behavior')) patterns.push('behavior_topics');
    if (lowerQuestion.includes('education')) patterns.push('education_topics');
    if (lowerQuestion.includes('therapy')) patterns.push('therapy_topics');
    if (lowerQuestion.includes('sleep')) patterns.push('sleep_topics');
    if (lowerQuestion.includes('social')) patterns.push('social_topics');
    
    // Complexity patterns
    if (question.split(' ').length > 10) patterns.push('complex_questions');
    if (question.split(' ').length < 5) patterns.push('simple_questions');
    
    return patterns;
  }

  /**
   * Generate improvement suggestions based on feedback patterns
   */
  generateImprovementSuggestions() {
    const suggestions = [];
    
    // Analyze patterns with low positive feedback
    for (const [pattern, data] of this.feedbackData.patterns) {
      const positiveRate = data.positive / data.total;
      
      if (data.total >= 3 && positiveRate < 0.5) {
        suggestions.push({
          pattern,
          issue: `Low positive feedback rate (${(positiveRate * 100).toFixed(1)}%)`,
          suggestion: this.getImprovementSuggestion(pattern),
          priority: 'high'
        });
      }
    }
    
    this.feedbackData.improvements = suggestions;
    return suggestions;
  }

  /**
   * Get specific improvement suggestions for patterns
   */
  getImprovementSuggestion(pattern) {
    const suggestions = {
      'sensory_topics': 'Provide more specific, actionable sensory strategies with examples',
      'communication_topics': 'Include more practical communication techniques and visual supports',
      'behavior_topics': 'Focus on positive behavior support strategies and prevention techniques',
      'education_topics': 'Provide more detailed educational accommodations and IEP guidance',
      'therapy_topics': 'Include more information about different therapy types and their benefits',
      'sleep_topics': 'Provide more comprehensive sleep hygiene strategies and environmental modifications',
      'social_topics': 'Include more specific social skills training and peer interaction strategies',
      'complex_questions': 'Break down complex topics into simpler, more digestible explanations',
      'simple_questions': 'Provide more comprehensive answers even for simple questions'
    };
    
    return suggestions[pattern] || 'Review and improve response quality for this topic area';
  }

  /**
   * Get feedback analytics
   */
  getFeedbackAnalytics() {
    const totalFeedback = this.feedbackData.positive.size + this.feedbackData.negative.size;
    const positiveRate = totalFeedback > 0 ? 
      (this.feedbackData.positive.size / totalFeedback) * 100 : 0;
    
    return {
      totalFeedback,
      positiveCount: this.feedbackData.positive.size,
      negativeCount: this.feedbackData.negative.size,
      positiveRate: positiveRate.toFixed(1),
      topPatterns: Array.from(this.feedbackData.patterns.entries())
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 5),
      improvements: this.feedbackData.improvements
    };
  }

  /**
   * Build integrated prompt for single LLM call
   */
  buildIntegratedPrompt(question) {
    return `User's question: "${question}"

Please provide a thoughtful response that either:
1. Gives expert autism guidance (if relevant)
2. Acknowledges the question and offers autism-related help or appropriate redirection (if not directly autism-related)

Be helpful, supportive, and maintain your autism specialization while being welcoming to all questions.

Remember to return ONLY a valid JSON object with "answer", "isAutismRelated", and "confidence" fields.`;
  }

  /**
   * Build universal LLM prompt for all questions
   */
  buildUniversalLLMPrompt(question) {
    return `User's question: "${question}"

Please provide a thoughtful response that either:
1. Gives expert autism guidance (if relevant)
2. Acknowledges the question and offers autism-related help or appropriate redirection (if not directly autism-related)

Be helpful, supportive, and maintain your autism specialization while being welcoming to all questions.`;
  }

  /**
   * Build guardrail enhancement prompt
   */
  buildGuardrailPrompt(question, llmResponse) {
    return `Original response: "${llmResponse}"
User question: "${question}"

Enhance this response to maintain autism focus while being helpful. If the question is not autism-related, provide context about how it might relate to autism or offer appropriate redirection.`;
  }

  /**
   * Simple autism classification for fallback
   */
  isAutismRelated(question) {
    const autismKeywords = [
      'autism', 'autistic', 'asd', 'spectrum', 'asperger', 'aspergers',
      'sensory', 'stimming', 'meltdown', 'nonverbal', 'communication',
      'social', 'interaction', 'behavior', 'developmental', 'therapy',
      'iep', '504', 'school', 'accommodation', 'special', 'education',
      'early', 'intervention', 'signs', 'symptoms', 'diagnosis'
    ];
    
    const lowerQuestion = question.toLowerCase();
    return autismKeywords.some(keyword => lowerQuestion.includes(keyword));
  }

  /**
   * Generate response using knowledge base (fallback)
   */
  generateKnowledgeBaseResponse(question) {
    const isAutismRelated = this.isAutismRelated(question);
    
    if (!isAutismRelated) {
      return `I understand you're asking about "${question}". While I specialize in Autism Spectrum Disorder support, I can share that many families in the autism community face various challenges and questions.

For specific guidance on this topic, I'd recommend consulting with appropriate professionals or specialized resources who can provide personalized advice.

Is there anything autism-related I can help you with regarding your situation?`;
    }

    // Get relevant knowledge from our curated base
    const relevantKnowledge = this.knowledgeBase.findRelevantTopics(question);

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
   * Layer 3: Find relevant references for autism-related responses
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
   * Normalizes user input to handle typos and grammar issues
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