const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { AuroraIntelligence } = require('./src/intelligence/aurora-core');
const { setupRoutes } = require('./src/routes');
const { errorHandler, requestLogger } = require('./src/middleware');

const app = express();
const PORT = process.env.PORT || 3002;

// Environment validation
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  WARNING: OPENAI_API_KEY not found. Aurora will use knowledge base only.');
  console.warn('   For full functionality, set OPENAI_API_KEY in your environment variables.');
  console.warn('   The app will still work with basic autism support features.');
} else {
  console.log('✅ OpenAI API key found - Full LLM functionality enabled');
}

// Ensure the app starts even without OpenAI
console.log('🚀 Starting Aurora Autism Assistant...');
console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🌐 Port: ${PORT}`);

// Security and performance middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || process.env.RAILWAY_PUBLIC_DOMAIN || 'http://localhost:3002',
  credentials: true
}));

// Rate limiting for API protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});

app.use('/api', limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Initialize Aurora Intelligence System
const aurora = new AuroraIntelligence();

// Serve static files (frontend)
app.use(express.static('public'));

// Setup routes
setupRoutes(app, aurora);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Aurora Autism Assistant',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Fallback route for any unhandled requests (must be before error handler)
app.use('*', (req, res) => {
  console.log(`🔍 Unhandled route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    message: 'Aurora Autism Assistant - Route not found',
    availableRoutes: ['/health', '/api/ask', '/api/topics', '/api/analytics']
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

// Start server with error handling
try {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🧩 Aurora Autism Assistant running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 Web interface: http://localhost:${PORT}`);
    console.log(`🤖 Ready to help with autism-related questions!`);
    console.log(`📊 Server started successfully at ${new Date().toISOString()}`);
  });
} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}

module.exports = app;