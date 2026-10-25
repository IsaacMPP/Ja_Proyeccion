# JA Proyección — Estado y continuidad

Repositorio: https://github.com/IsaacMPP/Ja_Proyeccion
Rama: main
Base: FreeShow 1.6.7, GPL-3.0.

## Confirmado
- El usuario instaló y abrió correctamente JA Proyección compilado con GitHub Actions.
- El usuario confirmó funcionamiento básico de proyección, multimedia y pantallas.
- Conservamos el reproductor, las miniaturas y el gestor de carpetas multimedia de FreeShow.
- La aplicación no es todavía una interfaz adventista completa.

## Corrección del alcance de fase 2
Los himnos y cantos de la iglesia **son videos** (MP4/AVI/MKV y otros formatos), NO letras TXT.
La anterior implementación TXT se cancela por completo: se eliminan sus IPC, importador,
escáner, convertidor, controles, pruebas y cualquier documentación que la recomiende.

## Fase 2 — primera versión de videoteca
- Biblioteca basada en carpetas del disco añadidas desde la pestaña **Multimedia** (sin copias).
- Selector «Esta carpeta / Todas las carpetas» durante la búsqueda de contenido local.
- Búsqueda por nombre y número (con/sin ceros), sin depender de tildes.
- Incluye subcarpetas hasta la profundidad que admite la consulta existente (5 niveles).
- Filtro opcional «Solo videos». Los formatos AVI/MKV figuran en la lista admitida, pero los
  códecs reales requieren pruebas de reproducción en Windows.
- En resultados globales aparece la biblioteca de origen para distinguir archivos homónimos.
- Miniatura automática, selección, vista previa, reproducción, controles y salidas siguen usando
  el código existente de FreeShow, que el usuario ya probó.
- La portada personalizada por video es una mejora posterior: no confundirla con miniaturas automáticas.

## Próximos pasos
1. Revisar el resultado de GitHub Actions del cambio a videoteca.
2. Probar en Windows con dos carpetas reales (Himnario Adventista y Jóvenes) y nombres repetidos.
3. Validar búsquedas de subcarpetas, miniaturas y códecs específicos de AVI/MKV.
4. Diseñar opcionalmente portadas personalizadas y gestionar pistas musicales desde Audio.
5. Biblia en español autorizada, navegación de versículos y simplificación de UI.

## Reglas
- Nunca mezclar este proyecto con IsaacMPP/Prueba.
- No reinstalar dependencias en equipos de iglesia: empaquetar desde GitHub Actions.
- No subir node_modules, CMD, instaladores, cachés, logs, multimedia personal o datos de usuarios.
- Conservar licencia GPL-3.0 y atribución a ChurchApps / FreeShow.

## Fase 3 — primera identidad visual JA (2026-10-25)

- Preservada la distribución original: barra superior, proyectos, panel de vista previa, multimedia y salidas.
- Tema predeterminado azul oscuro y dorado, inspirado en el emblema JA.
- La migración solo reemplaza el **tema predeterminado original** de FreeShow; los temas personales permanecen intactos.
- Cabecera, pantalla de bienvenida, pestañas y «Acerca de» muestran JA Proyección.
- Se añade un emblema vectorial estilizado de referencia (public/ja-logo.svg); se recomienda sustituirlo por un recurso oficial de alta resolución con autorización de uso cuando esté disponible.
- No se alteraron la reproducción, las salidas ni los archivos multimedia del usuario.
- Por validar: compilación, renderizado visual real, icono nativo del instalador de Windows y pruebas de regresión.

- Inicio de aplicación: `public/loading.html` y título HTML muestran JA Proyección. Icono nativo de Windows pendiente de recurso final.

## Fase 3 — ajuste de interfaz conforme a la maqueta aprobada
Referencia visual facilitada por el usuario el 2026-10-25, 1672×941.

- El usuario pidió que la apariencia coincida con la maqueta, no solamente colores similares.
- Logo real de JA extraído de la imagen que entregó el usuario, guardado como `public/ja-logo.webp`.
- Fondo oscuro de congregación adaptado visualmente de la maqueta, `public/ja-hero.jpg`. Las zonas con textos del ejemplo se reconstruyeron para no duplicar los textos de la aplicación.
- Barra de modo superior de 58 px; bienvenida con logo grande, eslogan aprobado y botón primario dorado.
- Paneles azul marino, barra de bibliotecas inferior de 48 px, imágenes multimedia redondeadas.
- Valores iniciales: 4 columnas de multimedia y drawer inferior de 365 px. Los ajustes persistidos por el usuario siguen siendo editables y pueden diferir.
- Los cantos mostrados en la ilustración no se incluyen como contenido. El programa únicamente enseña los archivos reales de las carpetas del usuario.
- Se conserva la estructura de FreeShow y se mantienen sus créditos/licencia.
- Falta validar en Windows que la compilación de este commit pase y el diseño funcione en resoluciones distintas.
