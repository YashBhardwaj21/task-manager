const request = require('supertest');
const app = require('../../../src/app');
const { assertStandardResponse } = require('../helpers/assertResponse');
const { createUser } = require('../helpers/createUser');
const { getToken } = require('../helpers/getToken');
const prisma = require('../../../src/config/db');

describe('Create Task API', () => {
  let token;

  beforeEach(async () => {
    await createUser({ email: "user@test.com", password: "Password123" });
    const tokens = await getToken("user@test.com", "Password123");
    token = tokens.accessToken;
  });

  it('should create a task successfully', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Test Description",
        priority: "high"
      });

    expect(res.status).toBe(201);
    assertStandardResponse(res);
    expect(res.body.success).toBe(true);

    const task = await prisma.task.findUnique({ where: { id: res.body.data.id } });
    expect(task).toBeTruthy();
    expect(task.title).toBe("Test Task");
  });

  it('should return 401 if no token provided', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .send({ title: "Test Task" });

    expect(res.status).toBe(401);
    assertStandardResponse(res);
  });

  it('should return 401 if invalid token provided', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer fake_token`)
      .send({ title: "Test Task" });

    expect(res.status).toBe(401);
    assertStandardResponse(res);
  });
});
