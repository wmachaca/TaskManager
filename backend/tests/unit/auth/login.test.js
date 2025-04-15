const request = require('supertest');
const app = require('../../../src/server');
const { cleanDatabase, createTestUser, fixtures } = require('../../setup');

describe('POST /api/auth/login', () => {
  let testUser;
  beforeAll(async () => {
    await cleanDatabase();
    testUser = await createTestUser();
    console.log('Created test user:', testUser.id);
  });

  afterAll(async () => {
    await cleanDatabase();
  });

  test('should authenticate with valid credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: fixtures.users.validUser.email,
      password: 'testpassword',
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      token: expect.any(String),
      user: {
        id: testUser.id,
        email: fixtures.users.validUser.email,
      },
    });
  });

  test('should fail with invalid credentials', async () => {
    const response = await request(app).post('/api/auth/login').send(fixtures.users.invalidUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: expect.stringContaining('Invalid credentials'),
    });
  });
});
