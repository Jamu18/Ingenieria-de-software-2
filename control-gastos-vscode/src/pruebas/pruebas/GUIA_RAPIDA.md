# Guía Rápida - Pruebas Automatizadas

## Inicio Rápido (5 minutos)

### 1. Instalación
```bash
cd pruebas
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configurar Variables de Entorno
```bash
cp config/.env.example config/.env
# Editar config/.env si es necesario
```

### 3. Asegurar que el Sistema Esté Corriendo
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run dev:frontend
```

### 4. Ejecutar Pruebas

**Opción A: Script Interactivo** (Recomendado)
```bash
./run_tests.sh
```

**Opción B: Comandos Directos**
```bash
# Pruebas funcionales
pytest tests/functional/ -v

# Pruebas de rendimiento (con interfaz)
cd tests/performance && locust -f locustfile.py

# Pruebas de rendimiento (sin interfaz)
locust -f tests/performance/locustfile.py --headless \
  --users 50 --spawn-rate 5 --host http://localhost:3000 \
  --run-time 2m --html reports/performance.html
```

## Comandos Útiles

### Pruebas Funcionales
```bash
# Todas las pruebas
pytest tests/functional/ -v

# Solo autenticación
pytest tests/functional/test_auth.py -v

# Solo gastos
pytest tests/functional/test_expenses.py -v

# Con reporte HTML
pytest tests/functional/ --html=reports/report.html --self-contained-html

# En paralelo (más rápido)
pytest tests/functional/ -n 4

# Modo verboso con prints
pytest tests/functional/ -v -s
```

### Pruebas de Rendimiento

**Con Interfaz Web:**
```bash
cd tests/performance
locust -f locustfile.py
# Abrir http://localhost:8089
```

**Sin Interfaz (Headless):**
```bash
# Prueba básica
locust -f tests/performance/locustfile.py --headless \
  --users 50 --spawn-rate 5 --host http://localhost:3000 \
  --run-time 2m

# Con reporte HTML
locust -f tests/performance/locustfile.py --headless \
  --users 50 --spawn-rate 5 --host http://localhost:3000 \
  --run-time 2m --html reports/perf.html

# Prueba de carga API
locust -f tests/performance/api_load_test.py --headless \
  --users 100 --spawn-rate 10 --host http://localhost:3000 \
  --run-time 3m --html reports/api_load.html
```

## Estructura de Archivos

```
pruebas/
├── tests/
│   ├── functional/
│   │   ├── test_auth.py          # Pruebas de autenticación
│   │   └── test_expenses.py      # Pruebas de gastos
│   ├── performance/
│   │   ├── locustfile.py         # Pruebas de rendimiento generales
│   │   └── api_load_test.py      # Pruebas de carga API
│   └── conftest.py               # Fixtures de pytest
├── config/
│   ├── .env.example              # Variables de entorno ejemplo
│   └── config.py                 # Configuración centralizada
├── utils/
│   ├── driver_factory.py         # Factory de Selenium WebDriver
│   └── helpers.py                # Funciones auxiliares
├── reports/                      # Reportes generados
├── requirements.txt              # Dependencias Python
├── run_tests.sh                  # Script de ejecución interactivo
├── README.md                     # Documentación completa
├── PLAN_DE_PRUEBAS.md           # Plan detallado de pruebas
└── GUIA_RAPIDA.md               # Esta guía
```

## Solución de Problemas Comunes

### Error: "Connection refused"
```bash
# Verificar que el backend esté corriendo
curl http://localhost:3000/api/auth/me

# Verificar que el frontend esté corriendo
curl http://localhost:5173
```

### Error: "WebDriver not found"
```bash
# Reinstalar webdriver-manager
pip install --upgrade webdriver-manager
```

### Pruebas muy lentas
```bash
# Ejecutar en modo headless
# Editar config/.env:
HEADLESS=true

# O ejecutar directamente en paralelo
pytest tests/functional/ -n 4
```

### Screenshots no se guardan
```bash
# Verificar configuración en config/.env
SCREENSHOT_ON_FAILURE=true

# Verificar que exista el directorio
mkdir -p reports/screenshots
```

## Interpretación de Resultados

### Pytest (Funcionales)
```
tests/functional/test_auth.py::TestAuthentication::test_01_register_new_user PASSED
tests/functional/test_auth.py::TestAuthentication::test_02_login_valid_credentials PASSED
tests/functional/test_auth.py::TestAuthentication::test_03_login_invalid_credentials PASSED

====== 3 passed in 45.2s ======
```
- ✓ `PASSED`: Prueba exitosa
- ✗ `FAILED`: Prueba falló (revisar output y screenshot)
- `SKIPPED`: Prueba omitida

### Locust (Rendimiento)
Métricas clave:
- **Requests/s**: Peticiones por segundo (mayor = mejor)
- **Response time (ms)**: Tiempo de respuesta promedio
  - Objetivo: < 2000ms
- **Failures**: Tasa de errores
  - Objetivo: < 1%
- **Percentiles**: p50, p90, p95, p99
  - p95 < 2000ms = bueno

## Ejemplos de Uso

### 1. Antes de hacer un commit
```bash
# Ejecutar solo pruebas rápidas
pytest tests/functional/test_auth.py -v
```

### 2. Antes de un release
```bash
# Ejecutar todas las pruebas con reporte
pytest tests/functional/ -v --html=reports/pre_release.html --self-contained-html

# Prueba de carga
locust -f tests/performance/locustfile.py --headless \
  --users 50 --spawn-rate 5 --host http://localhost:3000 \
  --run-time 5m --html reports/load_test.html
```

### 3. Probar nueva funcionalidad
```bash
# Crear nuevo archivo de prueba
# tests/functional/test_nueva_funcionalidad.py

# Ejecutar solo ese archivo
pytest tests/functional/test_nueva_funcionalidad.py -v -s
```

### 4. Debugging
```bash
# Ejecutar prueba específica con máximo detalle
pytest tests/functional/test_auth.py::TestAuthentication::test_02_login_valid_credentials -v -s --pdb
```

## Buenas Prácticas

1. **Siempre ejecutar pruebas antes de commit**
2. **Usar datos de prueba separados** (no producción)
3. **Limpiar datos después de las pruebas**
4. **Revisar reportes de fallos**
5. **Actualizar pruebas cuando cambie funcionalidad**
6. **Documentar casos de prueba nuevos**
7. **Ejecutar pruebas de rendimiento regularmente**

## Próximos Pasos

1. Personalizar selectores CSS/IDs según tu HTML real
2. Agregar más casos de prueba según necesidades
3. Integrar con CI/CD (GitHub Actions, GitLab CI)
4. Agregar pruebas de integración
5. Implementar Page Object Pattern para mejor mantenibilidad

## Recursos

- [README completo](README.md)
- [Plan de Pruebas](PLAN_DE_PRUEBAS.md)
- [Documentación Selenium](https://www.selenium.dev/documentation/)
- [Documentación Locust](https://docs.locust.io/)
- [Documentación Pytest](https://docs.pytest.org/)
