# JA PROYECCIÓN — ARCHIVO MAESTRO DE CONTINUIDAD

> **DOCUMENTO CANÓNICO / FUENTE ÚNICA DE VERDAD.**
> Antes de continuar el desarrollo, abrir este archivo **directamente desde `main` en GitHub**, consultar el último commit y revisar las ejecuciones de GitHub Actions. No confiar en respuestas anteriores del chat ni en una copia antigua de este documento.
>
> **Última actualización de contenido:** 25 de octubre de 2026. **Revisión de continuidad tras verificación de GitHub:** 25-oct-2026. **Versión del registro:** 2.1. **Responsable del alcance:** el usuario. **Estado global:** aplicación funcional en Windows y desarrollo activo, NO versión final.

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

**Corte de continuidad de este chat (25-oct-2026):** el HEAD de `main` observado fue `d77387ff7dc019f1c3dd0876b5604a7672133e27` (`test(scripture): align navigation regression test with queued arrow handling`). La ejecución específica de ese commit [40229385282](https://github.com/IsaacMPP/Ja_Proyeccion/actions/runs/40229385282) estaba **en progreso** durante la revisión (ya verificó la generación de RV1909; faltaban pruebas/build). El intento previo [40228820831](https://github.com/IsaacMPP/Ja_Proyeccion/actions/runs/40228820831), commit `3021c51f33`, **falló en `Pruebas de estructura`** por una aserción antigua sobre las flechas; no se debe asumir que la corrección actual también falla, ni darla por exitosa sin leer Actions. La última compilación del instalador confirmada exitosa antes de esta nueva fase fue la RV1909 en [40226399698](https://github.com/IsaacMPP/Ja_Proyeccion/actions/runs/40226399698), commit `a18be441a6`. **Al comenzar otro chat, volver a verificar HEAD y runs, porque pueden haber cambiado.**

- **Último commit funcional verificado antes de abrir este documento maestro:** `74709e042f871110e24591bbe83be0ba8114e1e4` — `fix(outputs): respect selected display and prevent fullscreen on operator laptop`.
- **Última CI verificada exitosa:** https://github.com/IsaacMPP/Ja_Proyeccion/actions/runs/40167451587
  - `verify-base.mjs`, `npm ci`, `npm run ja:test`, `npm run build`, electron-builder NSIS, carga del artefacto: **correctos**.
  - Artefacto: `JA-Proyeccion-Windows-pruebas`, de disponibilidad temporal (14 días configurados; el ZIP puede expirar).
- Identidad de empaquetado: `appId: org.japroyeccion.desktop`, `productName: JA Proyección`, en `config/building/electron-builder.yaml`.
- El `package.json` conserva **`name: freeshow` y `version: 1.6.7`** por herencia del proyecto; **NO cambiar a ciegas** sin sincronizar lockfile y dependencias. El instalador sí se presenta como JA Proyección.
- Publicación/actualización automática heredada de FreeShow deshabilitada: las versiones se prueban mediante Actions, no publicación automática.

### 2.2 Pruebas realizadas en Windows por el usuario

**Nuevo reporte del usuario (captura real del 25-oct-2026):** RV1909 **sí se está mostrando en la aplicación en español** (captura: `2 Reyes 3:7`, fondo fotográfico), pero **la salida se queda fija tras avanzar los primeros dos versículos**; además **los cambios de imagen/color/fuente/tamaño/alineación no se reflejan inmediatamente hasta seleccionar otro versículo**, y **el panel de personalización resulta demasiado pequeño**. Estas observaciones tienen prioridad sobre el éxito de CI de versiones anteriores. La corrección de código para estos problemas está integrada pero **pendiente de aprobación por CI y nueva prueba del usuario**.

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
- **Segunda incidencia:** run `40222040901` descargó el ZIP verificado, pero el conversor no identificó Cantar de los Cantares (`SNG`). Se añadieron equivalencias de nombres/abreviaturas bíblicas y diagnóstico de prefijos desconocidos. El paso de generación RV1909 ahora corre **antes** de instalar Electron, para detectar diferencias de texto rápidamente sin gastar cinco minutos en dependencias.
- **Tercera incidencia:** run `40222693944` ejecutó el verificador al inicio, revelando con precisión las abreviaturas no reconocidas: `EZE`, `JOH`, `MAR`, `JAM`, `1JO`, `PHI`, `JOE`, `NAH`, `3JO`, `2JO`. Se corrigió la tabla de nombres con correspondencias verificadas por el diagnóstico (no hay cambios en el texto bíblico).
- **Estado:** integración RV1909 completa verificada por Actions **exitosa** [40226399698](https://github.com/IsaacMPP/Ja_Proyeccion/actions/runs/40226399698) (`a18be441`), con instalador generado. El usuario confirmó indirectamente la presencia y proyección de RV1909 mediante captura de `2 Reyes 3:7`; aún no hay confirmación de prueba sin Internet ni de todos los libros/capítulos en Windows. **No mezclar la versión compilada RV1909 con los arreglos más recientes de flechas y diseño, que están pendientes de CI/prueba.**

### 3.9 Corrección de navegación y diseño bíblico en vivo (25-oct-2026)

**Reporte real del usuario:** tras avanzar los primeros 2 versículos, la proyección quedaba fija; los cambios de fondo, color o letra solo se veían después de seleccionar otro versículo. Además, el panel era demasiado pequeño y la vista previa desplazaba los controles.

**Diagnóstico en código:**
- `Scripture.svelte` entregaba a `getVerses` `verseNumbers.map(Number)`. Un identificador de fragmento como `"3_2"` se convertía en `NaN`, interrumpiendo la actualización de la selección. Las flechas también usaban `setTimeout(playScripture)` sin esperar a que libro, capítulo y versículo terminaran de cargar.
- `ScriptureInfo.svelte` guardaba una plantilla pero nunca refrescaba por sí mismo la salida temporal `temp`; además, la vista previa estaba encima de los controles y los cambios de tamaño/color se aplicaban al soltar el deslizador o selector.
- `scripture.ts` dejaba la imagen de fondo anterior activa cuando se quitaba para seleccionar un color.

**Solución implementada (pendiente CI y prueba en Windows):**
- `jaVerseNavigation.ts` interpreta los IDs de subversos y pasa números base válidos al motor, preservando la selección visual completa.
- Flechas y botones usan una cola secuencial; se espera a terminar la carga antes de proyectar, sin `setTimeout` de carreras. En el mismo capítulo no se recarga todo el libro innecesariamente.
- Los cambios de estilo se ven en la proyección activa con `refreshLiveJAScripture`, agrupando movimientos continuos del control. Solo se interviene la salida bíblica, no otras presentaciones; se respeta la plantilla original.
- Al elegir color de fondo, se elimina la asociación con la imagen de fondo anterior, y solo se limpia el fondo de salida si era el previamente instalado por el módulo bíblico.
- Controles grandes y de una sola columna, primero el diseño, colores y fondo, después vista previa desplegable y opciones avanzadas; adaptación a panel estrecho. Si la salida tiene una plantilla especial, se dirige a una copia JA sin modificar la plantilla original.
- `scripts/ja/scripture-live-controls.test.mjs` añade pruebas de subversos, orden de navegación, controles inmediatos y sustitución segura del fondo.
- **Estado exacto de esta fase (handoff 25-oct-2026):** la implementación funcional se publicó en commit `3021c51f33` (`fix(scripture): reliable verse navigation and live accessible Bible styling`), con `jaVerseNavigation.ts`, cambios a `Scripture.svelte`, `ScriptureInfo.svelte`, `scripture.ts` y nueva prueba `scripts/ja/scripture-live-controls.test.mjs`. El run `40228820831` **falló en `ja:test`**: una prueba antigua `spanish-bible.test.mjs` esperaba `_moveSelection` llamado directamente desde el teclado; el nuevo flujo usa `navigateVerse` y espera la operación en cola. Se corrigió únicamente esa aserción en commit `d77387ff7d`. **La CI `40229385282` terminó EXITOSA** sobre `d77387ff7d`, confirmó pruebas, build e instalador Windows. Sigue pendiente la prueba real del usuario de avance y estilos inmediatos. No afirmar que la corrección de navegación y estilos esté validada hasta completar CI y ensayo físico. **La copia del archivo auxiliar que se redactó durante este chat no se publicó por separado: la versión canónica ya existe en GitHub y no debe duplicarse.**
- **Pruebas de aceptación pendientes:** avanzar al menos 10 versos con flechas y botones (incluidos versos largos y cambios de capítulo), retroceder, navegar rápidamente, cambiar fuente, tamaño, alineación, color e imagen sin seleccionar otro versículo, probar segundo monitor y reiniciar para verificar persistencia. No declararlo probado en pantalla real solo porque CI compile.

### 3.10 Fase 4 — Organizador de cultos (primer entregable de prueba)

- **Autorización:** usuario pidió continuar los pendientes y posteriormente «procede» para Fase 4.
- **Rama:** `feature/fase4-organizador-cultos`, basada en `main`. No fusionar sin verificar CI y uso real.
- Se auditó `src/frontend/components/show/{Projects.svelte,ProjectContentList.svelte,project.ts}` y `src/types/Projects.ts`; FreeShow ya ofrece proyectos, secciones, archivos multimedia, presentaciones y orden editable. No duplicar su sistema.
- Se añadió `jaCultoProject.ts`, que prepara un proyecto estándar con ocho secciones editables: bienvenida, canto de apertura, oración inicial, lectura bíblica, participaciones, tema, canto final y oración final. No crea vídeos ni versículos ficticios y no reemplaza proyectos previos.
- En el menú de nuevo proyecto de `Projects.svelte` se añadió «Culto JA — orden sugerido», conservando los accesos anteriores y reutilizando `history` + `openProject`. El usuario puede agregar posteriormente sus vídeos y lecturas a la lista.
- Pruebas estáticas de integración: `scripts/ja/culto-project.test.mjs`. CI Windows habilitada para esta rama a fin de compilar Electron/NSIS.
- **Sin validar todavía en Windows:** crear proyecto, editar nombre/secciones, agregar vídeo/lectura, reiniciar, avanzar en proyección y conservar datos. Registrar prueba real antes de declarar la fase terminada.
- La importación JSON personal fue validada por el usuario previamente, pero sus cambios siguen en PR #1 y rama separada; no se mezclan ni redistribuyen traducciones protegidas en este trabajo.
- RVR1995 y API bíblica quedaron pospuestas a petición del usuario.

### Ajuste visual solicitado en Windows — carpetas de biblioteca
- El usuario mostró la ruta `Documentos/JA Proyección` con solamente Audio, Bibles, Config, Imports y Shows, y precisó que las bibliotecas deben ser **carpetas físicas visibles** allí.
- Se añadió `src/electron/data/jaLibraryDirectories.ts` y creación idempotente al finalizar `setupStores`: `Himnario Adventista`, `Cantos Juveniles`, `Fondos Personalizados` y `Especiales`. `Bibles` existe previamente y sigue gestionada por el importador; no se duplica ni cambia de nombre. No mover, eliminar ni copiar archivos.
- Las carpetas aparecen tras ejecutar la nueva versión del programa y pueden vincularse desde Medios mediante las opciones de bibliotecas JA. La vinculación automática y búsqueda especializada del Himnario aún no están cerradas.
- Requiere CI Windows y confirmación de carpetas físicas visibles y persistentes en PC real. Prueba estática `scripts/ja/library-directories.test.mjs`.

### Fase 4.1 — Biblioteca central vinculada (25-oct-2026)

- **Autorización:** usuario aprobó el orden Fase 4.1–4.5 y pidió «procede».
- Rama `feature/fase4-1-biblioteca-central` (basada en rama de Fase 4, no fusionada a `main`).
- Primera entrega: categorías exclusivas de carpetas vinculadas para Himnario Adventista, Cantos juveniles, Fondos personalizados y Especiales/videos, desde el panel Medios. Los archivos se mantienen en su ubicación original; se reutilizan los registros persistentes `mediaFolders`, importación existente, navegación y motor de medios de FreeShow. Se conservan las carpetas generales sin categorizar.
- Nuevos archivos: `src/frontend/components/drawer/media/jaLibraryRoles.ts`. UI: `src/frontend/components/drawer/navigation/MediaTabs.svelte`.
- Alcance deliberado: no se crea copia de medios, no se instala material con derechos, no se altera `Archivos de programa`; aún no crea carpetas físicas, no incorpora biblias a esta estructura ni clasifica automáticamente videos por contenido. El himnario especializado con búsqueda por número/título y miniaturas se hará en Fase 4.2. El organizador y los espacios aislados corresponden a 4.3 y 4.4.
- **Aceptación pendiente:** CI Windows de rama, vincular carpetas separadas, comprobar persistencia tras reiniciar y proyección de video externo. No marcar terminado sin prueba real.

### Regresión de CI por pérdida de estilos — 25-oct-2026
- Los runs `40241776049`, `40241808241`, `40241829221` y `40241832154` fallaron en `scripts/ja/branding.test.mjs`: faltaba `border-radius: 7px` porque una sustitución de `MediaGrid.svelte` había eliminado todo el bloque `<style>`.
- Restaurado el CSS original completo sin revertir la virtualización: commit `76b53855`. Compilación `40242347542` iniciada, todavía requiere verificación final de CI.
- La prueba estática y la compilación no prueban ausencia de congelamientos ni portadas completas en PC: pendiente confirmar con los 613 videos del usuario. No fusionar antes de la validación.

### Separación definitiva de catálogos del Himnario y Multimedia — 25-oct-2026
- Petición del usuario: Multimedia → Todo y la búsqueda general no deben recorrer ni listar los ~613 MP4 del Himnario, que ya dispone de sección propia. La misma entrada «Vincular Himnario» debe gestionarse en Himnario, no duplicarse en Multimedia.
- `Media.svelte` ahora construye `multimediaFolderPaths` excluyendo el rol `hymnal` y utiliza ese conjunto al abrir Todo, buscar globalmente y restablecer la búsqueda. `MediaTabs.svelte` excluye los mismos registros de su navegación y contadores, y retira «Vincular Himnario» de los botones de bibliotecas JA.
- `HymnalTabs.svelte` mantiene la carpeta predeterminada y añade vinculación de carpetas externas mediante el flujo nativo de selector e historial. Las carpetas externas no se copian y no se registra dos veces una ruta ya vinculada; el motor y caché son compartidos.
- Pruebas estructurales actualizadas en `hymnal-dedicated-tab.test.mjs`. **Pendiente** CI Windows y prueba real: Multimedia → Todo sin himnos, búsqueda de Multimedia sin himnos, Himnario con 613 videos, vínculos externos y estabilidad de proyección. No fusionar borradores ni iniciar rediseño del centro antes de validar.
- Nota de diseño: los favoritos existentes se conservan globales por ahora; estudiar ámbito de favoritos por módulo separadamente, sin retirar a ciegas acceso a contenido marcado por el usuario.

### Evitar duplicación visual del Himnario — 25-oct-2026
- Usuario mostró captura donde Himnario aparecía como pestaña propia y también en «Bibliotecas JA» de Multimedia. Solicita evitar funciones y carpetas redundantes.
- `MediaTabs.svelte`: la navegación de Multimedia omite carpetas con rol `hymnal` de la sección «Bibliotecas JA». El registro, los MP4, el caché y la pestaña Himnario se conservan; no se borran ni duplican carpetas.
- Se mantiene la opción de gestión/vinculación de bibliotecas y «Todo» general para no romper búsqueda ni acceso técnico; revisar después, con pruebas reales, si «Todo» debe excluir también Himnario y cómo centralizar la vinculación en su pestaña sin duplicar controles.
- Prueba estructural de no duplicación añadida al test del Himnario. Pendiente CI Windows y validación del usuario. No fusionar hasta validar.

### Corrección de autovinculación de bibliotecas JA — 25-oct-2026
- Prueba del usuario: 613 MP4 ya están en `Documentos/JA Proyección/Himnario Adventista`, pero la nueva pestaña indicaba erróneamente «No hay una carpeta del Himnario vinculada». Causa: `ensureJALibraryDirectories()` creaba las carpetas físicas, pero la lista persistente `mediaFolders` nunca registraba esas rutas.
- Se añadió `jaDefaultLibraries.ts` con rutas correspondientes a `Himnario Adventista`, `Cantos Juveniles`, `Fondos Personalizados` y `Especiales`. Al disponer del directorio de datos, `Drawer.svelte` registra estas bibliotecas predeterminadas en `mediaFolders` sin copiar archivos, sin crear duplicados y sin borrar bibliotecas externas.
- Si la carpeta predeterminada ya aparece vinculada con otra etiqueta, se reutiliza ese registro y se le asigna el rol apropiado. La pestaña Himnario prioriza la carpeta predeterminada, conserva las bibliotecas externas como recursos adicionales y abre Multimedia para administrarlas.
- Prueba: `scripts/ja/default-libraries.test.mjs`; **pendiente** CI Windows y comprobar en el equipo del usuario: 613 MP4, búsquedas, miniaturas y el resto de carpetas incluso si están vacías. No modificar `main` antes de validar.
- Importante: esto cubre las cuatro bibliotecas multimedia JA; la Biblia se gestiona por su propio módulo de versiones y no debe tratarse como una carpeta de MP4. Audio y presentaciones poseen flujos propios: evaluar sus conexiones predeterminadas en su fase, sin cambiar el motor de FreeShow a ciegas.

### Orden de pestañas aprobado — 25-oct-2026
- El usuario autorizó aplicar de inmediato la organización funcional: **Proyectos → Himnario → Biblia → Multimedia → Audio → Superposiciones → Plantillas → Calendario → Funciones**.
- Se modificó únicamente el orden de `drawerTabs` en `src/frontend/values/tabs.ts`; se mantienen los mismos identificadores, componentes y permisos, sin cambios en el motor de salidas.
- Se añadió aserción de orden en `scripts/ja/hymnal-dedicated-tab.test.mjs`. Validar CI y después confirmar distribución visual en Windows.
- **Pendientes restantes 4.2:** prueba real de pestaña/buscador/caché/navegación, diseño e implementación por separado de audio-only de MP4 sin interferir con proyección multipantalla, regresión, orden de integración y cierre de PR. No comenzar rediseño del centro.

### Implementación de pestaña independiente Himnario — 25-oct-2026
- Autorización del usuario: «procede», para continuar en orden con la estructura definitiva del Himnario, antes del centro universal.
- En la misma rama del buscador (PR #6) se agregó pestaña visible **Himnario** a la navegación inferior; se abre la biblioteca asociada al rol `hymnal` reutilizando `Media.svelte`, `jaHymnal.ts`, el caché global, el buscador y los controles de proyección existentes. Se añade orientación cuando la biblioteca aún no está vinculada.
- Acceso a administración mediante Multimedia; se reutilizan las autorizaciones de Media y el panel informativo existente. **No** se reescribe el reproductor ni el motor multipantalla de FreeShow; no se modifica `main`.
- Test estructural `scripts/ja/hymnal-dedicated-tab.test.mjs`. **Pendiente:** CI Windows, probar clic en pestaña Himnario, 613 MP4, búsqueda por número/título, miniaturas tras cambio de pestaña, reproducción y proyección en distintas salidas, y manejo de biblioteca sin vincular.
- El futuro centro universal y las listas se mantienen fuera de esta entrega; la prioridad es estabilizar y validar Fase 4.2 antes de avanzar.

### Decisión de secuencia tras revisión de UX (25-oct-2026)
- El usuario validó el caché persistente y pidió **cerrar pendientes en orden** antes de rediseñar el centro. No iniciar aún el centro universal.
- Estado comprobado: CI del buscador #6, ejecuciones `40247531557` y `40247553565`, **success**. Compilación exitosa no equivale a prueba funcional en Windows.
- **Orden obligado Fase 4.2**: (1) estructura/pestaña definitiva del Himnario; (2) reutilizar y adaptar el buscador ya escrito en #6 a esa ubicación, sin duplicar controles; (3) verificar navegación, selección, vídeo/audio y el caché; (4) pruebas Windows y cierre de PR encadenados, sin fusionar prematuramente.
- **Pendiente posterior**: centro de trabajo universal con previsualización privada de videos, Biblia, diapositivas, imágenes y audio, controles contextuales, programas y listas; conservar las salidas independientes de FreeShow, pantallas de confianza y contenido simultáneo. Diseñar contra el motor existente, no imponer un editor nuevo ni romper el sistema multipantalla.
- No añadir funciones al centro hasta cerrar pendientes y revisar el alcance real de las demás fases.

### Mejorar visibilidad del buscador del Himnario — 25-oct-2026
- Tras prueba positiva del caché, se inició rama aislada `feature/fase4-2-buscador-himnario` basada en caché persistente.
- `Media.svelte`: campo de búsqueda por número/nombre claramente visible arriba del catálogo, con etiqueta, texto más legible, enfoque accesible y botón Limpiar; permanece visible durante el desplazamiento. Usa `searchValue` ya existente, sin introducir indexación ni filtrado nuevo, y no modifica la interfaz de otros medios.
- Validación pendiente: CI Windows y prueba real, incluida búsqueda numérica, por título, limpiar, y que la pantalla de proyección no se altere. Mantener PR en borrador.

### Validación del usuario — caché global de miniaturas (25-oct-2026)
- GitHub Actions `40246293775` (commit `5c0728bc`) terminó **success**.
- El usuario confirmó que instaló/probó la versión y dijo **«ya quedó, quedó bastante bien»**. Se considera validado el funcionamiento observado del caché en su equipo; no se generaliza todavía a todos los equipos de gama media.
- Se puede continuar con la mejora del buscador y la navegación del Himnario en una rama separada. No fusionar PR #5 y PR #4 sin revisión de la cadena de PRs.

### Fase 4.2 — caché persistente global de miniaturas (25-oct-2026)

- Usuario pidió miniaturas persistentes para **todos los videos**, no únicamente himnos, y autorizó implementarlas después de verificar el trabajo en curso.
- Las ejecuciones previas `40244753443`, `40244765544`, `40244790313` estaban en curso al comenzar esta mejora; el último ya se encontraba creando EXE. Para evitar cruces, se creó `feature/fase4-2-cache-persistente-global` basada en `feature/fase4-2-himnario` sin modificar ni fusionar `main`.
- El caché existente de FreeShow ya reutilizaba imágenes según la fecha de modificación y guardaba archivos en `AppData/media-cache`. No se sustituye el motor; se cambia la ubicación preferida a `<directorio de datos JA>/Cache/Miniaturas`, con persistencia entre cierres. Se recuperan archivos de la carpeta anterior bajo demanda, para no recapturar todos los videos tras una actualización.
- Se conserva fallback a caché persistente en AppData si la ubicación del usuario no es escribible. Continúa el límite de dos capturas simultáneas del cambio anterior. La carga visual de tarjetas sigue reutilizando el sistema de miniaturas de FreeShow.
- Prueba automatizada: `scripts/ja/persistent-thumbnail-cache.test.mjs`; falta compilación Windows, verificar uso real con cientos de videos, reincidencia de caché al reiniciar y que una actualización de MP4 regenere solo su miniatura.
- El trabajo no es un proxy de video: son imágenes PNG de previsualización (no reproducción). Futuras mejoras de JPG compacto / prioridad de elementos visibles requieren medición antes de alterar el motor.

### Causa raíz adicional del bloqueo de miniaturas (25-oct-2026)

- Usuario confirmó que el scroll mejora algo, pero el Himnario de 613 videos todavía muestra tarjetas vacías y se congela en Ryzen 9.
- Auditoría de `src/electron/data/thumbnails.ts`: el sistema original tenía su guardia `working` desactivada, por lo que `addToGenerateQueue` lanzaba capturas simultáneas sin límite práctico; también tenía un tope de 20 capturas en Canvas. Esto puede saturar CPU/GPU y renderizador.
- Se introdujo cola con **máximo dos capturas activas**, prevención de entradas repetidas y liberación de cupos por identificador al finalizar. Se eliminó `currentlyGenerating.clear()` global cuando terminaba una captura, para no liberar solicitudes todavía activas.
- Prueba automatizada `scripts/ja/thumbnail-queue.test.mjs`. Pendiente CI Windows y prueba real en biblioteca de 613 himnos; especialmente primera generación, scroll rápido, vuelta atrás, caché tras reiniciar y que la proyección no se bloquee.
- Si todavía hay atasco: revisar tiempos de espera de solicitudes/IPC y generación inicial gradual priorizada. No declarar resuelto sin prueba del usuario.

### Incidente rendimiento Himnario (25-oct-2026)
- Usuario observó con 613 MP4 que las miniaturas tardan en aparecer y la interfaz se congela al hacer scroll; se ve panel vacío. No cerrar Fase 4.2 sin ensayo real.
- Investigación en `MediaGrid.svelte`: la animación `lazyLoader` por cada tarjeta dependía de frames y podía quedar atrás al desplazar rápidamente; reemplazada por ventana directa de tarjetas visibles + margen. `Media.svelte` recalculaba `mediaFilesOnly.map(...)` para cada tarjeta y remontaba toda la cuadrícula con `{#key searchedFiles}`; ahora memoriza la lista derivada y mantiene instancias. Test estático `media-grid-performance.test.mjs`.
- PENDIENTE: verificar compilación Windows y desplazamiento con 613 himnos; revisar caché/thumbnails fallidos si persiste. No se declara resuelto sólo con CI.

### Fase 4.2 — Himnario Adventista, primera integración (25-oct-2026)

- El usuario confirmó la creación física de las carpetas de biblioteca en Windows («ya está») y autorizó continuar.
- Rama: `feature/fase4-2-himnario`, derivada de la Fase 4.1. `main` no se modifica.
- `src/frontend/components/drawer/media/jaHymnal.ts` reconoce archivos numerados como `385 Hablando con Jesus.mp4`, extrae número/título, busca número exacto y nombre sin acentos y ordena numéricamente.
- Al seleccionar una carpeta vinculada con `jaLibraryRole: "hymnal"`, `Media.svelte` activa búsqueda exclusiva, no permite buscar otras carpetas desde esa vista y presenta únicamente videos MP4 con número y título válido; reutiliza las tarjetas, miniaturas, vista previa, proyección y añadir a proyecto de FreeShow.
- La carpeta física `Documentos/JA Proyección/Himnario Adventista` debe vincularse una vez desde Medios → Vincular biblioteca JA → Himnario Adventista; en esta entrega no existe registro automático al iniciarse. Evitar afirmar lo contrario.
- Prueba estática: `scripts/ja/hymnal-library.test.mjs`. Falta CI y comprobación real en Windows con videos del usuario; miniaturas se heredan del motor existente, verificar generación/caché real y navegación.
- Pendientes de esta fase: vinculación automática (sin duplicados), controles de lista dedicados si el usuario los prefiere, duplicados/ausentes, manejo de nombre sin título y rendimiento con muchos MP4. No declarar la fase completa antes de cerrar esos puntos.

## 4. Próximas fases y prioridades ACTUALIZADAS

> Esta tabla **reemplaza las fases antiguas** descritas en `JA_RUTA_DESARROLLO.md`, que es un documento histórico y aún contiene el orden inicial ya superado.

| Prioridad | Trabajo | Estado real | Criterio mínimo para cerrar |
| --- | --- | --- | --- |
| 0 | Base, videoteca, marca y pantalla secundaria | **Integradas; validadas parcialmente en Windows** | Mantener como línea base; corregir regresiones, no rehacer módulos estables. |
| 1 — VALIDADA | Miniaturas/portadas personalizadas por video | **CI exitosa y el usuario confirmó «quedó súper bien»** | Escoger JPG/PNG, asociarla a cada archivo sin tocar original, conservarla al reiniciar, restaurar miniatura automática, mostrarla en biblioteca/búsqueda. |
| 2 — VALIDADA | Audio/pistas musicales | **CI exitosa y el usuario confirmó «ya funciona el audio»** (audición por audífonos aún requiere prueba específica) | Carpetas MP3/WAV, búsqueda, escucha previa, controles de volumen, pausa y avance; probar aislamiento de audio antes de declarar monitoreo privado. |
| **3 — EN DESARROLLO** | Biblia en español | **RV1909 offline y correcciones de navegación/diseño integradas; CI `40229385282` exitosa sobre `d77387ff`; prueba real del usuario aún pendiente.** | Importar traducción autorizada, buscar libro/capítulo/versículo, navegar con flechas, controlar cantidad de versículos y fondos. |
| 4 | Organización de un culto | **Propuesta aprobada como ruta, no implementada** | Preparar orden de videos, especiales, versículos y anuncios reutilizando proyectos de FreeShow. |
| 5 | Temporizadores y mejoras de operación | **Hay componentes heredados; falta adaptar/probar** | Cronómetro/reloj, cuentas regresivas, avisos y controles rápidos comprobados en salida real. |
| 6 | Auditoría de funciones avanzadas heredadas | **Dejar para el final (instrucción del usuario)** | NDI, control por celular, StageShow, OBS, OMT, cámaras y demás: inventario, configuración y pruebas independientes. |
| 7 | Estabilización/versión de distribución | **Pendiente** | Pruebas con distintos Windows/monitores/códecs, rendimiento, respaldos de datos y documentación GPL. |

**Próxima acción obligatoria:** (1) verificar HEAD y ejecuciones posteriores a la última CI de código exitosa `40229385282`; si hay fallo, leer logs y arreglar raíz sin parches redundantes; (2) pedir al usuario prueba en su Windows: 10-15 versículos sucesivos, retrocesos, fragmentos largos, límites de capítulo, personalización INMEDIATA mientras se proyecta y panel cómodo a tamaño de ventana real; (3) registrar resultados en este maestro. **No empezar organizador de cultos ni otra fase hasta cerrar estos dos errores.** RVR60/RVR95/NVI completas requieren permisos.

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

### Incidente técnico de RV1909 (25-oct-2026)

- El commit `6c7ac114` generó correctamente los 66 libros y pasó 42 pruebas, pero **falló el compilador Electron/TypeScript** en `src/electron/IPC/responsesMain.ts(91,29)`: `JSON.parse` devolvía `any[]` y el contrato `Main.BIBLE` requiere una tupla `[string, Bible]`.
- Solución: validar que el JSON sea una matriz de exactamente 2 elementos con el ID correcto y 66 libros y **solo entonces** convertir a la tupla tipada. No cambiar los textos bíblicos.
- Se registrará la Biblia empaquetada cuando el usuario abra el panel Biblia para no depender de un perfil nuevo; no se duplican versiones ya registradas.
- **Actualización:** Actions `40226399698` ya generó EXE correctamente y una captura demuestra RV1909 visible y proyectada; falta prueba explícita de lectura sin red de Juan 3/Salmo 23 y la aceptación de la corrección posterior de navegación/estilos.

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
| 2026-10-25 | Nueva implementación para corregir avance de subversos, navegación serializada, estilos en vivo y panel bíblico accesible; `40228820831` falló en test antiguo, test alineado en `d77387f`; `40229385282` exitosa y artefacto generado; usuario aún no validó | `3021c51f33`, `d77387ff7d`; `scripts/ja/scripture-live-controls.test.mjs` |
| 2026-10-25 | Integración RV1909 de dominio público; compilación TS corregida al declarar tupla validada [ID, Bible] y registro al abrir Biblia; pendiente CI y prueba física | `scripts/ja/build_rv1909.py`, `docs/JA_BIBLIA_RV1909_INTEGRADA.md` |

## 8.1 Entrega al siguiente chat — NO PERDER ESTE CONTEXTO

- **Problema A, reportado por el usuario:** al pasar de los primeros dos versículos, la imagen de proyección quedaba atascada en el último; revisar rutas de subverso, carga asíncrona y carreras de teclas.
- **Problema B:** cambio de fondo, fuente, color, tamaño o alineación solo se veía al cambiar versículo; debe reaccionar en la salida REAL y la vista previa, mientras la Biblia está proyectándose; respetar imágenes y medios externos.
- **Problema C (usabilidad):** la sección de ajustes de Biblia es muy estrecha en la ventana real; agrandar controles y distribuirlos con prioridad para operadores no técnicos, sin rediseñar la disposición general de FreeShow.
- **Código para revisar antes de modificar:** `src/frontend/components/drawer/bible/{Scripture.svelte,scripture.ts,jaVerseNavigation.ts,jaScriptureDesign.ts}`, `src/frontend/components/drawer/info/ScriptureInfo.svelte`, `scripts/ja/{scripture-live-controls.test.mjs,spanish-bible.test.mjs,scripture-svelte-compile.test.mjs}`.
- **Acción inicial obligatoria:** leer últimos commits, CI y este maestro; el intento de arreglo ya **existe** en `main`. Evaluarlo y corregir lo que falle; **no volver a implementar desde cero sin necesidad**.
- **CI funcional confirmada:** `40229385282` sobre `d77387ff7d`, EXITOSA. **Último commit de documentación:** `d5376ce9` en `main`. Su ejecución `40229915007` estaba EN CURSO durante la revisión; no confundirla con fallo funcional. Un commit **solo de documentación** al actualizar este maestro puede activar otra compilación automática: distinguir ese run de la compilación del código funcional.
- **Criterio de cierre:** pruebas de regresión + compilación Windows/NSIS + confirmación real del usuario en su monitor/proyector, incluyendo navegación repetida y cambios de diseño inmediatos. No declarar solucionado solo por GitHub verde.

## 8.2 Corte de continuidad verificado — 25 de octubre de 2026

**Repositorio:** `IsaacMPP/Ja_Proyeccion`. **Rama remota única observada:** `main` (no se publicó otra rama de trabajo). **HEAD antes de este nuevo registro:** `d5376ce9b568b6a01afd066af118fe78777cfccd` (`docs: record Bible live-preview regression, CI state and next-chat handoff`; solo documentación).

**Estado de GitHub Actions comprobado:**
- `40229385282`, commit `d77387ff7dc019f1c3dd0876b5604a7672133e27`, **success** (última ejecución de código funcional).
- `40228820831`, commit `3021c51f33328ffd54c08364d27dfd39c42e5f3e`, **failure** por aserción anterior de navegación; corregida en `d77387ff`.
- `40226399698`, commit `a18be441a6e093559c0ae7dea31b2a18ac0d81e5`, **success**, edición RV1909 offline empaquetada.
- `40229915007`, commit `d5376ce9b568b6a01afd066af118fe78777cfccd`, **in_progress** en instalación de dependencias al momento de esta revisión; es un commit de **solo documentación**, no una implementación adicional. Consultar nuevamente al entrar al próximo chat.
- **Al subir esta actualización del maestro puede iniciarse una nueva ejecución automática de CI de solo documentación.** Evitar interpretarla como cambio funcional.

**Último problema funcional pendiente:** validar con el usuario la corrección de navegación de subversos y los cambios inmediatos de diseño de la Biblia en pantalla secundaria. El usuario reportó inicialmente que después de dos versículos los demás no cambiaban y que el fondo, fuente, alineación y colores solo se aplicaban después de seleccionar otro versículo. La CI exitosa **no sustituye** esta prueba física. Revisar `Scripture.svelte`, `ScriptureInfo.svelte`, `scripture.ts`, `jaVerseNavigation.ts` y tests `scripts/ja/scripture-*.test.mjs`.

**Instrucción de continuación:** no duplicar ni reescribir el módulo ya corregido; primero verificar HEAD/CI, abrir compilación válida, probar secuencia de 10–15 versículos y ajustes en vivo, documentar resultados y solo entonces avanzar al organizador de cultos. No incluir RVR1960/RVR1995/NVI completas sin permisos de distribución.

## 9. Texto para comenzar una conversación nueva

> **Continuamos el proyecto JA Proyección** en https://github.com/IsaacMPP/Ja_Proyeccion (rama main). **Antes de contestar o modificar nada, lee entero https://github.com/IsaacMPP/Ja_Proyeccion/blob/main/docs/JA_MASTER.md y verifica el HEAD y GitHub Actions actuales.** Respeta las decisiones, la distribución visual aprobada, los cambios funcionales, las pruebas pendientes y la prioridad de trabajo. No confundas este proyecto con IsaacMPP/Prueba. Explica primero el estado actual y el siguiente pendiente, y no modifiques código hasta que te lo pida. Al terminar cualquier implementación, actualiza el documento maestro y registra el commit/CI y el resultado.

---

**Regla central: GitHub y este archivo documentan dónde estamos; el estado verdadero se confirma en el código, las pruebas y lo que el usuario verifica en Windows.**
