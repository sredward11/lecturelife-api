const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título é obrigatório'],
      trim: true,
    },
    autor: {
      type: String,
      required: [true, 'O autor é obrigatório'],
      trim: true,
    },
    anoPublicacao: {
      type: Number,
      validate: {
        validator: function (v) {
          return v <= new Date().getFullYear();
        },
        message: 'O ano de publicação não pode ser futuro',
      },
    },
    categoria: {
      type: String,
      trim: true,
    },
    paginasTotal: {
      type: Number,
      required: true,
      min: 1,
    },
    sinopse: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', bookSchema);