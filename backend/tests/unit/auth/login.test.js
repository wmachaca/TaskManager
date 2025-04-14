const request = require('supertest');
const app = require('../../../src/server');
const { cleanDatabase, createTestUser, fixtures } = require('../../setup');

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    await cleanDatabase();
    await createTestUser();
  });

  afterAll(async () => {
    await cleanDatabase();
  });

  test('should authenticate with valid credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: fixtures.users.validUser.email,
      password: fixtures.users.validUser.auth.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  test('should fail with invalid credentials', async () => {
    const response = await request(app).post('/api/auth/login').send(fixtures.users.invalidUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});
