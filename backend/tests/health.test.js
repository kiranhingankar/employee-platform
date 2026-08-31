const request = require('supertest');

jest.mock('../src/db/postgres', () => ({
  isDatabaseReady: jest.fn(),
}));

jest.mock('../src/db/redis', () => ({
  isRedisReady: jest.fn(),
}));

const { isDatabaseReady } = require('../src/db/postgres');
const { isRedisReady } = require('../src/db/redis');

const app = require('../src/app');

describe('Health and readiness endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /health returns 200', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: 'UP',
      service: 'employee-platform-api',
    });
  });

  test('GET /ready returns 200 when dependencies are healthy', async () => {
    isDatabaseReady.mockResolvedValue(true);
    isRedisReady.mockResolvedValue(true);

    const response = await request(app).get('/ready');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('READY');
    expect(response.body.dependencies).toEqual({
      postgres: 'UP',
      redis: 'UP',
    });
  });

  test('GET /ready returns 503 when PostgreSQL is unavailable', async () => {
    isDatabaseReady.mockResolvedValue(false);
    isRedisReady.mockResolvedValue(true);

    const response = await request(app).get('/ready');

    expect(response.statusCode).toBe(503);
    expect(response.body.status).toBe('NOT_READY');
    expect(response.body.dependencies).toEqual({
      postgres: 'DOWN',
      redis: 'UP',
    });
  });

  test('GET /ready returns 503 when Redis is unavailable', async () => {
    isDatabaseReady.mockResolvedValue(true);
    isRedisReady.mockResolvedValue(false);

    const response = await request(app).get('/ready');

    expect(response.statusCode).toBe(503);
    expect(response.body.status).toBe('NOT_READY');
    expect(response.body.dependencies).toEqual({
      postgres: 'UP',
      redis: 'DOWN',
    });
  });
});