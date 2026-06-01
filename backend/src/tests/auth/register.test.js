const request = require('supertest');
const app = require('../../../src/app');
const { PrismaClient } = require('@prisma/client');
const { assertStandardResponse } = require('../helpers/assertResponse');
const { createUser } = require('../helpers/createUser');
const prisma = require('../../../src/config/db');

describe('Auth Register API', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "John",
        email: "john@test.com",
        password: "Password123"
      });

    expect(res.status).toBe(201);
    assertStandardResponse(res);
    expect(res.body.success).toBe(true);

    const user = await prisma.user.findUnique({ where: { email: "john@test.com" } });
    expect(user).toBeTruthy();
  });

  it('should return 409 for duplicate email', async () => {
    await createUser({ email: "duplicate@test.com" });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "Jane",
        email: "duplicate@test.com",
        password: "Password123"
      });

    expect(res.status).toBe(409);
    assertStandardResponse(res);
    expect(res.body.success).toBe(false);
  });
});
