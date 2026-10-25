/**
 * JA Proyección — helpers puros de búsqueda de videos.
 * No lee, copia ni modifica archivos originales.
 */
export type JAVideoFolder = { name?: string; path?: string }

export function normalizeJASearch(value: string): string {
    return (value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/[.,\\/#!?$%^&*;:{}=_\-`~()\s]/g, "")
}

export function matchesJAVideoName(fileName: string, query: string): boolean {
    const wanted = normalizeJASearch(query)
    if (!wanted) return true
    const stem = (fileName || "").replace(/\.[^.\\/]+$/, "")
    // Comparar números completos, sin hacer coincidir el «4» de la extensión MP4.
    if (/^\d+$/.test(wanted)) {
        const number = Number(wanted)
        return Number.isSafeInteger(number) && [...stem.matchAll(/\d+/g)].some((match) => Number(match[0]) === number)
    }
    const haystack = normalizeJASearch(stem)
    if (haystack.includes(wanted)) return true
    // Las búsquedas de varias palabras admiten preposiciones intermedias en el título.
    const words = query.trim().split(/\s+/).map(normalizeJASearch).filter(Boolean)
    return words.length > 1 && words.every((word) => haystack.includes(word))
}

function normalizeFolderPath(value: string): string {
    return (value || "").replace(/\\/g, "/").replace(/\/+$/, "").toLocaleLowerCase()
}

/** Identifica la carpeta registrada más específica. Soporta nombres repetidos y subcarpetas. */
export function getJAVideoLibraryName(filePath: string, folders: Record<string, JAVideoFolder>): string {
    const file = normalizeFolderPath(filePath)
    let best = ""
    let name = ""
    for (const folder of Object.values(folders || {})) {
        const root = normalizeFolderPath(folder.path || "")
        if (root && (file === root || file.startsWith(root + "/")) && root.length > best.length) {
            best = root
            name = folder.name || (folder.path || "").split(/[\\/]/).filter(Boolean).pop() || ""
        }
    }
    return name
}
