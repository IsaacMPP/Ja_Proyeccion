# JA Proyección — Biblioteca de audio para cultos (primera implementación)

## Propósito
Organizar pistas musicales y canciones en formato **MP3/WAV** (también otros formatos
aceptados por el reproductor de FreeShow), por carpetas locales que el usuario añade
a la aplicación. No se copian ni modifican los archivos de audio originales.

## Nuevas funciones
- En la pestaña **Audio**, cuando se abre una biblioteca, aparece **Buscar en:
  Esta carpeta / Todas las carpetas**.
- La búsqueda global recorre hasta **5 niveles** de las carpetas registradas
  cuando hay un término, sin importar que el audio se encuentre en una subcarpeta.
- Búsqueda que ignora mayúsculas, tildes y ceros iniciales del número (por ejemplo,
  `1` encuentra `001 - Pista de entrada.mp3`).
- Muestra la biblioteca de origen en los resultados globales, útil cuando hay
  nombres de pistas repetidos.
- Las tarjetas siguen usando el reproductor **AudioPlayer** y las listas existentes
  de FreeShow (reproducción, pausa, efectos, playlists, mezclador).
- Botón **Preescuchar** por pista. Aparece un panel independiente con selección
  explícita de **audífonos/salida de audio**, pausa, volumen, avance y detención.
  No se usa el mezclador principal para esta audición.

## Protección para cultos en vivo
- La escucha previa **no reproduce hasta elegir un dispositivo de audio**.
- Aplica `HTMLMediaElement.setSinkId` antes de iniciar la reproducción.
- Si Windows/Chromium no soportan ese enrutamiento, muestra un error y NO
  reproduce la pista por los altavoces predeterminados.
- Es responsabilidad del operador seleccionar una salida física que NO esté
  conectada a los altavoces del culto. Si elige el mismo dispositivo usado por
  la sala, también podría oírse allí: no hay autodetección de cableado físico.
- La audición no cambia el volumen global ni la reproducción del servicio.

## Alcance y límites
- Se respetan las playlists, carpetas, selección, controles de efectos y
  proyectos preexistentes; no se elimina ni sustituye la lógica de FreeShow.
- La búsqueda profunda puede tardar al primer intento en bibliotecas grandes;
  se solicita solo al buscar, no durante cada tecla cuando ya está cargada.
- No se integra todavía un selector de dispositivo permanente o mezclador dedicado
  para todos los canales: la salida de audición se elige por sesión.
- La compatibilidad depende del códec y del soporte de audio de Windows/Electron.
- No es edición de audio ni separación automática de voz/instrumentos.

## Pruebas requeridas en Windows
1. Añadir carpetas **Pistas / Jóvenes / Especiales** y archivos MP3/WAV reales.
2. Encontrar una pista por título o por número en la carpeta y globalmente.
3. Verificar que dos pistas del mismo nombre en carpetas distintas conserven
   rutas independientes y etiquetas correctas.
4. Reproducir, pausar y detener una pista usando los controles heredados;
   comprobar que el sonido de culto permanezca estable.
5. Conectar **audífonos por USB** u otro dispositivo distinto de la salida de
   sonido del culto. Abrir **Preescuchar**, elegir ese dispositivo y reproducir.
6. Probar el comportamiento SIN dispositivo adicional: no debe emitir audio
   accidentalmente en la salida predeterminada.
7. Cerrar audición, cambiar canción y volver a abrir; comprobar que no
   quedan pistas reproduciéndose.
8. Verificar listas, efectos, dos monitores, reproducción de video y portadas
   personalizadas, que ya habían sido confirmados por el usuario.

**Cierre:** compilar por GitHub Actions, luego validar físicamente las dos salidas
de audio y el comportamiento de audición antes de considerar la fase estable.
