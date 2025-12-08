#!/bin/bash

# Script de Verificación de Selectores
# Ejecuta una prueba rápida para verificar que los selectores están correctos

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Verificación de Selectores${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Verificar que estamos en el directorio correcto
if [ ! -f "requirements.txt" ]; then
    echo -e "${YELLOW}Error: Ejecutar desde el directorio 'pruebas'${NC}"
    exit 1
fi

echo -e "${BLUE}1. Verificando que el backend está corriendo...${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend accesible en http://localhost:3000${NC}"
else
    echo -e "${YELLOW}⚠ Backend no responde en http://localhost:3000${NC}"
    echo -e "${YELLOW}  Asegúrate de ejecutar: npm run dev${NC}"
fi

echo -e "\n${BLUE}2. Verificando que el frontend está corriendo...${NC}"
if curl -s http://localhost:5174 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend accesible en http://localhost:5174${NC}"
elif curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend accesible en http://localhost:5173${NC}"
    echo -e "${YELLOW}⚠ Nota: Frontend en puerto 5173, pero config usa 5174${NC}"
else
    echo -e "${YELLOW}⚠ Frontend no responde en http://localhost:5174 ni en 5173${NC}"
    echo -e "${YELLOW}  Asegúrate de ejecutar: npm run dev:frontend${NC}"
fi

echo -e "\n${BLUE}3. Ejecutando prueba rápida de login...${NC}"

# Activar entorno virtual si existe
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi

# Agregar directorio actual al PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

pytest tests/functional/test_auth.py::TestAuthentication::test_02_login_valid_credentials -v -s

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ ¡Selectores verificados correctamente!${NC}"
    echo -e "${GREEN}========================================${NC}\n"
    echo -e "Los selectores están actualizados y funcionando."
    echo -e "\nPuedes ejecutar todas las pruebas con:"
    echo -e "  ${BLUE}pytest tests/functional/ -v${NC}\n"
else
    echo -e "\n${YELLOW}========================================${NC}"
    echo -e "${YELLOW}⚠ Hubo un problema con la prueba${NC}"
    echo -e "${YELLOW}========================================${NC}\n"
    echo -e "Posibles causas:"
    echo -e "1. El usuario de prueba no existe"
    echo -e "   - Registra un usuario con email: test@example.com"
    echo -e "2. Las credenciales son incorrectas"
    echo -e "   - Verifica config/.env"
    echo -e "3. El backend/frontend no están corriendo"
    echo -e "   - Ejecuta: npm run dev:all\n"
fi
