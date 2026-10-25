import type { Project, ProjectShowRef } from "../../../types/Projects"

/** Orden inicial editable, sin referencias a medios inexistentes. */
export const JA_CULTO_SECTIONS = [
    "Bienvenida y anuncios",
    "Canto de apertura",
    "Oración inicial",
    "Lectura bíblica",
    "Alabanzas y participaciones",
    "Tema central",
    "Canto final",
    "Oración final"
] as const

export function createJACultoProject(now: number = Date.now()): Project {
    const shows: ProjectShowRef[] = JA_CULTO_SECTIONS.map((name, index) => ({
        id: `ja_culto_${now}_${index}`,
        type: "section",
        name
    }))
    return {
        name: "Culto JA",
        parent: "/",
        created: now,
        modified: now,
        shows
    }
}
