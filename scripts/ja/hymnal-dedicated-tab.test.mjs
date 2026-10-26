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
