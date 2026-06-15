const http = require('node:http');

const port = Number(process.env.PORT || 3000);
const serviceName = process.env.SERVICE_NAME || 'demo-api';

const routes = {
  '/health': {
    status: 'ok',
    service: serviceName,
  },
  '/users/1': {
    id: 1,
    name: 'Ada Lovelace',
    role: 'QA Engineer',
  },
};

const server = http.createServer((request, response) => {
  const body = routes[request.url];
  const statusCode = body ? 200 : 404;
  const payload = body || { error: 'Not found' };

  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(payload));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Demo API is listening on port ${port}`);
});
