const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['not_started', 'reading', 'finished'], default: 'not_started' },
    currentPage: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reading', ReadingSchema);
