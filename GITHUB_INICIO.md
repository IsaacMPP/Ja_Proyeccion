# JA Proyección — comenzar a compilar con GitHub

## 1. Crear repositorio vacío (única operación manual en GitHub)

Visita <https://github.com/new> e inicia sesión con la cuenta `IsaacMPP`.

- Nombre: `JA-Proyeccion` (separado del repositorio del editor de video).
- Visibilidad: **Privado** durante el desarrollo, recomendado.
- **No** activar creación de README, .gitignore ni LICENSE (el proyecto ya los tiene).

## 2. Subir el código desde Windows

Descomprime este proyecto **fuera de OneDrive**, por ejemplo `C:\JA-Proyeccion-GitHub`.
Ejecuta `04_SUBIR_A_GITHUB.cmd` desde la raíz del proyecto. Requiere Git y que tu sesión de GitHub pueda autenticarte al hacer `git push`.

No copies `node_modules`; la compilación se realiza en GitHub.

Si prefieres comandos, desde PowerShell en la carpeta:

```powershell
git init -b main
git add .
git commit -m "Base JA Proyeccion y compilacion Windows en GitHub Actions"
git remote add origin https://github.com/IsaacMPP/Ja_Proyeccion.git
git push -u origin main
```

## 3. Compilar y descargar

1. Abre `https://github.com/IsaacMPP/Ja_Proyeccion/actions`.
2. En **Compilar JA Proyeccion (Windows)** comprueba el resultado de la ejecución iniciada tras el push.
3. Si termina correctamente, abre la ejecución, baja a **Artifacts** y descarga `JA-Proyeccion-Windows-pruebas`.
4. Extrae el `.zip` de GitHub Actions y encontrarás el instalador `.exe` de prueba.
5. Si falla, copia la primera sección con error del job `windows`. No asumas que se generó un EXE si la acción falló.

También puedes iniciar una nueva compilación mediante el botón **Run workflow**.

## Lo que se ha preparado y lo que no

- Workflow Windows 2022, Node 24.16.0, Python 3.12, C++ Build Tools del runner.
- `npm ci` instala dependencias usando la conexión de GitHub.
- Compilación y empaquetado NSIS con `electron-builder`, con nombre e ID propios.
- Datos nuevos en `Documentos/JA Proyección`, separados de `Documentos/FreeShow`; `productName` específico y sin comprobación automática de actualizaciones.
- Se mantiene el código fuente de FreeShow 1.6.7 como base derivada y su licencia GPL-3.0.
- **No está validado todavía que compile ni que abra en Windows**. El primer flujo CI nos dirá qué requiere corrección.
- La nueva biblioteca JA, buscador, Biblia en español y controles adaptados aún son trabajos pendientes.
- Windows SmartScreen puede advertir al abrir instaladores de pruebas sin firma digital.

## Licencia

Base derivada de FreeShow © sus respectivos autores, bajo GPL-3.0. Si entregas binarios a otras personas, debes proporcionar el código fuente correspondiente bajo esta licencia; no incluir biblias, cantos, traducciones o multimedia sin permiso.
