const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');

test('server exits clearly when the configured port is already in use', async () => {
  const blocker = http.createServer();
  let port;

  await new Promise((resolve, reject) => {
    blocker.once('error', reject);
    blocker.listen(0, '127.0.0.1', () => {
      const address = blocker.address();
      port = address.port;
      resolve();
    });
  });

  const child = spawn(process.execPath, ['server.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let output = '';
  child.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on('data', (chunk) => {
    output += chunk.toString();
  });

  const exitCode = await new Promise((resolve) => {
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      resolve(0);
    }, 2000);

    child.once('exit', (code) => {
      clearTimeout(timer);
      resolve(code ?? 0);
    });
  });

  assert.equal(exitCode, 1);
  assert.match(output, /already in use|Server startup error/i);

  await new Promise((resolve, reject) => {
    blocker.close((err) => (err ? reject(err) : resolve()));
  });
});
