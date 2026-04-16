@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"
echo.
echo ===== INICIANDO BACKEND ENEBA =====
echo Perfil: DEV (H2 en memoria, sin MySQL)
echo Puerto: 8080
echo URL API: http://localhost:8080/api/juegos
echo.
echo Presiona Ctrl+C para detener
echo.

set JAVA_HOME=C:\Program Files\Java\jdk-21
set JAVA_OPTS=-Xmx512m -Xms256m
set SPRING_PROFILE=-Dspring.profiles.active=dev

"%JAVA_HOME%\bin\java.exe" %JAVA_OPTS% %SPRING_PROFILE% -jar target\eneba-clone-1.0.0.jar

