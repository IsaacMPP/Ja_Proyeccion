# JA Proyección — Biblia en español (fase inicial)

## Objetivo
Proyectar pasajes bíblicos en español y permitir que el operador cambie versión,
fuente, tamaño, alineación, color de letra, fondo de color o imagen, y navegue con
**flechas ← / →** desde el módulo Biblia sin interferir con los campos de búsqueda.

## Versiones habituales
Se incluye un catálogo de accesos visibles a:
- Reina-Valera 1960 (RVR60)
- Reina-Valera 1995 (RVR95)
- Nueva Versión Internacional (NVI)
- Nueva Traducción Viviente (NTV)
- Nueva Biblia de las Américas (NBLA)
- Dios Habla Hoy (DHH)
- Reina-Valera 1909 (RV1909, dominio público)

**Importante:** el catálogo NO distribuye automáticamente textos bíblicos.
Identifica ediciones ya instaladas y permite acceder al importador de FreeShow
si faltan. Este acepta biblias locales en formatos XML Zefania, OSIS, Beblia,
OpenSong y FSB, así como opciones de API.Bible disponibles según permisos.
No prometer disponibilidad de traducciones concretas en API.Bible.

Las ediciones RVR60, RVR95, NVI y otras modernas tienen derechos y marcas
reservados. Para incluir sus textos completos sin conexión, se requiere
autorización de sus titulares. No incorporar descargas piratas, extracciones
de sitios o colecciones de terceros que no autoricen la redistribución.

Referencias de derechos:
- https://ubscopyrights.org/index.php/pages/view/translates
- https://www.biblica.com/permissions/
- https://open.bible/bibles/reina-valera-1909

## Personalización del estilo
En Biblia > panel derecho > configuración, el bloque **Diseño de la Biblia**
permite seleccionar:
- tipografía (Arial, Montserrat, Inter, Tahoma, Verdana, Georgia),
- tamaño (30 a 160 píxeles de la plantilla base 1920×1080),
- alineación izquierda/centro/derecha,
- color del texto y color de fondo,
- imagen JPG/PNG/WebP de fondo o volver al color.

Los cambios crean una copia **Biblia JA — personalizado**, sin modificar
las plantillas originales. Se guarda en los datos actuales de la aplicación.
Si una salida usa un estilo avanzado que impone una plantilla distinta, se
advierte al operador y se preserva ese override.

## Flechas de navegación
En la vista Biblia (cuando está abierta):
- **→** avanza al siguiente versículo; **←** retrocede.
- Se conserva **Ctrl+←/→** heredado.
- No secuestra las flechas cuando el foco está en inputs, botones, selects,
  áreas editables, ni durante edición.
- En salida bíblica activa, aprovecha `_moveSelection` heredado para
  actualizar la proyección según el comportamiento existente.
- El panel derecho permite desactivar «Flechas del teclado» si estorban.

## Verificaciones necesarias con el usuario
1. Cargar una traducción cuya fuente/licencia autorice el uso y proyectar.
2. Cambiar entre dos traducciones instaladas; la referencia debe mantenerse
   correcta y respetar diferencias de numeración.
3. Cambiar fondo/color/fuente y confirmar resultado en **monitor secundario**.
4. Reiniciar programa y comprobar persistencia de plantilla.
5. Navegar 1:1 -> 1:2 y regresar, también entre capítulos/libros.
6. Escribir referencias en buscador con flechas sin navegación accidental.
7. Verificar que las letras, videos, portadas y audio no tengan regresiones.
8. Verificar atribución obligatoria para las versiones donde aplique.

No declarar instalada RVR60/RVR95/NVI hasta que se incorpore contenido
autorizado, ni considerar la función validada hasta ensayo real en Windows.
