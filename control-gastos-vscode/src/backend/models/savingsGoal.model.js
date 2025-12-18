const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const SavingsGoal = sequelize.define('SavingsGoal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: { type: DataTypes.STRING, allowNull: false },
  target_amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
  current_amount: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
  deadline: { type: DataTypes.DATEONLY },
  color: { type: DataTypes.STRING, defaultValue: 'blue' }
}, {
  tableName: 'savings_goals'
});

// Relationships are defined in models/index.js

module.exports = SavingsGoal;
