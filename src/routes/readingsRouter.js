const express = require('express');
const readingsController = require('../controllers/readingsController');
const { autenticar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(autenticar);

router.get('/', readingsController.list);
router.post('/', readingsController.create);
router.get('/stats', readingsController.stats);
router.get('/:id', readingsController.show);
router.put('/:id', readingsController.update);
router.delete('/:id', readingsController.remove);

module.exports = router;