const mongoose = require('mongoose');

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI não configurada');
  }

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  return mongoose.connection;
};

module.exports = { connectDatabase };
