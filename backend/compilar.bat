@echo off
setlocal enabledelayedexpansion

REM Detectar Java
for /f "tokens=*" %%i in ('where java') do set "JAVA_PATH=%%i"
for %%A in ("%JAVA_PATH%") do set "JAVA_BIN=%%~dpA"
for %%A in ("%JAVA_BIN:~0,-1%") do set "JAVA_HOME=%%~dpA"
set "JAVA_HOME=%JAVA_HOME:~0,-1%"

echo JAVA_HOME: %JAVA_HOME%
echo Java version:
java -version

REM Descargar Maven si no existe
if not exist "%USERPROFILE%\.m2\apache-maven-3.9.0" (
    echo Descargando Maven...
    powershell -Command "$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.0/binaries/apache-maven-3.9.0-bin.zip' -OutFile '%USERPROFILE%\maven.zip'"
    
    echo Extrayendo Maven...
    cd /d "%USERPROFILE%\.m2"
    powershell -Command "Expand-Archive -Path '$env:USERPROFILE\maven.zip' -DestinationPath '.' -Force"
    del "%USERPROFILE%\maven.zip"
)

REM Configurar Maven en PATH
set "PATH=%USERPROFILE%\.m2\apache-maven-3.9.0\bin;%PATH%"
set "MAVEN_OPTS=-Xmx1024m"

echo.
echo Compilando proyecto...
echo.

cd /d "%~dp0"
call mvn clean package -DskipTests

echo.
echo Compilacion completada!
echo.
pause
