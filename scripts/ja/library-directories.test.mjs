import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

test("JA library directories are created on startup without removing user files", () => {
    const source = fs.readFileSync("src/electron/data/jaLibraryDirectories.ts", "utf8")
    const store = fs.readFileSync("src/electron/data/store.ts", "utf8")
    for (const name of ["Himnario Adventista", "Cantos Juveniles", "Fondos Personalizados", "Especiales"]) {
        assert.ok(source.includes(name), name)
    }
    assert.match(source, /mkdirSync\(path.join\(root, directory\), \{ recursive: true \}\)/)
    assert.match(store, /ensureJALibraryDirectories\(\)/)
    assert.doesNotMatch(source, /rmSync|unlinkSync|renameSync/)
})
