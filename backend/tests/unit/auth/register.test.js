const request = require('supertest');
const app = require('../../../src/server');
const { cleanDatabase, prisma, fixtures } = require('../../setup');

describe('POST /api/auth/register - User Registration', () => {
  beforeAll(async () => {
    console.log('[DEBUG] Using DB:', process.env.DATABASE_URL);
    await cleanDatabase();
  });

  afterEach(async () => {
    await cleanDatabase();
  });

  test('should register a new user with valid credentials', async () => {
    const userData = fixtures.users.registration.valid;

    const response = await request(app).post('/api/auth/register').send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      user: {
        name: userData.name,
        email: userData.email,
        provider: 'credentials',
      },
      token: expect.any(String),
    });

    // Verify user was actually created
    const dbUser = await prisma.user.findUnique({
      where: { email: userData.email },
      include: { auth: true },
    });

    expect(dbUser).toBeTruthy();
    expect(dbUser.auth).toBeTruthy();
  });

  test('should fail with invalid email format', async () => {
    const userData = {
      ...fixtures.users.registration.valid,
      email: 'invalid-email',
    };

    const response = await request(app).post('/api/auth/register').send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/email/i);
  });

  test('should fail with weak password', async () => {
    const userData = {
      ...fixtures.users.registration.valid,
      password: '123',
    };

    const response = await request(app).post('/api/auth/register').send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/password/i);
  });

  test('should fail if email already exists', async () => {
    const userData = fixtures.users.registration.valid;

    // First registration (should succeed)
    await request(app).post('/api/auth/register').send(userData);

    // Second attempt with same email
    const response = await request(app).post('/api/auth/register').send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/already exists/i);
  });
});
