const mongoose = require('mongoose');
const Book = require('../models/Book');

const resolveBookQuery = (idOrTitle, owner) => {
  if (mongoose.Types.ObjectId.isValid(idOrTitle)) {
    return { _id: idOrTitle, owner };
  }
  return { title: idOrTitle, owner };
};

const listBooks = (owner) => Book.find({ owner });

const createBook = (owner, payload) => {
  const book = new Book({ ...payload, owner });
  return book.save();
};

const updateBook = async (owner, idOrTitle, payload) => {
  const filter = resolveBookQuery(idOrTitle, owner);
  const updated = await Book.findOneAndUpdate(filter, payload, { new: true });
  return updated;
};

const deleteBook = async (owner, idOrTitle) => {
  const filter = resolveBookQuery(idOrTitle, owner);
  const deleted = await Book.findOneAndDelete(filter);
  return deleted;
};

module.exports = {
  listBooks,
  createBook,
  updateBook,
  deleteBook
};
