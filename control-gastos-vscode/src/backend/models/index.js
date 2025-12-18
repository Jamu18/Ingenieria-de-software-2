const User = require('./user.model');
const Expense = require('./expense.model');
const SavingsGoal = require('./savingsGoal.model');

// Relaciones User <-> Expense
User.hasMany(Expense, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Expense.belongsTo(User, { foreignKey: 'user_id' });

// Relaciones User <-> SavingsGoal
User.hasMany(SavingsGoal, { foreignKey: 'user_id', onDelete: 'CASCADE' });
SavingsGoal.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { User, Expense, SavingsGoal };
