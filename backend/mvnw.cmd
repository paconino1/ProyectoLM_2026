@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM M2_HOME - location of maven's installed home (default is your user installation)
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to wait for a key stroke before ending
@REM MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ------------
@REM Begin all REM lines with '@' in case MAVEN_BATCH_ECHO is 'on'
@REM enable echoing by setting MAVEN_BATCH_ECHO before calling this script
@if "%MAVEN_BATCH_ECHO%" == "on"  echo %MAVEN_BATCH_ECHO%

@REM set %date /a "-day_of_week%=1" would set the day_of_week
@REM Suppress all error messages if MAVEN_BATCH_SUPPRESS_MSGTITLE is set
@setlocal
@set MAVEN_CMD_LINE_ARGS=%*

if not "%JAVA_HOME%" == "" goto OkJavaHome

for /f "tokens=*" %%j in ('where java') do (
  setlocal
  for /f "tokens=*" %%f in ('java -version 2^>^&1') do (
    echo Found Java at: %%j
    if not "%JAVA_HOME%" == "" goto OkJavaHome
  )
)

:OkJavaHome
@REM Extracts the Java installation directory path

@REM Execute Maven
setlocal ENABLEDELAYEDEXPANSION
set MAVEN_HOME=
set MAVEN_BATCH_ECHO=off

if "%MAVEN_BATCH_ECHO%" == "on" (
  @echo.
  @echo %MAVEN_BATCH_ECHO%
  @echo off
)

@REM Start the execution
cd /d "%~dp0"

if "%MAVEN_OPTS%" == "" (
  set MAVEN_OPTS=-Xmx1024m
)

if ERRORLEVEL 9009 (
  echo.
  echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
  echo.
  echo Please set the JAVA_HOME variable in your environment to match the
  echo location of your Java installation.
  goto error
)

@REM Download Maven if needed
setlocal enabledelayedexpansion
set MAVEN_VERSION=3.9.0
set MAVEN_URL=https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip
set MAVEN_FOLDER=%USERPROFILE%\.m2\maven-%MAVEN_VERSION%

if not exist "%MAVEN_FOLDER%\bin\mvn.cmd" (
  echo Descargando Maven %MAVEN_VERSION%...
  powershell -Command "Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%USERPROFILE%\maven.zip'; Expand-Archive -Path '%USERPROFILE%\maven.zip' -DestinationPath '%USERPROFILE%\.m2' -Force; Remove-Item '%USERPROFILE%\maven.zip'"
)

set PATH=%MAVEN_FOLDER%\bin;%PATH%

cd /d "%~dp0"
call mvn %MAVEN_CMD_LINE_ARGS%
goto end

:error
exit /b 1

:end
endlocal & exit /b %ERRORLEVEL%
