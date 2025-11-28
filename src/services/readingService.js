const Reading = require('../models/reading');
const mongoose = require('mongoose');

async function createReading(userId, payload) {
  const { bookId, nota, paginasLidas, dataInicio, dataFim } = payload;
  const status = payload.status || 'planejando';

  if (!bookId) {
    const error = new Error('bookId é obrigatório');
    error.statusCode = 422;
    throw error;
  }

  const validStatuses = ['planejando', 'lendo', 'concluido', 'abandonado'];
  if (!validStatuses.includes(status)) {
    const error = new Error('Status de leitura inválido');
    error.statusCode = 422;
    throw error;
  }

  if (['planejando', 'lendo'].includes(status)) {
    const existing = await Reading.findOne({
      userId,
      bookId,
      status: { $in: ['planejando', 'lendo'] },
    });
    if (existing) {
      const error = new Error('Já existe uma leitura ativa para este livro');
      error.statusCode = 409;
      throw error;
    }
  }

  if (nota !== undefined && status !== 'concluido') {
    const error = new Error('Nota só pode ser informada quando a leitura estiver concluída');
    error.statusCode = 422;
    throw error;
  }

  if (status === 'concluido' && !dataInicio) {
    const error = new Error('dataInicio é obrigatória para leituras concluídas');
    error.statusCode = 422;
    throw error;
  }

  const reading = await Reading.create({
    ...payload,
    status,
    userId,
  });

  return reading;
}

async function listReadings(userId, filters = {}) {
  const query = { userId };

  if (filters.status) {
    query.status = filters.status;
  }

  const readings = await Reading.find(query).populate('bookId').sort({ updatedAt: -1 });
  
  if (Object.keys(filters).length > 0 && (!readings || readings.length === 0)) {
      const error = new Error('Nenhuma leitura encontrada para os filtros informados');
      error.statusCode = 404;
      throw error;
  }
  
  return readings;
}

async function getReadingById(userId, readingId) {
  const reading = await Reading.findOne({ _id: readingId, userId }).populate('bookId');
  if (!reading) {
    const error = new Error('Leitura não encontrada');
    error.statusCode = 404;
    throw error;
  }
  return reading;
}

async function updateReading(userId, readingId, payload) {
  const reading = await Reading.findOne({ _id: readingId, userId });
  if (!reading) {
    const error = new Error('Leitura não encontrada');
    error.statusCode = 404;
    throw error;
  }

  if (payload.status && !['planejando', 'lendo', 'concluido', 'abandonado'].includes(payload.status)) {
      const error = new Error('Status de leitura inválido');
      error.statusCode = 422;
      throw error;
  }
  
  const allowed = ['status', 'nota', 'paginasLidas', 'dataInicio', 'dataFim', 'favorito'];
  const keys = Object.keys(payload);
  const invalid = keys.find(k => !allowed.includes(k));
  if (invalid) {
       const error = new Error('Campos não permitidos no corpo da requisição');
       error.statusCode = 422;
       throw error;
  }

  Object.assign(reading, payload);
  await reading.save();
  return reading;
}

async function deleteReading(userId, readingId) {
  const reading = await Reading.findOneAndDelete({ _id: readingId, userId });
  if (!reading) {
    const error = new Error('Leitura não encontrada');
    error.statusCode = 404;
    throw error;
  }
}

async function getStats(userId) {
  const stats = await Reading.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalLeituras: { $sum: 1 },
        concluidos: {
          $sum: { $cond: [{ $eq: ['$status', 'concluido'] }, 1, 0] },
        },
        totalPaginasLidos: { $sum: '$paginasLidas' },
        mediaNotas: { $avg: '$nota' },
      },
    },
  ]);

  return stats[0] || { totalLeituras: 0, concluidos: 0, totalPaginasLidos: 0, mediaNotas: 0 };
}

module.exports = {
  createReading,
  listReadings,
  getReadingById,
  updateReading,
  deleteReading,
  getStats,
};