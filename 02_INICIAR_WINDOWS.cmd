@echo off
setlocal
cd /d "%~dp0"
if not exist "node_modules\electron" (
 echo Faltan dependencias. Ejecuta primero 01_PREPARAR_WINDOWS.cmd.
 pause
 exit /b 1
)
call npm run ja:check
if errorlevel 1 (
 echo La verificacion estructural fallo.
 pause
 exit /b 1
)
echo Iniciando la base FreeShow en modo desarrollo...
call npm start
if errorlevel 1 (
 echo Fallo el inicio; revisa los errores de consola.
 pause
 exit /b 1
)
pause
