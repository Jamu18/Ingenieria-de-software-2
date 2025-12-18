
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

// Use DATABASE_URL if available (Railway/Production), otherwise use individual env vars (Local)
let sequelize;

if (process.env.DATABASE_URL) {
  // Production - Railway provides DATABASE_URL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    define: {
      underscored: true,
      timestamps: true
    }
  });
} else {
  // Local development - use individual env vars
  sequelize = new Sequelize(
    process.env.DB_NAME || 'control_gastos_db',
    process.env.DB_USER || 'cg_user',
    process.env.DB_PASS || 'jaime789521',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      define: {
        underscored: true,
        timestamps: true
      }
    }
  );
}

module.exports = { sequelize };
