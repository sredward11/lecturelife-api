const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'Título é obrigatório'],
      minlength: [2, 'Título deve ter ao menos 2 caracteres'],
      maxlength: [160, 'Título deve ter no máximo 160 caracteres'],
      trim: true,
    },
    autor: {
      type: String,
      trim: true,
    },
    anoPublicacao: {
      type: Number,
      min: [0, 'Ano de publicação inválido'],
      validate: {
        validator(value) {
          if (value === undefined) return true;
          const anoAtual = new Date().getFullYear();
          return value <= anoAtual;
        },
        message: 'Ano de publicação não pode ser maior que o ano atual',
      },
    },
    categoria: {
      type: String,
      trim: true,
    },
    paginasTotal: {
      type: Number,
      min: [1, 'Número de páginas deve ser positivo'],
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