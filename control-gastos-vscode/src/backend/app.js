const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load env early
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();

// Middleware
app.use(express.json());

// Ejemplo de ruta de API
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: '¡Hola desde el backend!' });
});

// Rutas API (deben ir ANTES de los archivos estáticos)
try {
  const authRoutes = require('./routes/auth.routes');
  const expensesRoutes = require('./routes/expenses.routes');
  const savingsGoalsRoutes = require('./routes/savingsGoals.routes');
  app.use('/api/auth', authRoutes);
  app.use('/api/expenses', expensesRoutes);
  app.use('/api/savings-goals', savingsGoalsRoutes);
} catch (err) {
  console.warn('No se pudieron montar las rutas API:', err && err.message ? err.message : err);
}

// Servir archivos estáticos desde el build de React (solo en producción)
const distPath = path.join(__dirname, 'dist');
if (require('fs').existsSync(distPath)) {
  app.use(express.static(distPath));

  // Para cualquier otra ruta que no sea API, devolver index.html (SPA)
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // En desarrollo, mostrar mensaje
  app.get('*', (req, res) => {
    res.json({
      message: 'Backend API running. Frontend should be running on http://localhost:5173',
      api: {
        auth: '/api/auth/*',
        expenses: '/api/expenses/*'
      }
    });
  });
}

module.exports = app;
