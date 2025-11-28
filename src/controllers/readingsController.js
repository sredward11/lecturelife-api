const readingService = require('../services/readingService');

async function create(req, res) {
  const reading = await readingService.createReading(req.user.id, req.body);
  res.status(201).json(reading);
}

async function list(req, res) {
  const readings = await readingService.listReadings(req.user.id, req.query);
  res.status(200).json(readings);
}

async function show(req, res) {
  const reading = await readingService.getReadingById(req.user.id, req.params.id);
  res.status(200).json(reading);
}

async function update(req, res) {
  const reading = await readingService.updateReading(req.user.id, req.params.id, req.body);
  res.status(200).json(reading);
}

async function remove(req, res) {
  await readingService.deleteReading(req.user.id, req.params.id);
  res.status(204).send();
}

async function stats(req, res) {
  const resumo = await readingService.getStats(req.user.id);
  res.status(200).json(resumo);
}

module.exports = {
  create,
  list,
  show,
  update,
  remove,
  stats,
};