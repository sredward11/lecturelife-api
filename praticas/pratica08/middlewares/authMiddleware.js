const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const token = req.headers.authorization;

  if (token == undefined) {
    return res.status(401).json({ msg: "Não autorizado" });
  }

  try {
    jwt.verify(token, "segredo");
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token inválido" });
  }
}

function gerarToken(payload) {
  const token = jwt.sign(payload, "segredo", { expiresIn: 120 });
  return token;
}

module.exports = {
  verificarToken,
  gerarToken,
};
