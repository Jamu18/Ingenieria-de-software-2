#!/bin/bash

# Script para activar el entorno virtual de pruebas
# Uso: source activar_entorno.sh

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Activando entorno virtual de pruebas${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Verificar que estamos en el directorio correcto
if [ ! -d "venv" ]; then
    echo -e "${RED}Error: No se encontró el directorio venv${NC}"
    echo -e "${RED}Ejecutar desde el directorio 'pruebas'${NC}"
    exit 1
fi

# Activar entorno virtual
source venv/bin/activate

echo -e "${GREEN}✓ Entorno virtual activado${NC}\n"

echo -e "Versiones instaladas:"
echo -e "  - Python: $(python --version)"
echo -e "  - Pytest: $(pytest --version)"
echo -e "  - Locust: $(locust --version | head -n 1)"
echo -e "  - Selenium: $(pip show selenium | grep Version | cut -d' ' -f2)\n"

echo -e "${BLUE}Comandos útiles:${NC}"
echo -e "  ${GREEN}pytest tests/functional/ -v${NC}         # Ejecutar pruebas funcionales"
echo -e "  ${GREEN}locust -f tests/performance/locustfile.py${NC}  # Pruebas de carga"
echo -e "  ${GREEN}./verificar_selectores.sh${NC}           # Verificar selectores"
echo -e "  ${GREEN}deactivate${NC}                          # Desactivar entorno virtual\n"
