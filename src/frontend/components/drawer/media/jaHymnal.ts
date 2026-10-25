/** Catálogo visual del Himnario; no modifica los archivos de video. */
export type JAHymn = { number: number; title: string; name: string }

export function parseJAHymn(name: string): JAHymn | null {
    const match = /^\s*(\d{1,3})(?:[\s._-]+)(.+)\.mp4$/i.exec(name)
    if (!match) return null
    const number = Number(match[1])
    const title = match[2].trim().replace(/[._-]+$/g, "").trim()
    if (!Number.isInteger(number) || number < 1 || !title) return null
    return { number, title, name }
}

function plain(value: string): string {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim()
}

export function matchesJAHymn(name: string, query: string): boolean {
    const hymn = parseJAHymn(name)
    if (!hymn) return false
    const wanted = plain(query)
    if (!wanted) return true
    if (/^\d+$/.test(wanted)) return hymn.number === Number(wanted)
    return wanted.split(/\s+/).every((term) => plain(hymn.title).includes(term))
}

export function compareJAHymns(a: string, b: string): number {
    const first = parseJAHymn(a)
    const second = parseJAHymn(b)
    if (!first || !second) return first ? -1 : second ? 1 : a.localeCompare(b)
    return first.number - second.number || first.title.localeCompare(second.title, "es")
}
