const readingService = require('../services/readingService');

async function create(req, res, next) {
  try {
    const reading = await readingService.createReading(req.user.id, req.body);
    res.status(201).json(reading);
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const readings = await readingService.listReadings(req.user.id, req.query);
    res.status(200).json(readings);
  } catch (error) {
    next(error);
  }
}

async function show(req, res, next) {
  try {
    const reading = await readingService.getReadingById(req.user.id, req.params.id);
    res.status(200).json(reading);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const reading = await readingService.updateReading(req.user.id, req.params.id, req.body);
    res.status(200).json(reading);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await readingService.deleteReading(req.user.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function stats(req, res, next) {
  try {
    const resumo = await readingService.getStats(req.user.id);
    res.status(200).json(resumo);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  list,
  show,
  update,
  remove,
  stats,
};