const request = require('supertest');
const app = require('../../../src/server');
const { cleanDatabase, createTestUser, getAuthToken, fixtures } = require('../../setup');

//jest synctax
describe('POST /api/tasks - Task Creation', () => {
  let authToken;

  // Run once before all tests
  beforeAll(async () => {
    console.log('[DEBUG] Using DB:', process.env.DATABASE_URL);
    await cleanDatabase();
    await createTestUser();
    authToken = await getAuthToken(app, {
      email: fixtures.users.validUser.email,
      password: fixtures.users.validUser.auth.password,
    });
  });

  // Run once after all tests
  afterAll(async () => {
    await cleanDatabase();
  });

  test('should create a valid task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(fixtures.tasks.validTask);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: fixtures.tasks.validTask.title,
      status: fixtures.tasks.validTask.status,
    });
  });

  test('should fail with invalid data', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(fixtures.tasks.invalidTask);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });

  test('should return validation errors for empty title and invalid status', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: '', status: 'INVALID_STATUS' });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('The title is required.');
    expect(response.body.errors).toContain('The status must be IN_COURSE, FINISHED, or STOPPED.');
  });

  test('should return 401 when no authorization token is provided', async () => {
    const response = await request(app).post('/api/tasks').send(fixtures.tasks.validTask);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Not authorized, no token');
  });
});
