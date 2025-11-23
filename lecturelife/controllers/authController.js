const authService = require('../services/authService');

async function register(req, res) {
  const user = await authService.registerUser(req.body);
  res.status(201).json(user);
}

async function login(req, res) {
  const result = await authService.authenticateUser(req.body);
  res.status(200).json(result);
}

module.exports = {
  register,
  login,
};
