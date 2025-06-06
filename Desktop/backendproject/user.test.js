const request = require('supertest');
const app = require('../app');

describe('User Profile', () => {
  it('should get the logged in user profile', async () => {
    const loginRes = await request(app).post('/api/users/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('should return 401 if no token provided', async () => {
    const res = await request(app).get('/api/users/profile');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 if token invalid', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toEqual(401);
  });
});
