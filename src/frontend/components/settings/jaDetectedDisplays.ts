import { writable } from "svelte/store"
import { Main } from "../../../types/IPC/Main"
import { requestMain } from "../../IPC/main"
import type { JADisplay } from "./displayGuide"

// Read-only snapshot of actual displays reported by Electron/Windows.
export const jaDetectedDisplays = writable<JADisplay[]>([])
let latestRequest = 0
export async function refreshJADetectedDisplays(): Promise<JADisplay[]> {
    const request = ++latestRequest
    try {
        const displays = await requestMain(Main.GET_DISPLAYS)
        if (!Array.isArray(displays)) return []
        if (request === latestRequest) jaDetectedDisplays.set(displays)
        return displays
    } catch (error) {
        console.warn("JA: no se pudieron consultar monitores", error)
        if (request === latestRequest) jaDetectedDisplays.set([])
        return []
    }
}
