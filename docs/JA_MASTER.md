# JA PROYECCIÓN — ARCHIVO MAESTRO DE CONTINUIDAD

> **DOCUMENTO CANÓNICO / FUENTE ÚNICA DE VERDAD.**
> Antes de continuar el desarrollo, abrir este archivo **directamente desde `main` en GitHub**, consultar el último commit y revisar las ejecuciones de GitHub Actions. No confiar en respuestas anteriores del chat ni en una copia antigua de este documento.
>
> **Última actualización de contenido:** 25 de octubre de 2026. **Versión del registro:** 1.7. **Responsable del alcance:** el usuario. **Estado global:** aplicación funcional en Windows y desarrollo activo, NO versión final.

**Enlace directo:** https://github.com/IsaacMPP/Ja_Proyeccion/blob/main/docs/JA_MASTER.md

---

## 0. Regla para comenzar en cualquier chat nuevo

1. Acceder al repositorio **`IsaacMPP/Ja_Proyeccion`**, rama **`main`**, y leer **todo este documento**.
2. Obtener el **HEAD real de `main`** y consultar las últimas **GitHub Actions**, su resultado, pruebas y artefactos. No inferir el estado solo por la fecha de este texto.
3. Leer las secciones **Estado confirmado**, **Pendientes**, **Próximo trabajo** y **Historial reciente**; buscar el código relevante del cambio propuesto.
4. Antes de modificar, comprobar que no exista una implementación previa y que el usuario esté solicitando efectivamente un cambio; las **preguntas y propuestas no autorizan implementaciones**.
5. Si se autoriza un cambio, trabajar en **este repositorio**, de forma modular, sin romper funciones estables. Subir un commit entendible, validar CI y actualizar este archivo en el mismo commit o en uno inmediatamente posterior.
6. Distinguir **código integrado**, **compilación exitosa** y **prueba real del usuario**. Son cosas distintas.
7. Si existe un fallo nuevo, identificar **causa raíz y logs** antes de aplicar cambios; no crear scripts de reparación innecesarios.

**No confundir con:** `IsaacMPP/Prueba` (editor de video JA Video Studio), que es OTRO proyecto y NO debe modificarse al trabajar en JA Proyección.

## 1. Identidad y objetivo

- **Nombre aprobado:** JA Proyección.
- **Repositorio principal:** https://github.com/IsaacMPP/Ja_Proyeccion
- **Rama principal:** `main`.
- **Origen:** FreeShow **1.6.7**, modificado y atribuido a ChurchApps. **Licencia GPL-3.0** (conservar `LICENSE`, créditos y obligaciones de redistribución).
- **Plataforma prioritaria:** Windows. Aplicación de escritorio con **Electron, Svelte y TypeScript**.
- **Compilación:** GitHub Actions; instalador de Windows generado con electron-builder/NSIS.
- **Objetivo funcional:** centro de proyección fácil para cultos adventistas y juveniles, con videoteca de himnos, cantos juveniles, clubes y especiales, audio, Biblia, temporizadores, vista previa y salidas de pantalla.
- **No es:** editor de video, transcriptor de letras, ni plataforma web de fotografía.

### Preferencias visuales y de uso (NO rehacer sin autorización)

- El usuario **aprueba la disposición original de FreeShow**: barra superior, panel de proyectos a la izquierda, área central, salida/vista previa a la derecha y pestañas Multimedia/Audio/Presentaciones abajo.
- Conservar posiciones, accesos y comportamiento; **personalizar la identidad, no reorganizar la aplicación**.
- Estilo ya implementado: **azul marino, dorado y blanco**, inspirado en el logo JA; botones dorados y paneles oscuros.
- **Logo:** solo el emblema **JA**, **sin “AOP”**. Debe conservar proporción, transparencia y nitidez. Se utiliza `public/ja-logo.png`; el icono de aplicación usa `public/icon.png`.
- La interfaz debe acercarse a la **maqueta aprobada por el usuario** (cabecera JA, bienvenida con fondo de congregación, galerías multimedia) sin incorporar videos/cantos ficticios.
- La interfaz debe ser sencilla para voluntarios sin conocimientos técnicos; los ajustes avanzados deben estar disponibles, pero separados del flujo normal.
- Evitar saturación visual, diálogos innecesarios y romper ajustes que el usuario ya personalizó.

## 2. Estado verificado al 25-oct-2026

### 2.1 Repositorio y compilación

- **Último commit funcional verificado antes de abrir este documento maestro:** `74709e042f871110e24591bbe83be0ba8114e1e4` — `fix(outputs): respect selected display and prevent fullscreen on operator laptop`.
- **Última CI verificada exitosa:** https://github.com/IsaacMPP/Ja_Proyeccion/actions/runs/40167451587
  - `verify-base.mjs`, `npm ci`, `npm run ja:test`, `npm run build`, electron-builder NSIS, carga del artefacto: **correctos**.
  - Artefacto: `JA-Proyeccion-Windows-pruebas`, de disponibilidad temporal (14 días configurados; el ZIP puede expirar).
- Identidad de empaquetado: `appId: org.japroyeccion.desktop`, `productName: JA Proyección`, en `config/building/electron-builder.yaml`.
- El `package.json` conserva **`name: freeshow` y `version: 1.6.7`** por herencia del proyecto; **NO cambiar a ciegas** sin sincronizar lockfile y dependencias. El instalador sí se presenta como JA Proyección.
- Publicación/actualización automática heredada de FreeShow deshabilitada: las versiones se prueban mediante Actions, no publicación automática.

### 2.2 Pruebas realizadas en Windows por el usuario

| Función | Estado | Evidencia / límite |
| --- | --- | --- |
| Abrir e instalar aplicación | **Confirmado por el usuario** | Mostró capturas de JA Proyección ejecutándose en Windows. |
| Interfaz JA azul/dorado y logo JA | **Confirmado visualmente** | Capturas reales; hubo correcciones de nitidez, recorte, pantalla de carga e icono. No dar por acreditadas todas las resoluciones y escalados. |
| Videoteca multimedia y reproducción de un MP4 | **Confirmado por el usuario** | Capturas de video `Prueba` en reproducción y controles; comprobó el funcionamiento general. |
| Vista previa y controles básicos multimedia | **Confirmado por el usuario en uso normal** | Mantener, sin reconstruir el reproductor. |
| Proyección en pantalla secundaria | **CONFIRMADO por el usuario: “ya quedó”** | Tras corrección de enrutamiento de monitor; antes abría ventana negra sobre laptop. |
| Detección de dos monitores en Windows | **Confirmado** | Captura de Windows en modo `Extender`; había monitores 1 y 2. |
| Asistente fácil de pantallas | **Código integrado y CI correcta** | Validación exhaustiva con 1, 2, 3 monitores y reconexiones aún pendiente. |
| AVI, MKV y códecs poco comunes | **Sin validación exhaustiva** | Que se reconozca la extensión NO garantiza que su códec reproduzca. |
| NDI / control desde celular / conexiones externas | **NO validados** | El usuario pidió explícitamente dejarlos **para el final**. |

**Importante:** La vista previa de **dos salidas** arriba a la derecha NO necesariamente equivale a dos monitores físicos; FreeShow permite configurar múltiples salidas lógicas. Se debe aclarar en una futura mejora de usabilidad, si aún confunde a operadores.

## 3. Funciones incorporadas y código clave

### 3.1 Biblioteca de videos de cantos (implementada)

**Decisión actual de alcance, modificable solo si el usuario lo pide:** los himnos/cantos son **ARCHIVOS DE VIDEO** existentes en carpetas de Windows (p. ej., **MP4, AVI, MKV**), NO letras TXT. El primer importador de letras TXT se canceló y su código se retiró.

- Añadir carpetas locales desde **Multimedia**, separando Himnario Adventista, Jóvenes, Conquistadores, Aventureros, Especiales u otras.
- Consultar **Esta carpeta** o **Todas las carpetas**, incluido contenido de subcarpetas dentro del límite actual (5 niveles).
- Búsqueda por título, acentos y número de himno, con ceros iniciales opcionales; filtro **Solo videos**.
- Indicar biblioteca de origen en búsqueda global. Trabajar **sin copiar ni editar los videos originales**.
- Miniaturas automáticas, reproducción, control y proyección heredados de FreeShow.
- Implementación: `src/frontend/components/drawer/media/Media.svelte`, `MediaCard.svelte`, `jaVideoLibrary.ts`, gestor `mediaFolders`.
- Más detalles: [JA_BIBLIOTECA_FASE2.md](JA_BIBLIOTECA_FASE2.md).

### 3.2 Identidad JA y ventana de carga (implementadas)

- Paleta en `src/frontend/components/settings/tabs/defaultThemes.ts` y `public/global.css`, con migración selectiva del tema default antiguo en `src/frontend/utils/updateSettings.ts`.
- Cabecera: `src/frontend/components/main/Top.svelte`.
- Bienvenida: `src/frontend/components/main/Splash.svelte`, recurso `public/ja-hero.jpg`.
- Ventana de carga: `public/loading.html`.
- Créditos: `src/frontend/components/main/popups/About.svelte`.
- Recursos: `public/ja-logo.png`, `public/icon.png` (sin AOP).
- Verificar visualmente cualquier cambio: antes hubo errores por textos recortados, logo de baja resolución y pruebas que apuntaban a nombres de archivos antiguos (`.svg`, `.webp`, `.png`).

### 3.3 Pantallas fáciles y enrutamiento (implementados)

- Detección: `Main.GET_DISPLAYS` en `src/electron/IPC/responsesMain.ts`, incluye identificación de principal mediante `screen.getPrimaryDisplay()`.
- Asistente: `src/frontend/components/settings/Screens.svelte` y reglas `displayGuide.ts`.
- Acceso **Pantallas** desde la barra superior, opción de **Identificar**, **Actualizar**, **Usar como proyector**, y apartado avanzado.
- Ruteo físico: `src/electron/output/helpers/displayRouting.ts` y `OutputVisibility.ts`.
- **Fallo solucionado:** se prioriza la pantalla elegida por su ID antes que las viejas coordenadas `(0,0)`. La ventana se posiciona antes de mostrarse para evitar que tape la laptop.
- Para proyectar en monitor externo: Windows debe estar en **Win+P → Extender**. No asumir que display[1] es necesariamente el externo ni que siempre está a la derecha.
- No cambiar por accidente NDI, escenario u otras salidas lógicas.
- Más detalles: [JA_PANTALLAS_FACILES.md](JA_PANTALLAS_FACILES.md).

### 3.4 Pruebas integradas

- `scripts/ja/*.test.mjs` (brand, videoteca, pantallas y regresión básica).
- `npm run ja:test` corre en GitHub Actions; **no sustituye pruebas reales en Windows**.
- `.github/workflows/compilar-windows.yml` es el workflow activo único; usa Node **24.16.0**, Python **3.12**, runner **windows-2022**, `npm ci`, `npm run build`, NSIS x64.

### 3.5 Portadas personalizadas de videos — implementación nueva

- **Autorización:** usuario pidió continuar con siguiente fase el 25-oct-2026.
- Tarjetas de videos locales ofrecen **Elegir portada** (JPG/PNG) y **Restaurar miniatura automática**.
- El video original **no se toca**; se copia solo la imagen de portada a `Config/JA-Video-Covers` en los datos de JA Proyección y se guarda el vínculo de ruta en el `MEDIA` persistente (`jaCoverPath`).
- Conserva vista previa y proyección reales del video, sin sustituir su flujo de reproducción.
- Implementación: `src/electron/data/jaVideoCovers.ts`, `src/frontend/components/drawer/media/MediaCard.svelte`, `src/types/{Main,IPC/Main}.ts`, IPC `responsesMain.ts`.
- Nueva documentación: [JA_PORTADAS_PERSONALIZADAS.md](JA_PORTADAS_PERSONALIZADAS.md); pruebas: `scripts/ja/video-covers.test.mjs`.
- **Estado:** código de portadas aprobado por GitHub Actions (run `40169389141`, éxito) y **validado por el usuario** el 25-oct-2026. Mantener cobertura de regresión.
- **Limitación:** asociación por ruta de video; mover o renombrar el archivo requiere reasignar portada. No se implementó editor de recorte ni sincronización entre dispositivos.

### 3.6 Biblioteca de audio y audición (implementación nueva — por validar)

- El usuario confirmó portadas y autorizó seguir el 25-oct-2026.
- Se conserva el reproductor, las listas y el mezclador de audio de FreeShow.
- Búsqueda de pistas por carpeta actual o **Todas las carpetas**, profundidad de hasta 5 niveles, coincidencia sin tildes, palabras no contiguas y numeración `001 = 1`.
- Resultados globales indican la biblioteca de origen cuando la ruta coincide.
- Cada pista cuenta con botón **Preescuchar** que abre un reproductor local independiente. El operador debe seleccionar explícitamente una salida física de sonido y `setSinkId` debe funcionar antes de reproducir; **no** se reproduce automáticamente en la salida predeterminada.
- No se conoce automáticamente si el dispositivo seleccionado es el mismo amplificador de la congregación. Debe **probarse con audífonos separados** para evitar que la audición se escuche en el culto.
- Código: `src/frontend/components/drawer/audio/{Audio.svelte,AudioFile.svelte,AudioAudition.svelte,jaAudioLibrary.ts}`.
- Pruebas `scripts/ja/audio-library.test.mjs`; guía `docs/JA_BIBLIOTECA_AUDIO.md`.
- **Estado confirmado:** GitHub Actions `40213108136` exitosa; el usuario confirmó «ya funciona el audio». **Precaución:** no hay confirmación específica de aislamiento por audífonos; verificar antes de usar en el culto. NDI y control desde celular continúan para el final.

### 3.7 Biblia en español: traducciones, diseño y flechas (CI correcta — prueba en Windows pendiente)

- Solicitud explícita del usuario después de confirmar que el audio funciona: **RVR1960, RVR1995, NVI y otras traducciones populares**, cambio rápido de versión, fondo de color o imagen, fuente, tamaño, alineación y navegación con flechas.
- **Catálogo** de RVR60, RVR95, NVI, NTV, NBLA, DHH, RV1909 en `jaSpanishBibles.ts`. Muestra qué ediciones están realmente instaladas, permite elegirlas y abre el importador existente para las ausentes.
- **No** se adjuntan textos completos protegidos al proyecto. RVR60, RVR95 y NVI requieren permisos de sus titulares para redistribución; RV1909 es de dominio público. Catálogo ≠ Biblia instalada. Se reutiliza importación local/API de FreeShow según sus propios permisos.
- **Estilo JA** en `ScriptureInfo.svelte` con plantilla independiente `ja_scripture_custom`: fuente (Arial/Montserrat/Inter/Tahoma/Verdana/Georgia), tamaño 30–160 px, alineación, color de texto, color de fondo e imagen de fondo; se guarda en las plantillas persistentes. No sobreescribir plantillas originales.
- **Flechas** normales izquierda/derecha dentro del módulo Biblia; no interceptar búsquedas, selects, botones, edición ni atajos con modificadores. Opción visible para activar/desactivar; conserva navegación previa Ctrl+flechas.
- Código: `src/frontend/components/drawer/bible/{Scripture.svelte,jaScriptureDesign.ts,jaSpanishBibles.ts}`, `src/frontend/components/drawer/info/ScriptureInfo.svelte`, `src/frontend/components/drawer/navigation/ScriptureTabs.svelte`.
- Guía `docs/JA_BIBLIA_ESPANOL.md` y pruebas `scripts/ja/spanish-bible.test.mjs`.
- **Estado al crear:** el primer intento de CI, run `40216920921`, **falló al compilar Svelte**: `ScriptureInfo.svelte` línea 293 tenía una aserción de tipo `as JAScriptureDesign["align"]` dentro del markup, no aceptada por el compilador. Las 38 pruebas anteriores sí habían pasado porque ninguna compilaba los componentes Svelte. Se corrigió moviendo el estrechamiento del tipo a `changeJAAlignment` dentro del script, se corrigió la detección de plantillas `scripture_2/3/4` y se añadió un test de compilación real `scripts/ja/scripture-svelte-compile.test.mjs`. **CI corregida y verificada exitosa:** run `40218691694`, commit `7d66e1ecdec121867a6b8d201855260c6328cebd`; pasó pruebas automatizadas, compilación, empaquetado NSIS y publicó artefacto `JA-Proyeccion-Windows-pruebas` (no expirado al revisar). Pendiente prueba con Biblia real en Windows. No afirmar que RVR60/95/NVI estén listas para proyectarse offline antes de licencia y datos correspondientes.

### 3.8 Reina-Valera 1909 empaquetada y disponible sin conexión — implementación nueva

- Autorización: usuario pidió explícitamente una Biblia completa **en español ya instalada**, sin el contenido inglés predeterminado, tras revisar repositorios con RVR1960/NVI protegidas.
- Se integra la edición **Reina-Valera 1909 de dominio público**, fuente oficial eBible.org (`spaRV1909_vpl.zip`) con SHA-256 fijado. **No se descargan RVR1960/RVR1995/NVI protegidas**.
- `scripts/ja/build_rv1909.py`: el workflow descarga exclusivamente durante la compilación, verifica integridad de ZIP, 66 libros, 1.189 capítulos y aproximadamente 31 mil versículos, y genera `public/ja-bibles/rv1909.fsb` (no se incorpora la Biblia como texto de código).
- `config/building/electron-builder.yaml` ya incluye `public/**`; el instalador lleva el texto para funcionar **sin Internet**. La lectura integrada por `Main.BIBLE` usa `app.getAppPath()` y `fs.readFileSync`.
- `registerJARV1909` en frontend registra la versión únicamente si el recurso dentro del instalador es válido; en primera incorporación la selecciona si no había selección o estaba una Biblia inglesa de ejemplo. Conserva otros libros y configuraciones.
- Se añadió prueba integral de empaquetado `scripts/ja/bundled-rv1909.test.mjs` y guía `docs/JA_BIBLIA_RV1909_INTEGRADA.md`.
- **Incidencia en CI inicial**: run `40221454883` detuvo el empaquetado al detectar SHA de ZIP diferente del registro del 7-ago-2026: el ZIP oficial de eBible.org devolvió `c901a31a89421eafa54e82a0a2ad94962c6889e3c5556c2a0834529789c4ac76` en GitHub Actions. Se actualizó el pin al valor realmente descargado desde la fuente oficial. El script **aún exige** 66 libros, 1.189 capítulos, volumen de versículos y contenido de referencia; NO se ignoran fallos de integridad.
- **Estado:** pendiente de nueva CI y validación de texto e instalador; después prueba real del usuario.

## 4. Próximas fases y prioridades ACTUALIZADAS

> Esta tabla **reemplaza las fases antiguas** descritas en `JA_RUTA_DESARROLLO.md`, que es un documento histórico y aún contiene el orden inicial ya superado.

| Prioridad | Trabajo | Estado real | Criterio mínimo para cerrar |
| --- | --- | --- | --- |
| 0 | Base, videoteca, marca y pantalla secundaria | **Integradas; validadas parcialmente en Windows** | Mantener como línea base; corregir regresiones, no rehacer módulos estables. |
| 1 — VALIDADA | Miniaturas/portadas personalizadas por video | **CI exitosa y el usuario confirmó «quedó súper bien»** | Escoger JPG/PNG, asociarla a cada archivo sin tocar original, conservarla al reiniciar, restaurar miniatura automática, mostrarla en biblioteca/búsqueda. |
| 2 — VALIDADA | Audio/pistas musicales | **CI exitosa y el usuario confirmó «ya funciona el audio»** (audición por audífonos aún requiere prueba específica) | Carpetas MP3/WAV, búsqueda, escucha previa, controles de volumen, pausa y avance; probar aislamiento de audio antes de declarar monitoreo privado. |
| **3 — EN DESARROLLO** | Biblia en español | **RV1909 completa y offline añadida al proceso de build; esperando nueva CI y prueba real. No se distribuyen textos protegidos.** | Importar traducción autorizada, buscar libro/capítulo/versículo, navegar con flechas, controlar cantidad de versículos y fondos. |
| 4 | Organización de un culto | **Propuesta aprobada como ruta, no implementada** | Preparar orden de videos, especiales, versículos y anuncios reutilizando proyectos de FreeShow. |
| 5 | Temporizadores y mejoras de operación | **Hay componentes heredados; falta adaptar/probar** | Cronómetro/reloj, cuentas regresivas, avisos y controles rápidos comprobados en salida real. |
| 6 | Auditoría de funciones avanzadas heredadas | **Dejar para el final (instrucción del usuario)** | NDI, control por celular, StageShow, OBS, OMT, cámaras y demás: inventario, configuración y pruebas independientes. |
| 7 | Estabilización/versión de distribución | **Pendiente** | Pruebas con distintos Windows/monitores/códecs, rendimiento, respaldos de datos y documentación GPL. |

**Próxima acción planificada:** validar en CI y Windows los controles de **Biblia en español** (cambio de ediciones ya instaladas, tipografía, tamaño, alineación, color/fondo y flechas). Gestionar derechos antes de integrar RVR60/RVR95/NVI completas.

### Aspectos que NO deben contarse como terminados

- Portadas personalizadas **validadas por el usuario** en Windows; conservar como función estable.
- Biblioteca de audio general **confirmada por el usuario** y compilada correctamente (run `40213108136`); la separación física de audio con audífonos y `setSinkId` sigue requiriendo verificación específica.
- Biblia en español: **catálogo y personalización integrados en código**; NO se han empaquetado ediciones completas RVR60/RVR95/NVI sin permiso; falta prueba en Windows y, para textos completos, autorización del titular.
- Control remoto por celular y NDI funcionando; existen bases heredadas pero faltan ensayos reales.
- Prueba de cada formato/códec, monitores 3+, reconexión HDMI, escalados de Windows.
- Instalador final firmado/distribuido estable; los EXE de Actions son **de prueba**.

## 5. Reglas de desarrollo y protección del proyecto

1. **No tocar `IsaacMPP/Prueba` ni otros proyectos.** Solo `IsaacMPP/Ja_Proyeccion`.
2. **No duplicar funciones que FreeShow ya ofrece:** reutilizar el motor de proyección, previews, audio, carpetas, plantillas y configuración.
3. **Nada de parches acumulativos** que dificulten mantenimiento. Si una solución requiere rehacer un módulo, identificar la causa raíz y refactorizar con cuidado, respetando la interfaz aprobada.
4. **No subir** `*.cmd` personales, `node_modules`, cachés, instaladores EXE, ZIP de builds, `dist`, registros, imágenes o videos personales. Mantener archivos originales indispensables del build; por ejemplo, el script heredado `compile.bat` forma parte del proyecto original y no se elimina arbitrariamente.
5. **GitHub Actions** es el procedimiento preferido para compilar; no pedir al usuario instalaciones complejas de Node/Electron en su computadora salvo necesidad expresa.
6. **No alterar rutas o archivos originales** de los himnos/vídeos. Las portadas personalizadas deberán guardarse en almacenamiento de JA Proyección, con relación segura a la ruta del video. Evitar duplicaciones innecesarias y definir comportamiento si se mueve el archivo.
7. **No desactivar ni sustituir el sistema de salidas** para implementar cambios cosméticos. Proteger los controles de la laptop frente a ventanas siempre encima.
8. **Respetar GPL-3.0** de FreeShow y derechos independientes de traducciones bíblicas, letras, música, imágenes y logos. No empaquetar contenido protegido sin permiso.
9. Conservar identidad de datos propia e independencia frente a FreeShow. Revisar `appId`, `productName`, perfiles y guardado antes de cualquier renombrado.
10. No comunicar como «terminado» algo que solo pasó pruebas estructurales. Registrar toda evidencia manual y de CI.

## 6. Problemas y lecciones aprendidas

- **Importador TXT:** malentendido de requerimientos; se retiró. Los cantos reales son videos. Confirmar el tipo de contenido antes de diseñar importadores.
- **Logo/UI:** hubo recurso recortado/borroso (logo con texto AOP) y splash con nombre truncado; hoy se utiliza JA sin AOP y carga responsiva. Mantener pruebas y recursos sincronizados.
- **CI en rojo por recursos:** el test esperaba una extensión anterior del logo. Corregido sin rehacer la app.
- **Pantalla secundaria:** inicialmente ventana negra encima del operador. Arreglado al asignar monitor por ID y posicionar antes de mostrar; el usuario confirmó que ya funciona.
- **Segunda vista negra** en el panel derecho: puede representar otra salida lógica inactiva, no necesariamente un monitor físico. Revisar salidas configuradas antes de concluir que hay otro fallo.
- **GitHub tiene runs antiguos fallidos:** no implican que `main` esté fallando; siempre verificar el último run ligado al commit actual.
- **Artefactos de Actions expiran:** no confundir la falta de un ZIP antiguo con un fallo del programa.

## 7. Mapa mínimo del repositorio

| Área | Archivo/directorio |
| --- | --- |
| Inicio y marca | `src/frontend/components/main/{Top,Splash}.svelte`, `public/loading.html`, `public/ja-logo.png`, `public/icon.png` |
| Tema | `src/frontend/components/settings/tabs/defaultThemes.ts`, `public/global.css` |
| Videoteca y portadas | `src/frontend/components/drawer/media/{Media.svelte,MediaCard.svelte,jaVideoLibrary.ts}`, `src/electron/data/jaVideoCovers.ts`, `docs/JA_PORTADAS_PERSONALIZADAS.md` |
| Previsualización/salidas | `src/frontend/components/output/preview/`, `src/frontend/components/helpers/output.ts` |
| Selector de pantalla | `src/frontend/components/settings/{Screens.svelte,displayGuide.ts}` |
| Salida Windows/Electron | `src/electron/output/helpers/{OutputVisibility.ts,displayRouting.ts}` |
| IPC monitores | `src/electron/IPC/responsesMain.ts` |
| Audio y audición | `src/frontend/components/drawer/audio/`, `src/frontend/audio/routing/`, `docs/JA_BIBLIOTECA_AUDIO.md` |
| Biblia española offline | `scripts/ja/build_rv1909.py`, `src/frontend/components/drawer/bible/jaBundledBible.ts`, `src/electron/IPC/responsesMain.ts`, `docs/JA_BIBLIA_RV1909_INTEGRADA.md` |
| Pruebas propias | `scripts/ja/` |
| CI | `.github/workflows/compilar-windows.yml` |
| Packaging Windows | `config/building/electron-builder.yaml` |
| Historial previo | `docs/JA_CONTINUIDAD.md`, `docs/JA_DECISIONES.md`, `docs/JA_RUTA_DESARROLLO.md` |

## 8. Protocolo OBLIGATORIO de actualización del maestro

**Después de cada cambio significativo, antes de cerrar la conversación:**

1. Anotar fecha, nuevo commit, rama y enlace a Actions.
2. Actualizar **qué cambió** y **qué función queda abierta**.
3. Registrar pruebas automáticas, compilación, instalador y pruebas reales **por separado**.
4. Cambiar estados de la tabla de prioridades solo cuando corresponda.
5. Registrar errores pendientes, riesgos, decisiones del usuario y próximo paso concreto.
6. No dejar referencias a rutas eliminadas ni funcionalidades canceladas.
7. Mantener **este archivo como fuente única de verdad**. Los otros documentos pueden profundizar o archivar decisiones, pero no deben contradecir su estado.
8. **Antes de cambiar una decisión importante** (interfaz, licencias, arquitectura, prioridad, alcance), consultarlo con el usuario.

### Bitácora resumida

| Fecha | Hito | Evidencia |
| --- | --- | --- |
| 2026-10-24 | Base FreeShow 1.6.7 adaptada a JA Proyección; repositorio e instalador CI | `IsaacMPP/Ja_Proyeccion` |
| 2026-10-25 | Biblioteca de videos por carpeta/global; importador TXT cancelado | `docs/JA_BIBLIOTECA_FASE2.md` |
| 2026-10-25 | Interfaz propia azul/dorado, emblema JA sin AOP, mejora de carga | `src/frontend/components/main/`, `public/` |
| 2026-10-25 | Asistente de pantallas y protección del monitor operador | `d909f78c` |
| 2026-10-25 | Corrección final de ruta de salida; usuario confirma proyector secundario | `74709e0`; CI `40167451587` **exitosa** |
| 2026-10-25 | Creación del documento maestro y establecimiento de protocolo de continuidad | **Este documento** |
| 2026-10-25 | Portadas personalizadas validadas en Windows por usuario («súper bien») | `6078eb9`, CI `40169389141` exitosa |
| 2026-10-25 | Audio general validado por usuario («ya funciona»), CI exitosa; audífonos por separado pendientes de ensayo | `a03635c`, Actions `40213108136` |
| 2026-10-25 | Biblia española: catálogo, estilo JA, navegación con flechas implementados; pendiente CI/licencias | `docs/JA_BIBLIA_ESPANOL.md` |
| 2026-10-25 | Falló CI Biblia `40216920921` en Svelte (TS aserción dentro de markup); corregido en `7d66e1e`. Nueva CI `40218691694` **exitosa**, instalador Windows publicado; prueba real de Biblia pendiente | `ScriptureInfo.svelte`, `scripts/ja/scripture-svelte-compile.test.mjs` |
| 2026-10-25 | Integración de RV1909 de dominio público dentro del instalador, 66 libros, sin conexión; pendiente CI y prueba física | `scripts/ja/build_rv1909.py`, `docs/JA_BIBLIA_RV1909_INTEGRADA.md` |

## 9. Texto para comenzar una conversación nueva

> **Continuamos el proyecto JA Proyección** en https://github.com/IsaacMPP/Ja_Proyeccion (rama main). **Antes de contestar o modificar nada, lee entero https://github.com/IsaacMPP/Ja_Proyeccion/blob/main/docs/JA_MASTER.md y verifica el HEAD y GitHub Actions actuales.** Respeta las decisiones, la distribución visual aprobada, los cambios funcionales, las pruebas pendientes y la prioridad de trabajo. No confundas este proyecto con IsaacMPP/Prueba. Explica primero el estado actual y el siguiente pendiente, y no modifiques código hasta que te lo pida. Al terminar cualquier implementación, actualiza el documento maestro y registra el commit/CI y el resultado.

---

**Regla central: GitHub y este archivo documentan dónde estamos; el estado verdadero se confirma en el código, las pruebas y lo que el usuario verifica en Windows.**
