const request = require('supertest');
const app = require('../app');

async function createAndLoginUser(overrides = {}) {
  const userPayload = {
    nome: 'Usuário Teste',
    email: `usuario-${Date.now()}@example.com`,
    senha: 'senha123',
    ...overrides,
  };

  await request(app).post('/auth/register').send(userPayload);
  const loginResponse = await request(app)
    .post('/auth/login')
    .send({ email: userPayload.email, senha: userPayload.senha })
    .expect(200);

  return {
    token: loginResponse.body.token,
    user: loginResponse.body.user,
  };
}

async function createBook(token, overrides = {}) {
  const bookPayload = {
    titulo: `Livro ${Date.now()}`,
    autor: 'Autor Teste',
    anoPublicacao: 2020,
    categoria: 'técnico',
    paginasTotal: 300,
    sinopse: 'Livro de teste',
    ...overrides,
  };

  const resposta = await request(app)
    .post('/books')
    .set('Authorization', `Bearer ${token}`)
    .send(bookPayload)
    .expect(201);

  return resposta.body;
}

module.exports = {
  app,
  createAndLoginUser,
  createBook,
};