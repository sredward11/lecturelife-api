const mongoose = require('mongoose');
const Reading = require('../models/Reading');
const Book = require('../models/Book');

const createReading = async (userId, payload) => {
  const book = await Book.findOne({ _id: payload.book, owner: userId });
  if (!book) {
    const error = new Error('Livro não encontrado para o usuário');
    error.status = 404;
    throw error;
  }

  const reading = new Reading({ ...payload, user: userId });
  return reading.save();
};

const listReadings = (userId) => Reading.find({ user: userId }).populate('book');

const updateReading = async (userId, id, payload) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const updated = await Reading.findOneAndUpdate({ _id: id, user: userId }, payload, { new: true });
  return updated;
};

const deleteReading = async (userId, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const removed = await Reading.findOneAndDelete({ _id: id, user: userId });
  return removed;
};

const readingStats = async (userId) => {
  const total = await Reading.countDocuments({ user: userId });
  const finished = await Reading.countDocuments({ user: userId, status: 'finished' });
  return { total, finished };
};

module.exports = {
  createReading,
  listReadings,
  updateReading,
  deleteReading,
  readingStats
};
