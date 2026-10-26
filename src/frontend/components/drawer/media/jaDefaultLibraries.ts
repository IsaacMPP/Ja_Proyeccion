import type { Categories } from "../../../../types/Tabs"
import type { JALibraryRole } from "./jaLibraryRoles"

const DEFAULT_LIBRARIES: { role: JALibraryRole; directory: string; name: string }[] = [
    { role: "hymnal", directory: "Himnario Adventista", name: "Himnario Adventista" },
    { role: "songs", directory: "Cantos Juveniles", name: "Cantos Juveniles" },
    { role: "backgrounds", directory: "Fondos Personalizados", name: "Fondos Personalizados" },
    { role: "specials", directory: "Especiales", name: "Especiales" }
]

function normalizedPath(value: string): string {
    return value.replace(/\\/g, "/").replace(/\/+$/, "").toLocaleLowerCase()
}

export function defaultJALibraryPath(root: string, directory: string): string {
    const separator = root.includes("\\") ? "\\" : "/"
    return root.replace(/[\\/]+$/, "") + separator + directory
}

/** Register user-library folders created at startup, preserving linked external folders. */
export function withDefaultJALibraries(folders: Categories, root: string): Categories {
    if (!root) return folders
    const next: Categories = { ...folders }
    let changed = false
    for (const def of DEFAULT_LIBRARIES) {
        const targetPath = defaultJALibraryPath(root, def.directory)
        const existing = Object.entries(next).find(([, folder]) => normalizedPath(folder.path || "") === normalizedPath(targetPath))
        if (existing) {
            if (existing[1].jaLibraryRole !== def.role) {
                next[existing[0]] = { ...existing[1], jaLibraryRole: def.role }
                changed = true
            }
            continue
        }
        const id = "ja-default-" + def.role
        if (next[id]) continue
        next[id] = { name: def.name, icon: "folder", path: targetPath, jaLibraryRole: def.role }
        changed = true
    }
    return changed ? next : folders
}

/** Prefer the program's own folder, and allow external libraries as additional sources. */
export function getPrimaryJALibraryId(folders: Categories, root: string, role: JALibraryRole): string {
    const def = DEFAULT_LIBRARIES.find((item) => item.role === role)
    const primaryPath = def && root ? normalizedPath(defaultJALibraryPath(root, def.directory)) : ""
    const entries = Object.entries(folders).filter(([, folder]) => folder.jaLibraryRole === role)
    return entries.find(([, folder]) => normalizedPath(folder.path || "") === primaryPath)?.[0] || entries[0]?.[0] || ""
}
