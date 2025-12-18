# Crear Usuario de Prueba

Para que las pruebas funcionen correctamente, necesitas crear un usuario de prueba en tu aplicación.

## Opción 1: Manual (Recomendado)

### Paso 1: Inicia tu aplicación
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run dev:frontend
```

### Paso 2: Regístrate manualmente
1. Abre http://localhost:5173 en tu navegador
2. Haz clic en "Crear cuenta gratis"
3. Completa el formulario:
   - **Nombre**: Usuario Test
   - **Email**: test@example.com
   - **Contraseña**: Test123456
   - **Moneda**: USD (o la que prefieras)
4. Haz clic en "Crear mi cuenta gratis"

### Paso 3: Verifica que funciona
```bash
cd pruebas
./verificar_selectores.sh
```

## Opción 2: Usando cURL (API)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario Test",
    "email": "test@example.com",
    "password": "Test123456",
    "currency": "USD"
  }'
```

## Opción 3: Usando la Base de Datos Directamente

Si tienes acceso a PostgreSQL:

```sql
-- Conectar a la base de datos
psql -U postgres -d control_gastos_db

-- El password es el hash bcrypt de "Test123456"
-- Este hash se genera automáticamente al usar la API, pero aquí está un ejemplo
INSERT INTO users (email, password, name, currency, "createdAt", "updatedAt")
VALUES (
  'test@example.com',
  '$2a$10$YourHashedPasswordHere',  -- Usar hash real
  'Usuario Test',
  'USD',
  NOW(),
  NOW()
);
```

## Verificar Credenciales

Las credenciales del usuario de prueba deben coincidir con las configuradas en `config/.env`:

```env
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=Test123456
TEST_USER_NAME=Usuario Test
TEST_USER_CURRENCY=USD
```

## Solución de Problemas

### Error: "Email already exists"
El usuario ya está registrado. Las pruebas deberían funcionar.

### Error: "Invalid credentials" en las pruebas
1. Verifica que la contraseña en `config/.env` es correcta
2. Intenta hacer login manual en http://localhost:5173 con las mismas credenciales
3. Si el login manual funciona pero las pruebas fallan, revisa los selectores

### El usuario no aparece en la base de datos
1. Verifica que el backend está corriendo
2. Revisa los logs del backend para ver errores
3. Verifica la conexión a PostgreSQL

## Prueba de Login Manual

Antes de ejecutar las pruebas automatizadas, verifica manualmente:

1. Ve a http://localhost:5173/login
2. Ingresa:
   - Email: test@example.com
   - Password: Test123456
3. Deberías ser redirigido a http://localhost:5173/dashboard

Si el login manual funciona, las pruebas también deberían funcionar.

## Crear Gastos de Ejemplo (Opcional)

Para que las pruebas de gastos tengan datos con los que trabajar:

1. Login en la aplicación
2. Ve a la sección "Gastos"
3. Crea 2-3 gastos de ejemplo:
   - Título: "Almuerzo"
   - Monto: 15.50
   - Categoría: Alimentación
   - Fecha: Hoy

Esto permitirá que las pruebas de eliminación y listado funcionen mejor.

## Script de Verificación

Una vez creado el usuario, ejecuta:

```bash
cd pruebas
./verificar_selectores.sh
```

Este script verificará:
- ✓ Backend corriendo
- ✓ Frontend corriendo
- ✓ Login funciona con las credenciales de prueba

## Mantener el Usuario de Prueba

**Importante**: No elimines este usuario. Es necesario para las pruebas automatizadas.

Si necesitas recrearlo:
1. Elimina el usuario de la base de datos (si existe)
2. Sigue nuevamente la Opción 1 o 2

---

¿Necesitas ayuda? Revisa el archivo `GUIA_RAPIDA.md` o `README.md` para más información.
