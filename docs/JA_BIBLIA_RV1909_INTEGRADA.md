# Biblia española RV1909 ya incluida en JA Proyección

## Qué se instala
**Reina-Valera 1909** (RV1909), 66 libros, 1.189 capítulos y aproximadamente
31 mil versículos, totalmente en español, para consultar y proyectar **sin
Internet**.

La fuente oficial es eBible.org, identificada por su distribuidor como **dominio
público**: https://ebible.org/spaRV1909/ y
https://ebible.org/Scriptures/spaRV1909_vpl.zip .

## Generación reproducible del instalador
- `scripts/ja/build_rv1909.py` descarga el ZIP oficial **solo durante el build**.
- Comprueba SHA-256 del ZIP y presencia de 66 libros, 1.189 capítulos,
  aproximadamente 31 mil versículos y contenido bíblico reconocible.
- Guarda `public/ja-bibles/rv1909.fsb` en el formato FreeShow.
- `config/building/electron-builder.yaml` incluye `public/**` en el EXE.
- La aplicación **no necesita red** para leer RV1909 instalada.
- El instalador empaqueta únicamente RV1909, NO incluye RVR1960, RVR1995,
  NVI ni otras versiones con permisos restringidos.
- Mantener visible el origen y dominio público; sin atribuir a RV1909 la
  identidad ni el nombre de la edición RVR1960.

## Uso al abrir el programa
1. Abre **Biblia** en JA Proyección.
2. Aparecerá **Reina-Valera 1909 (RV1909)** entre las Biblias disponibles.
3. Si no había una selección previa o estaba elegida una Biblia inglesa de
   ejemplo, la primera instalación de esta función seleccionará RV1909.
4. Selecciona libro, capítulo y versículo, y proyecta normalmente.
5. Cambia tamaño, alineación, fondo y navega con las flechas.
6. La aplicación conserva tus Biblias y estilos anteriores.

## Protección de datos
- En el primer arranque de esta edición, `registerJARV1909()` verifica por
  IPC que la Biblia empaquetada realmente contenga 66 libros antes de
  mostrarla en el selector.
- No reemplaza el almacén de Biblias del usuario ni los archivos originales.
- Si falta el recurso en un build de desarrollo, no se muestra como disponible.
- El archivo integrado permanece dentro del instalador y se lee por
  `Main.BIBLE`, sin copiarlo a `Documentos/Bibles` y sin Internet.

## Validación en Windows pendiente
- Confirmar que RV1909 aparece desde la primera instalación, tanto en una
  instalación nueva como en una actualización conservando datos.
- Comprobar Génesis 1, Salmo 23, Juan 3 y Apocalipsis.
- Activar/desactivar conexión a Internet y proyectar los mismos versículos.
- Reiniciar y verificar que RV1909 sigue disponible y que las otras Biblias
  continúan accesibles.
- Comprobar que la salida física, estilos de texto, flechas, videos y audio
  siguen funcionando.
