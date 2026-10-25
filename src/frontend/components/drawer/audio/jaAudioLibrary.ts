/**
 * JA Proyección — Búsqueda de pistas de audio por título, acentos y número.
 * La identidad de una pista es su ruta completa, no su nombre visible.
 */
export type JAAudioFolder = { name?: string; path?: string }
export function normalizeJAAudioTerm(value: string): string {
    return (value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/[.,\\/#!?$%^&*;:{}=_\-`~()\s]/g, "")
}
export function matchesJAAudioName(fileName: string, query: string): boolean {
    const trimmed = (query || "").trim()
    if (!trimmed) return true
    const stem = (fileName || "").replace(/\.[^.\\/]+$/, "")
    const wanted = normalizeJAAudioTerm(trimmed)
    if (/^\d+$/.test(wanted)) {
        const value = Number(wanted)
        return Number.isSafeInteger(value) && [...stem.matchAll(/\d+/g)].some(m => Number(m[0]) === value)
    }
    if (normalizeJAAudioTerm(stem).includes(wanted)) return true
    return trimmed.split(/\s+/).map(normalizeJAAudioTerm).filter(Boolean).every(word => normalizeJAAudioTerm(stem).includes(word))
}
export function getJAAudioLibraryName(filePath: string, folders: Record<string, JAAudioFolder>): string {
    const normalizedFile = (filePath || "").replace(/\\/g, "/").replace(/\/+$/, "").toLocaleLowerCase()
    let best = "", name = ""
    for (const folder of Object.values(folders || {})) {
        const original = folder.path || ""
        const root = original.replace(/\\/g, "/").replace(/\/+$/, "").toLocaleLowerCase()
        if (root && (normalizedFile === root || normalizedFile.startsWith(root + "/")) && root.length > best.length) {
            best = root
            name = folder.name || original.split(/[\\/]/).filter(Boolean).pop() || ""
        }
    }
    return name
}
export function uniqueJAAudioRoots(folders: Record<string, JAAudioFolder>): string[] {
    const seen = new Set<string>()
    return Object.values(folders || {}).map(folder => folder.path || "").filter(path => {
        if (!path) return false
        const normalized = path.replace(/\\/g, "/").replace(/\/+$/, "").toLocaleLowerCase()
        if (seen.has(normalized)) return false
        seen.add(normalized)
        return true
    })
}
