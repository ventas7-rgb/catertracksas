@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo 🚀 CaterTrack Admin - Iniciando...
echo.

echo 📡 Iniciando servicio local...
start "CaterTrack local service" /b node scripts\local-service.mjs

echo 🌐 Iniciando servidor web...
start "CaterTrack web server" /b npx.cmd --yes serve .

echo.
echo ✅ Sistema listo.
echo.
echo 📍 Abre tu navegador en: http://localhost:3000/admin/
echo.
echo (Este archivo se puede minimizar, no cierre la ventana mientras use el administrador)
echo.

timeout /t 2 /nobreak

REM Keep the window open
pause
