# JA Proyección — Biblioteca de himnos y cantos (Fase 2, primera entrega)

## Funciones implementadas en esta entrega

- **Importar carpeta de cantos TXT** desde la navegación de Presentaciones. Se abre el selector nativo de carpetas Windows.
- Se leen TXT UTF-8 de la carpeta seleccionada y subcarpetas (hasta ocho niveles), sin modificar los archivos originales.
- Cada carpeta raíz importada crea una categoría independiente y persistente (identificador derivado de la ruta local, sin guardar la ruta completa en los cantos).
- Reimportar la misma carpeta añade solamente archivos nuevos: los ya importados se omiten para evitar duplicados. Los cambios en archivos existentes **no se sincronizan aún**.
- Nombres tipo `070 - Santo, Santo, Santo.txt` muestran el número `070` en la columna de himnos.
- Las estrofas separadas por líneas en blanco usan el convertidor de letras que FreeShow ya tiene.
- **Buscar en: Carpeta actual / Todas las carpetas**, en Presentaciones. Búsqueda por título, número y letras (según caché disponible) con normalización de acentos. Los resultados globales indican su categoría.

## Límites deliberados de seguridad y alcance

- **Solo TXT** en esta primera iteración. PDFs, Word, PPT, OpenSong y video conservan los importadores originales del programa, pero no se incluyen en este nuevo botón de carpetas.
- Máximo 1,000 TXT y 1 MiB por archivo; no se siguen enlaces simbólicos. Si una carpeta contiene más, se informa cuántos archivos fueron omitidos.
- La importación copia letras al catálogo de presentaciones: no altera ni borra archivos fuente.
- El resto del motor de proyección, multimedia y salidas no se modifica.
- No se han implementado todavía miniaturas por canto ni pistas asociadas. Esas funciones siguen pendientes.

## Prueba manual después de compilar GitHub Actions

1. Crear dos carpetas distintas con archivos `.txt`; dejar una línea en blanco entre estrofas.
2. En Presentaciones elegir **Importar carpeta de cantos TXT** y seleccionar cada carpeta por separado.
3. Confirmar que aparecen dos categorías y que cada una muestra solo sus cantos.
4. Escribir un título en el buscador; cambiar **Carpeta actual / Todas las carpetas**, comprobar categoría de cada coincidencia.
5. Buscar `1` o `070`, y un título con/sin tildes; verificar resultados.
6. Reimportar la misma carpeta y comprobar que no aparecen cantos duplicados.
7. Abrir y proyectar un canto con doble clic; revisar cambio de estrofas y que multimedia continúe funcionando.

## No confundir con hecho verificado

El código queda incorporado al repositorio, pero hasta que GitHub Actions compile y se compruebe el instalador en Windows, las nuevas funciones no deben considerarse validadas en producción.
