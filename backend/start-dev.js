// Development startup script with SSL certificate bypass
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { spawn } = require('child_process');

console.log('🚀 Starting YagoutPay Backend with SSL certificate bypass...');
console.log('⚠️  WARNING: SSL certificate verification is disabled for development only!');

const child = spawn('node', ['dist/main.js'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: '0' }
});

child.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});
