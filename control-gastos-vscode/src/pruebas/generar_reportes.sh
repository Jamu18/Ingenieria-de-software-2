#!/bin/bash

# Script para generar todos los reportes de pruebas
# Uso: ./generar_reportes.sh

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🧪 Generando Reportes de Pruebas${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Crear directorio de reportes si no existe
mkdir -p reports

# Timestamp para nombres únicos
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Activar entorno virtual
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
else
    echo -e "${YELLOW}⚠ No se encontró el entorno virtual${NC}"
    exit 1
fi

# 1. Pruebas funcionales
echo -e "${BLUE}📊 1/2 Ejecutando pruebas funcionales con Selenium...${NC}"
pytest tests/functional/ -v \
  --html=reports/reporte_funcional_${TIMESTAMP}.html \
  --self-contained-html

FUNCTIONAL_EXIT=$?

if [ $FUNCTIONAL_EXIT -eq 0 ]; then
    echo -e "${GREEN}✓ Pruebas funcionales completadas exitosamente${NC}\n"
else
    echo -e "${YELLOW}⚠ Algunas pruebas funcionales fallaron (revisa el reporte)${NC}\n"
fi

# 2. Pruebas de rendimiento
echo -e "${BLUE}⚡ 2/2 Ejecutando pruebas de rendimiento con Locust...${NC}"
locust -f tests/performance/locustfile.py \
  --host=http://localhost:3000 \
  --users 50 \
  --spawn-rate 5 \
  --run-time 1m \
  --headless \
  --html reports/reporte_rendimiento_${TIMESTAMP}.html \
  --csv reports/stats_${TIMESTAMP} 2>&1 | grep -v "urllib3"

PERFORMANCE_EXIT=$?

if [ $PERFORMANCE_EXIT -eq 0 ]; then
    echo -e "${GREEN}✓ Pruebas de rendimiento completadas exitosamente${NC}\n"
else
    echo -e "${YELLOW}⚠ Error en pruebas de rendimiento${NC}\n"
fi

# Resumen
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📁 Reportes Generados${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "📊 ${GREEN}Pruebas Funcionales:${NC}"
echo -e "   reports/reporte_funcional_${TIMESTAMP}.html"

echo -e "\n⚡ ${GREEN}Pruebas de Rendimiento:${NC}"
echo -e "   reports/reporte_rendimiento_${TIMESTAMP}.html"
echo -e "   reports/stats_${TIMESTAMP}_stats.csv"

echo -e "\n${BLUE}Para abrir los reportes:${NC}"
echo -e "   open reports/reporte_funcional_${TIMESTAMP}.html"
echo -e "   open reports/reporte_rendimiento_${TIMESTAMP}.html"

echo -e "\n${BLUE}Archivos disponibles en reports/:${NC}"
ls -lh reports/*.html | tail -5

echo -e "\n${GREEN}✅ Generación de reportes completada${NC}"
