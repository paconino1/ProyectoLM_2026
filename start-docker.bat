@echo off
REM Script para iniciar ENEBA con Docker

echo ================================
echo   ENEBA Clone - Docker Setup
echo ================================
echo.

REM Verificar que Docker está instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker no está instalado o no está en el PATH
    echo Descárgalo desde: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Verificar que docker-compose está instalado
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Compose no está disponible
    pause
    exit /b 1
)

echo ✓ Docker detectado correctamente
echo.
echo Iniciando servicios...
echo   - MySQL en puerto 3306
echo   - Backend en puerto 8080
echo.

REM Navegar a la carpeta del proyecto
cd /d "%~dp0"

REM Ejecutar docker-compose
docker-compose up --build

echo.
echo ================================
echo   Servicios levantados
echo ================================
echo.
echo Frontend:  http://localhost:3000 (después de levantar servidor local)
echo Backend:   http://localhost:8080/api
echo API Docs:  http://localhost:8080/api/juegos
echo.
echo phpMyAdmin: http://localhost (usuario: root, contraseña: root)
echo.
pause
