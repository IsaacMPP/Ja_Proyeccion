# JA Proyección — Pantallas fáciles (primer entregable)

Objetivo: que cualquier operador pueda detectar las pantallas de Windows y enviar al
proyector el contenido que seleccionó, sin configurar manualmente coordenadas.

## Flujo de usuario
1. Conectar el proyector/TV mediante HDMI o DisplayPort.
2. En Windows, pulsar **Win + P → Extender**. JA Proyección no puede cambiar de forma
   segura ese modo por su cuenta; si Windows solo expone una pantalla, se informa.
3. Pulsar **Pantallas** en la cabecera de JA Proyección.
4. La aplicación consulta automáticamente la lista de monitores que detecta Electron.
   Muestra número, resolución y distingue claramente pantalla principal/externa.
5. Pulsar **Identificar pantallas** si se desconoce cuál es el proyector (se muestran
   números brevemente sobre cada pantalla).
6. En la pantalla externa elegida, pulsar **Usar como proyector**. La pantalla
   principal queda excluida de esta acción para proteger la consola del operador.
7. Al conectar o desconectar monitores, pulsar **Actualizar** para refrescar la lista.

La nueva guía se presenta sobre el selector técnico original. El selector de
posiciones, bloqueo, recorte y corrección queda en **Opciones avanzadas de pantalla**.

## Implementación
- Se amplía únicamente la respuesta existente `Main.GET_DISPLAYS` con el indicador
  `isPrimary` obtenido de `screen.getPrimaryDisplay()`.
- La guía utiliza las funciones de FreeShow `toggleOutputs`, `OUTPUT.CREATE`
  y `OUTPUT.UPDATE_BOUNDS`. No hay un motor de salida duplicado.
- Reutiliza una salida física del programa, sin modificar NDI, RTMP, WebRTC o Stage.
  Crea una salida física predeterminada solo si todavía no existe ninguna.
- No activa la proyección en la pantalla principal desde la acción simplificada.
- Si una salida tiene bloqueo o resolución forzada, remite a configuración avanzada
  en lugar de alterar esa configuración.

## Pruebas de aceptación en Windows (pendientes)
- Equipo con un monitor: guía indica conectar pantalla y activar Extender.
- Equipo con dos: selecciona externa aun si está físicamente a la izquierda.
- Equipo con tres: permite elegir cualquiera de las pantallas externas.
- Identificación numérica coincide con las tarjetas mostradas.
- Con el proyector configurado, iniciar video MP4 desde Multimedia y verificar que se
  muestre en la pantalla externa; el operador conserva el control en su monitor.
- Desconectar/conectar HDMI, pulsar Actualizar y volver a asignar.
- Probar salida bloqueada, salida desactivada, NDI existente y salidas múltiples.
- Confirmar controles avanzados y reproducción previa sin cambios.

La compilación automatizada valida código/pruebas; no demuestra la detección real
del monitor físico ni sustituye las pruebas con equipos de iglesia.
