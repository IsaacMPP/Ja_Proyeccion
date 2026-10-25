/** Diagnóstico del equipo sin instalar nada. */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const required = [22, 12, 0]
function meetsMinNode(version) {
    const nums = version.replace(/^v/, "").split(".").map(Number)
    for (let i = 0; i < 3; i++) {
        if (nums[i] > required[i]) return true
        if (nums[i] < required[i]) return false
    }
    return true
}
function cmdOutput(command, args = []) {
    const r = spawnSync(command, args, { encoding: "utf8", shell: process.platform === "win32", timeout: 8000 })
    return r.status === 0 ? `${r.stdout || r.stderr}`.trim().split("\n")[0] : "no disponible"
}
console.log("=== JA Proyección: diagnóstico ===")
console.log(`Sistema: ${process.platform} ${process.arch}`)
console.log(`Node: ${process.version} ${meetsMinNode(process.version) ? "[OK]" : "[INSUFICIENTE; mínimo 22.12.0]"}`)
console.log(`npm: ${cmdOutput("npm", ["--version"])}`)
console.log(`Git: ${cmdOutput("git", ["--version"])}`)
console.log(`Python: ${cmdOutput(process.platform === "win32" ? "py" : "python3", ["--version"])}`)
console.log(`Dependencias: ${fs.existsSync(path.join(root,"node_modules", "electron")) ? "Electron presente (no validado)" : "no instaladas; ejecutar npm ci"}`)
console.log("Para compilar en Windows, el proyecto original indica Python 3.12 y Visual Studio Build Tools C++/Windows SDK.")
console.log("Este diagnóstico NO confirma que la aplicación haya compilado ni abierto.")
if (!meetsMinNode(process.version)) process.exitCode = 1
export { meetsMinNode }
