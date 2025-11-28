const mongoose = require('mongoose');
const Book = require('../models/Book');

function formatBook(book) {
  const { __v, ...data } = book.toObject({ versionKey: false });
  data.id = data._id;
  delete data._id;
  return data;
}

async function createBook(payload) {
  try {
    const book = await Book.create(payload);
    return formatBook(book);
  } catch (error) {
    error.statusCode = 422;
    throw error;
  }
}

function buildFilter(filtros = {}) {
  const filter = {};
  let hasFilters = false;

  if (filtros.titulo || filtros.title) {
    filter.titulo = filtros.titulo || filtros.title;
    hasFilters = true;
  }
  if (filtros.categoria) {
    filter.categoria = filtros.categoria;
    hasFilters = true;
  }

  return { filter, hasFilters };
}

async function listBooks(filtros = {}) {
  const { filter, hasFilters } = buildFilter(filtros);
  const books = await Book.find(filter).sort({ createdAt: -1 });

  if (hasFilters && books.length === 0) {
    const error = new Error('Nenhum livro encontrado para os filtros informados');
    error.statusCode = 404;
    throw error;
  }

  return books.map(formatBook);
}

async function getBookById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Livro não encontrado');
    error.statusCode = 404;
    throw error;
  }

  const book = await Book.findById(id);
  if (!book) {
    const error = new Error('Livro não encontrado');
    error.statusCode = 404;
    throw error;
  }
  return formatBook(book);
}

async function updateBook(id, data) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Livro não encontrado');
    error.statusCode = 404;
    throw error;
  }

  try {
    const book = await Book.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      const error = new Error('Livro não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return formatBook(book);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 422;
    }
    throw error;
  }
}

async function deleteBook(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Livro não encontrado');
    error.statusCode = 404;
    throw error;
  }

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
