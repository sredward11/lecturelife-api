// 1. importar o framework
const express = require("express");

// Criando um array em memoria
const tarefas = [
  { id: 1, nome: "Estudar middleware", concluida: false },
  { id: 2, nome: "Praticar Express", concluida: true },
];

// 2. Criando uma instancia
const app = express();

// midlleware integrado
app.use(express.json());

// midlleware de aplicaçao
app.use((req, res, next) => {
  console.log("Time:", Date.now()), next();
});

// 3. midlleware de roteamento
const router = express.Router();

router.get("/", (req, res) => {
  res.send(tarefas);
});

router.post("/", (req, res) => {
  const novaTarefa = { id: tarefas.length + 1, ...req.body };
  tarefas.push(novaTarefa);
  res.status(201).send(novaTarefa);
});

router.get("/:tarefaId", (req, res) => {
  const tarefaEncontrada = tarefas.find(
    (item) => item.id == req.params.tarefaId
  );
  if (tarefaEncontrada) return res.send(tarefaEncontrada);
  throw Error("Tarefa nao localizada");
});

router.put("/:tarefaId", (req, res) => {
  const tarefaEncontrada = tarefas.find(
    (item) => item.id == req.params.tarefaId
  );
  if (tarefaEncontrada) {
    tarefaEncontrada.nome = req.body.nome;
    tarefaEncontrada.concluida = req.body.concluida;
    return res.send(tarefaEncontrada);
  }
  throw Error("Tarefa nao localizada");
});

router.delete("/:tarefaId", (req, res) => {
  const posicao = tarefas.findIndex((item) => item.id == req.params.tarefaId);
  if (posicao >= 0) {
    tarefas.splice(posicao, 1);
    res.status(204).end();
  }
  throw Error("Tarefa nao localizada");
});

app.use("/tarefas", router);

// 4. midlleware de erro
app.use((err, req, res, next) => {
  res.status(400).send(err.message);
});

// Iniciar a aplicação em uma porta
app.listen(3000, () => {
  console.log("App está On!");
});

module.exports = app;
