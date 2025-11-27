const request = require('supertest');
const { app, createAndLoginUser, createBook } = require('./helpers');

describe('Readings - LectureLife', () => {
  async function setupUserAndBook(overrides = {}) {
    const { token, user } = await createAndLoginUser();
    const book = await createBook(token, overrides.book || {});
    return { token, user, book };
  }

  test('POST /readings deve criar leitura para usuário autenticado', async () => {
    const { token, book } = await setupUserAndBook();
    const resposta = await request(app)
      .post('/readings')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book.id, status: 'lendo' })
      .expect(201);

    expect(resposta.body).toHaveProperty('status', 'lendo');
    expect(resposta.body).toHaveProperty('dataInicio');
  });

  test('POST /readings deve impedir duplicidade ativa', async () => {
    const { token, book } = await setupUserAndBook();

    await request(app)
      .post('/readings')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book.id, status: 'lendo' })
      .expect(201);

    const resposta = await request(app)
      .post('/readings')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book.id, status: 'planejando' })
      .expect(409);

    expect(resposta.body).toHaveProperty('message', 'Já existe uma leitura ativa para este livro');
  });

  test('POST /readings deve validar páginas lidas', async () => {
    const { token, book } = await setupUserAndBook({ book: { paginasTotal: 100 } });

    const resposta = await request(app)
      .post('/readings')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book.id, status: 'lendo', paginasLidas: 150 })
      .expect(422);

    expect(resposta.body).toHaveProperty('message');
  });

  test('POST /readings não deve aceitar nota quando status diferente de concluido', async () => {
    const { token, book } = await setupUserAndBook();

    const resposta = await request(app)
      .post('/readings')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book.id, status: 'lendo', nota: 8 })
      .expect(422);

    expect(resposta.body).toHaveProperty(
      'message',
      'Nota só pode ser informada quando a leitura estiver concluída'
    );
  });

  test('PUT /readings/:id deve concluir leitura com nota válida', async () => {
    const { token, book } = await setupUserAndBook({ book: { paginasTotal: 200 } });

    const created = await request(app)
      .post('/readings')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book.id, status: 'lendo', paginasLidas: 50 })
      .expect(201);

    const hoje = new Date().toISOString();
    const resposta = await request(app)
      .put(`/readings/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'concluido',
        dataInicio: created.body.dataInicio,
        dataFim: hoje,
        paginasLidas: 200,
        nota: 9,
      })
      .expect(200);

    expect(resposta.body).toHaveProperty('status', 'concluido');
    expect(resposta.body).toHaveProperty('nota', 9);
  });

  test('PUT /readings/:id deve respeitar regras de datas', async () => {
    const { token, book } = await setupUserAndBook();

    const created = await request(app)
      .post('/readings')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book.id, status: 'planejando' })
      .expect(201);

    const resposta = await request(app)
      .put(`/readings/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'concluido', dataFim: '2024-01-01' })
      .expect(422);

    expect(resposta.body).toHaveProperty('message', 'dataInicio é obrigatória para leituras concluídas');
  });

  test('GET /readings deve filtrar por status e categoria', async () => {
    const { token, book } = await setupUserAndBook({ book: { categoria: 'fantasia' } });
    await request(app)
      .post('/readings')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book.id, status: 'planejando' })
      .expect(201);

    const resposta = await request(app)
      .get('/readings')
      .set('Authorization', `Bearer ${token}`)
      .query({ status: 'planejando', categoria: 'fantasia' })
      .expect(200);

    expect(resposta.body).toHaveLength(1);
  });

  test('GET /readings/stats deve retornar resumo do usuário', async () => {
    const { token, book } = await setupUserAndBook({ book: { paginasTotal: 120 } });

    const created = await request(app)
      .post('/readings')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book.id, status: 'lendo', paginasLidas: 100 })
      .expect(201);

    await request(app)
      .put(`/readings/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'concluido',
        dataInicio: created.body.dataInicio,
        dataFim: new Date().toISOString(),
        paginasLidas: 120,
        nota: 8,
      })
      .expect(200);

    const resposta = await request(app)
      .get('/readings/stats')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(resposta.body).toMatchObject({ concluidos: 1, totalLeituras: 1 });
    expect(resposta.body.mediaNotas).toBeGreaterThan(0);
  });
});