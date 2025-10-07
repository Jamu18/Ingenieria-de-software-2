
# Control de Gastos Personales (Visual Studio Code)

Proyecto mínimo para Control de Gastos Personales. Incluye backend en Node.js + Express (estructurado para usar MySQL con Sequelize)
y un frontend estático (HTML/JS) que se comunica por fetch a la API.

## Estructura
- src/backend: código del servidor (Express)
- src/frontend: HTML/CSS/JS del cliente
- .env.example: variables de entorno
- schema.sql: script SQL para crear la base de datos y tablas en MySQL
- package.json: scripts para desarrollo

## Cómo usar (resumen)
1. Abrir en Visual Studio Code la carpeta `control-gastos-vscode`.
2. Copiar `.env.example` a `.env` y completar los datos de conexión a MySQL (DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET).
3. Ejecutar `npm install` en la raíz (instalar dependencias) o en `src/backend` si prefieres aislar.
4. Levantar servidor: `npm run start:backend` y abrir `src/frontend/index.html` en el navegador (o servirlo con Live Server).

-- Este paquete es la base que podrás adaptar. Contiene también `schema.sql` para crear las tablas MySQL.
