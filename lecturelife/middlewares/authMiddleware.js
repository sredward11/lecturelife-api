const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function autenticar(req, res, next) {
  const autorizacao = req.headers.authorization;

  if (!autorizacao || !autorizacao.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = autorizacao.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findById(payload.sub);
    if (!usuario) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }
    req.user = {
      id: usuario.id,
      role: usuario.role,
      nome: usuario.nome,
      email: usuario.email,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

module.exports = {
  autenticar,
};