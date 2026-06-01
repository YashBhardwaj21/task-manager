const request = require('supertest');
const app = require('../../../src/app');
const { assertStandardResponse } = require('../helpers/assertResponse');
const { createUser } = require('../helpers/createUser');

describe('Auth Login API', () => {
  beforeEach(async () => {
    await createUser({ email: "login@test.com", password: "Password123" });
  });

  it('should login user and return tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "login@test.com",
        password: "Password123"
      });

    expect(res.status).toBe(200);
    assertStandardResponse(res);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
  });

  it('should return 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "login@test.com",
        password: "WrongPassword"
      });

    expect(res.status).toBe(401);
    assertStandardResponse(res);
    expect(res.body.success).toBe(false);
  });
});
