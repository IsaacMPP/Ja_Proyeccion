# JA Proyección — Portadas personalizadas de videos (Fase 4)

## Alcance
Las canciones e himnos son videos. Cada uno puede tener una portada visual distinta
de su miniatura automática, sin modificar sus datos, contenido o archivo original.

## Cómo utilizar
1. Abre **Multimedia** y añade tu carpeta real de videos.
2. En la tarjeta de un video local, pulsa el pequeño icono de **imagen**.
3. Selecciona una fotografía **JPG, JPEG o PNG** (hasta 20 MB).
4. La portada aparecerá en esa tarjeta, incluso en búsquedas de **Todas las carpetas**.
5. Para revertir, pulsa el icono **Restaurar miniatura automática** en esa misma tarjeta.
6. El ajuste se guarda en el archivo de medios de JA Proyección y debe conservarse
   tras cerrar y volver a abrir el programa.

## Implementación y límites
- Reutiliza el store `MEDIA` existente mediante `MediaStyle.jaCoverPath`, asociado
  a la ruta absoluta del video.
- El archivo seleccionado se valida como imagen por Electron y se copia a
  `Config/JA-Video-Covers/` dentro de la carpeta de datos actual de JA Proyección.
- No se altera ni copia el video; tampoco se altera la imagen original.
- Cada actualización crea un nuevo archivo único y elimina el antiguo **solo si**
  pertenecía al mismo video dentro del directorio de portadas JA.
- No cambia miniaturas de imágenes, streams NDI, recursos remotos o videos protegidos.
- No sustituye el sistema de reproducción de FreeShow. Al pasar el cursor por un
  video, la vista previa animada original sigue pudiendo mostrarse.
- Identidad asociada a ruta de archivo: si el video se renombra o mueve, la portada
  necesitará reasociarse; no usamos coincidencias ambiguas por nombre.
- Las portadas guardadas en la carpeta de datos no se distribuyen dentro del instalador.
- Se valida que la imagen tenga tamaño razonable (20 MB/40 millones de píxeles).
- La primera entrega usa el selector de archivo del sistema; no hay todavía un editor
  de recorte, administración masiva ni sincronización entre computadoras.

## Validación Windows pendiente
- Asignar una portada JPG a MP4, reiniciar y confirmar persistencia.
- Asignar PNG con transparencia; probar búsqueda global y por carpeta.
- Cambiar portada, restaurar automática y reiniciar; comprobar que no reaparece.
- Rechazar imágenes corruptas y cancelar el selector sin afectar el video.
- Proyectar el mismo video antes y después: el video en vivo **no** debe ser
  reemplazado por la imagen de la portada.
- Verificar múltiples videos con nombres iguales pero rutas diferentes.
- Verificar teclado, pantallas secundarias y demás herramientas anteriores.

**No dar por terminada la fase únicamente por compilar:** las pruebas en Windows
deben confirmarse con un video real de la biblioteca del usuario.
