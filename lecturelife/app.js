require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const { connectDatabase } = require('./config/database');
const router = require('./routes');
const swaggerDocs = require('./docs/swagger');
const corsMiddleware = require('./middlewares/corsMiddleware');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  connectDatabase().catch((error) => {
    console.error('Erro ao conectar no MongoDB:', error.message);
  });
}

app.use(corsMiddleware);
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api-docs', swaggerDocs);
app.use(router);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  res.status(status).json({ message });
});

module.exports = app;