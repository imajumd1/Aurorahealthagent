/**
 * Middleware for Aurora Autism Assistant
 */

/**
 * Request logger middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip } = req;
  
  // Log request start
  console.log(`🔵 ${method} ${url} - ${ip} - ${new Date().toISOString()}`);
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    // Determine log level based on status code
    const logLevel = statusCode >= 400 ? '🔴' : statusCode >= 300 ? '🟡' : '🟢';
    console.log(`${logLevel} ${method} ${url} - ${statusCode} - ${duration}ms`);
    
    originalEnd.apply(this, args);
  };
  
  next();
};

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('🔴 Aurora Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = 'I apologize, but I\'m experiencing some technical difficulties right now.';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'I need a bit more information to help you. Could you please rephrase your question?';
  } else if (err.name === 'OpenAIError') {
    statusCode = 503;
    message = 'I\'m having trouble accessing my knowledge base right now. Please try again in a moment.';
  } else if (err.name === 'RateLimitError') {
    statusCode = 429;
    message = 'You\'re asking questions faster than I can process them. Please wait a moment before trying again.';
  }

  // Aurora-specific error response
  res.status(statusCode).json({
    error: true,
    message: message,
    betaNotice: 'I am still in Beta, I can make mistakes.',
    timestamp: new Date().toISOString(),
    supportMessage: 'If you need immediate assistance, please consult healthcare professionals or autism support organizations.',
    ...(process.env.NODE_ENV === 'development' && { 
      details: err.message,
      stack: err.stack 
    })
  });
};

/**
 * Input validation middleware
 */
const validateQuestion = (req, res, next) => {
  const { question } = req.body;
  
  if (!question) {
    const error = new Error('Question is required');
    error.name = 'ValidationError';
    error.statusCode = 400;
    return next(error);
  }

  if (typeof question !== 'string') {
    const error = new Error('Question must be text');
    error.name = 'ValidationError';
    error.statusCode = 400;
    return next(error);
  }

  if (question.trim().length === 0) {
    const error = new Error('Question cannot be empty');
    error.name = 'ValidationError';
    error.statusCode = 400;
    return next(error);
  }

  if (question.length > 2000) {
    const error = new Error('Question is too long (max 2000 characters)');
    error.name = 'ValidationError';
    error.statusCode = 400;
    return next(error);
  }

  // Clean and normalize the question
  req.body.question = question.trim();
  next();
};

/**
 * Response time tracking middleware
 */
const trackResponseTime = (req, res, next) => {
  req.startTime = Date.now();
  next();
};

/**
 * CORS preflight middleware for complex requests
 */
const handlePreflight = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    return res.status(200).end();
  }
  next();
};

/**
 * Security headers middleware
 */
const securityHeaders = (req, res, next) => {
  // Remove server signature
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  
  next();
};

module.exports = {
  requestLogger,
  errorHandler,
  validateQuestion,
  trackResponseTime,
  handlePreflight,
  securityHeaders
};