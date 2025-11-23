const express = require('express');
const booksController = require('../controllers/booksController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', booksController.list);
router.post('/', booksController.create);
router.put('/:idOrTitle', booksController.update);
router.delete('/:idOrTitle', booksController.remove);

module.exports = router;
