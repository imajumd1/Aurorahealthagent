#!/usr/bin/env node

/**
 * Railway Deployment Status Checker
 * Checks if Aurora is working on Railway
 */

const https = require('https');

const RAILWAY_URL = 'https://aurorahealthagent-production.up.railway.app';

console.log('🚂 Checking Railway Deployment Status...\n');

// Test health endpoint
testEndpoint('GET', '/health', (data) => {
  if (data.status === 'ok') {
    console.log('✅ Health endpoint: WORKING');
    console.log(`   Service: ${data.service}`);
    console.log(`   Version: ${data.version}`);
    console.log(`   Timestamp: ${data.timestamp}\n`);
    
    // Test other endpoints
    testEndpoint('GET', '/api/topics', (data) => {
      if (Array.isArray(data)) {
        console.log('✅ Topics endpoint: WORKING');
        console.log(`   Found ${data.length} topics\n`);
      } else {
        console.log('❌ Topics endpoint: FAILED');
        console.log(`   Response: ${JSON.stringify(data)}\n`);
      }
    });
    
    testEndpoint('POST', '/api/ask', (data) => {
      if (data.aurora) {
        console.log('✅ API Ask endpoint: WORKING');
        console.log(`   Aurora: ${data.aurora.name}`);
        console.log(`   Answer length: ${data.answer ? data.answer.length : 0} characters\n`);
      } else {
        console.log('❌ API Ask endpoint: FAILED');
        console.log(`   Response: ${JSON.stringify(data)}\n`);
      }
    }, { question: 'What is autism?' });
    
    testEndpoint('GET', '/api/analytics', (data) => {
      if (data.analytics) {
        console.log('✅ Analytics endpoint: WORKING');
        console.log(`   Total feedback: ${data.analytics.totalFeedback}`);
        console.log(`   Positive rate: ${data.analytics.positiveRate}%\n`);
      } else {
        console.log('❌ Analytics endpoint: FAILED');
        console.log(`   Response: ${JSON.stringify(data)}\n`);
      }
    });
    
    // Test web interface
    testEndpoint('GET', '/', (data) => {
      if (data.includes('Aurora') || data.includes('autism')) {
        console.log('✅ Web interface: WORKING');
        console.log('   Frontend loads correctly\n');
      } else {
        console.log('❌ Web interface: FAILED');
        console.log('   Frontend not loading properly\n');
      }
    });
    
  } else {
    console.log('❌ Health endpoint: FAILED');
    console.log(`   Response: ${JSON.stringify(data)}\n`);
  }
});

function testEndpoint(method, path, callback, body = null) {
  const url = new URL(RAILWAY_URL + path);
  
  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Aurora-Status-Checker/1.0'
    },
    timeout: 10000
  };
  
  const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        if (res.headers['content-type'] && res.headers['content-type'].includes('application/json')) {
          const parsed = JSON.parse(data);
          callback(parsed);
        } else {
          callback(data);
        }
      } catch (error) {
        console.log(`❌ ${method} ${path}: JSON Parse Error`);
        console.log(`   Raw response: ${data.substring(0, 200)}...\n`);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log(`❌ ${method} ${path}: Request Failed`);
    console.log(`   Error: ${error.message}\n`);
  });
  
  req.on('timeout', () => {
    console.log(`❌ ${method} ${path}: Request Timeout`);
    console.log(`   Timeout after 10 seconds\n`);
    req.destroy();
  });
  
  if (body) {
    req.write(JSON.stringify(body));
  }
  
  req.end();
}

// Add a delay to allow all requests to complete
setTimeout(() => {
  console.log('🎯 Railway Status Check Complete!');
  console.log('\n📋 Next Steps:');
  console.log('   1. If all endpoints are working: Your app is deployed successfully!');
  console.log('   2. If some endpoints failed: Check Railway logs for errors');
  console.log('   3. If all endpoints failed: The app may still be deploying (wait 2-3 minutes)');
  console.log('\n🔗 Your Aurora app: https://aurorahealthagent-production.up.railway.app/');
}, 5000);
