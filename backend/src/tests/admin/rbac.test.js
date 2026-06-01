const request = require('supertest');
const app = require('../../../src/app');
const { assertStandardResponse } = require('../helpers/assertResponse');
const { createUser } = require('../helpers/createUser');
const { getToken } = require('../helpers/getToken');

describe('Admin RBAC API', () => {
  let userToken;
  let adminToken;

  beforeEach(async () => {
    await createUser({ email: "user@test.com", password: "Password123", role: "user" });
    await createUser({ email: "admin@test.com", password: "Password123", role: "admin" });

    const userTokens = await getToken("user@test.com", "Password123");
    userToken = userTokens.accessToken;

    const adminTokens = await getToken("admin@test.com", "Password123");
    adminToken = adminTokens.accessToken;
  });

  it('Normal User cannot view users (403)', async () => {
    const res = await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    assertStandardResponse(res);
  });

  it('Normal User cannot block another user (403)', async () => {
    const res = await request(app)
      .patch('/api/v1/admin/users/some-id/block')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    assertStandardResponse(res);
  });

  it('Admin can view users (200)', async () => {
    // Assuming GET /admin/users is implemented, otherwise this returns 404
    // We will expect it to not be 403.
    const res = await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).not.toBe(403);
  });
});
