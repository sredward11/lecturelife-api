const readingService = require('../services/readingService');

const list = async (req, res) => {
  const readings = await readingService.listReadings(req.userId);
  return res.json(readings);
};

const create = async (req, res) => {
  try {
    const reading = await readingService.createReading(req.userId, req.body);
    return res.status(201).json(reading);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
};

const update = async (req, res) => {
  const updated = await readingService.updateReading(req.userId, req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ message: 'Leitura não encontrada' });
  }
  return res.json(updated);
};

const remove = async (req, res) => {
  const removed = await readingService.deleteReading(req.userId, req.params.id);
  if (!removed) {
    return res.status(404).json({ message: 'Leitura não encontrada' });
  }
  return res.status(204).send();
};

const stats = async (req, res) => {
  const result = await readingService.readingStats(req.userId);
  return res.json(result);
};

module.exports = {
  list,
  create,
  update,
  remove,
  stats
};
