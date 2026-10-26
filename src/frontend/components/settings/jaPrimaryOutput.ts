import { get, writable } from "svelte/store"
import { isOutputOnDisplay, type JADisplay, type JAOutput } from "./displayGuide"

const storageKey = "ja.primary-projector-output-id"
function readSavedPrimary(): string {
    try {
        return typeof localStorage === "undefined" ? "" : localStorage.getItem(storageKey) || ""
    } catch {
        return ""
    }
}

// The saved output never silently fails over to another screen.
export const jaPrimaryOutputId = writable(readSavedPrimary())
export function setJAPrimaryOutput(id: string): void {
    jaPrimaryOutputId.set(id)
    try {
        if (typeof localStorage !== "undefined") localStorage.setItem(storageKey, id)
    } catch {
        // Storage can be disabled: the session selection still works.
    }
}

export function getJAPrimaryOutputId(outputs: Record<string, JAOutput>, displays: JADisplay[]): string {
    const candidates = Object.entries(outputs).filter(([, output]) =>
        displays.some((display) => !display.isPrimary && isOutputOnDisplay(output, display))
    )
    const configured = get(jaPrimaryOutputId)
    if (configured) return candidates.some(([id]) => id === configured) ? configured : ""
    // On first use only, offer the first assigned external output as the default.
    return candidates[0]?.[0] || ""
}
