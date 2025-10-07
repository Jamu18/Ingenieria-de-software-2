
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING },
  currency: { type: DataTypes.STRING, defaultValue: 'USD' },
  monthly_salary: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 }
}, { tableName: 'users' });

module.exports = User;
