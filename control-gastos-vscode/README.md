
# Control de Gastos Personales (Visual Studio Code)

Proyecto mínimo para Control de Gastos Personales. Incluye backend en Node.js + Express (estructurado para usar MySQL con Sequelize)
y un frontend estático (HTML/JS) que se comunica por fetch a la API.

## Estructura
- src/backend: código del servidor (Express)
- src/frontend: HTML/CSS/JS del cliente
- .env.example: variables de entorno
- schema.sql: script SQL para crear la base de datos y tablas en MySQL
- package.json: scripts para desarrollo

## Cómo usar (pasos detallados para Windows PowerShell)

1. Abre Visual Studio Code en la carpeta `control-gastos-vscode`.

2. Copia el archivo de ejemplo de variables de entorno y edítalo:

```powershell
cd "c:\Users\Jaime M\OneDrive\Documentos\Ingenieria-de-software-2\control-gastos-vscode"
copy .env.example .env
notepad .env
```

Rellena las variables: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS y JWT_SECRET.

3. Instala dependencias (si no lo hiciste ya):

```powershell
npm install
```

4. Crear la base de datos y tablas (requiere MySQL instalado). Opciones:

- Usando cliente mysql (si está en PATH):

```powershell
mysql -u <DB_USER> -p -h <DB_HOST> < <path-to-project>\schema.sql
```

- Si no tienes MySQL disponible, puedes usar Docker (ejemplo):

```powershell
docker run --name mysql-dev -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=control_gastos_db -p 3306:3306 -d mysql:8
# Luego importa schema.sql desde tu host usando el cliente mysql o herramientas GUI
```

5. Levantar servidor Node.js:

```powershell
npm run start
```

El servidor por defecto escucha en el puerto indicado en `.env` (o 3000).

6. Abrir la aplicación frontend en el navegador: visita `http://localhost:3000/`.

Notas:
- El backend intenta conectar y sincronizar la base de datos al arrancar. Si no hay configuración de DB válida, el servidor seguirá en modo degradado y el frontend todavía se servirá (útil para desarrollo del cliente estático).
- Si deseas ejecutar solo la interfaz sin backend, abre `src/frontend/index.html` localmente (algunos navegadores bloquean fetch a APIs locales por CORS si lo abres como archivo).

-- Este paquete es la base que podrás adaptar. Contiene también `schema.sql` para crear las tablas MySQL.
