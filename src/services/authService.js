const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

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

  const senhaHash = await bcrypt.hash(senha, 10);
  const user = await User.create({ nome, email, senhaHash, role });
  return sanitizeUser(user);
}

async function authenticateUser({ email, senha }) {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Usuário não encontrado');
    error.statusCode = 404;
    throw error;
  }

  const senhaValida = await bcrypt.compare(senha, user.senhaHash);
  if (!senhaValida) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 401;
    throw error;
  }

  const payload = {
    id: user.id,
    email: user.email,
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