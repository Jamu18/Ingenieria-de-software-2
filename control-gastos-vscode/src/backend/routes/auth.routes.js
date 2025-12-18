
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const dotenv = require('dotenv');
const auth = require('../middleware/auth.middleware');
dotenv.config();

// Register
router.post('/register', async (req, res) => {
  try{
    const { email, password, name, currency } = req.body;
    if(!email || !password) return res.status(400).json({ message: 'Email y password requeridos' });
    const existing = await User.findOne({ where: { email } });
    if(existing) return res.status(400).json({ message: 'Usuario ya existe' });
    const user = await User.create({ email, password, name, currency });
    return res.json({ id: user.id, email: user.email, name: user.name, currency: user.currency });
  }catch(err){ console.error(err); res.status(500).json({ message: 'error' }); }
});

// Login
router.post('/login', async (req, res) => {
  try{
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: 'Email y password requeridos' });
    const user = await User.findOne({ where: { email } });
    if(!user) return res.status(400).json({ message: 'Usuario no encontrado' });
    const ok = await user.validatePassword(password);
    if(!ok) return res.status(400).json({ message: 'Credenciales inválidas' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'changeme', { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, currency: user.currency, monthly_salary: user.monthly_salary } });
  }catch(err){ console.error(err); res.status(500).json({ message: 'error' }); }
});

  // Get current user
  router.get('/me', auth, async (req, res) => {
    try {
      const user = await User.findByPk(req.userId);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          currency: user.currency, 
          monthly_salary: user.monthly_salary 
        } 
      });
    } catch (err) { 
      console.error(err); 
      res.status(500).json({ message: 'error' }); 
    }
  });

  // Update user settings
  router.put('/settings', auth, async (req, res) => {
    try {
      const { monthly_salary, currency } = req.body;
      const user = await User.findByPk(req.userId);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      if (monthly_salary !== undefined) user.monthly_salary = monthly_salary;
      if (currency) user.currency = currency;

      await user.save();
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          currency: user.currency,
          monthly_salary: user.monthly_salary
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'error' });
    }
  });

  // Update user profile (name, email)
  router.put('/profile', auth, async (req, res) => {
    try {
      const { name, email } = req.body;
      const user = await User.findByPk(req.userId);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      // Check if email is already taken by another user
      if (email && email !== user.email) {
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: 'El email ya está en uso' });
        user.email = email;
      }

      if (name) user.name = name;

      await user.save();
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          currency: user.currency,
          monthly_salary: user.monthly_salary
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar perfil' });
    }
  });

  // Change password
  router.put('/password', auth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Contraseña actual y nueva requeridas' });
      }

      const user = await User.findByPk(req.userId);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      // Verify current password
      const isValid = await user.validatePassword(currentPassword);
      if (!isValid) {
        return res.status(400).json({ message: 'Contraseña actual incorrecta' });
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
      }

      // Hash and update new password
      user.password = newPassword; // Will be hashed by beforeCreate hook
      await user.save();

      res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al cambiar contraseña' });
    }
  });

module.exports = router;
