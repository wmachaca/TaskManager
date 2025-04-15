const request = require('supertest');
const app = require('../../../src/server');
const { cleanDatabase, createTestUser, getAuthToken, fixtures } = require('../../setup');

//jest synctax
describe('POST /api/tasks - Task Creation', () => {
  let authToken;

  beforeAll(async () => {
    console.log('[DEBUG] Using DB:', process.env.DATABASE_URL);
    await cleanDatabase();
    await createTestUser();
    authToken = await getAuthToken(app, {
      email: fixtures.users.validUser.email,
      password: fixtures.users.validUser.auth.password,
    });
  });

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
});
