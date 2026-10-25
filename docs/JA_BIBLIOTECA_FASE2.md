# JA Proyección — Videoteca (Fase 2)

## Objetivo real
Los cantos e himnos son VIDEOS almacenados en carpetas de Windows.
No se utiliza TXT para esta función. No se copian ni se modifican los archivos originales.

## Cómo se utiliza
1. Abrir **Multimedia**.
2. Pulsar **Agregar carpeta**, seleccionar la carpeta real de videos: «Himnario Adventista».
3. Repetir con «Cantos Jóvenes», «Conquistadores», «Aventureros» y otras carpetas.
4. Seleccionar una carpeta del menú lateral y utilizar el buscador de la pestaña.
5. Elegir **Esta carpeta** (solo esa biblioteca y sus subcarpetas) o **Todas las carpetas**.
6. Activar **Solo videos** para excluir fotos y otros recursos durante la búsqueda.
7. Seleccionar un video para verlo en la vista previa; usar la proyección en vivo solo
   cuando corresponda. Se conserva el sistema multimedia y sus controles originales.

## Implementación técnica
- Utiliza `mediaFolders` persistente, `Main.READ_FOLDER` y las tarjetas de FreeShow.
- Para buscar se consultan hasta 5 niveles de profundidad por carpeta, según la
  implementación actual de `READ_FOLDER`. Carpetas más profundas están fuera del alcance
  de esta primera entrega.
- El filtrado posterior funciona en memoria, acepta un carácter y normaliza tildes,
  mayúsculas y números con o sin ceros a la izquierda.
- Los resultados globales identifican la biblioteca registrada más específica.
- Las miniaturas y reproducción se conservan desde FreeShow, sin crear reproductores paralelos.
- Los archivos AVI y MKV pueden depender de los códecs presentes en el reproductor;
  estar reconocidos por extensión NO equivale a garantizar la reproducción.

## No implementado todavía
- Elegir una portada distinta de la miniatura que genera FreeShow.
- Generación automática de letras ni conversión de videos en diapositivas.
- Reconversión automática de códecs ni motor de decodificación adicional.
- Asociación individual de una pista de audio a cada video; FreeShow ya tiene una pestaña Audio.

## Pruebas de aceptación
- Agregar dos bibliotecas con nombres diferentes y dos videos de igual título.
- Buscar «001», «1», parte del título con y sin acentos; revisar coincidencias.
- Cambiar entre búsqueda local y global sin mezclar bibliotecas.
- Buscar videos en subcarpetas.
- Comprobar miniaturas y reproducción previa sin proyectar.
- Proyectar, pausar, adelantar, retroceder y detener; probar la pantalla secundaria.
- Confirmar que se mantienen las imágenes y las herramientas antiguas de FreeShow.
