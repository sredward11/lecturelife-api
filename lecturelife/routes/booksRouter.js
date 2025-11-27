const express = require('express');
const booksController = require('../controllers/booksController');
const { autenticar } = require('../middlewares/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(autenticar);

router.get('/', asyncHandler(booksController.list));
router.get('/:idOrTitle', asyncHandler(booksController.show));
router.post('/', asyncHandler(booksController.create));
router.put('/:idOrTitle', asyncHandler(booksController.update));
router.delete('/:idOrTitle', asyncHandler(booksController.remove));

module.exports = router;