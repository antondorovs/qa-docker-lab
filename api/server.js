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
