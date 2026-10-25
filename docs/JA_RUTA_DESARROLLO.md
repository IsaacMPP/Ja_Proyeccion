# Ruta de desarrollo — Proyección para iglesias adventistas

## Objetivo

Un **solo programa de proyección**, sencillo de usar en cultos generales, cultos jóvenes, Escuela Sabática y clubes. Se aprovecha el motor de FreeShow, con una experiencia pensada para operadores voluntarios. La etiqueta **JA Proyección** es provisional; no hay nombre comercial final aprobado.

## Principios que no se negocian

- No dividir la aplicación en programas separados por ministerio.
- Pantallas **Vista previa** y **En vivo** claramente diferenciadas.
- Importar de forma no destructiva; nunca modificar cantos originales al catalogarlos.
- Funciones útiles antes que agregar menús: cada botón tiene que funcionar.
- Buscar en menos pasos, con controles desde teclado.
- No reemplazar módulos estables solo por cambiar de marca; no añadir parches innecesarios.
- Evaluar y probar una fase antes de comenzar la siguiente.

## Fase 1 — Base/auditoría

**Entregables:** copia fuente separada, mapa de arquitectura, documentación, verificador estático, instrucciones de Windows. **Pendiente fuera de este entorno:** instalación completa de dependencias, compilación y arranque en Windows.

## Fase 2 — Biblioteca de videos de cantos e himnos

1. Usar carpetas existentes como bibliotecas independientes: Himnario Adventista, Jóvenes y clubes.
2. Reconocer archivos multimedia MP4, AVI, MKV y otros formatos compatibles sin convertirlos.
3. Buscar por número y nombre, dentro de la carpeta o en todas, respetando bibliotecas.
4. Mostrar miniaturas automáticas y carpeta de origen en resultados globales.
5. Conservar vista previa privada, reproducción y salidas múltiples del motor FreeShow.
6. Mantener imágenes y audio existentes, con filtro opcional solo videos.
7. Posteriormente, permitir portadas personalizadas sin alterar el video fuente.
8. Pruebas con carpetas reales, nombres repetidos, subcarpetas y diversidad de códecs.

**Criterio de aceptación:** registrar dos carpetas de videos, encontrar el mismo título en ambas con búsqueda global, revisar en vista previa y proyectar solo el archivo seleccionado.

## Fase 3 — Biblia en español y teclas

- Importar traducción española bajo licencia válida (formato compatible que acepte FreeShow).
- Buscar libro, capítulo y rango: `Juan 3:16-18`; proyectar versículos en letra ajustable.
- Navegar con flechas sin conflicto con teclado en buscador; seleccionar cantidad de versículos por diapositiva.
- Manejar versículos largos, acentos y abreviaturas de libros.
- **Criterio:** salto de versículos, proyección correcta, navegación sin avanzar al editar texto.

## Fase 4 — Audio, video y vista previa

- Video en ventana de operador sin salida al público hasta enviar en vivo.
- Reproducir, pausar, saltar ±10 s, controlar volumen, silenciar y hacer seek.
- Pistas de especiales con salida elegible y escucha privada cuando el hardware lo permita.
- **Criterio:** audífonos de monitor aislados de salida congregación, sin cambios involuntarios en vivo.

## Fase 5 — Múltiples pantallas y temporizador

- Pantalla de operador, proyector principal, escenario y salida de transmisión según necesidad.
- Destino y resolución de cada pantalla, salida en negro y temporizadores.
- **Criterio:** ensayo real con dos o más pantallas y control de regreso tras desconexión.

## Fase 6 — Simplificación de UI

- Inicio en Biblioteca / Biblia / Multimedia / Temporizador / Pantallas.
- Controles esenciales visibles, ajustes avanzados secundarios.
- Flujo de operador medido: importar, encontrar, revisar, proyectar, avanzar y apagar.

## Fase 7 — Distribución Windows

- Definir nombre final, ícono, ID independiente, datos de usuario, actualizaciones, firma y atribuciones.
- Compilar, empaquetar, instalar y probar en máquinas nuevas sin FreeShow.
- Entregar código fuente y avisos GPL requeridos.

## Exclusiones iniciales

No convertir el proyecto en editor de video, plataforma de juegos, servidor de nube ni sistema de streaming completo. Esas ideas se revisarán después solo si aportan a la proyección.
