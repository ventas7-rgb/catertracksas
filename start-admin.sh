#!/bin/bash

echo ""
echo "🚀 CaterTrack Admin - Iniciando..."
echo ""

echo "📡 Iniciando servicio local..."
node scripts/local-service.mjs &
SERVICE_PID=$!

echo "🌐 Iniciando servidor web..."
npx serve . &
SERVE_PID=$!

sleep 2

echo ""
echo "✅ Sistema listo."
echo ""
echo "📍 Abre tu navegador en: http://localhost:3000/admin/"
echo ""

# Handle cleanup on exit
trap "kill $SERVICE_PID $SERVE_PID 2>/dev/null" EXIT

# Wait for processes
wait
