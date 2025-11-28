const express = require('express');
const booksController = require('../controllers/booksController');
const { autenticar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(autenticar);

router.get('/', booksController.list);
router.post('/', booksController.create);
router.get('/:id', booksController.show);
router.put('/:id', booksController.update);
router.delete('/:id', booksController.remove);

module.exports = router;