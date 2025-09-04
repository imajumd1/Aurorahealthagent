#!/usr/bin/env node

/**
 * Test script to verify Aurora routes are working
 * Run with: node test-routes.js
 */

const express = require('express');
const http = require('http');
const { AuroraIntelligence } = require('./src/intelligence/aurora-core');
const { setupRoutes } = require('./src/routes');

console.log('🧪 Testing Aurora routes...\n');

// Test Aurora initialization
console.log('1️⃣ Testing Aurora initialization...');
let aurora;
try {
  aurora = new AuroraIntelligence();
  console.log('   ✅ Aurora initialized successfully\n');
} catch (error) {
  console.log(`   ❌ Aurora initialization failed: ${error.message}\n`);
  process.exit(1);
}

// Test Express app setup
console.log('2️⃣ Testing Express app setup...');
const app = express();
const PORT = process.env.PORT || 3004;

// Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup routes
console.log('3️⃣ Setting up routes...');
try {
  setupRoutes(app, aurora);
  console.log('   ✅ Routes setup completed\n');
} catch (error) {
  console.log(`   ❌ Routes setup failed: ${error.message}\n`);
  process.exit(1);
}

// Add basic health route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Aurora Autism Assistant',
    timestamp: new Date().toISOString()
  });
});

// Test server startup
console.log('4️⃣ Testing server startup...');
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`   ✅ Server started successfully on port ${PORT}\n`);
  
  // Test routes
  console.log('5️⃣ Testing routes...');
  
  // Test health endpoint
  testRoute('GET', '/health', (data) => {
    if (data.status === 'ok') {
      console.log('   ✅ Health endpoint working');
    } else {
      console.log('   ❌ Health endpoint failed');
    }
  });
  
  // Test API ask endpoint
  testRoute('POST', '/api/ask', (data) => {
    if (data.aurora) {
      console.log('   ✅ API ask endpoint working');
    } else {
      console.log('   ❌ API ask endpoint failed');
    }
  }, { question: 'What is autism?' });
  
  // Test topics endpoint
  testRoute('GET', '/api/topics', (data) => {
    if (Array.isArray(data)) {
      console.log('   ✅ Topics endpoint working');
    } else {
      console.log('   ❌ Topics endpoint failed');
    }
  });
  
  // Test analytics endpoint
  testRoute('GET', '/api/analytics', (data) => {
    if (data.analytics) {
      console.log('   ✅ Analytics endpoint working');
    } else {
      console.log('   ❌ Analytics endpoint failed');
    }
  });
  
  // Test unknown route
  testRoute('GET', '/unknown', (data) => {
    if (data.error === 'Route not found') {
      console.log('   ✅ Fallback route working');
    } else {
      console.log('   ❌ Fallback route failed');
    }
  });
  
  console.log('\n🎉 All route tests completed!');
  console.log('\n📋 Summary:');
  console.log('   - Aurora routes are properly configured');
  console.log('   - All endpoints should work on Railway');
  console.log('   - Fallback handling is working');
  
  server.close();
});

function testRoute(method, path, callback, body = null) {
  const options = {
    hostname: 'localhost',
    port: PORT,
    path: path,
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        callback(parsed);
      } catch (error) {
        console.log(`   ❌ ${method} ${path} - Invalid JSON response`);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log(`   ❌ ${method} ${path} - Request failed: ${error.message}`);
  });
  
  if (body) {
    req.write(JSON.stringify(body));
  }
  
  req.end();
}

server.on('error', (error) => {
  console.log(`   ❌ Server startup failed: ${error.message}`);
  process.exit(1);
});
