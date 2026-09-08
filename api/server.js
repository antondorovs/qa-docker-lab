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
  const isHeadRequest = request.method === 'HEAD';
  const methodAllowed = request.method === 'GET' || isHeadRequest;
  const { pathname } = new URL(request.url, 'http://localhost');
  const body = methodAllowed ? routes[pathname] : undefined;
  const statusCode = methodAllowed ? (body ? 200 : 404) : 405;
  const payload = body || {
    error: methodAllowed ? 'Not found' : 'Method not allowed',
  };

  response.writeHead(statusCode, {
    ...(methodAllowed ? {} : { Allow: 'GET, HEAD' }),
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(isHeadRequest ? undefined : JSON.stringify(payload));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Demo API is listening on port ${port}`);
});

let isShuttingDown = false;

function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`Received ${signal}; closing HTTP server`);

  const forceExit = setTimeout(() => {
    console.error('HTTP server did not close in time');
    process.exit(1);
  }, 8000);
  forceExit.unref();

  server.close((error) => {
    clearTimeout(forceExit);

    if (error) {
      console.error('Failed to close HTTP server', error);
      process.exit(1);
    }

    console.log('HTTP server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
