const request = require('supertest');
const app = require('../../../src/server');
const { cleanDatabase, createTestUser, getAuthToken, fixtures, prisma } = require('../../setup');

describe('PUT /api/tasks/:id - Task Updates', () => {
  let authToken;
  let testUser;
  let testTask;

  beforeAll(async () => {
    await cleanDatabase();
    testUser = await createTestUser();
    authToken = await getAuthToken(app);

    // Create a test task
    testTask = await prisma.task.create({
      data: {
        ...fixtures.tasks.validTask,
        userId: testUser.id,
      },
    });
  });

  afterAll(async () => {
    await cleanDatabase();
  });

  test('should update task with valid data', async () => {
    const updateData = {
      description: 'Updated description',
      status: 'FINISHED',
      priority: 'HIGH',
    };

    const response = await request(app)
      .put(`/api/tasks/${testTask.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updateData);

    // Verify update in database
    const updatedTask = await prisma.task.findUnique({
      where: { id: testTask.id },
    });
    expect(updatedTask.description).toBe(updateData.description);
  });

  test('should fail with invalid status', async () => {
    // Store original console.error
    const originalConsoleError = console.error;

    // Mock console.error to suppress Prisma's validation error
    console.error = jest.fn();
    const response = await request(app)
      .put(`/api/tasks/${testTask.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'INVALID_STATUS' });

    // Restore console.error
    console.error = originalConsoleError;

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Invalid data');
  });

  test('should fail with empty title', async () => {
    const response = await request(app)
      .put(`/api/tasks/${testTask.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: '' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/title/i); // Check if error mentions title
  });

  test('should return 404 for non-existent task', async () => {
    const nonExistentId = 9999;
    const response = await request(app)
      .put(`/api/tasks/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'New Title' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
  test('should update only provided fields', async () => {
    const originalTask = await prisma.task.findUnique({
      where: { id: testTask.id },
    });

    const response = await request(app)
      .put(`/api/tasks/${testTask.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ description: 'Partial update' });

    expect(response.status).toBe(200);
    expect(response.body.description).toBe('Partial update');
    expect(response.body.title).toBe(originalTask.title); // Title should remain unchanged
  });
});
