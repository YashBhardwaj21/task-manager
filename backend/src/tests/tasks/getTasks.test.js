const request = require('supertest');
const app = require('../../../src/app');
const { assertStandardResponse } = require('../helpers/assertResponse');
const { createUser } = require('../helpers/createUser');
const { getToken } = require('../helpers/getToken');
const prisma = require('../../../src/config/db');

describe('Get Tasks API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    await createUser({ email: "user@test.com", password: "Password123" });
    const tokens = await getToken("user@test.com", "Password123");
    token = tokens.accessToken;
    userId = tokens.userId;

    // Seed 15 tasks
    const tasks = Array.from({ length: 15 }).map((_, i) => ({
      title: i === 0 ? "Backend Assignment" : `Task ${i}`,
      userId,
      status: "pending"
    }));
    await prisma.task.createMany({ data: tasks });
  });

  it('should return paginated tasks with metadata', async () => {
    const res = await request(app)
      .get('/api/v1/tasks?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    assertStandardResponse(res);
    expect(res.body.data.tasks.length).toBe(10);
    expect(res.body.data.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 15,
      totalPages: 2
    });
  });

  it('should return empty array for page beyond limit (edge case)', async () => {
    const res = await request(app)
      .get('/api/v1/tasks?page=100&limit=10')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    assertStandardResponse(res);
    expect(res.body.data.tasks.length).toBe(0);
  });

  it('should support case-insensitive search', async () => {
    const res = await request(app)
      .get('/api/v1/tasks?search=BACKEND')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    assertStandardResponse(res);
    expect(res.body.data.tasks.length).toBe(1);
    expect(res.body.data.tasks[0].title).toBe("Backend Assignment");
  });
});
