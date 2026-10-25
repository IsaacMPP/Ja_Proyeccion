@echo off
setlocal
cd /d "%~dp0"
echo =============================================
echo       JA PROYECCION - PREPARAR (FASE 1)
echo =============================================
where node >nul 2>nul
if errorlevel 1 (
 echo ERROR: Instala Node.js 22.12 o superior.
 goto :error
)
node scripts\ja\check-environment.mjs
if errorlevel 1 goto :error
node scripts\ja\verify-base.mjs
if errorlevel 1 goto :error
echo.
echo Instalando dependencias con npm ci...
call npm ci
if errorlevel 1 (
 echo.
 echo ERROR: Fallo npm ci. Verifica Python 3.12 y Visual Studio Build Tools C++.
 goto :error
)
call npm run ja:check
if errorlevel 1 goto :error
echo.
echo Dependencias preparadas. Para abrir, ejecuta 02_INICIAR_WINDOWS.cmd.
pause
exit /b 0
:error
echo.
echo Preparacion incompleta. No se ha confirmado que Electron funcione.
pause
exit /b 1
