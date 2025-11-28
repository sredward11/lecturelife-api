const request = require('supertest');
const app = require('../app');

describe('Auth Endpoints', () => {
  it('deve registrar um novo usuário com sucesso', async () => {
    const res = await request(app).post('/auth/register').send({
      nome: 'Novo Usuário',
      email: 'novo@email.com',
      senha: 'senha123',
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', 'novo@email.com');
    expect(res.body).not.toHaveProperty('senhaHash'); // Garante sanitização
  });

  it('não deve permitir email duplicado', async () => {
    await request(app).post('/auth/register').send({
      nome: 'User 1',
      email: 'duplicado@email.com',
      senha: '123',
    });

    const res = await request(app).post('/auth/register').send({
      nome: 'User 2',
      email: 'duplicado@email.com',
      senha: '456',
    });

    expect(res.statusCode).toEqual(409);
  });

  it('deve fazer login e retornar token', async () => {
    // Registrar primeiro
    await request(app).post('/auth/register').send({
      nome: 'Login User',
      email: 'login@email.com',
      senha: 'password',
    });

    const res = await request(app).post('/auth/login').send({
      email: 'login@email.com',
      senha: 'password',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});