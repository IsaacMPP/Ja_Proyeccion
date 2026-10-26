import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

test("Himnario has its own tab and reuses the native Media browser", () => {
    const read = (file) => fs.readFileSync(file, "utf8")
    assert.match(read("src/types/Tabs.ts"), /"hymnal"/)
    assert.match(read("src/frontend/values/tabs.ts"), /hymnal: \{ name: "Himnario"/)
    assert.match(read("src/frontend/components/drawer/Content.svelte"), /<HymnalContent/)
    assert.match(read("src/frontend/components/drawer/Navigation.svelte"), /<HymnalTabs/)
    const library = read("src/frontend/components/drawer/media/HymnalContent.svelte")
    assert.match(library, /jaLibraryRole === "hymnal"/)
    assert.match(library, /<Media active=\{hymnalFolder\}/)
    assert.match(library, /activeDrawerTab\.set\("media"\)/)
    assert.match(read("src/frontend/components/drawer/Drawer.svelte"), /tab\.id === "hymnal" \? "media"/)
})

test("worship tabs stay together and related media tabs stay adjacent", () => {
    const tabs = fs.readFileSync("src/frontend/values/tabs.ts", "utf8")
    const order = ["shows:", "hymnal:", "scripture:", "media:", "audio:", "overlays:", "templates:", "calendar:", "functions:"]
    const positions = order.map((name) => tabs.indexOf("\n    " + name))
    assert.ok(positions.every((pos) => pos >= 0), "all tabs exist")
    assert.ok(positions.every((pos, i) => i === 0 || pos > positions[i - 1]), "tab ordering must match the agreed workflow")
})
