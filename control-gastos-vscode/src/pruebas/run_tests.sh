#!/bin/bash

# Script para ejecutar pruebas automatizadas
# Control de Gastos - Pruebas Automatizadas

set -e  # Salir si hay errores

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Control de Gastos - Pruebas Automatizadas${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Verificar que estamos en el directorio correcto
if [ ! -f "requirements.txt" ]; then
    echo -e "${RED}Error: Ejecutar desde el directorio 'pruebas'${NC}"
    exit 1
fi

# Función para mostrar menú
show_menu() {
    echo -e "${YELLOW}Seleccione el tipo de prueba:${NC}"
    echo "1) Pruebas Funcionales (Selenium)"
    echo "2) Pruebas de Rendimiento (Locust - Interfaz Web)"
    echo "3) Pruebas de Rendimiento (Locust - Sin interfaz)"
    echo "4) Todas las pruebas funcionales con reporte"
    echo "5) Verificar instalación de dependencias"
    echo "6) Salir"
    echo ""
}

# Función para instalar dependencias
install_dependencies() {
    echo -e "${BLUE}Instalando dependencias...${NC}"
    pip install -r requirements.txt
    echo -e "${GREEN}✓ Dependencias instaladas${NC}\n"
}

# Función para pruebas funcionales
run_functional_tests() {
    echo -e "${BLUE}Ejecutando pruebas funcionales con Selenium...${NC}\n"

    # Verificar que el servidor esté corriendo
    if ! curl -s http://localhost:3000 > /dev/null; then
        echo -e "${YELLOW}Advertencia: El servidor backend no responde en http://localhost:3000${NC}"
        echo -e "${YELLOW}Asegúrate de que el servidor esté corriendo antes de las pruebas${NC}\n"
    fi

    pytest tests/functional/ -v --html=reports/functional_report.html --self-contained-html

    echo -e "\n${GREEN}✓ Pruebas funcionales completadas${NC}"
    echo -e "${BLUE}Reporte generado en: reports/functional_report.html${NC}\n"
}

# Función para pruebas de rendimiento con interfaz
run_locust_web() {
    echo -e "${BLUE}Iniciando Locust con interfaz web...${NC}\n"
    echo -e "${YELLOW}Configuración:${NC}"
    echo "- URL: http://localhost:8089"
    echo "- Host: http://localhost:3000"
    echo "- Usuarios sugeridos: 50"
    echo "- Tasa de generación: 5"
    echo ""

    cd tests/performance
    locust -f locustfile.py
}

# Función para pruebas de rendimiento sin interfaz
run_locust_headless() {
    echo -e "${BLUE}Ejecutando pruebas de rendimiento (headless)...${NC}\n"

    cd tests/performance
    locust -f locustfile.py \
        --headless \
        --users 50 \
        --spawn-rate 5 \
        --host http://localhost:3000 \
        --run-time 2m \
        --html ../../reports/performance_report.html

    echo -e "\n${GREEN}✓ Pruebas de rendimiento completadas${NC}"
    echo -e "${BLUE}Reporte generado en: reports/performance_report.html${NC}\n"
}

# Función para ejecutar todas las pruebas
run_all_tests() {
    echo -e "${BLUE}Ejecutando TODAS las pruebas...${NC}\n"

    # Funcionales
    pytest tests/functional/ -v -n 4 --html=reports/full_report.html --self-contained-html

    echo -e "\n${GREEN}✓ Todas las pruebas completadas${NC}"
    echo -e "${BLUE}Reporte generado en: reports/full_report.html${NC}\n"
}

# Bucle principal del menú
while true; do
    show_menu
    read -p "Opción: " option

    case $option in
        1)
            run_functional_tests
            ;;
        2)
            run_locust_web
            ;;
        3)
            run_locust_headless
            ;;
        4)
            run_all_tests
            ;;
        5)
            install_dependencies
            ;;
        6)
            echo -e "${GREEN}¡Hasta luego!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Opción inválida${NC}\n"
            ;;
    esac
done
