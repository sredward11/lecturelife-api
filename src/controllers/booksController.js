const bookService = require('../services/bookService');

async function create(req, res, next) {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const books = await bookService.listBooks(req.query);
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
}

async function show(req, res, next) {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await bookService.deleteBook(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  list,
  show,
  update,
  remove,
};
