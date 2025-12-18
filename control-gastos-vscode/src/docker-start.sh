#!/bin/bash

# Script para iniciar el entorno Docker de Control de Gastos
# Uso: ./docker-start.sh

set -e

echo "🐳 Iniciando contenedores Docker..."
echo ""

# Verificar que Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo."
    echo "   Por favor, inicia Docker Desktop y vuelve a intentar."
    exit 1
fi

# Levantar contenedores
echo "📦 Levantando PostgreSQL y Adminer..."
docker-compose up -d

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 5

# Verificar que están corriendo
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Contenedores iniciados correctamente!"
    echo ""
    echo "📊 Estado de los servicios:"
    docker-compose ps
    echo ""
    echo "🔗 Accesos:"
    echo "   PostgreSQL:  localhost:5432"
    echo "   Adminer:     http://localhost:8080"
    echo ""
    echo "🔐 Credenciales para Adminer:"
    echo "   System:      PostgreSQL"
    echo "   Server:      db"
    echo "   Username:    cg_user"
    echo "   Password:    jaime789521"
    echo "   Database:    control_gastos_db"
    echo ""
    echo "📝 Ver logs:      docker-compose logs -f"
    echo "🛑 Detener:       docker-compose stop"
    echo "♻️  Reiniciar:     docker-compose restart"
    echo ""
else
    echo ""
    echo "❌ Error al iniciar los contenedores."
    echo "   Ver logs: docker-compose logs"
    exit 1
fi
