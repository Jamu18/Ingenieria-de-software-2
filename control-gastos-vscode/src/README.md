# Control de Gastos Personales

Aplicación web para gestionar gastos personales con autenticación, registro de gastos y metas de ahorro.

## 📁 Estructura del Proyecto

```
/
├── backend/              # Backend Node.js + Express + PostgreSQL
│   ├── server.js        # Punto de entrada
│   ├── app.js           # Configuración Express
│   ├── db.js            # Conexión Sequelize
│   ├── models/          # Modelos de base de datos
│   ├── routes/          # Endpoints API
│   ├── middleware/      # Middleware (auth JWT)
│   └── config/          # Configuración (logger, database)
│
├── frontend/            # Frontend React + TypeScript + Vite
│   ├── src/            # Código fuente React
│   ├── public/         # Assets estáticos
│   └── vite.config.ts  # Configuración Vite
│
├── frontend-reference/  # Frontend HTML/CSS/JS vanilla (referencia)
│   ├── index.html      # Login/Dashboard
│   ├── expenses.html   # Registro de gastos
│   ├── main.js         # Lógica JavaScript
│   └── styles.css      # Diseño shadcn-inspired
│
├── .env                # Variables de entorno (NO COMMITEAR)
├── .env.example        # Template de .env
├── package.json        # Dependencias backend
└── schema.sql          # Script SQL para crear base de datos
```

## 🚀 Instalación

### 1. Instalar dependencias del backend

```bash
npm install
```

### 2. Instalar dependencias del frontend

```bash
cd frontend
npm install
cd ..
```

### 3. Configurar base de datos

Copia el archivo `.env.example` a `.env` y configura tus credenciales de PostgreSQL:

```bash
cp .env.example .env
```

Edita `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=control_gastos_db
DB_USER=postgres
DB_PASS=tu_password
JWT_SECRET=tu_secreto_jwt_muy_seguro
PORT=3000
```

### 4. Crear base de datos

```bash
# Opción 1: Usando psql
psql -U postgres -c "CREATE DATABASE control_gastos_db;"

# Opción 2: Usando Docker
docker run --name postgres-dev -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=control_gastos_db -p 5432:5432 -d postgres:15

# Opción 3: Ejecutar schema.sql
psql -U postgres -d control_gastos_db -f schema.sql
```

## 🎯 Uso

### Desarrollo (Backend + Frontend simultáneamente)

```bash
npm run dev:all
```

Este comando inicia:
- **Backend** en `http://localhost:3000`
- **Frontend** en `http://localhost:5173`

### Solo Backend

```bash
npm run dev
```

### Solo Frontend

```bash
npm run dev:frontend
```

### Producción

```bash
# Backend
npm start

# Frontend (primero hacer build)
cd frontend
npm run build
# Los archivos se sirven desde backend/dist
```

## 📚 API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere auth)
- `PUT /api/auth/settings` - Actualizar configuración (requiere auth)

### Gastos

- `POST /api/expenses` - Crear gasto (requiere auth)
- `GET /api/expenses?month=YYYY-MM` - Listar gastos (requiere auth)
- `DELETE /api/expenses/:id` - Eliminar gasto (requiere auth)

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** + **Express** - Servidor web
- **PostgreSQL** - Base de datos
- **Sequelize** - ORM
- **JWT** - Autenticación
- **bcrypt** - Hash de contraseñas
- **Winston** - Logging

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client

### Frontend Reference (Vanilla)
- **HTML5** + **CSS3** + **JavaScript ES6**
- Sistema de diseño inspirado en shadcn/ui
- Sin frameworks (solo vanilla JS)

## 📝 Notas

- El **frontend-reference/** es el frontend original en HTML/CSS/JS que funciona correctamente
- El **frontend/** es la versión nueva en React que estamos desarrollando
- Usa **frontend-reference/** como guía para implementar las funcionalidades en React
- La base de datos es **PostgreSQL** (no MySQL como indica el README viejo)

## 🔒 Seguridad

- Las contraseñas se hashean con bcrypt antes de guardarse
- JWT para autenticación stateless
- Middleware de autenticación protege rutas privadas
- Variables sensibles en `.env` (no committear)

## 📦 Scripts Disponibles

```bash
npm start           # Iniciar backend (producción)
npm run dev         # Iniciar backend (desarrollo con nodemon)
npm run dev:frontend    # Iniciar frontend
npm run dev:all     # Iniciar backend + frontend simultáneamente
npm test            # Ejecutar tests
npm run migrate     # Ejecutar migraciones
```

## 🐛 Troubleshooting

### Puerto ocupado
Si el puerto 3000 o 5173 está ocupado:

```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# Matar proceso en puerto 5173
lsof -ti:5173 | xargs kill -9
```

### Error de conexión a base de datos
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en `.env`
- Asegúrate de que la base de datos existe

### Frontend en blanco
- Abre la consola del navegador (F12)
- Verifica que el backend esté corriendo
- Revisa que las rutas del proxy en `vite.config.ts` sean correctas
