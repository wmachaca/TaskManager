const request = require('supertest');
const app = require('../../../../src/server');
const { cleanDatabase, createTestUser, getAuthToken, prisma, fixtures } = require('../../../setup');

describe('DELETE /api/tasks/:id - Soft Delete Task', () => {
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

  test('should soft delete a task', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${testTask.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Task moved to trash',
      task: expect.objectContaining({
        id: testTask.id,
        isDeleted: true,
        deletedAt: expect.any(String),
      }),
    });

    // Verify in database
    const deletedTask = await prisma.task.findUnique({
      where: { id: testTask.id },
    });
    expect(deletedTask.isDeleted).toBe(true);
    expect(deletedTask.deletedAt).toBeInstanceOf(Date);
  });

  test('should return 404 for non-existent task', async () => {
    const nonExistentId = 9999;
    const response = await request(app)
      .delete(`/api/tasks/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Task not found or unauthorized',
    });
  });
});
