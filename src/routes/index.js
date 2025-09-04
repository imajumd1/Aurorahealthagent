/**
 * API Routes for Aurora Autism Assistant
 */

const { validateQuestion, trackResponseTime } = require('../middleware');

/**
 * Setup all routes for the Aurora application
 */
function setupRoutes(app, aurora) {
  
  // Main question endpoint - the heart of Aurora
  app.post('/api/ask', 
    trackResponseTime,
    validateQuestion,
    async (req, res, next) => {
      try {
        const { question, fileContent, fileName, fileType } = req.body;
        const startTime = req.startTime;
        
        let processedQuestion = question;
        
        // If file content is provided, enhance the question
        if (fileContent && fileName) {
          console.log(`📄 Aurora processing file: ${fileName} (${fileType})`);
          processedQuestion = `File Analysis Request: ${question}\n\nFile: ${fileName}\nFile Type: ${fileType}\n\nPlease analyze the uploaded file content and provide insights related to autism support. The file content is: ${fileContent.substring(0, 2000)}${fileContent.length > 2000 ? '...' : ''}`;
        }
        
        console.log(`🧩 Aurora processing: "${processedQuestion.substring(0, 100)}${processedQuestion.length > 100 ? '...' : ''}"`);
        
        // Process the question through Aurora's intelligence layers
        const response = await aurora.processQuestion(processedQuestion, {
          timestamp: new Date().toISOString(),
          userAgent: req.get('User-Agent'),
          ip: req.ip,
          hasFile: !!fileContent
        });
        
        // Add response timing
        response.responseTime = Date.now() - startTime;
        
        // Log successful response
        console.log(`🟢 Aurora responded in ${response.responseTime}ms - Topic: ${response.isAutismRelated ? 'Autism' : 'Off-topic'}${fileContent ? ' - File Analysis' : ''}`);
        
        // Send response with Aurora branding
        res.json({
          aurora: {
            name: "Aurora",
            version: "1.0.0-beta",
            disclaimer: "I am still in Beta, I can make mistakes."
          },
          ...response,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.error('🔴 Aurora processing error:', error);
        next(error);
      }
    }
  );

  // Suggested topics endpoint
  app.get('/api/topics', (req, res) => {
    const suggestedTopics = [
      {
        id: 'early_signs',
        title: 'Early Signs & Diagnosis',
        description: 'Recognizing autism signs and the diagnosis process',
        examples: [
          'What are early signs of autism in toddlers?',
          'How is autism diagnosed?',
          'When should I be concerned about development?'
        ]
      },
      {
        id: 'school_support',
        title: 'School Support',
        description: 'Educational accommodations and IEP guidance',
        examples: [
          'How do I get an IEP for my child?',
          'What accommodations help in school?',
          'How to work with teachers on autism support?'
        ]
      },
      {
        id: 'daily_routines',
        title: 'Daily Routines',
        description: 'Managing daily activities and transitions',
        examples: [
          'How to create good routines for autism?',
          'Managing transitions and changes',
          'Help with morning and bedtime routines'
        ]
      },
      {
        id: 'communication',
        title: 'Communication Tips',
        description: 'Supporting communication development',
        examples: [
          'How to help nonverbal communication?',
          'What is AAC and how does it help?',
          'Improving conversation skills'
        ]
      },
      {
        id: 'sensory_issues',
        title: 'Sensory Issues',
        description: 'Managing sensory processing differences',
        examples: [
          'How to handle sensory overload?',
          'Creating sensory-friendly environments',
          'What are sensory processing issues?'
        ]
      },
      {
        id: 'family_resources',
        title: 'Family Resources',
        description: 'Support for families and caregivers',
        examples: [
          'Where to find autism support groups?',
          'How to get respite care?',
          'Resources for autism families'
        ]
      }
    ];

    res.json({
      topics: suggestedTopics,
      message: 'Click any topic below or ask me anything about autism!'
    });
  });

  // System status endpoint
  app.get('/api/status', async (req, res) => {
    try {
      // Basic system health check
      const status = {
        service: 'Aurora Autism Assistant',
        status: 'operational',
        version: '1.0.0-beta',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
      };

      // Check if OpenAI API is accessible (basic check)
      if (process.env.OPENAI_API_KEY) {
        status.ai_service = 'connected';
      } else {
        status.ai_service = 'not_configured';
        status.status = 'degraded';
      }

      res.json(status);
    } catch (error) {
      res.status(503).json({
        service: 'Aurora Autism Assistant',
        status: 'error',
        message: 'Service temporarily unavailable',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Aurora info endpoint
  app.get('/api/aurora', (req, res) => {
    res.json({
      name: 'Aurora',
      tagline: 'Your autism support assistant',
      version: '1.0.0-beta',
      status: 'Beta - I can make mistakes',
      purpose: 'Specialized AI assistant for autism spectrum disorder information and support',
      capabilities: [
        'Answer autism-related questions',
        'Provide evidence-based guidance',
        'Share credible resources and references',
        'Support families and individuals',
        'Redirect non-autism questions appropriately'
      ],
      limitations: [
        'Cannot provide medical diagnosis',
        'General information only',
        'Beta version with potential errors',
        'Always recommend professional consultation for medical decisions'
      ],
      scope: [
        'Diagnosis & Assessment',
        'Treatment & Interventions', 
        'Daily Living & Support',
        'Educational Support',
        'Family & Caregiver Resources',
        'Adult Autism Support',
        'Legal Rights & Advocacy',
        'Funding & Insurance',
        'Communities & Resources'
      ],
      contact: {
        emergency: 'For emergencies, contact 911 or local emergency services',
        crisis: 'Crisis Text Line: Text HOME to 741741',
        suicide_prevention: 'National Suicide Prevention Lifeline: 988'
      }
    });
  });

  // Feedback endpoint
  app.post('/api/feedback', (req, res) => {
    try {
      const { feedbackId, type, timestamp, question, answer } = req.body;
      
      console.log(`📊 Feedback received: ${type} for ${feedbackId} at ${timestamp}`);
      
      // Process feedback through Aurora's reinforcement learning system
      const feedbackResult = aurora.processFeedback(feedbackId, type, question, answer);
      
      // Store additional metadata
      const feedback = {
        feedbackId,
        type,
        timestamp: new Date().toISOString(),
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        question: question,
        answer: answer
      };
      
      // In a real implementation, you'd save this to a database
      console.log('💾 Feedback processed and stored:', feedback);
      console.log('🧠 Reinforcement learning updated:', feedbackResult);
      
      res.json({
        status: 'success',
        message: 'Feedback received and processed',
        feedbackId: feedbackId,
        analytics: feedbackResult
      });
      
    } catch (error) {
      console.error('🔴 Feedback processing error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to process feedback'
      });
    }
  });

  // Analytics endpoint for feedback data
  app.get('/api/analytics', (req, res) => {
    try {
      const analytics = aurora.getFeedbackAnalytics();
      
      res.json({
        status: 'success',
        analytics: analytics,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('🔴 Analytics error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve analytics'
      });
    }
  });

  // Quick example endpoint for testing
  app.get('/api/example', async (req, res, next) => {
    try {
      const exampleQuestion = "What are some sensory strategies for autism?";
      console.log('🧩 Processing example question for demo');
      
      const response = await aurora.processQuestion(exampleQuestion);
      
      res.json({
        example: {
          question: exampleQuestion,
          response: response
        },
        note: 'This is a demonstration of Aurora\'s capabilities'
      });
    } catch (error) {
      next(error);
    }
  });

  // Catch-all for undefined API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      error: true,
      message: `API endpoint not found: ${req.path}`,
      available_endpoints: [
        'POST /api/ask - Ask Aurora a question',
        'GET /api/topics - Get suggested topics',
        'GET /api/status - System status',
        'GET /api/aurora - About Aurora',
        'GET /api/example - Example response',
        'GET /health - Health check'
      ],
      aurora: {
        name: 'Aurora',
        message: 'I\'m here to help with autism-related questions!'
      }
    });
  });
}

module.exports = { setupRoutes };