require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerDocs = require('./docs/swagger');
const authRouter = require('./routes/authRouter');
const booksRouter = require('./routes/booksRouter');
const readingsRouter = require('./routes/readingsRouter');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api-docs', swaggerDocs);
app.use('/auth', authRouter);
app.use('/books', booksRouter);
app.use('/readings', readingsRouter);

app.use((req, res) => res.status(404).json({ message: 'Rota não encontrada' }));

module.exports = app;
