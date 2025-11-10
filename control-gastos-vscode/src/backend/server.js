const dotenv = require('dotenv');
const logger = require('./config/logger');

// Load env
dotenv.config({ path: __dirname + '/.env' });

const { sequelize } = require('./db');
const app = require('./app');

const PORT = process.env.PORT || 3002;

async function start() {
  try {
    await sequelize.authenticate();
    logger.info('Conectado a la base de datos');
    // Sync models (use migrations in real projects)
    await sequelize.sync();
    logger.info('Modelos sincronizados');

    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error('Error al iniciar la aplicación:', err);
    console.error('Error al iniciar la aplicación:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

start();
