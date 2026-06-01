const request = require('supertest');
const app = require('../../../src/app');
const { assertStandardResponse } = require('../helpers/assertResponse');
const { createUser } = require('../helpers/createUser');
const { getToken } = require('../helpers/getToken');
const prisma = require('../../../src/config/db');

describe('Task Soft Delete API', () => {
  let token;
  let taskId;

  beforeEach(async () => {
    await createUser({ email: "user@test.com", password: "Password123" });
    const tokens = await getToken("user@test.com", "Password123");
    token = tokens.accessToken;

    const task = await prisma.task.create({
      data: {
        title: "Task to delete",
        userId: tokens.userId
      }
    });
    taskId = task.id;
  });

  it('should soft delete a task (200)', async () => {
    const res = await request(app)
      .delete(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    assertStandardResponse(res);

    const dbTask = await prisma.task.findUnique({ where: { id: taskId } });
    expect(dbTask.deletedAt).not.toBeNull();
  });

  it('should exclude soft deleted tasks from get tasks query', async () => {
    // Delete the task
    await request(app)
      .delete(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    // Query tasks
    const res = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.tasks.length).toBe(0); // Should be hidden
  });
});
