import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

test("ordinary media click targets only the selected main output", () => {
  const card=fs.readFileSync("src/frontend/components/drawer/media/MediaCard.svelte","utf8")
  assert.ok(card.includes("getJAPrimaryOutputId($outputs, $jaDetectedDisplays)"))
  assert.ok(card.includes(".filter((output) => output.id === primaryId)"))
  assert.ok(card.includes("clearBackground(output.id)"))
  assert.ok(card.includes('type === "video" ? { muted: forceMuted }'))
})
test("operator chooses and persists main projector and disconnected output never falls back", () => {
  const logic=fs.readFileSync("src/frontend/components/settings/jaPrimaryOutput.ts","utf8")
  const screens=fs.readFileSync("src/frontend/components/settings/Screens.svelte","utf8")
  assert.ok(logic.includes("localStorage.setItem(storageKey, id)"))
  assert.ok(logic.includes('if (configured) return candidates.some(([id]) => id === configured) ? configured : ""'))
  assert.ok(screens.includes("Establecer como principal"))
})
test("right click distinguishes main with audio and auxiliary without audio", () => {
  const menu=fs.readFileSync("src/frontend/components/context/contextMenus.ts","utf8")
  const click=fs.readFileSync("src/frontend/components/context/menuClick.ts","utf8")
  assert.ok(menu.includes("Proyectar en principal (con audio)"))
  assert.ok(menu.includes("Enviar a otra pantalla"))
  assert.ok(click.includes("const muted = !isPrimary"))
})
