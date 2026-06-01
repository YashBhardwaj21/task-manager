const request = require('supertest');
const app = require('../../../src/app');
const { assertStandardResponse } = require('../helpers/assertResponse');
const { createUser } = require('../helpers/createUser');
const { getToken } = require('../helpers/getToken');

describe('Task Validation API', () => {
  let token;

  beforeEach(async () => {
    await createUser({ email: "user@test.com", password: "Password123" });
    const tokens = await getToken("user@test.com", "Password123");
    token = tokens.accessToken;
  });

  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: "Missing title"
      });

    expect(res.status).toBe(400);
    assertStandardResponse(res);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 if priority is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "Task",
        priority: "super-high"
      });

    expect(res.status).toBe(400);
    assertStandardResponse(res);
  });

  it('should return 400 if status is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "Task",
        status: "done" // should be completed
      });

    expect(res.status).toBe(400);
    assertStandardResponse(res);
  });
});
