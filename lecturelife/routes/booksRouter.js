const express = require('express');
const booksController = require('../controllers/booksController');
const { autenticar } = require('../middlewares/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(booksController.list));
router.get('/:idOrTitle', asyncHandler(booksController.show));
router.post('/', autenticar, asyncHandler(booksController.create));
router.put('/:idOrTitle', autenticar, asyncHandler(booksController.update));
router.delete('/:idOrTitle', autenticar, asyncHandler(booksController.remove));

module.exports = router;
