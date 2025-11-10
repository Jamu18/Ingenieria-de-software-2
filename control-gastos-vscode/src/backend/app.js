const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load env early
dotenv.config({ path: __dirname + '/.env' });

const app = express();

// Middleware
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

// Rutas (si existen)
try {
  const authRoutes = require('./routes/auth.routes');
  const expensesRoutes = require('./routes/expenses.routes');
  app.use('/api/auth', authRoutes);
  app.use('/api/expenses', expensesRoutes);
} catch (err) {
  console.warn('No se pudieron montar las rutas API:', err && err.message ? err.message : err);
}

module.exports = app;
