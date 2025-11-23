const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const PBKDF2_ITERATIONS = 10000;
const PBKDF2_KEYLEN = 64;
const PBKDF2_DIGEST = 'sha512';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString('hex');
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const derivedKey = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derivedKey, 'hex'));
}

function sanitizeUser(user) {
  const { senhaHash, __v, ...rest } = user.toObject({ versionKey: false });
  rest.id = rest._id;
  delete rest._id;
  return rest;
}

async function registerUser({ nome, email, senha, role }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error('Email já cadastrado');
    error.statusCode = 409;
    throw error;
  }

  if (!senha || senha.length < 6) {
    const error = new Error('Senha deve possuir pelo menos 6 caracteres');
    error.statusCode = 422;
    throw error;
  }

  const senhaHash = hashPassword(senha);
  const user = await User.create({ nome, email, senhaHash, role });
  return sanitizeUser(user);
}

async function authenticateUser({ email, senha }) {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 401;
    throw error;
  }

  const senhaValida = verifyPassword(senha, user.senhaHash);
  if (!senhaValida) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 401;
    throw error;
  }

  const payload = {
    sub: user.id,
    role: user.role,
    nome: user.nome,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

  return {
    token,
    user: sanitizeUser(user),
  };
}

module.exports = {
  registerUser,
  authenticateUser,
  sanitizeUser,
};