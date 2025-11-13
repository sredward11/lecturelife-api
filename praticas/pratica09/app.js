const express = require('express');
const apidocsRouter = require('./routes/apidocsRouter');
const produtosRouter = require('./routes/produtos');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api-docs', apidocsRouter);
app.use('/produtos', produtosRouter);
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;