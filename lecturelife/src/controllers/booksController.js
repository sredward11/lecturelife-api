const bookService = require('../services/bookService');

const list = async (req, res) => {
  const books = await bookService.listBooks(req.userId);
  return res.json(books);
};

const create = async (req, res) => {
  const book = await bookService.createBook(req.userId, req.body);
  return res.status(201).json(book);
};

const update = async (req, res) => {
  const updated = await bookService.updateBook(req.userId, req.params.idOrTitle, req.body);
  if (!updated) {
    return res.status(404).json({ message: 'Livro não encontrado' });
  }
  return res.json(updated);
};

const remove = async (req, res) => {
  const deleted = await bookService.deleteBook(req.userId, req.params.idOrTitle);
  if (!deleted) {
    return res.status(404).json({ message: 'Livro não encontrado' });
  }
  return res.status(204).send();
};

module.exports = {
  list,
  create,
  update,
  remove
};
