const request = require('supertest');
const app = require('../../../../src/server');
const { cleanDatabase, createTestUser, getAuthToken, prisma, fixtures } = require('../../../setup');

describe('POST /api/tasks/:id/restore - Restore Soft Deleted Task', () => {
  let authToken;
  let testUser;
  let testTask;

  beforeAll(async () => {
    await cleanDatabase();
    testUser = await createTestUser();
    authToken = await getAuthToken(app);

    // Create and soft delete a test task
    testTask = await prisma.task.create({
      data: {
        ...fixtures.tasks.validTask,
        userId: testUser.id,
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    await cleanDatabase();
  });

  test('should restore a soft deleted task', async () => {
    const response = await request(app)
      .post(`/api/tasks/${testTask.id}/restore`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Task restored successfully',
      task: expect.objectContaining({
        id: testTask.id,
        isDeleted: false,
        deletedAt: null,
      }),
    });

    // Verify in database
    const restoredTask = await prisma.task.findUnique({
      where: { id: testTask.id },
    });
    expect(restoredTask.isDeleted).toBe(false);
    expect(restoredTask.deletedAt).toBeNull();
    expect(restoredTask.updatedAt).not.toBe(testTask.updatedAt);
  });

  test('should return 404 for non-existent task', async () => {
    const nonExistentId = 9999;
    const response = await request(app)
      .post(`/api/tasks/${nonExistentId}/restore`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Deleted task not found or unauthorized',
    });
  });

  test('should return 404 when trying to restore a non-deleted task', async () => {
    // Create a non-deleted task
    const activeTask = await prisma.task.create({
      data: {
        ...fixtures.tasks.validTask,
        userId: testUser.id,
        isDeleted: false,
        deletedAt: null,
      },
    });

    // Try to restore
    const response = await request(app)
      .post(`/api/tasks/${activeTask.id}/restore`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Deleted task not found or unauthorized',
    });
  });
  test('should return 400 for invalid task ID', async () => {
    const response = await request(app)
      .post('/api/tasks/invalid-id/restore')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid task ID',
    });
  });
});
