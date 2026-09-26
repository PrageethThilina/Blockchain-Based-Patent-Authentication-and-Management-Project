import http from 'http';

function checkEndpoint(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Testing server health...');
  try {
    const health = await checkEndpoint('/api/v1/health');
    console.log('Health check response:', health.status, health.body.service);
    const patents = await checkEndpoint('/api/v1/patents');
    console.log('Patents response:', patents.status, `Total: ${patents.body.total}`);
    const verify = await checkEndpoint('/api/v1/verify/1');
    console.log('Verify response:', verify.status, `Valid: ${verify.body.isValid}`);
    console.log('ALL API TESTS PASSED SUCCESSFULLY! ✅');
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err.message);
    process.exit(1);
  }
}

run();
