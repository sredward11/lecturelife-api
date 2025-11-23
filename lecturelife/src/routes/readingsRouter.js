const express = require('express');
const readingsController = require('../controllers/readingsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', readingsController.list);
router.post('/', readingsController.create);
router.get('/stats/summary', readingsController.stats);
router.put('/:id', readingsController.update);
router.delete('/:id', readingsController.remove);

module.exports = router;
