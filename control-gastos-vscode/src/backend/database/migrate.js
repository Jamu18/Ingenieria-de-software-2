const { sequelize } = require('../db');
const logger = require('../config/logger');

// Importar todos los modelos
const User = require('../models/user.model');
const Expense = require('../models/expense.model');

async function migrate() {
  try {
  // Sincronizar todos los modelos con la base de datos
  await sequelize.sync({ alter: true });
    logger.info('Base de datos migrada exitosamente');
    process.exit(0);
  } catch (error) {
    logger.error('Error migrando la base de datos:', error);
    process.exit(1);
  }
}

migrate();