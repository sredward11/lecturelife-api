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

function resolveBookQuery(idOrTitle) {
  if (mongoose.Types.ObjectId.isValid(idOrTitle)) {
    return { _id: idOrTitle };
  }
  return { titulo: idOrTitle };
}

async function getBookByIdOrTitle(idOrTitle) {
  const book = await Book.findOne(resolveBookQuery(idOrTitle));
  if (!book) {
    const error = new Error('Livro não encontrado');
    error.statusCode = 404;
    throw error;
  }
  return formatBook(book);
}

async function updateBook(idOrTitle, data) {
  try {
    const query = resolveBookQuery(idOrTitle);
    const book = await Book.findOneAndUpdate(query, data, {
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

async function deleteBook(idOrTitle) {
  const book = await Book.findOneAndDelete(resolveBookQuery(idOrTitle));
  if (!book) {
    const error = new Error('Livro não encontrado');
    error.statusCode = 404;
    throw error;
  }
}

module.exports = {
  createBook,
  listBooks,
  getBookByIdOrTitle,
  updateBook,
  deleteBook,
};
