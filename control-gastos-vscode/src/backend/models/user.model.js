
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING },
  currency: { type: DataTypes.STRING, defaultValue: 'USD' },
  monthly_salary: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 }
}, { tableName: 'users' });

// Hook para hashear la contraseña antes de crear el usuario
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Hook para hashear la contraseña antes de actualizar el usuario
User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Método para validar contraseña
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Relationships are defined in models/index.js

module.exports = User;
