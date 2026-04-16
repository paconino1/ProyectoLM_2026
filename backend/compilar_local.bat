@echo off
cd /d %~dp0
echo Compilando backend con Maven...
C:\Users\usuario\.maven\maven-3.9.14\bin\mvn.cmd clean package -DskipTests
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===== COMPILACION EXITOSA =====
    echo JAR generado en: %cd%\target\eneba-clone-1.0.0.jar
) else (
    echo.
    echo ===== ERROR EN COMPILACION =====
    pause
)
pause
