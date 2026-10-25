import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const helper = fs.readFileSync("src/frontend/components/drawer/media/jaHymnal.ts", "utf8")
const media = fs.readFileSync("src/frontend/components/drawer/media/Media.svelte", "utf8")
test("Hymnal searches only linked hymnal folder by number or title", () => {
    assert.match(helper, /export function parseJAHymn/)
    assert.match(helper, /export function matchesJAHymn/)
    assert.match(helper, /export function compareJAHymns/)
    assert.match(media, /jaLibraryRole === "hymnal"/)
    assert.match(media, /!isJAHymnal && jaSearchScope === "all"/)
    assert.match(media, /compareJAHymns\(a.name, b.name\)/)
    assert.match(media, /matchesJAHymn\(item.name, searchValue\)/)
    assert.match(media, /<MediaGrid items=\{searchedFiles\}/)
    assert.match(media, /<Media credits=/)
})
