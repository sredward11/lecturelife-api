const express = require("express");
const app = express();

app.use(express.json());

const usuariosRouter = require("./routes/usuariosRouter");
const produtosRouter = require("./routes/produtosRouter");

app.use("/usuarios", usuariosRouter);
app.use("/", produtosRouter);


module.exports = app;
