@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title JA Proyeccion - Subir a GitHub

echo ==================================================
echo  JA PROYECCION - SUBIR A GITHUB
 echo ==================================================
echo.
echo Repositorio vacio necesario: https://github.com/new
echo Propietario: IsaacMPP
 echo Nombre: JA-Proyeccion
 echo No marques README, .gitignore ni licencia en GitHub.
echo.
where git >nul 2>nul
if errorlevel 1 (
 echo ERROR: Git no esta instalado o no esta en PATH.
 goto :error
)
set "REMOTE=https://github.com/IsaacMPP/Ja_Proyeccion.git"
set /p "ACEPTO=Ya creaste el repositorio JA-Proyeccion? Escribe SI para continuar: "
if /i not "%ACEPTO%"=="SI" (
 echo Cancelado. No se hizo ningun cambio.
 pause
 exit /b 0
)
if not exist .git (
 call git init -b main
 if errorlevel 1 goto :error
)
for /f "delims=" %%u in ('git remote get-url origin 2^>nul') do set "ACTUAL=%%u"
if defined ACTUAL (
 if /i not "%ACTUAL%"=="%REMOTE%" (
  echo ERROR: Esta carpeta ya apunta a otro repositorio: %ACTUAL%
  echo No se cambiara ni sobrescribira otro repositorio.
  goto :error
 )
) else (
 call git remote add origin "%REMOTE%"
 if errorlevel 1 goto :error
)
call git add .
if errorlevel 1 goto :error
call git diff --cached --quiet
if errorlevel 1 (
 call git commit -m "Preparar JA Proyeccion para compilar Windows con GitHub Actions"
 if errorlevel 1 (
  echo.
  echo Si Git solicita identidad configura tu nombre y email, despues ejecuta este CMD otra vez.
  echo Ejemplos: git config --global user.name "Tu nombre"
  echo           git config --global user.email "tu-correo-de-GitHub"
  goto :error
 )
)
call git branch -M main
if errorlevel 1 goto :error
call git push -u origin main
if errorlevel 1 goto :error
 echo.
 echo EXITO: Codigo subido. Verifica el resultado de compilacion en:
 echo https://github.com/IsaacMPP/Ja_Proyeccion/actions
 echo IMPORTANTE: La compilacion NO esta comprobada hasta que Actions termine en verde.
pause
exit /b 0
:error
echo.
echo ERROR: La subida no se ha confirmado. Lee los mensajes anteriores.
echo Puedes ejecutar este mismo .cmd nuevamente tras corregirlo.
pause
exit /b 1
