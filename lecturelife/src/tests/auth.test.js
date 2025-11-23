const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

const defaultUser = {
  name: 'Tester',
  email: 'tester@example.com',
  password: 'Secret123'
};

describe('Auth flow', () => {
  it('returns 404 when email is not found', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'missing@example.com',
      password: 'anything'
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Usuário não encontrado');
  });

  it('returns 401 when password is invalid', async () => {
    await request(app).post('/auth/register').send(defaultUser);

    const response = await request(app).post('/auth/login').send({
      email: defaultUser.email,
      password: 'wrong'
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Credenciais inválidas');
  });

  it('returns token when credentials are valid', async () => {
    await request(app).post('/auth/register').send(defaultUser);

    const response = await request(app).post('/auth/login').send({
      email: defaultUser.email,
      password: defaultUser.password
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(defaultUser.email);
  });
});
