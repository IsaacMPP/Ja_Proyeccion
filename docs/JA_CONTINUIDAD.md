# JA Proyección — Continuidad

Repositorio: https://github.com/IsaacMPP/Ja_Proyeccion
Rama principal: main
Base: FreeShow 1.6.7, licencia GPL-3.0.

## Estado

- Código base y adaptaciones iniciales disponibles en GitHub.
- Compilación de Windows definida únicamente en .github/workflows/compilar-windows.yml.
- Retirados scripts CMD de instalación local, instrucciones de carga manual y workflow de importación temporal.
- No considerar el instalador funcional hasta pasar compilación y pruebas reales de Windows.

## Pendientes

1. Verificar o corregir GitHub Actions: npm ci, compilación, empaquetado y artefacto EXE.
2. Biblioteca por carpetas para himnos, Jóvenes, Conquistadores y Aventureros.
3. Buscador de carpeta y global; miniaturas personalizables y pistas de especiales.
4. Vista previa de video/audio separada de la proyección y salidas múltiples.
5. Biblia en español con licencia válida y navegación mediante flechas.
6. Temporizadores y controles sencillos, verificando cada función.

## Reglas

- No mezclar este proyecto con IsaacMPP/Prueba.
- No subir node_modules, instaladores, CMD locales, cachés, logs ni datos de usuarios.
- Conservar atribuciones y licencia GPL-3.0 del proyecto original.

## Fase 2 — primera entrega de biblioteca (2026-10-25)

- Implementado selector de carpeta de letras TXT en Presentaciones (Electron dialog, lectura limitada y no destructiva).
- Cada carpeta importada se asocia a su propia categoría FreeShow y se evitan duplicados por origen al reimportar.
- Interfaz de búsqueda con ámbito **Carpeta actual / Todas las carpetas**; resultados globales muestran categoría.
- Se añadieron pruebas del escáner de TXT, y documentación en [JA_BIBLIOTECA_FASE2.md](JA_BIBLIOTECA_FASE2.md).
- **Por validar:** compilación de GitHub Actions del commit de esta fase, instalación y pruebas manuales con cantos reales.
- Pendientes deliberados: portadas/miniaturas, pistas asociadas, formatos adicionales (Word, PowerPoint y otros), sincronización de cambios en archivos ya importados.
