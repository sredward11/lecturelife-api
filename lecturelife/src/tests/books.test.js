const request = require('supertest');
const app = require('../app');

const userPayload = {
  name: 'Book User',
  email: 'book@example.com',
  password: 'Secret123'
};

const getToken = async () => {
  await request(app).post('/auth/register').send(userPayload);
  const login = await request(app).post('/auth/login').send({
    email: userPayload.email,
    password: userPayload.password
  });
  return login.body.token;
};

describe('Books routes protection', () => {
  it('rejects access without token', async () => {
    const response = await request(app).get('/books');
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/Token/);
  });

  it('rejects access with invalid token', async () => {
    const response = await request(app).get('/books').set('Authorization', 'Bearer invalid');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token inválido');
  });

  it('allows CRUD with valid token', async () => {
    const token = await getToken();
    const headers = { Authorization: `Bearer ${token}` };

    const createRes = await request(app).post('/books').set(headers).send({
      title: 'Book A',
      author: 'Author A',
      pages: 100
    });
    expect(createRes.status).toBe(201);

    const listRes = await request(app).get('/books').set(headers);
    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);

    const bookId = listRes.body[0]._id;
    const updateRes = await request(app).put(`/books/${bookId}`).set(headers).send({ pages: 120 });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.pages).toBe(120);

    const deleteRes = await request(app).delete(`/books/${bookId}`).set(headers);
    expect(deleteRes.status).toBe(204);
  });
});
