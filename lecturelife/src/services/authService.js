const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error('Usuário já existe');
    error.status = 400;
    throw error;
  }

  const user = new User({ name, email, password });
  await user.save();
  return user;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Usuário não encontrado');
    error.status = 404;
    throw error;
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    const error = new Error('Credenciais inválidas');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  return { user, token };
};

module.exports = {
  register,
  login
};
