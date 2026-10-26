import assert from "node:assert/strict"
import test from "node:test"
import { defaultJALibraryPath, withDefaultJALibraries, getPrimaryJALibraryId } from "../../src/frontend/components/drawer/media/jaDefaultLibraries.ts"

test("registers physical JA folders from the program data root", () => {
    const root = "C:\\Users\\Example\\Documents\\JA Proyección"
    const folders = withDefaultJALibraries({}, root)
    assert.equal(Object.keys(folders).length, 4)
    assert.equal(folders["ja-default-hymnal"].path, root + "\\Himnario Adventista")
    assert.equal(folders["ja-default-songs"].jaLibraryRole, "songs")
    assert.equal(folders["ja-default-backgrounds"].jaLibraryRole, "backgrounds")
    assert.equal(folders["ja-default-specials"].jaLibraryRole, "specials")
    assert.equal(withDefaultJALibraries(folders, root), folders, "no duplicate registration")
})

test("keeps existing linked folders and repairs role on a matching default folder", () => {
    const root = "C:\\JA Proyección"
    const folders = {
        original: { path: root + "\\Himnario Adventista", name: "Mis himnos" },
        external: { path: "D:\\Iglesia\\Himnos", name: "Himnos externos", jaLibraryRole: "hymnal" }
    }
    const registered = withDefaultJALibraries(folders, root)
    assert.equal(registered.original.jaLibraryRole, "hymnal")
    assert.equal(registered.external.path, folders.external.path)
    assert.equal(registered["ja-default-hymnal"], undefined)
    assert.equal(getPrimaryJALibraryId(registered, root, "hymnal"), "original")
})

test("returns external role library as fallback if no default is registered", () => {
    const folders = { external: { path: "D:\\Hymns", name: "External", jaLibraryRole: "hymnal" } }
    assert.equal(getPrimaryJALibraryId(folders, "C:\\JA Proyección", "hymnal"), "external")
})
