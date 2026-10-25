# JA Proyección — Base de desarrollo, fase 1

**Estado actual:** copia de trabajo preparada y auditada estructuralmente. **No es todavía una aplicación adventista terminada ni un instalador.** La interfaz ejecutable sigue siendo la de FreeShow 1.6.7 hasta las siguientes fases.

## En Windows

1. Descomprime el proyecto en una ruta local, por ejemplo `C:\JA-Proyeccion`, fuera de OneDrive.
2. Instala preferentemente **Node.js 24.15 o superior** (aunque la base original declara mínimo 22.12, varias dependencias del lockfile requieren `22.22.2+` o `24.15+`). Para compilar módulos nativos, FreeShow recomienda Python 3.12 y Visual Studio con desarrollo de escritorio C++ y Windows SDK.
3. Ejecuta `01_PREPARAR_WINDOWS.cmd`, que revisa requisitos e intenta instalar dependencias con `npm ci`.
4. Si la preparación termina correctamente, ejecuta `02_INICIAR_WINDOWS.cmd`.

**No instales una distribución creada con el identificador actual:** los archivos de empaquetado todavía conservan `app.freeshow` y `FreeShow`. Se bloqueó la publicación automática heredada para evitar lanzar por error una versión con esa identidad. El cambio de identidad e instalador se hará en una fase independiente, antes de distribuir.

## Comandos de diagnóstico (en cualquier sistema con Node.js)

- `npm run ja:check` — valida estructura, versión, licencia y coherencia del lockfile (sin instalar nada).
- `npm run ja:env` — informa requisitos y versiones del equipo.
- `npm run ja:test` — pruebas estáticas de la base.
- `npm ci` — instala dependencias (requiere conexión, compiladores y herramientas nativas según sistema).
- `npm run build` — compila FreeShow, una vez instaladas las dependencias y herramientas.

## Documentación

- `docs/JA_AUDITORIA_FASE1.md` — resultados comprobados y riesgos.
- `docs/JA_RUTA_DESARROLLO.md` — requisitos y entregas por fases.
- `docs/JA_CONTINUIDAD.md` — estado verificable para continuar en otra conversación.
- `docs/JA_DECISIONES.md` — decisiones de alcance y pendientes.

## Precauciones

- Este repositorio derivado conserva la licencia GPL-3.0 y el archivo LICENSE de FreeShow. Mantener el aviso de atribución a ChurchApps y cumplir la distribución de fuentes al repartir binarios.
- No se agregan himnarios, pistas, letras ni traducciones bíblicas bajo derechos de autor hasta contar con permisos adecuados.
- En esta copia para compartir no se redistribuyen los archivos binarios de fuentes del paquete original; se usa una fuente disponible localmente como sustituta en el CSS. El aspecto tipográfico puede diferir.
- No se copian configuraciones ni carpetas de datos del usuario de FreeShow. No se ha abierto Electron aquí.
