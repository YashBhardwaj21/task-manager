const request = require('supertest');
const app = require('../../../src/app');
const { assertStandardResponse } = require('../helpers/assertResponse');
const { createUser } = require('../helpers/createUser');
const { getToken } = require('../helpers/getToken');

describe('Auth Refresh Token API', () => {
  let refreshToken;

  beforeEach(async () => {
    await createUser({ email: "refresh@test.com", password: "Password123" });
    const tokens = await getToken("refresh@test.com", "Password123");
    refreshToken = tokens.refreshToken;
  });

  it('should return new access token for valid refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    assertStandardResponse(res);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('should return 401 for invalid refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: "invalid-token-string" });

    expect(res.status).toBe(401);
    assertStandardResponse(res);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for missing refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({}); // missing token

    expect(res.status).toBe(400); // Because Zod catches missing required fields
    assertStandardResponse(res);
    expect(res.body.success).toBe(false);
  });
});
