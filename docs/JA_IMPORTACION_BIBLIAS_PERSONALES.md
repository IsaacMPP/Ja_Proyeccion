# Importación personal de Biblias JSON a JA Proyección

Estado: **herramienta preliminar para probar**. No sustituye la importación local ya existente ni modifica la RV1909 integrada.

## Propósito y derechos
Este repositorio público conserva **únicamente el conversor**. No contiene RVR1960, NVI, NTV, DHH, NBLA ni otros textos bíblicos descargados. Las licencias MIT que muestran algunos repositorios de código **no otorgan automáticamente** derechos de redistribuir las traducciones bíblicas. Comprueba las condiciones de los titulares; el uso personal tampoco equivale automáticamente a autorización para cualquier copia.

Repositorios externos referidos por el usuario:
- https://github.com/josevladimir/bible-json (JavaScript: `procesados/*.js`)
- https://github.com/mrk214/bible-data-es-spa (JSON por versión bajo `data/`)

## Requisitos
Python 3.12 o posterior. No instala bibliotecas adicionales. Descarga tú mismo los archivos que tengas derecho a utilizar. No pegues contenido bíblico completo en GitHub ni lo metas en `public/` o `scripts/` del proyecto.

## Conversión desde bible-json
1. Descomprime el repositorio en tu PC.
2. Abre una terminal en la carpeta donde tengas el conversor, ejecuta:

```powershell
py -3 scripts/ja/import_local_bible.py --source jose --input "C:\MisBiblias\bible-json" --name "Mi Biblia personal RVR1960" --output "C:\MisBiblias\rvr1960-personal.fsb"
```

El conversor **no ejecuta** los archivos JavaScript del repositorio ajeno: analiza únicamente literales de arrays de texto con un parser seguro.

## Conversión desde bible-data-es-spa
Selecciona un archivo JSON de una traducción (no una carpeta entera):

```powershell
py -3 scripts/ja/import_local_bible.py --source snapshot --input "C:\MisBiblias\NVI_vid_128.json" --name "Mi NVI personal" --output "C:\MisBiblias\nvi-personal.fsb"
```

**Advertencia:** los JSON de terceros pueden cambiar de estructura; el adaptador soporta objetos/listas con `books`, `chapters` y `verses` o claves numéricas. Falta validar el esquema real de los JSON grandes de mrk214 en Windows. Si dice que faltan libros o no reconoce el archivo, no fuerces una conversión ni des por válida la Biblia: conserva el archivo y reporta la estructura de claves (sin compartir versículos protegidos).

## Importar el archivo .fsb generado
1. Abrir JA Proyección > Biblia.
2. Seleccionar añadir/importar Biblia > Local.
3. Elegir el archivo `.fsb` recién generado desde el selector.
4. Confirmar nombre y traducción; probar Génesis 1, Salmo 23, Juan 3, Apocalipsis y navegación por varios capítulos.
5. Reiniciar la aplicación para verificar persistencia. RV1909 debe mantenerse instalada.

**No** copiar `.fsb` personales a la carpeta del repositorio ni a la compilación de GitHub Actions. El convertidor verifica 66 libros por defecto y rechaza resultados incompletos, salvo el modo `--allow-partial` destinado únicamente a diagnóstico.
