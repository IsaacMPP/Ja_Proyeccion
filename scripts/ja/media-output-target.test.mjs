import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

test("media context menu lists only active enabled non-stage output targets", () => {
 const menus=fs.readFileSync("src/frontend/components/context/contextMenus.ts","utf8")
 const loaders=fs.readFileSync("src/frontend/components/context/loadItems.ts","utf8")
 assert.ok(menus.includes('"ja_send_to_output"'))
 assert.ok(menus.includes('"LOAD_ja_media_outputs"'))
 assert.ok(loaders.includes("output.enabled && output.active && !output.stageOutput && output.screen"))
 assert.ok(loaders.includes("display.isPrimary"))
 assert.ok(loaders.includes("Sin asignar"))
 assert.ok(loaders.includes("ja_configure_screens"))
})
test("target action uses the selected output only, with native FreeShow dispatch", () => {
 const actions=fs.readFileSync("src/frontend/components/context/menuClick.ts","utf8")
 const item=fs.readFileSync("src/frontend/components/context/ContextItem.svelte","utf8")
 assert.ok(item.includes('menu?.id?.startsWith("ja_media_output:")'))
 assert.ok(item.includes('menu?.id === "ja_configure_screens"'))
 assert.ok(actions.includes('id.startsWith("ja_media_output:")'))
 assert.ok(actions.includes("!target?.enabled || !target.active || target.stageOutput"))
 assert.ok(actions.includes('sel.id !== "media"'))
 assert.ok(actions.includes("if (!display || display.isPrimary || !isOutputOnDisplay(target, display)) return"))
 assert.ok(actions.includes('setOutput("background", { path, ...mediaStyle, type, loop, muted }, false, outputId)'))
})
