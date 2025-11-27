const express = require('express');
const readingsController = require('../controllers/readingsController');
const { autenticar } = require('../middlewares/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(autenticar);

router.get('/', asyncHandler(readingsController.list));
router.post('/', asyncHandler(readingsController.create));
router.get('/stats', asyncHandler(readingsController.stats));
router.get('/:id', asyncHandler(readingsController.show));
router.put('/:id', asyncHandler(readingsController.update));
router.delete('/:id', asyncHandler(readingsController.remove));

module.exports = router;