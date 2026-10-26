# Auditoría integral de JA Proyección y aprovechamiento de FreeShow
Fecha: 25 de octubre de 2026 · Rama auditada: `feature/fase4-2-buscador-himnario` · Alcance: revisión estática de código y flujos, no prueba física multipantalla.

## Diagnóstico ejecutivo
JA Proyección conserva componentes avanzados de FreeShow. El mayor riesgo no es la falta absoluta de capacidades, sino la fragmentación de su acceso, configuraciones difíciles de descubrir, duplicación de controles y validaciones insuficientes. El principio rector será **usar el motor existente, añadir una capa de experiencia coherente y vincular cada opción visual con su efecto real**. Prohibido sustituir motores funcionales para una mejora cosmética.

### Hallazgo urgente: CI rojo antes de continuar
Las ejecuciones 40260351155 y 40260322719 fallaron en pruebas estructurales desactualizadas después de eliminar la botonera de audio duplicada de Himnario; se corrigió la prueba `scripts/ja/hymnal-audio-only.test.mjs` en 760cf60e. La compilación y pruebas del HEAD nuevo requieren verificación. No desplegar ni fusionar hasta CI verde.

## Inventario confirmado en código
| Área | Capacidad FreeShow ya presente | Estado JA / brecha | Acción |
|---|---|---|---|
| Monitores | `settings/Screens.svelte`, `displayGuide.ts`, detección/refresco de pantallas, asignación de salida física, opciones de avanzado | Hay UI avanzada, pero el operador no identifica fácilmente la salida; distinguir monitor físico, salida lógica y salida virtual | Asistente de identificación, nombres y estado de conexión; no inventar monitores |
| Salidas independientes | `helpers/output.ts`: `setOutput(type,data,...,outputId)`, `resolveOutputId(s)`, enabled/active/stage; `settings/tabs/Outputs.svelte` | Configuración existe pero enviar contenido desde biblioteca a una salida no es intuitivo; clic de tarjeta puede afectar salidas activas múltiples | Acción única «Enviar a…» con destinos elegibles y previsualización; respetar bindings, bloqueo y pantalla de control |
| Vista previa/salidas | `output/preview/MultiOutputs.svelte`, `PreviewOutput.svelte`, `output/tools/MediaControls.svelte` | Verificar que controles y estados coinciden con salidas reales | Probar 1,2,3 monitores, hotplug, proyección separada y desconexión |
| Menús | `context/contextMenus.ts`, `loadItems.ts`, `menuClick.ts`, `ContextMenu.svelte` | Menú multimedia contiene muchas acciones técnicas sin jerarquía orientada a culto | Agrupar Proyectar/Preparar/Administrar; submenú dinámico de destino; mejorar texto/espaciado sin bifurcar menú |
| Video | `media/video/videoPlayer.ts` con play/pause, mute por salida, tiempo, loop, sincronización; `output.ts` | JA añadió «Solo video», «Solo audio»; falta validación real para estilos y salida | Probar tres modos; no sincronización en caliente (descartada por usuario) |
| Audio | `audio/audioPlayer.ts`, `output/tools/Audio.svelte` con controles globales, mezcla y posición, `settings/tabs/AudioRouting.svelte` | Se añadieron y después retiraron controles duplicados en Himnario; falta auditar dispositivos, volumen y enrutamiento | Un único transporte de audio, opción detener, claridad de dispositivo/ruta y estados |
| Archivos y biblioteca | `settings/tabs/Files.svelte`; `jaLibraryDirectories.ts` y `jaDefaultLibraries.ts` | Carpetas JA automáticas; riesgo de origen no disponible, redundancia, rutas externas y favoritos globales | Administrador único de bibliotecas, reparar vínculo, mostrar faltantes, sin mover/copiar |
| Perfil/permisos | `settings/tabs/Profiles.svelte`; `utils/profile` | Puede simplificar perfiles de operador vs administrador, pero no asumir ausencia de controles | Proponer modos sencillos y mantener avanzados |
| Estilos/temas | `settings/tabs/Styles.svelte`, `Theme.svelte` | Capacidades ya abundantes y potencialmente difíciles de localizar | Ajustes esenciales por contenido, avanzados colapsados, cambios coherentes |
| Conectividad | `settings/tabs/Connection.svelte` y proveedores de contenido | Configuración separada; verificar estados y mensajes | Diagnóstico de conexión y fallos recuperables |
| Presentaciones/agenda | Proyectos, plantillas, calendario, funciones, editor y escenas de FreeShow; base JA Fase 4 | El operador debe preparar el culto y despachar elementos sin saltar entre módulos | Integrar programación sobre modelos nativos existentes, sin nuevo formato si no es necesario |

## Reorganización propuesta de trabajo — prioridad estricta
### P0 — Estabilizar línea de trabajo
1. CI verde para HEAD, corregir pruebas obsoletas, no solo fuentes; auditar fallos introducidos por Fase 4.2.
2. Validación Windows real: medios, caché, 613 MP4, controles globales, modo solo video, proyección separada; documentar resultados.
3. Congelar integración de PR #1–#6; ramas encadenadas, no fusionar fuera de orden. No fusionar sin aprobación del usuario.

### P1 — Configuración y operación de pantallas (siguiente gran entrega)
1. Inventariar qué detecta Windows y qué salidas configuradas define FreeShow. Mostrar «Detectada», «Asignada», «Activa», «Desconectada», «Virtual» de forma distinta.
2. Configuración: nombrar destinos, identificar con número en pantalla real, vincular al monitor físico, probar proyección sin interferencia, restaurar/sustituir cuando desaparece monitor.
3. Menú/contexto y acceso directo «Enviar a pantalla…» en videos, imágenes, himnos, Biblia, presentaciones. Solo destinos válidos; jamás enviar por defecto a todos al elegir uno. Comprobar bindings y bloqueos.
4. Pruebas obligatorias: 1, 2 y 3 pantallas; monitor de control excluido si no es salida; desconexión/reconexión; salida principal vs auxiliar.

### P2 — Configuraciones realmente funcionales
Crear matriz por ajuste: ID/store, ubicación visual, ámbito (global/proyecto/salida/archivo), valor predeterminado, efecto aplicable, persistencia, rollback, evidencia de prueba. Revisar audio/ruteo; bibliotecas; salidas; perfiles; fondos y versículos; atajos. Marcar controles inertes y duplicados antes de agregar opciones.

### P3 — UX integrada y operable en culto
Rediseñar menús usando el mismo sistema; acciones primarias claras, menús cortos, detalles avanzados bajo expansión. Búsqueda y nombres uniformes, indicadores de envío/estado por pantalla, retroalimentación si está bloqueada. Revisar flujo «preparar → previsualizar → enviar → recuperar». No agregar otra capa de controles que duplique la actual.

### P4 — Trabajo pastoral/organizador del culto
Continuar la Fase 4 (organizador) usando proyectos y salidas nativas. Vincular himnos, versículos, imágenes, anuncios y especiales a un orden; después valorar listas y automatizaciones. Centro universal más adelante, tras validar operativa multipantalla.

## Criterios de aceptación transversales
- Un control = una responsabilidad; configuración visible **produce** un efecto real y persiste según alcance.
- Pantallas mostradas corresponden a salidas realmente disponibles; distinguir salidas virtuales/streaming.
- Elegir pantalla B no altera pantalla A; audio independiente no corta Biblia/proyección.
- Sin doble procesamiento ni doble registro de miniaturas; colecciones separadas por propósito.
- Cambios de pantalla y ajustes fallidos recuperables sin cerrar el culto.
- CI con pruebas estructurales y funcionales; pruebas Windows para casos que CI no simula.
- Ninguna modificación a motores centrales o fusión a `main` sin necesidad demostrada.

## Decisiones y límites
- Se DESCARTA transición continua audio↔video sin reinicio por decisión del usuario.
- Mantener carpetas predeterminadas y vínculos externos; no duplicar Himnario en Multimedia.
- Esta auditoría es **estática**: no demuestra calidad de interacción de cada ajuste, detección real de hardware ni que todas las capacidades aquí inventariadas estén activadas por defecto. Eso requiere pruebas manuales y evidencias posteriores.
