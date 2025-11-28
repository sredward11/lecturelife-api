const request = require('supertest');
const app = require('../app');
const { createAndLoginUser } = require('./helpers');

describe('Books Endpoints', () => {
  let token;

  beforeEach(async () => {
    const auth = await createAndLoginUser();
    token = auth.token;
  });

  it('deve criar um novo livro', async () => {
    const res = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Node.js in Action',
        autor: 'Cantelon',
        anoPublicacao: 2017,
        categoria: 'Tecnologia',
        paginasTotal: 400,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.titulo).toBe('Node.js in Action');
  });

  it('deve listar livros', async () => {
    await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Livro A', autor: 'A', paginasTotal: 100 });

    const res = await request(app)
      .get('/books')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('deve buscar livro por ID', async () => {
    const created = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Busca ID', autor: 'B', paginasTotal: 150 });

    const res = await request(app)
      .get(`/books/${created.body._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toBe(created.body._id);
  });

  it('deve atualizar um livro', async () => {
    const created = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Original', autor: 'C', paginasTotal: 200 });

    const res = await request(app)
      .put(`/books/${created.body._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Atualizado' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.titulo).toBe('Atualizado');
  });

  it('deve remover um livro', async () => {
    const created = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Para Deletar', autor: 'D', paginasTotal: 100 });

    const res = await request(app)
      .delete(`/books/${created.body._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(204);
  });
});