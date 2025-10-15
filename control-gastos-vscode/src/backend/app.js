const express = require('express');
const path = require('path');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Ejemplo de ruta de API
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: '¡Hola desde el backend!' });
});

// Ruta raíz para servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Para cualquier otra ruta que no sea API, devolver index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// (La inicialización del servidor se hace más abajo usando process.env.PORT)
const dotenv = require('dotenv');
dotenv.config();

// Importar DB y rutas si existen
let sequelize;
try {
  ({ sequelize } = require('./db'));
} catch (err) {
  console.warn('No se pudo require("./db"). La app seguirá en modo sin DB.');
}

// Rutas
try {
  const authRoutes = require('./routes/auth.routes');
  const expensesRoutes = require('./routes/expenses.routes');
  app.use('/api/auth', authRoutes);
  app.use('/api/expenses', expensesRoutes);
} catch (err) {
  console.warn('No se pudieron montar las rutas API:', err && err.message ? err.message : err);
}

// Intentar conectar y sincronizar la base de datos, pero no evitar que el servidor arranque
(async () => {
  if (!sequelize) return;
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos. Ejecutando sequelize.sync()...');
    await sequelize.sync();
    console.log('Sincronización de modelos completada.');
  } catch (err) {
    console.warn('No fue posible conectar/sincronizar la base de datos. Se continúa en modo degradado.');
    console.warn(err && err.message ? err.message : err);
  }
})();

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
