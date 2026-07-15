const { test, expect } = require('@playwright/test');

const expectedServiceName = process.env.EXPECTED_SERVICE_NAME || 'demo-api';

function expectJsonResponse(response, status) {
  expect(response.status()).toBe(status);
  expect(response.headers()['content-type']).toContain('application/json');
}

test('health endpoint reports that the API is ready', async ({ request }) => {
  const response = await request.get('/health');

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

test('returns 404 for an unknown route', async ({ request }) => {
  const response = await request.get('/missing');

  expectJsonResponse(response, 404);
  expect(await response.json()).toEqual({
    error: 'Not found',
  });
});
