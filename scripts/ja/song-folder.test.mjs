import assert from "node:assert/strict"
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { test } from "node:test"
import { scanSongTextFiles } from "../../src/electron/data/jaSongScanner.ts"

test("JA TXT folder import scans subfolders, preserves sources and strips UTF-8 BOM", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "ja-songs-"))
    try {
        await mkdir(path.join(dir, "Cantos"))
        await writeFile(path.join(dir, "070 - Himno.TXT"), "\uFEFFPrimera estrofa\n\nSegunda estrofa")
        await writeFile(path.join(dir, "Cantos", "Canto joven.txt"), "Joven canción\n\nCoro")
        await writeFile(path.join(dir, "ignore.mp3"), "audio")
        await writeFile(path.join(dir, "blank.txt"), "   ")
        const before = await readFile(path.join(dir, "070 - Himno.TXT"), "utf8")
        const result = await scanSongTextFiles(dir)
        assert.equal(result.files.length, 2)
        assert.equal(result.ignored, 1)
        assert.ok(result.files.some((f) => f.relativePath === "070 - Himno.TXT" && f.content.startsWith("Primera")))
        assert.ok(result.files.some((f) => f.relativePath === "Cantos/Canto joven.txt"))
        assert.equal(await readFile(path.join(dir, "070 - Himno.TXT"), "utf8"), before)
    } finally {
        await rm(dir, { recursive: true, force: true })
    }
})

test("JA TXT folder importer ignores symbolic links", async (t) => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "ja-symlinks-"))
    try {
        const file = path.join(dir, "real.txt")
        await writeFile(file, "Canto de prueba")
        try { await symlink(file, path.join(dir, "duplicate.txt")) }
        catch { t.skip("Symlinks unavailable on this system"); return }
        const result = await scanSongTextFiles(dir)
        assert.equal(result.files.length, 1)
        assert.equal(result.files[0].name, "real")
    } finally {
        await rm(dir, { recursive: true, force: true })
    }
})
