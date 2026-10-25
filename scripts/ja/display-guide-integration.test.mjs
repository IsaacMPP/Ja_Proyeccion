import { test } from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

test("Acceso rápido al asistente desde JA Proyección", async () => {
    const top = await readFile("src/frontend/components/main/Top.svelte", "utf8")
    assert.match(top, /ja-display-assistant/)
    assert.match(top, /activePopup\.set\("choose_screen"\)/)
    assert.match(top, /Pantallas/)
})
test("La detección distingue el monitor principal y conserva la API existente", async () => {
    const backend = await readFile("src/electron/IPC/responsesMain.ts", "utf8")
    assert.match(backend, /Main\.GET_DISPLAYS/)
    assert.match(backend, /screen\.getPrimaryDisplay\(\)/)
    assert.match(backend, /isPrimary: display\.id === primaryId/)
})
test("El asistente no proyecta automáticamente en el monitor del operador", async () => {
    const screens = await readFile("src/frontend/components/settings/Screens.svelte", "utf8")
    assert.match(screens, /isExternalDisplay\(display, screens\)/)
    assert.match(screens, /No proyectar aquí/)
    assert.match(screens, /Usar como proyector/)
    assert.match(screens, /Identificar pantallas/)
    assert.match(screens, /Actualizar/)
    assert.match(screens, /Win \+ P/)
})
test("Guía y avanzado comparten el motor de FreeShow", async () => {
    const screens = await readFile("src/frontend/components/settings/Screens.svelte", "utf8")
    assert.match(screens, /getPhysicalOutputId/)
    assert.match(screens, /addOutput\(false, "", false, "Proyector"\)/)
    assert.match(screens, /toggleOutputs\(\[selectedId\], \{ state: true \}\)/)
    assert.match(screens, /send\(OUTPUT, \["UPDATE_BOUNDS"\]/)
    assert.match(screens, /showAdvancedScreens/)
})
