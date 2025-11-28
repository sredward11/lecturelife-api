const mongoose = require('mongoose');

async function connectDatabase(uri) {
  try {
    const dbUri = uri || process.env.MONGO_URI;
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