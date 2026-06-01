const request = require('supertest');
const app = require('../../../src/app');

describe('System Health API', () => {
  it('should return 200 with server metadata', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Server healthy");
    expect(res.body).toHaveProperty("timestamp");
  });
});
