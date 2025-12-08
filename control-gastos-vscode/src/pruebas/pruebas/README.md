# Pruebas Automatizadas - Control de Gastos

Proyecto de pruebas automatizadas para la aplicación de control de gastos usando **Selenium** (pruebas funcionales) y **Locust** (pruebas de rendimiento).

## Estructura del Proyecto

```
pruebas/
├── tests/                  # Scripts de pruebas
│   ├── functional/        # Pruebas funcionales con Selenium
│   ├── performance/       # Pruebas de rendimiento con Locust
│   └── integration/       # Pruebas de integración
├── config/                # Archivos de configuración
├── reports/               # Reportes generados
├── utils/                 # Utilidades y helpers
├── requirements.txt       # Dependencias Python
└── README.md             # Este archivo
```

## Tipos de Pruebas Implementadas

### 1. Pruebas Funcionales (Selenium)
- **Pruebas de autenticación**: Login, registro, logout
- **Pruebas de gestión de gastos**: Crear, listar, eliminar gastos
- **Pruebas de configuración**: Actualizar salario y moneda
- **Pruebas de regresión**: Validar que cambios no rompan funcionalidad existente

### 2. Pruebas de Rendimiento (Locust)
- **Pruebas de carga**: Simular múltiples usuarios concurrentes
- **Pruebas de estrés**: Evaluar límites del sistema
- **Pruebas de API**: Validar tiempos de respuesta de endpoints

## Instalación

1. **Crear entorno virtual** (recomendado):
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. **Instalar dependencias**:
```bash
pip install -r requirements.txt
```

3. **Configurar variables de entorno**:
```bash
cp config/.env.example config/.env
# Editar config/.env con tus valores
```

## Ejecución de Pruebas

### Pruebas Funcionales con Selenium

**Ejecutar todas las pruebas funcionales**:
```bash
pytest tests/functional/ -v
```

**Ejecutar pruebas específicas**:
```bash
# Solo pruebas de autenticación
pytest tests/functional/test_auth.py -v

# Solo pruebas de gastos
pytest tests/functional/test_expenses.py -v
```

**Generar reporte HTML**:
```bash
pytest tests/functional/ --html=reports/functional_report.html --self-contained-html
```

**Ejecutar en paralelo** (más rápido):
```bash
pytest tests/functional/ -n 4
```

### Pruebas de Rendimiento con Locust

**Iniciar Locust con interfaz web**:
```bash
cd tests/performance
locust -f locustfile.py
```

Luego abrir http://localhost:8089 y configurar:
- **Número de usuarios**: 50
- **Tasa de generación**: 5 usuarios/segundo
- **Host**: http://localhost:3000

**Ejecutar Locust sin interfaz (headless)**:
```bash
locust -f tests/performance/locustfile.py --headless \
  --users 50 --spawn-rate 5 \
  --host http://localhost:3000 \
  --run-time 2m \
  --html reports/performance_report.html
```

## Configuración

### Variables de Entorno (config/.env)

```env
# URL de la aplicación
BASE_URL=http://localhost:5173
API_URL=http://localhost:3000

# Credenciales de prueba
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=Test123456
TEST_USER_NAME=Usuario Test

# Configuración de Selenium
HEADLESS=false
BROWSER=chrome
IMPLICIT_WAIT=10

# Configuración de Locust
LOCUST_USERS=50
LOCUST_SPAWN_RATE=5
```

## Casos de Prueba Principales

### Funcionales
1. **Registro de usuario nuevo**
   - Validar formulario de registro
   - Verificar creación exitosa
   - Validar mensajes de error con datos inválidos

2. **Inicio de sesión**
   - Login con credenciales válidas
   - Login con credenciales inválidas
   - Validar persistencia de sesión

3. **Gestión de gastos**
   - Crear gasto nuevo
   - Listar gastos del mes
   - Filtrar gastos por categoría
   - Eliminar gasto

4. **Configuración de usuario**
   - Actualizar salario mensual
   - Cambiar moneda
   - Validar cálculos de porcentajes

### Rendimiento
1. **Carga de usuarios concurrentes**
   - 50 usuarios simultáneos
   - Tiempo de respuesta < 2 segundos
   - Tasa de error < 1%

2. **Endpoints críticos**
   - POST /api/auth/login
   - GET /api/expenses
   - POST /api/expenses

## Reportes

Los reportes se generan en la carpeta `reports/`:
- `functional_report.html`: Resultados de pruebas funcionales
- `performance_report.html`: Resultados de pruebas de rendimiento
- `screenshots/`: Capturas de pantalla en caso de fallos

## Buenas Prácticas

1. **Ejecutar backend y frontend antes de las pruebas**:
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
npm run dev:frontend
```

2. **Usar datos de prueba separados**: No usar la base de datos de producción

3. **Limpiar datos después de las pruebas**: Las pruebas deben ser independientes

4. **Revisar reportes**: Analizar fallos y tiempos de respuesta

## Solución de Problemas

### Error: "WebDriver not found"
```bash
# Reinstalar webdriver-manager
pip install --upgrade webdriver-manager
```

### Error: "Connection refused"
Verificar que el backend esté corriendo en el puerto correcto:
```bash
curl http://localhost:3000/api/auth/me
```

### Pruebas lentas
Ejecutar en modo headless:
```bash
# Editar config/.env
HEADLESS=true
```

## Contribuir

Para agregar nuevas pruebas:

1. Crear archivo en `tests/functional/` o `tests/performance/`
2. Seguir convención de nombres: `test_*.py`
3. Usar fixtures de `conftest.py`
4. Documentar casos de prueba
5. Ejecutar todas las pruebas antes de commit

## Referencias

- [Selenium Documentation](https://www.selenium.dev/documentation/)
- [Locust Documentation](https://docs.locust.io/)
- [Pytest Documentation](https://docs.pytest.org/)
- ISTQB Foundation Level Syllabus
- ISO/IEC/IEEE 29119

## Autor

Proyecto de pruebas para Control de Gastos
