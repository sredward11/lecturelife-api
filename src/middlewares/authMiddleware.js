const jwt = require('jsonwebtoken');

async function autenticar(req, res, next) {
  const autorizacao = req.headers['authorization'] || req.headers.authorization;

  if (!autorizacao) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const [scheme, token] = autorizacao.split(' ');

  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.userId = decoded.id || decoded.userId || decoded.sub;
    req.user = {
      id: decoded.id || decoded.userId || decoded.sub,
      role: decoded.role,
      nome: decoded.nome,
      email: decoded.email,
    };

    return next();
  });
}

module.exports = {
  autenticar,
};
