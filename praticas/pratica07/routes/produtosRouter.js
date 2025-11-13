const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtosController');

router.post('/', controller.criar);

router.get('/', controller.listar);

router.get('/:id', controller.buscar, controller.exibir);

router.put('/:id', controller.buscar, controller.atualizar);

router.delete('/:id', controller.buscar, controller.remover);


module.exports = router;