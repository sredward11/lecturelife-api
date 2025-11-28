const express = require('express');
const authRouter = require('./authRouter');
const booksRouter = require('./booksRouter');
const readingsRouter = require('./readingsRouter');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'LectureLife API rodando!' });
});
   
router.use('/auth', authRouter);
router.use('/books', booksRouter);
router.use('/readings', readingsRouter);

module.exports = router;