const path = require('path');

const dotenvResult = require('dotenv').config({
  path: path.resolve(process.cwd(), '.env'),
});

console.log('dotenv carregado no database.js?', !dotenvResult.error);
console.log('MONGODB_URI no database.js?', !!process.env.MONGODB_URI);

const mongoose = require('mongoose');

async function connectDatabase() {
  try {
    const dbUri = process.env.MONGODB_URI;

    if (!dbUri) {
      throw new Error('Variável MONGODB_URI não encontrada no .env');
    }

    await mongoose.connect(dbUri);
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

module.exports = { connectDatabase, disconnectDatabase };