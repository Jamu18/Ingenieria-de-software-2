const { validationResult } = require('express-validator');
const authService = require('../services/auth.service');
const logger = require('../config/logger');

class AuthController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      logger.error('Error en controlador de registro:', error);
      if (error.message === 'Usuario ya existe') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      logger.error('Error en controlador de login:', error);
      if (error.message === 'Usuario no encontrado' || error.message === 'Contraseña incorrecta') {
        return res.status(401).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

module.exports = new AuthController();