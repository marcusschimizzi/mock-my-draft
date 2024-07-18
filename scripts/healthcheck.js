const http = require('http');

const PORT = process.env.PORT || 3000;

const options = {
  hostname: 'localhost',
  port: PORT,
  path: '/api/health',
  timeout: 2000,
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('Healthcheck is OK');
    process.exit(0);
  } else {
    console.error('Healthcheck failed with status code', res.statusCode);
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.error('Healthcheck failed with error', err);
  process.exit(1);
});

request.end();
