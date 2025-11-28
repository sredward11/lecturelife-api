const request = require('supertest');
const app = require('../app');
const Book = require('../models/Book');

async function createAndLoginUser(email = 'teste@example.com', role = 'user') {
  const userData = {
    nome: 'Usuário Teste',
    email,
    senha: 'password123',
    role,
  };

  await request(app).post('/auth/register').send(userData);
  
  const res = await request(app).post('/auth/login').send({
    email: userData.email,
    senha: userData.senha,
  });

  return {
    token: res.body.token,
    userId: res.body.user.id,
    userData,
  };
}

async function createBook(token) {
  const bookData = {
    titulo: 'Livro de Teste',
    autor: 'Autor Teste',
    anoPublicacao: 2023,
    categoria: 'Ficção',
    paginasTotal: 200,
    sinopse: 'Sinopse teste',
  };

  const res = await request(app)
    .post('/books')
    .set('Authorization', `Bearer ${token}`)
    .send(bookData);

  return res.body;
}

module.exports = {
  createAndLoginUser,
  createBook,
};