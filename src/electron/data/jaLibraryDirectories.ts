import { mkdirSync } from "fs"
import path from "path"
import { getDataFolderRoot } from "../utils/files"

/** Bibliotecas del usuario, separadas de Config, Bibles y demás datos internos. */
export const JA_LIBRARY_DIRECTORIES = [
    "Himnario Adventista",
    "Cantos Juveniles",
    "Fondos Personalizados",
    "Especiales"
] as const

/** Idempotente: crea únicamente carpetas inexistentes y nunca toca los contenidos. */
export function ensureJALibraryDirectories(root: string = getDataFolderRoot()): void {
    for (const directory of JA_LIBRARY_DIRECTORIES) {
        try {
            mkdirSync(path.join(root, directory), { recursive: true })
        } catch (error) {
            console.warn(`JA Proyección: no se pudo preparar la biblioteca ${directory}`, error)
        }
    }
}
