
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./user.model');

const Expense = sequelize.define('Expense', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
  currency: { type: DataTypes.STRING, defaultValue: 'USD' },
  category: { type: DataTypes.STRING },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  note: { type: DataTypes.TEXT }
}, { tableName: 'expenses' });

Expense.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Expense;
