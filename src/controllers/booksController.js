const bookService = require('../services/bookService');

async function create(req, res) {
  const book = await bookService.createBook(req.body);
  res.status(201).json(book);
}

async function list(req, res) {
  const books = await bookService.listBooks(req.query);
  res.status(200).json(books);
}

async function show(req, res) {
  const book = await bookService.getBookByIdOrTitle(req.params.idOrTitle);
  res.status(200).json(book);
}

async function update(req, res) {
  const book = await bookService.updateBook(req.params.idOrTitle, req.body);
  res.status(200).json(book);
}

async function remove(req, res) {
  await bookService.deleteBook(req.params.idOrTitle);
  res.status(204).send();
}

module.exports = {
  create,
  list,
  show,
  update,
  remove,
};
