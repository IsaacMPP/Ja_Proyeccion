# Continuidad — JA Proyección (preparación GitHub, 2026-10-24)

- Fuente: FreeShow 1.6.7. Base proporcionada por usuario.
- Estado anterior: fase 1. Problemas en Windows con node-gyp (sin Build Tools), OneDrive, instalador Electron incompleto; reparador V3 descargó Electron con SHA-256 correcto pero falló por comillas y revirtió su instalación. No se ha confirmado arranque.
- Nueva decisión del usuario: pasar al desarrollo con GitHub Actions. **No mezclar con `IsaacMPP/Prueba` (editor de video).**
- Proyecto local listo para nuevo repositorio `IsaacMPP/Ja_Proyeccion`, con `.github/workflows/compilar-windows.yml`, `04_SUBIR_A_GITHUB.cmd`, `GITHUB_INICIO.md`.
- Identidad de instalación: appId `org.japroyeccion.desktop`, productName `JA Proyección`; carpeta de documentos y descarga separadas, updater deshabilitado temporalmente y icono JA provisional.
- **No se ha creado un repositorio remoto ni ejecutado Actions desde este entorno**; GitHub connector no expone creación de repositorios. Usuario debe crear el repositorio vacío una vez y ejecutar el script de subida.
- El flujo intenta `npm ci`, `npm run ja:test`, `npm run build`, NSIS EXE y sube artifact (solo si funciona). Requiere revisar logs de la primera ejecución.
- Mantener GPL-3.0 y atribución de FreeShow.
- Pendientes funcionales principales: biblioteca por carpetas / búsqueda global, miniaturas de cantos, pistas de audio, vista previa privada, Biblia española y atajos.
