/** JA Proyección: roles visuales de las carpetas enlazadas; nunca mueve archivos. */
export const JA_LIBRARY_ROLES = [
    { id: "hymnal", name: "Himnario Adventista", icon: "music" },
    { id: "songs", name: "Cantos juveniles", icon: "music" },
    { id: "backgrounds", name: "Fondos personalizados", icon: "image" },
    { id: "specials", name: "Especiales y videos", icon: "video" }
] as const

export type JALibraryRole = (typeof JA_LIBRARY_ROLES)[number]["id"]

export function isJALibraryRole(role: unknown): role is JALibraryRole {
    return JA_LIBRARY_ROLES.some((item) => item.id === role)
}

export function belongsToJALibrary(role: unknown, expected: JALibraryRole): boolean {
    return role === expected && isJALibraryRole(role)
}
