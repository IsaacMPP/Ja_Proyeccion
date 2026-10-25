/**
 * Resolución de la pantalla física para JA Proyección.
 * Funciones puras, reutilizables sin Electron en pruebas y sin modificar la configuración.
 */
export type ScreenRectangle = { x: number; y: number; width: number; height: number }
export type PhysicalScreen = { id: number; bounds: ScreenRectangle }

function hasValidBounds(value: ScreenRectangle | undefined | null): value is ScreenRectangle {
    return !!value && value.width > 0 && value.height > 0
}

function matchesScreenCenter(bounds: ScreenRectangle, display: PhysicalScreen): boolean {
    const cx = bounds.x + bounds.width / 2
    const cy = bounds.y + bounds.height / 2
    return cx >= display.bounds.x && cx < display.bounds.x + display.bounds.width && cy >= display.bounds.y && cy < display.bounds.y + display.bounds.height
}

/**
 * El monitor explícitamente elegido prevalece sobre coordenadas guardadas antiguas.
 * En modo automático, si solo hay un monitor externo, evita el monitor del operador.
 * Si hay varios externos, no adivina: el asistente debe recibir una selección explícita.
 */
export function resolvePhysicalDisplayBounds(options: {
    displays: PhysicalScreen[]
    bounds: ScreenRectangle | undefined
    targetScreenId?: string | null
    controllerScreenId?: number | null
    autoPosition?: boolean
    boundsLocked?: boolean
    isMac?: boolean
}): ScreenRectangle {
    const { displays, bounds, targetScreenId, controllerScreenId, autoPosition = false, boundsLocked = false, isMac = false } = options
    const fallback = hasValidBounds(bounds) ? bounds : (displays[0]?.bounds || { x: 0, y: 0, width: 1920, height: 1080 })

    if (boundsLocked) return { ...fallback }

    const selected = targetScreenId ? displays.find((d) => String(d.id) === String(targetScreenId)) : null
    // Una elección explícita distinta de la pantalla del operador tiene prioridad máxima.
    if (selected && (!autoPosition || selected.id !== controllerScreenId)) return { ...selected.bounds }

    // No abrir por defecto sobre los controles en configuraciones típicas de dos pantallas.
    if ((autoPosition || !hasValidBounds(bounds)) && !isMac && displays.length === 2 && controllerScreenId !== null && controllerScreenId !== undefined) {
        const external = displays.find((d) => d.id !== controllerScreenId)
        if (external) return { ...external.bounds }
    }

    if (selected) return { ...selected.bounds }
    if (hasValidBounds(bounds) && displays.some((display) => matchesScreenCenter(bounds, display))) return { ...bounds }
    return { ...fallback }
}
