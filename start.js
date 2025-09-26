#!/usr/bin/env node

// Force port 3000 for Replit
process.env.PORT = '3000';
process.env.HOSTNAME = '0.0.0.0';

// Import and run Next.js
const { spawn } = require('child_process');

console.log('🚀 Starting Next.js on port 3000...');

const nextProcess = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', '3000'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '3000',
    HOSTNAME: '0.0.0.0'
  }
});

nextProcess.on('error', (error) => {
  console.error('❌ Error starting Next.js:', error);
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
});