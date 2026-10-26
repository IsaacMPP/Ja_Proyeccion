/**
 * JA Proyección — reglas de selección simple de pantallas.
 * La numeración es local a la lista detectada, no el ID interno del sistema.
 */
export type JADisplay = {
    id: number
    bounds: { x: number; y: number; width: number; height: number }
    internal?: boolean
    isPrimary?: boolean
}
export type JAOutput = {
    enabled?: boolean
    active?: boolean
    invisible?: boolean
    stageOutput?: string
    screen?: string
    boundsLocked?: boolean
    forcedResolution?: { width?: number; height?: number }
    blackmagic?: boolean
    ndi?: boolean
    omt?: boolean
    rtmp?: boolean
    webrtc?: boolean
}

export function isExternalDisplay(display: JADisplay, screens: JADisplay[]): boolean {
    // Nunca asumir que una pantalla interna sea el proyector por defecto.
    return screens.length > 1 && display.isPrimary === false
}

export function getPhysicalOutputId(outputs: Record<string, JAOutput>, preferredId: string | null, targetDisplayId?: string): string {
    const allowed = (output: JAOutput | undefined) =>
        !!output && !output.stageOutput && !output.invisible && !output.blackmagic && !output.ndi && !output.omt && !output.rtmp && !output.webrtc
    // Never steal the output assigned to a different physical display.
    const available = (output: JAOutput | undefined) => allowed(output) && (!targetDisplayId || !output?.screen || output.screen === targetDisplayId)
    if (targetDisplayId) {
        const exact = Object.entries(outputs).find(([, output]) => available(output) && output.screen === targetDisplayId)
        if (exact) return exact[0]
    }
    if (preferredId && available(outputs[preferredId])) return preferredId
    const entry = Object.entries(outputs).find(([, output]) => available(output))
    return entry?.[0] || ""
}
