const request = require('supertest');
const app = require('../app');
const { createAndLoginUser, createBook } = require('./helpers');

describe('Readings Endpoints', () => {
  let token;
  let book;
  let userId;

  beforeEach(async () => {
    const auth = await createAndLoginUser();
    token = auth.token;
    userId = auth.userId;
    book = await createBook(token);
  });

  it('deve criar uma leitura', async () => {
    const res = await request(app)
      .post('/readings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        bookId: book._id,
        status: 'planejando',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.bookId).toBe(book._id);
    expect(res.body.userId).toBe(userId);
  });

  it('não deve permitir leitura duplicada ativa', async () => {
    await request(app)
      .post('/readings')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book._id, status: 'lendo' });

    const res = await request(app)
      .post('/readings')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book._id, status: 'lendo' });

    expect(res.statusCode).toEqual(409);
  });

  it('deve listar leituras do usuário', async () => {
    await request(app)
      .post('/readings')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book._id, status: 'planejando' });

    const res = await request(app)
      .get('/readings')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
  });

  it('deve atualizar leitura (concluir e dar nota)', async () => {
    const reading = await request(app)
      .post('/readings')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book._id, status: 'lendo' });

    const res = await request(app)
      .put(`/readings/${reading.body._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'concluido',
        nota: 9,
        dataInicio: new Date(),
        dataFim: new Date(),
        paginasLidas: 200,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('concluido');
    expect(res.body.nota).toBe(9);
  });
});