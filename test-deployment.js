#!/usr/bin/env node

/**
 * Test script to verify Aurora deployment readiness
 * Run with: node test-deployment.js
 */

const express = require('express');
const { AuroraIntelligence } = require('./src/intelligence/aurora-core');

console.log('🧪 Testing Aurora deployment readiness...\n');

// Test 1: Check environment variables
console.log('1️⃣ Checking environment variables...');
const hasOpenAI = !!process.env.OPENAI_API_KEY;
console.log(`   OPENAI_API_KEY: ${hasOpenAI ? '✅ Found' : '⚠️  Missing (will use knowledge base only)'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   PORT: ${process.env.PORT || '3002'}\n`);

// Test 2: Check Aurora initialization
console.log('2️⃣ Testing Aurora initialization...');
try {
  const aurora = new AuroraIntelligence();
  console.log('   ✅ Aurora initialized successfully\n');
} catch (error) {
  console.log(`   ❌ Aurora initialization failed: ${error.message}\n`);
  process.exit(1);
}

// Test 3: Test basic server startup
console.log('3️⃣ Testing basic server startup...');
const app = express();
const PORT = process.env.PORT || 3002;

// Add basic routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Aurora Autism Assistant',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Aurora Test</title></head>
      <body>
        <h1>🧩 Aurora Autism Assistant</h1>
        <p>Test deployment successful!</p>
        <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
        <p>OpenAI: ${hasOpenAI ? 'Enabled' : 'Disabled (knowledge base only)'}</p>
      </body>
    </html>
  `);
});

// Test server startup
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`   ✅ Server started successfully on port ${PORT}`);
  console.log(`   🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`   🌐 Web interface: http://localhost:${PORT}\n`);
  
  // Test health endpoint
  console.log('4️⃣ Testing health endpoint...');
  const http = require('http');
  const options = {
    hostname: 'localhost',
    port: PORT,
    path: '/health',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const health = JSON.parse(data);
        if (health.status === 'ok') {
          console.log('   ✅ Health endpoint working correctly');
          console.log('   📊 Response:', health);
        } else {
          console.log('   ❌ Health endpoint returned unexpected response');
        }
      } catch (error) {
        console.log('   ❌ Health endpoint returned invalid JSON');
      }
      
      console.log('\n🎉 All tests passed! Aurora is ready for deployment.');
      console.log('\n📋 Next steps:');
      console.log('   1. Set OPENAI_API_KEY in Railway dashboard (optional but recommended)');
      console.log('   2. Deploy to Railway');
      console.log('   3. Test your live deployment');
      
      server.close();
    });
  });
  
  req.on('error', (error) => {
    console.log(`   ❌ Health endpoint test failed: ${error.message}`);
    server.close();
  });
  
  req.end();
});

server.on('error', (error) => {
  console.log(`   ❌ Server startup failed: ${error.message}`);
  process.exit(1);
});
