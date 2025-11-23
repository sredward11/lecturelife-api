const request = require('supertest');
const app = require('../app');

const userPayload = {
  name: 'Reading User',
  email: 'reading@example.com',
  password: 'Secret123'
};

const authHeaders = async () => {
  await request(app).post('/auth/register').send(userPayload);
  const login = await request(app).post('/auth/login').send({
    email: userPayload.email,
    password: userPayload.password
  });
  return { Authorization: `Bearer ${login.body.token}` };
};

describe('Readings routes protection', () => {
  it('blocks access without token', async () => {
    const response = await request(app).get('/readings');
    expect(response.status).toBe(401);
  });

  it('blocks access with invalid token', async () => {
    const response = await request(app).get('/readings').set('Authorization', 'Bearer bad');
    expect(response.status).toBe(401);
  });

  it('allows managing readings with valid token', async () => {
    const headers = await authHeaders();

    const bookRes = await request(app).post('/books').set(headers).send({
      title: 'Reading Book',
      author: 'Reader',
      pages: 50
    });

    const bookId = bookRes.body._id;

    const createRes = await request(app).post('/readings').set(headers).send({
      book: bookId,
      status: 'reading',
      currentPage: 10
    });

    expect(createRes.status).toBe(201);

    const listRes = await request(app).get('/readings').set(headers);
    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);

    const readingId = listRes.body[0]._id;
    const updateRes = await request(app)
      .put(`/readings/${readingId}`)
      .set(headers)
      .send({ status: 'finished', currentPage: 50 });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe('finished');

    const statsRes = await request(app).get('/readings/stats/summary').set(headers);
    expect(statsRes.status).toBe(200);
    expect(statsRes.body.finished).toBe(1);

    const deleteRes = await request(app).delete(`/readings/${readingId}`).set(headers);
    expect(deleteRes.status).toBe(204);
  });
});
