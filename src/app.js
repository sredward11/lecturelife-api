require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { connectDatabase } = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const routes = require('./routes');

const app = express();

// Conexão com banco (exceto em testes)
if (process.env.NODE_ENV !== 'test') {
  connectDatabase();
}

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', routes);

// Handler de 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Handler de Erro Global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ message: err.message || 'Erro interno' });
});

module.exports = app;