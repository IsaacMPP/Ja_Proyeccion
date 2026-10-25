# JA PROYECCIÓN — ARCHIVO MAESTRO DE CONTINUIDAD

> **DOCUMENTO CANÓNICO / FUENTE ÚNICA DE VERDAD.**
> Antes de continuar el desarrollo, abrir este archivo **directamente desde `main` en GitHub**, consultar el último commit y revisar las ejecuciones de GitHub Actions. No confiar en respuestas anteriores del chat ni en una copia antigua de este documento.
>
> **Última actualización de contenido:** 25 de octubre de 2026. **Versión del registro:** 1.0. **Responsable del alcance:** el usuario. **Estado global:** aplicación funcional en Windows y desarrollo activo, NO versión final.

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

## 4. Próximas fases y prioridades ACTUALIZADAS

> Esta tabla **reemplaza las fases antiguas** descritas en `JA_RUTA_DESARROLLO.md`, que es un documento histórico y aún contiene el orden inicial ya superado.

| Prioridad | Trabajo | Estado real | Criterio mínimo para cerrar |
| --- | --- | --- | --- |
| 0 | Base, videoteca, marca y pantalla secundaria | **Integradas; validadas parcialmente en Windows** | Mantener como línea base; corregir regresiones, no rehacer módulos estables. |
| **1 — SIGUIENTE** | **Miniaturas/portadas personalizadas por video** | **Pendiente de implementar** | Escoger JPG/PNG, asociarla a cada archivo sin tocar original, conservarla al reiniciar, restaurar miniatura automática, mostrarla en biblioteca/búsqueda. |
| 2 | Audio/pistas musicales | **Por ampliar** | Carpetas MP3/WAV, búsqueda, escucha previa, controles de volumen, pausa y avance; probar aislamiento de audio antes de declarar monitoreo privado. |
| 3 | Biblia en español | **Por implementar / validar licencia** | Importar traducción autorizada, buscar libro/capítulo/versículo, navegar con flechas, controlar cantidad de versículos y fondos. |
| 4 | Organización de un culto | **Propuesta aprobada como ruta, no implementada** | Preparar orden de videos, especiales, versículos y anuncios reutilizando proyectos de FreeShow. |
| 5 | Temporizadores y mejoras de operación | **Hay componentes heredados; falta adaptar/probar** | Cronómetro/reloj, cuentas regresivas, avisos y controles rápidos comprobados en salida real. |
| 6 | Auditoría de funciones avanzadas heredadas | **Dejar para el final (instrucción del usuario)** | NDI, control por celular, StageShow, OBS, OMT, cámaras y demás: inventario, configuración y pruebas independientes. |
| 7 | Estabilización/versión de distribución | **Pendiente** | Pruebas con distintos Windows/monitores/códecs, rendimiento, respaldos de datos y documentación GPL. |

**Próxima acción planificada:** plantear/implementar las **miniaturas personalizadas por video**, pero **esperar la autorización del usuario** si solo está preguntando por el estado o definiendo prioridades. Al retomarlo, primero auditar modelo de medios, persistencia y caché existentes.

### Aspectos que NO deben contarse como terminados

- Portadas personalizadas (solo están las automáticas).
- Biblioteca de audio específicamente adaptada a pistas musicales y monitoreo separado.
- Traducción bíblica en español empaquetada o importada con permiso.
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
| Videoteca | `src/frontend/components/drawer/media/Media.svelte`, `MediaCard.svelte`, `jaVideoLibrary.ts` |
| Previsualización/salidas | `src/frontend/components/output/preview/`, `src/frontend/components/helpers/output.ts` |
| Selector de pantalla | `src/frontend/components/settings/{Screens.svelte,displayGuide.ts}` |
| Salida Windows/Electron | `src/electron/output/helpers/{OutputVisibility.ts,displayRouting.ts}` |
| IPC monitores | `src/electron/IPC/responsesMain.ts` |
| Audio | `src/frontend/components/drawer/audio/`, `src/frontend/audio/routing/` |
| Biblia (heredada) | `src/frontend/components/drawer/bible/`, `src/frontend/converters/` |
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

## 9. Texto para comenzar una conversación nueva

> **Continuamos el proyecto JA Proyección** en https://github.com/IsaacMPP/Ja_Proyeccion (rama main). **Antes de contestar o modificar nada, lee entero https://github.com/IsaacMPP/Ja_Proyeccion/blob/main/docs/JA_MASTER.md y verifica el HEAD y GitHub Actions actuales.** Respeta las decisiones, la distribución visual aprobada, los cambios funcionales, las pruebas pendientes y la prioridad de trabajo. No confundas este proyecto con IsaacMPP/Prueba. Explica primero el estado actual y el siguiente pendiente, y no modifiques código hasta que te lo pida. Al terminar cualquier implementación, actualiza el documento maestro y registra el commit/CI y el resultado.

---

**Regla central: GitHub y este archivo documentan dónde estamos; el estado verdadero se confirma en el código, las pruebas y lo que el usuario verifica en Windows.**
