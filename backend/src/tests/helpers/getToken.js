const request = require('supertest');
const app = require('../../app');

const getToken = async (email = "user@test.com", password = "Password123") => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password });
  
  return {
    accessToken: res.body.data.accessToken,
    refreshToken: res.body.data.refreshToken,
    userId: res.body.data.user.id
  };
};

module.exports = { getToken };
