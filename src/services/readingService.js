const mongoose = require('mongoose');
const Book = require('../models/Book');
const Reading = require('../models/Reading');

const ACTIVE_STATUSES = ['planejando', 'lendo'];
const ALLOWED_STATUSES = ['planejando', 'lendo', 'concluido', 'abandonado'];

function formatBook(book) {
  if (!book) return undefined;
  const { __v, ...data } = book.toObject({ versionKey: false });
  data.id = data._id;
  delete data._id;
  return data;
}

function formatReading(reading) {
  const { __v, ...data } = reading.toObject({ versionKey: false });
  data.id = data._id;
  data.readingId = data._id;
  delete data._id;
  if (data.bookId && typeof data.bookId === 'object') {
    data.book = formatBook(reading.bookId);
    data.bookId = reading.bookId.id || reading.bookId;
  }
  if (data.userId && typeof data.userId === 'object') {
    data.userId = reading.userId.id || reading.userId;
  }
  return data;
}

function ensureNotaPermitted(status, nota) {
  if (nota === undefined || nota === null) {
    return;
  }
  if (status !== 'concluido') {
    const error = new Error('Nota só pode ser informada quando a leitura estiver concluída');
    error.statusCode = 422;
    throw error;
  }
}

function ensureDatesAreValid(status, dataInicio, dataFim) {
  if (status === 'lendo' && !dataInicio) {
    return { dataInicio: new Date() };
  }
  if (status === 'concluido') {
    if (!dataFim) {
      const error = new Error('dataFim é obrigatória para leituras concluídas');
      error.statusCode = 422;
      throw error;
    }
    if (!dataInicio) {
      const error = new Error('dataInicio é obrigatória para leituras concluídas');
      error.statusCode = 422;
      throw error;
    }
    if (new Date(dataFim) < new Date(dataInicio)) {
      const error = new Error('dataFim deve ser maior ou igual a dataInicio');
      error.statusCode = 422;
      throw error;
    }
  }
  return {};
}

async function ensureNoDuplicateActive(userId, bookId, status, readingId) {
  if (!ACTIVE_STATUSES.includes(status)) {
    return;
  }
  const query = {
    userId,
    bookId,
    status: { $in: ACTIVE_STATUSES },
  };
  if (readingId) {
    query._id = { $ne: readingId };
  }
  const existing = await Reading.findOne(query);
  if (existing) {
    const error = new Error('Já existe uma leitura ativa para este livro');
    error.statusCode = 409;
    throw error;
  }
}

function ensurePaginasValidas(book, paginasLidas, status) {
  if (paginasLidas === undefined || paginasLidas === null) {
    return;
  }

  if (book.paginasTotal && paginasLidas > book.paginasTotal) {
    const error = new Error('Páginas lidas não podem exceder o total do livro');
    error.statusCode = 422;
    throw error;
  }

  if (status === 'concluido' && book.paginasTotal) {
    const tolerancia = Math.ceil(book.paginasTotal * 0.1);
    const minimoAceito = book.paginasTotal - tolerancia;
    if (paginasLidas < minimoAceito) {
      const error = new Error('Páginas lidas incompatíveis com uma leitura concluída');
      error.statusCode = 422;
      throw error;
    }
  }
}


async function loadBook(bookId) {
  if (!bookId) {
    const error = new Error('bookId é obrigatório');
    error.statusCode = 422;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    const error = new Error('bookId inválido');
    error.statusCode = 422;
    throw error;
  }

  const book = await Book.findById(bookId);
  if (!book) {
    const error = new Error('Livro informado na leitura não foi encontrado');
    error.statusCode = 422;
    throw error;
  }
  return book;
}

function ensureStatusValido(status) {
  if (!status || typeof status !== 'string' || !ALLOWED_STATUSES.includes(status)) {
    const error = new Error('Status de leitura inválido');
    error.statusCode = 422;
    throw error;
  }
}

async function createReading(userId, payload) {
  const book = await loadBook(payload.bookId);
  const status = payload.status || 'planejando';
  ensureStatusValido(status);

  await ensureNoDuplicateActive(userId, book.id, status);
  ensureNotaPermitted(status, payload.nota);
  ensurePaginasValidas(book, payload.paginasLidas, status);

  const datesAdjust = ensureDatesAreValid(status, payload.dataInicio, payload.dataFim);

  const reading = await Reading.create({
    ...payload,
    ...datesAdjust,
    status,
    userId,
  });

  await reading.populate('bookId');
  return formatReading(reading);
}

async function listReadings(userId, filtros = {}) {
  const query = { userId };
  const hasStatusFilter = filtros.status !== undefined;
  const hasCategoriaFilter = filtros.categoria !== undefined;

  if (hasStatusFilter) {
    ensureStatusValido(filtros.status);
    query.status = filtros.status;
  }
  const readings = await Reading.find(query)
    .populate('bookId')
    .sort({ createdAt: -1 });

  const filtered = filtros.categoria
    ? readings.filter((item) => item.bookId && item.bookId.categoria === filtros.categoria)
    : readings;

  if ((hasStatusFilter || hasCategoriaFilter) && filtered.length === 0) {
    const error = new Error('Nenhuma leitura encontrada para os filtros informados');
    error.statusCode = 404;
    throw error;
  }

  return filtered.map(formatReading);
}

async function getReadingById(userId, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Leitura não encontrada');
    error.statusCode = 404;
    throw error;
  }
  const reading = await Reading.findOne({ _id: id, userId }).populate('bookId');
  if (!reading) {
    const error = new Error('Leitura não encontrada');
    error.statusCode = 404;
    throw error;
  }
  return formatReading(reading);
}

async function updateReading(userId, id, payload) {
  const reading = await Reading.findOne({ _id: id, userId });
  if (!reading) {
    const error = new Error('Leitura não encontrada');
    error.statusCode = 404;
    throw error;
  }

  const allowedFields = ['bookId', 'status', 'dataInicio', 'dataFim', 'nota', 'paginasLidas', 'favorito'];
  const extraFields = Object.keys(payload || {}).filter((field) => !allowedFields.includes(field));

  if (extraFields.length) {
    const error = new Error('Campos não permitidos no corpo da requisição');
    error.statusCode = 422;
    throw error;
  }

  const updateData = {};
  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      updateData[field] = payload[field];
    }
  });

  // 👇 mantém a correção do status vazio
  const status = updateData.status !== undefined ? updateData.status : reading.status;

  ensureStatusValido(status);
  await ensureNoDuplicateActive(
    userId,
    updateData.bookId || reading.bookId,
    status,
    reading.id
  );

  // 🔁 ***MUDANÇA DE ORDEM***: datas antes de páginas
  const dataInicio =
    updateData.dataInicio !== undefined ? updateData.dataInicio : reading.dataInicio;
  const dataFim =
    updateData.dataFim !== undefined ? updateData.dataFim : reading.dataFim;

  const dateAdjust = ensureDatesAreValid(status, dataInicio, dataFim);

  const book = await loadBook(updateData.bookId || reading.bookId);

  ensureNotaPermitted(
    status,
    updateData.nota !== undefined ? updateData.nota : reading.nota
  );

  ensurePaginasValidas(
    book,
    updateData.paginasLidas !== undefined ? updateData.paginasLidas : reading.paginasLidas,
    status
  );

  Object.assign(reading, {
    ...updateData,
    status,
    ...dateAdjust,
  });

  await reading.save();
  await reading.populate('bookId');
  return formatReading(reading);
}

async function deleteReading(userId, id) {
  const reading = await Reading.findOneAndDelete({ _id: id, userId });
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
        _id: '$status',
        total: { $sum: 1 },
        notas: { $push: '$nota' },
      },
    },
  ]);

  let totalLeituras = 0;
  let totalPaginas = 0;
  let concluidos = 0;
  let notas = [];

  stats.forEach((registro) => {
    totalLeituras += registro.total;
    totalPaginas += registro.paginas;
    if (registro._id === 'concluido') {
      concluidos = registro.total;
      notas = registro.notas.filter((nota) => nota !== undefined && nota !== null);
    }
  });

  const mediaNotas = notas.length
    ? notas.reduce((soma, nota) => soma + nota, 0) / notas.length
    : 0;

  return {
    totalLeituras,
    concluidos,
    totalPaginasLidos: totalPaginas,
    mediaNotas: Number(mediaNotas.toFixed(2)),
  };
}

module.exports = {
  createReading,
  listReadings,
  getReadingById,
  updateReading,
  deleteReading,
  getStats,
};
