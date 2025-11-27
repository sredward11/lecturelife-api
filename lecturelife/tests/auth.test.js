const request = require('supertest');
const app = require('../app');

function buildUserPayload(overrides = {}) {
  return {
    nome: 'Fulano de Tal',
    email: 'fulano@example.com',
    senha: 'segredo123',
    ...overrides,
  };
}

describe('Auth - LectureLife', () => {
  test('POST /auth/register deve criar usuário', async () => {
    const resposta = await request(app)
      .post('/auth/register')
      .send(buildUserPayload())
      .expect(201);

    expect(resposta.body).toMatchObject({
      nome: 'Fulano de Tal',
      email: 'fulano@example.com',
      role: 'user',
    });
     expect(resposta.body).not.toHaveProperty('senhaHash');
  });

  test('POST /auth/register com email duplicado deve retornar 409', async () => {
    await request(app).post('/auth/register').send(buildUserPayload()).expect(201);
    const resposta = await request(app)
      .post('/auth/register')
      .send(buildUserPayload())
      .expect(409);

    expect(resposta.body).toHaveProperty('message', 'Email já cadastrado');
  });

  test('POST /auth/login deve retornar token válido', async () => {
    await request(app).post('/auth/register').send(buildUserPayload()).expect(201);

    const resposta = await request(app)
      .post('/auth/login')
      .send({ email: 'fulano@example.com', senha: 'segredo123' })
      .expect(200);

    expect(resposta.body).toHaveProperty('token');
    expect(resposta.body).toHaveProperty('user.email', 'fulano@example.com');
  });

  test('POST /auth/login com email inexistente deve retornar 404', async () => {
    const resposta = await request(app)
      .post('/auth/login')
      .send({ email: 'naoexiste@example.com', senha: '123456' })
      .expect(404);

    expect(resposta.body).toHaveProperty('message', 'Usuário não encontrado');
  });

  test('POST /auth/login com senha errada deve retornar 401', async () => {
    await request(app).post('/auth/register').send(buildUserPayload()).expect(201);

    const resposta = await request(app)
      .post('/auth/login')
      .send({ email: 'fulano@example.com', senha: 'senha_errada' })
      .expect(401);

    expect(resposta.body).toHaveProperty('message', 'Credenciais inválidas');
  });
});