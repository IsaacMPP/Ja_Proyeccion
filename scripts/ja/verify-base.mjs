/**
 * Fase 1: comprobación estructural SIN dependencias ni cambios de datos.
 * No equivale a compilar o ejecutar Electron.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const required = [
    "LICENSE",
    "package.json",
    "package-lock.json",
    "config/building/electron-builder.yaml",
    "src/frontend/components/quicksearch/quicksearch.ts",
    "src/frontend/components/drawer/navigation/ShowsTabs.svelte",
    "src/frontend/components/drawer/navigation/MediaTabs.svelte",
    "src/frontend/components/drawer/navigation/AudioTabs.svelte",
    "src/frontend/components/drawer/bible/Scripture.svelte",
    "src/frontend/components/show/VideoShow.svelte",
    "src/frontend/components/show/AudioPreview.svelte",
    "src/frontend/components/output/preview/Preview.svelte",
    "src/frontend/components/output/tools/MediaControls.svelte",
    "src/electron/data/thumbnails.ts",
    "src/frontend/audio/routing/audioRoutingManager.ts",
    "docs/JA_RUTA_DESARROLLO.md",
    "docs/JA_AUDITORIA_FASE1.md",
    "docs/JA_CONTINUIDAD.md"
]

function verifyBase({ rootDir = root, readFile = fs.readFileSync, exists = fs.existsSync } = {}) {
    const errors = []
    for (const rel of required) if (!exists(path.join(rootDir, rel))) errors.push(`Falta ${rel}`)
    let pkg = null
    let lock = null
    try { pkg = JSON.parse(readFile(path.join(rootDir, "package.json"), "utf8")) }
    catch (error) { errors.push(`package.json: ${error.message}`) }
    try { lock = JSON.parse(readFile(path.join(rootDir, "package-lock.json"), "utf8")) }
    catch (error) { errors.push(`package-lock.json: ${error.message}`) }
    if (pkg && lock) {
        if (lock.name !== pkg.name || lock.version !== pkg.version) errors.push("El nombre/versión del lockfile no coincide")
        if (lock.packages?.[""]?.name !== pkg.name) errors.push("La raíz del lockfile no coincide")
        for (const group of ["dependencies", "devDependencies", "optionalDependencies"]) {
            const a = pkg[group] || {}
            const b = lock.packages?.[""]?.[group] || {}
            for (const [name, version] of Object.entries(a)) if (b[name] !== version) errors.push(`Versión desactualizada en lockfile: ${name}`)
        }
        if (pkg.license !== "GPL-3.0") errors.push("La licencia GPL-3.0 debe conservarse")
    }
    try {
        const css = readFile(path.join(rootDir, "public/global.css"), "utf8")
        if (/url\(\s*["']?\.\/fonts\//.test(css)) errors.push("CSS apunta a tipografías no incluidas")
    } catch { errors.push("Falta public/global.css") }
    return errors
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const errors = verifyBase()
    console.log(`JA Proyección: revisión estructural (${required.length} rutas críticas)`)
    if (errors.length) {
        for (const error of errors) console.error("  ERROR:", error)
        process.exitCode = 1
    } else {
        console.log("  OK: estructura, licencia y lockfile consistentes")
        if (!fs.existsSync(path.join(root, "node_modules"))) console.log("  PENDIENTE: npm ci y compilación (dependencias no instaladas)")
        console.log("  IMPORTANTE: no se ha probado la ejecución de Electron")
    }
}
export { verifyBase, required }
