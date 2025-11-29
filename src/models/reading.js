const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    status: {
      type: String,
      enum: ['planejando', 'lendo', 'concluido', 'abandonado'],
      default: 'planejando',
      required: true,
    },
    dataInicio: {
      type: Date,
    },
    dataFim: {
      type: Date,
    },
    nota: {
      type: Number,
      min: [0, 'Nota mínima é 0'],
      max: [10, 'Nota máxima é 10'],
    },
    paginasLidas: {
      type: Number,
      min: [0, 'Páginas lidas deve ser maior ou igual a zero'],
      default: 0,
    },
    favorito: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('reading', readingSchema);