import assert from "node:assert/strict"
import { test } from "node:test"
import { readFile } from "node:fs/promises"

const asset = "public/ja-bibles/rv1909.fsb"
test("El instalador contiene RV1909 completa, en español y sin Internet", async () => {
    const raw = await readFile(asset, "utf8")
    const [id, bible] = JSON.parse(raw)
    assert.equal(id, "ja-rv1909")
    assert.equal(bible.name, "Reina-Valera 1909 (RV1909)")
    assert.equal(bible.metadata.license, "Public Domain")
    assert.equal(bible.books.length, 66)
    assert.equal(bible.books.reduce((sum, book) => sum + book.chapters.length, 0), 1189)
    const count = bible.books.reduce((sum, book) => sum + book.chapters.reduce((s, chapter) => s + chapter.verses.length, 0), 0)
    assert.ok(count >= 30000 && count <= 32000, "Texto completo de la Biblia")
    assert.equal(bible.books[0].name, "Génesis")
    assert.equal(bible.books[39].name, "Mateo")
    assert.ok(bible.books[0].chapters[0].verses[0].text.includes("Dios"))
    assert.ok(bible.books[42].chapters[2].verses.find(v => v.number === 16)?.text.includes("Dios"))
})
test("El motor de Biblia sabe leer el archivo de recursos empaquetados", async () => {
    const [ipc, loader, startup, builder] = await Promise.all([
        readFile("src/electron/IPC/responsesMain.ts", "utf8"),
        readFile("src/frontend/components/drawer/bible/jaBundledBible.ts", "utf8"),
        readFile("src/frontend/utils/updateSettings.ts", "utf8"),
        readFile("config/building/electron-builder.yaml", "utf8")
    ])
    assert.match(ipc, /app\.getAppPath\(\)/)
    assert.match(ipc, /ja-bibles/)
    assert.match(ipc, /rv1909\.fsb/)
    assert.match(loader, /registerJARV1909/)
    assert.match(loader, /bundled\?\.content\?\.\[1\]\?\.books\?\.length !== 66/)
    assert.match(startup, /void registerJARV1909\(\)/)
    assert.match(builder, /public\/\*\*/)
})
