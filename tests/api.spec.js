const { test, expect } = require('@playwright/test');

const expectedServiceName = process.env.EXPECTED_SERVICE_NAME || 'demo-api';

function expectJsonResponse(response, status) {
  expect(response.status()).toBe(status);
  expect(response.headers()['cache-control']).toBe('no-store');
  expect(response.headers()['content-type']).toContain('application/json');
  expect(response.headers()['referrer-policy']).toBe('no-referrer');
  expect(response.headers()['x-frame-options']).toBe('DENY');
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['x-request-id']).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
}

test('health endpoint reports that the API is ready', async ({ request }) => {
  const response = await request.get('/health?source=playwright');

  expectJsonResponse(response, 200);
  expect(await response.json()).toEqual({
    status: 'ok',
    service: expectedServiceName,
  });
});

test('returns a known test user', async ({ request }) => {
  const response = await request.get('/users/1');

  expectJsonResponse(response, 200);
  expect(await response.json()).toEqual({
    id: 1,
    name: 'Ada Lovelace',
    role: 'QA Engineer',
  });
});

test('supports HEAD without returning a response body', async ({ request }) => {
  const response = await request.head('/health');

  expectJsonResponse(response, 200);
  expect(await response.text()).toBe('');
});

test('assigns a unique ID to each request', async ({ request }) => {
  const firstResponse = await request.get('/health');
  const secondResponse = await request.get('/health');

  expectJsonResponse(firstResponse, 200);
  expectJsonResponse(secondResponse, 200);
  expect(firstResponse.headers()['x-request-id']).not.toBe(
    secondResponse.headers()['x-request-id'],
  );
});

test('returns 404 for an unknown route', async ({ request }) => {
  const response = await request.get('/missing');

  expectJsonResponse(response, 404);
  expect(await response.json()).toEqual({
    error: 'Not found',
  });
});

test('rejects unsupported HTTP methods', async ({ request }) => {
  const response = await request.post('/health');

  expectJsonResponse(response, 405);
  expect(response.headers().allow).toBe('GET, HEAD');
  expect(await response.json()).toEqual({
    error: 'Method not allowed',
  });
});
