const express = require('express');
const router = express.Router();

let produtos = [
  { id: 1, nome: 'Caneta', preco: 2.5 },
  { id: 2, nome: 'Caderno', preco: 15.0 }
];
let nextId = 3;

// GET /produtos
router.get('/', (req, res) => {
  res.json(produtos);
});

// POST /produtos
router.post('/', (req, res) => {
  const { nome, preco } = req.body;
  if (!nome || preco === undefined) {
    return res.status(422).json({ message: 'Nome e preço são obrigatórios' });
  }
  const novo = { id: nextId++, nome, preco };
  produtos.push(novo);
  res.status(201).json(novo);
});

// GET /produtos/:produtoId
router.get('/:produtoId', (req, res) => {
  const id = parseInt(req.params.produtoId, 10);
  const p = produtos.find(x => x.id === id);
  if (!p) return res.status(404).json({ message: 'Produto não encontrado' });
  res.json(p);
});

// PUT /produtos/:produtoId
router.put('/:produtoId', (req, res) => {
  const id = parseInt(req.params.produtoId, 10);
  const pIndex = produtos.findIndex(x => x.id === id);
  if (pIndex === -1) return res.status(404).json({ message: 'Produto não encontrado' });

  const { nome, preco } = req.body;
  if (!nome || preco === undefined) return res.status(422).json({ message: 'Nome e preço são obrigatórios' });

  produtos[pIndex] = { id, nome, preco };
  res.json(produtos[pIndex]);
});

// DELETE /produtos/:produtoId
router.delete('/:produtoId', (req, res) => {
  const id = parseInt(req.params.produtoId, 10);
  const pIndex = produtos.findIndex(x => x.id === id);
  if (pIndex === -1) return res.status(404).json({ message: 'Produto não encontrado' });
  produtos.splice(pIndex, 1);
  res.status(204).send();
});

module.exports = router;