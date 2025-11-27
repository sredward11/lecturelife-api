const request = require('supertest');
const { app, createAndLoginUser, createBook } = require('./helpers');

async function authHeader() {
  const { token } = await createAndLoginUser();
  return { Authorization: `Bearer ${token}`, token };
}

describe('Books - LectureLife', () => {
  test('POST /books deve criar livro quando autenticado', async () => {
    const { Authorization } = await authHeader();
    const resposta = await request(app)
      .post('/books')
       .set('Authorization', Authorization)
      .send({ titulo: 'Clean Code', anoPublicacao: 2008 })
      .expect(201);

    expect(resposta.body).toHaveProperty('id');
    expect(resposta.body).toHaveProperty('titulo', 'Clean Code');
  });

  test('POST /books sem token deve retornar 401', async () => {
    const resposta = await request(app)
      .post('/books')
      .send({ titulo: 'Livro sem token' })
      .expect(401);

    expect(resposta.body).toHaveProperty('message', 'Token não fornecido');
  });

  test('GET /books deve listar livros cadastrados', async () => {
    const { Authorization } = await authHeader();
    await request(app)
      .post('/books')
      .set('Authorization', Authorization)
      .send({ titulo: 'Livro 1', anoPublicacao: 2010 })
      .expect(201);

    const resposta = await request(app)
      .get('/books')
      .set('Authorization', Authorization)
      .expect(200);
    expect(Array.isArray(resposta.body)).toBe(true);
    expect(resposta.body[0]).toHaveProperty('titulo');
  });

  test('GET /books deve retornar 404 quando filtros não encontrarem registros', async () => {
    const { Authorization } = await authHeader();
    await request(app)
      .post('/books')
      .set('Authorization', Authorization)
      .send({ titulo: 'Livro X', categoria: 'ficcao', anoPublicacao: 2018 })
      .expect(201);

    const resposta = await request(app)
      .get('/books')
      .set('Authorization', Authorization)
      .query({ categoria: 'historia' })
      .expect(404);

    expect(resposta.body).toHaveProperty('message', 'Nenhum livro encontrado para os filtros informados');
  });

  test('GET /books/:id deve retornar livro específico', async () => {
    const { Authorization } = await authHeader();
    const created = await request(app)
      .post('/books')
      .set('Authorization', Authorization)
      .send({ titulo: 'Livro Detalhe', anoPublicacao: 2012 })
      .expect(201);

    const resposta = await request(app)
      .get(`/books/${created.body.id}`)
      .set('Authorization', Authorization)
      .expect(200);
    expect(resposta.body).toHaveProperty('id', created.body.id);
  });

  test('PUT /books/:id deve atualizar livro', async () => {
    const { Authorization } = await authHeader();
    const created = await request(app)
      .post('/books')
      .set('Authorization', Authorization)
      .send({ titulo: 'Livro Atualizar', anoPublicacao: 2015 })
      .expect(201);

    const resposta = await request(app)
      .put(`/books/${created.body.id}`)
      .set('Authorization', Authorization)
      .send({ titulo: 'Livro Atualizado', anoPublicacao: 2016 })
      .expect(200);

    expect(resposta.body).toHaveProperty('titulo', 'Livro Atualizado');
  });

  test('DELETE /books/:id deve remover livro', async () => {
    const { Authorization } = await authHeader();
    const created = await request(app)
      .post('/books')
      .set('Authorization', Authorization)
      .send({ titulo: 'Livro Remover', anoPublicacao: 2011 })
      .expect(201);

    await request(app)
      .delete(`/books/${created.body.id}`)
      .set('Authorization', Authorization)
      .expect(204);

    await request(app)
      .get(`/books/${created.body.id}`)
      .set('Authorization', Authorization)
      .expect(404);
  });

  test('Não deve permitir anoPublicacao no futuro', async () => {
    const { Authorization } = await authHeader();
    const nextYear = new Date().getFullYear() + 1;
    const resposta = await request(app)
      .post('/books')
      .set('Authorization', Authorization)
      .send({ titulo: 'Livro Futuro', anoPublicacao: nextYear })
      .expect(422);

    expect(resposta.body).toHaveProperty('message');
  });

  test('GET /books sem token deve retornar 401', async () => {
    await request(app)
      .post('/books')
      .set('Authorization', (await authHeader()).Authorization)
      .send({ titulo: 'Livro Público', anoPublicacao: 2010 })
      .expect(201);

    const resposta = await request(app).get('/books').expect(401);
    expect(resposta.body).toHaveProperty('message', 'Token não fornecido');
  });
});