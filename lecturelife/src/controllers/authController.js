const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Erro ao registrar usuário' });
  }
};

const login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    return res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Erro ao autenticar usuário' });
  }
};

module.exports = {
  register,
  login
};
