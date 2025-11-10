
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

// Use env from process if available, otherwise fallback to parent src/backend/.env
const sequelize = new Sequelize(process.env.DB_NAME || 'control_gastos_db', process.env.DB_USER || 'postgres', process.env.DB_PASS || 'postgres', {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true,
    timestamps: true
  }
});

module.exports = { sequelize };
