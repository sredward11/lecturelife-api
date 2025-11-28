const Book = require('../models/Book');

async function createBook(payload) {
  const book = await Book.create(payload);
  return book;
}

async function listBooks(filters = {}) {
  const query = {};

  if (filters.titulo) {
    query.titulo = { $regex: filters.titulo, $options: 'i' };
  }

  if (filters.categoria) {
    query.categoria = { $regex: filters.categoria, $options: 'i' };
  }

  const books = await Book.find(query).sort({ createdAt: -1 });
  return books;
}

async function getBookById(id) {
  const book = await Book.findById(id);
  if (!book) {
    const error = new Error('Livro não encontrado');
    error.statusCode = 404;
    throw error;
  }
  return book;
}

async function updateBook(id, payload) {
  const book = await Book.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!book) {
    const error = new Error('Livro não encontrado');
    error.statusCode = 404;
    throw error;
  }
  return book;
}

async function deleteBook(id) {
  const book = await Book.findByIdAndDelete(id);
  if (!book) {
    const error = new Error('Livro não encontrado');
    error.statusCode = 404;
    throw error;
  }
}

module.exports = {
  createBook,
  listBooks,
  getBookById,
  updateBook,
  deleteBook,
};
