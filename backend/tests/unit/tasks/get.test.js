const request = require('supertest');
const app = require('../../../src/server');
const { cleanDatabase, createTestUser, getAuthToken, fixtures, prisma } = require('../../setup');

describe('GET /api/tasks - Task Retrieval', () => {
  let authToken;
  let testUser;
  let createdTasks = [];

  beforeAll(async () => {
    console.log('[DEBUG] Using DB:', process.env.DATABASE_URL);
    await cleanDatabase();
    testUser = await createTestUser();
    authToken = await getAuthToken(app);

    // Create test tasks
    createdTasks = await Promise.all([
      prisma.task.create({
        data: {
          ...fixtures.tasks.validTask,
          userId: testUser.id,
        },
      }),
      prisma.task.create({
        data: {
          ...fixtures.tasks.validTask,
          title: 'Second Test Task',
          status: 'FINISHED',
          userId: testUser.id,
        },
      }),
      prisma.task.create({
        data: {
          ...fixtures.tasks.validTask,
          title: 'Deleted Task',
          isDeleted: true,
          userId: testUser.id,
        },
      }),
    ]);
  });

  afterAll(async () => {
    await cleanDatabase();
  });

  test('should retrieve all non-deleted tasks for authenticated user', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2); //only two non-deleted tasks

    // Verify tasks belong to the test user
    response.body.forEach(task => {
      expect(task.userId).toBe(testUser.id);
      expect(task.isDeleted).toBe(false);
    });
  });
  test('should return deleted tasks when showDeleted is true', async () => {
    const response = await request(app)
      .get('/api/tasks?showDeleted=true')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3); // All tasks including the deleted one
  });

  test('should return 401 for unauthenticated requests', async () => {
    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(401);
  });
});
