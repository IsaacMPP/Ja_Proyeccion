# Auditoría técnica — Fase 1

**Fecha de revisión:** 24 de octubre de 2026.  
**Fuente:** ZIP `FreeShow-main.zip` aportado para este proyecto.  
**Versión declarada:** `freeshow@1.6.7`, `package.json`, sin repositorio `.git` en el ZIP.  
**Tecnologías:** Electron ^37.10.3, Svelte 3, TypeScript 4.9, Vite 4, Node >=22.12.0, npm lockfile v3.  
**Licencia:** GPL-3.0 (archivo `LICENSE` conservado).

## Resultado de la inspección del código

| Necesidad de la iglesia | Archivo o área identificada | Qué demuestra y qué falta |
|---|---|---|
| Biblioteca de cantos y búsqueda | `src/frontend/components/quicksearch/quicksearch.ts`, `src/frontend/components/drawer/navigation/ShowsTabs.svelte`, `src/types/Show.ts` | Existen modelos de presentaciones y búsqueda rápida; **no demuestra** búsqueda global y por carpeta específicamente diseñada para himnarios importados. |
| Carpetas multimedia | `src/frontend/components/drawer/navigation/MediaTabs.svelte`, `AudioTabs.svelte` | Existen carpetas separadas para medios y audio. Para canciones/himnos se necesita unificar en un catálogo visible con origen/carpeta. |
| Importadores | `src/frontend/components/main/popups/Import.svelte`, `src/frontend/converters/` | Se reconocen diversos formatos, pero se requiere definir importación masiva por carpeta, formatos iniciales, duplicados y metadatos. |
| Biblia | `src/frontend/components/drawer/bible/Scripture.svelte`, `src/frontend/converters/zefaniaBible.ts`, `osisBible.ts` | Existen vistas, conversores y navegación entre versículos. No incluye en esta entrega una traducción española validada/licenciada. |
| Atajos | `src/frontend/utils/shortcuts.ts`, `src/frontend/components/helpers/OutputHelper.ts` | Hay flechas de avance/retroceso y manejadores de Biblia; se debe auditar el foco de teclado para no alterar videos o campos de búsqueda por error. |
| Vista previa multimedia | `src/frontend/components/show/VideoShow.svelte`, `AudioPreview.svelte`, `src/frontend/components/output/preview/` | Componentes reales disponibles; se debe probar separación entre vista previa y señal enviada a público. |
| Controles de video | `src/frontend/components/output/tools/MediaControls.svelte` | Se observan pausa, avance/retroceso y control de tiempo en el código. |
| Audio a dispositivos | `src/frontend/audio/routing/audioRoutingManager.ts`, `src/types/AudioRouting.ts` | Arquitectura de ruteo identificada; **no equivale a validar** monitoreo privado separado del sonido del culto. |
| Miniaturas | `src/electron/data/thumbnails.ts` | Generación/caché de miniaturas de archivos de imagen y video. Asociar una portada personalizada a un canto exige ampliar el modelo de datos o crear una relación no destructiva. |
| Varias salidas | `src/electron/output/`, `src/frontend/components/settings/tabs/Outputs.svelte` | Existe infraestructura multi-salida; queda pendiente prueba física con diferentes monitores y resolución. |
| Temporizadores | `src/frontend/components/output/tools/TimerControls.svelte` | Componente base disponible. |

## Estado de verificación real

- [x] Archivo original presente y descomprimido.
- [x] Dependencias declaradas, Node mínimo, lockfile y licencia revisados.
- [x] Áreas principales y puntos de integración localizados.
- [x] Copia separada de trabajo creada; original permanece intacto.
- [x] Añadidos diagnóstico estático y pruebas sin dependencias.
- [x] Deshabilitada publicación heredada hacia identidad de FreeShow.
- [ ] `npm ci` completado — **intentado en modo offline, falló por `ENOTCACHED` (falta caché de dependencias; no es prueba de error del proyecto)**.
- [ ] `npm run build` completado — no acreditado.
- [ ] Inicio y funcionamiento de Electron — no acreditado.
- [ ] Salidas de proyección reales/HDMI — no probadas.
- [ ] Audio independiente en audífonos/altavoces — no probado.

**Importante:** un verificador estructural que devuelve OK no demuestra que la aplicación compile ni se ejecute. Se detectaron advertencias de `engines`: varias dependencias indirectas requieren Node `22.22.2+` o `24.15.0+`, mientras que el entorno de prueba tenía `22.16.0`. Para Windows se recomienda comenzar con Node `24.15+`, además de las herramientas C++/Python correspondientes.

## Riesgos y mitigación

1. **Identidad y datos:** `config/building/electron-builder.yaml` conserva `app.freeshow`/`FreeShow` y el `package.json` hereda el nombre original. Renombrar correctamente y aislar perfiles antes de construir un instalador para usuarios; no ejecutar publicación todavía.
2. **Dependencias nativas:** Electron, `better-sqlite3`, componentes de video/audio y algunos paquetes Git requieren preparación cuidadosa de Windows, Python y herramientas C++.
3. **Diferencia de licencias:** GPL-3.0 permite modificaciones y redistribución bajo sus condiciones. Letras, música, traducciones bíblicas, imágenes y tipografías pueden tener permisos separados.
4. **Contenido:** no distribuir textos protegidos de himnarios ni traducciones bíblicas sin permiso; crear importación desde archivos licenciados del propio usuario.
5. **Previsualización aislada:** revisar que play/pause/seek de la ventana de operador no produzca cambios involuntarios en pantallas en vivo; probar con dos salidas físicas.
6. **Atajos:** flechas dependen del contexto; si el usuario escribe en un campo de búsqueda, no deben avanzar la proyección.
7. **Archivos originales:** importación inicialmente de solo lectura con caché/índice propio, evitando mover, borrar o renombrar carpetas del operador.
8. **Fuente de interfaz:** en esta copia no se incluyen archivos de fuente del ZIP original; se usa `local("Arial")` como alternativa. Puede cambiar la composición visual.

## Criterios para cerrar fase 1

La parte **estructural y documental** de la fase queda preparada. El cierre técnico completo requiere ejecutar `npm ci`, `npm run build` y abrir la app en Windows en una máquina con los prerrequisitos. Hasta entonces, el estado honesto es **Fase 1 preparada; compilación y prueba funcional pendientes**.
