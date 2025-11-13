const express = require("express");
const { verificarToken, gerarToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", (req, res) => {
  const { usuario, senha } = req.body;
  if (!usuario || !senha) {
    return res.status(400).json({ msg: "usuario/ senha obrigatórios" });
  }

  const payload = { email: usuario };
  try {
    const token = gerarToken(payload);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ msg: "Erro ao gerar token" });
  }
});

router.post("/renovar", verificarToken, (req, res) => {
  try {
    const email = (req.usuario && req.usuario.email) ? req.usuario.email : null;
    const payload = { email };
    const token = gerarToken(payload);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ msg: "Erro ao gerar token" });
  }
});

module.exports = router;