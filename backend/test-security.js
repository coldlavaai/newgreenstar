#!/usr/bin/env node

/**
 * 🔒 Security Testing Script for VAPI Proxy
 * Tests various security measures to ensure proper protection
 */

const http = require('http');

const TEST_HOST = 'localhost';
const TEST_PORT = process.env.PORT || 3001;
const BASE_URL = `http://${TEST_HOST}:${TEST_PORT}`;

console.log('🔒 Starting Security Tests for VAPI Proxy...\n');

let testsPassed = 0;
let testsFailed = 0;

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve) => {
    const options = {
      hostname: TEST_HOST,
      port: TEST_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ error: err.message });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test function wrapper
async function runTest(name, testFn) {
  try {
    console.log(`🧪 Testing: ${name}`);
    const result = await testFn();
    if (result) {
      console.log(`✅ PASS: ${name}\n`);
      testsPassed++;
    } else {
      console.log(`❌ FAIL: ${name}\n`);
      testsFailed++;
    }
  } catch (error) {
    console.log(`❌ ERROR: ${name} - ${error.message}\n`);
    testsFailed++;
  }
}

// Security Tests

async function testHealthEndpoint() {
  const response = await makeRequest('/api/health');
  return response.status === 200 && response.body && response.body.status === 'OK';
}

async function testConfigEndpoint() {
  const response = await makeRequest('/api/vapi/config');
  if (response.status !== 200) return false;
  
  // Should not expose API keys
  const body = response.body;
  return body && 
         body.assistantId && 
         !body.apiKey && // Should not expose secret API key
         body.hasSecureBackend === true;
}

async function testInputValidation() {
  // Test XSS attempt
  const xssPayload = { input: '<script>alert("xss")</script>' };
  const response = await makeRequest('/api/vapi/chat', 'POST', xssPayload);
  
  return response.status === 400; // Should reject malicious input
}

async function testInputLengthLimit() {
  // Test overly long input
  const longInput = 'A'.repeat(1000); // 1000 characters
  const response = await makeRequest('/api/vapi/chat', 'POST', { input: longInput });
  
  return response.status === 400; // Should reject long input
}

async function testEmptyInput() {
  const response = await makeRequest('/api/vapi/chat', 'POST', { input: '' });
  return response.status === 400; // Should reject empty input
}

async function testInvalidInput() {
  const response = await makeRequest('/api/vapi/chat', 'POST', { input: null });
  return response.status === 400; // Should reject null input
}

async function testCodeInjection() {
  const payload = { input: 'eval(alert("injection"))' };
  const response = await makeRequest('/api/vapi/chat', 'POST', payload);
  
  return response.status === 400; // Should reject code injection attempts
}

async function testRateLimit() {
  console.log('   🚦 Testing rate limiting (this may take a moment)...');
  
  // Make multiple rapid requests
  const requests = [];
  for (let i = 0; i < 25; i++) {
    requests.push(makeRequest('/api/vapi/chat', 'POST', { input: `test ${i}` }));
  }
  
  const responses = await Promise.all(requests);
  const rateLimitedResponses = responses.filter(r => r.status === 429);
  
  return rateLimitedResponses.length > 0; // Should have rate limited some requests
}

async function testSecurityHeaders() {
  const response = await makeRequest('/api/health');
  const headers = response.headers;
  
  // Check for security headers (from helmet.js)
  return headers['x-content-type-options'] && 
         headers['x-frame-options'] &&
         headers['x-xss-protection'];
}

async function testInvalidRoute() {
  const response = await makeRequest('/api/invalid-route');
  return response.status === 404; // Should return 404 for invalid routes
}

async function testSecurityLogging() {
  const securityEvent = {
    event: 'TEST_EVENT',
    details: { test: true },
    timestamp: Date.now(),
    url: 'http://localhost:3000'
  };
  
  const response = await makeRequest('/api/security/log', 'POST', securityEvent);
  return response.status === 200; // Should accept security logs
}

async function testCORSHeaders() {
  const response = await makeRequest('/api/health', 'OPTIONS');
  const headers = response.headers;
  
  return headers['access-control-allow-origin'] !== undefined;
}

// Run all security tests
async function runAllTests() {
  console.log(`🎯 Testing server at: ${BASE_URL}\n`);
  
  // Basic functionality tests
  await runTest('Health Endpoint', testHealthEndpoint);
  await runTest('Config Endpoint Security', testConfigEndpoint);
  
  // Input validation tests
  await runTest('XSS Protection', testInputValidation);
  await runTest('Input Length Limits', testInputLengthLimit);
  await runTest('Empty Input Rejection', testEmptyInput);
  await runTest('Invalid Input Rejection', testInvalidInput);
  await runTest('Code Injection Protection', testCodeInjection);
  
  // Security features tests
  await runTest('Rate Limiting', testRateLimit);
  await runTest('Security Headers', testSecurityHeaders);
  await runTest('Invalid Route Handling', testInvalidRoute);
  await runTest('Security Logging', testSecurityLogging);
  await runTest('CORS Configuration', testCORSHeaders);
  
  // Summary
  console.log('📊 SECURITY TEST SUMMARY');
  console.log('========================');
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}`);
  console.log(`📊 Total Tests: ${testsPassed + testsFailed}`);
  
  if (testsFailed === 0) {
    console.log('\n🎉 ALL SECURITY TESTS PASSED! 🛡️');
    console.log('Your server is properly secured and ready for production.');
    process.exit(0);
  } else {
    console.log('\n⚠️  SOME SECURITY TESTS FAILED');
    console.log('Please review the failed tests and fix security issues before deploying.');
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await makeRequest('/api/health');
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    // Server not running
  }
  return false;
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running!');
    console.log(`Please start the server first:`);
    console.log(`  cd backend`);
    console.log(`  npm run start:secure`);
    console.log(`\nThen run this test again:`);
    console.log(`  npm test\n`);
    process.exit(1);
  }
  
  await runAllTests();
}

// Handle script interruption
process.on('SIGINT', () => {
  console.log('\n\n🛑 Tests interrupted by user');
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled test error:', error.message);
  process.exit(1);
});

main().catch((error) => {
  console.error('❌ Test execution failed:', error.message);
  process.exit(1);
});