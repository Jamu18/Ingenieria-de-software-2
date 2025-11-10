const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const logger = require('../config/logger');

class AuthService {
  async register(userData) {
    try {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (existingUser) {
        throw new Error('Usuario ya existe');
      }

      const user = await User.create(userData);
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        currency: user.currency
      };
    } catch (error) {
      logger.error('Error en registro:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const validPassword = await user.validatePassword(password);
      if (!validPassword) {
        throw new Error('Contraseña incorrecta');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          currency: user.currency
        }
      };
    } catch (error) {
      logger.error('Error en login:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();