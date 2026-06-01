const request = require('supertest');
const app = require('../../../src/app');
const { PrismaClient } = require('@prisma/client');
const { assertStandardResponse } = require('../helpers/assertResponse');
const prisma = require('../../../src/config/db');

describe('Auth Validation API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should return 400 if email is invalid', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: "John",
          email: "not-an-email",
          password: "Password123"
        });

      expect(res.status).toBe(400);
      assertStandardResponse(res);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if password is too short', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: "John",
          email: "john@test.com",
          password: "123"
        });

      expect(res.status).toBe(400);
      assertStandardResponse(res);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: "john@test.com",
          password: "Password123"
        });

      expect(res.status).toBe(400);
      assertStandardResponse(res);
      expect(res.body.success).toBe(false);
    });
  });
});
