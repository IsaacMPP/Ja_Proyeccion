import assert from "node:assert/strict"
import { test } from "node:test"
import { readFile } from "node:fs/promises"

test("Portadas: guarda JPG/PNG en datos JA sin sobrescribir archivos originales", async () => {
    const c = await readFile("src/electron/data/jaVideoCovers.ts", "utf8")
    assert.match(c, /selectFilesDialog\("Elegir portada del video"/)
    assert.match(c, /extensions: \["jpg", "jpeg", "png"\]/)
    assert.match(c, /getDataFolderPath\("userData", "JA-Video-Covers"\)/)
    assert.match(c, /await fs\.copyFile\(input, destination\)/)
    assert.match(c, /randomUUID\(\)/)
    assert.match(c, /MAX_IMAGE_BYTES/)
    assert.match(c, /MAX_IMAGE_PIXELS/)
    assert.match(c, /ownCoverPath\(videoPath, coverPath\)/)
    assert.doesNotMatch(c, /fs\.(writeFile|rename|unlink)\(videoPath/)
})
test("Portadas: API IPC tipada para elegir/restaurar desde la tarjeta", async () => {
    const [types, ipc, card] = await Promise.all([
        readFile("src/types/IPC/Main.ts", "utf8"),
        readFile("src/electron/IPC/responsesMain.ts", "utf8"),
        readFile("src/frontend/components/drawer/media/MediaCard.svelte", "utf8")
    ])
    for (const op of ["JA_PICK_VIDEO_COVER", "JA_REMOVE_VIDEO_COVER"]) {
        assert.match(types, new RegExp(op))
        assert.match(ipc, new RegExp(op))
        assert.match(card, new RegExp(op))
    }
    assert.match(card, /Elegir portada JPG o PNG/)
    assert.match(card, /Restaurar miniatura automática/)
    assert.match(card, /type === "video"/)
    assert.match(card, /thumbnailPath=\{previewCoverPath\}/)
})
test("Portadas: metadata por ruta queda en store MEDIA, guardado al reiniciar", async () => {
    const [types, card, saves, backend] = await Promise.all([
        readFile("src/types/Main.ts", "utf8"),
        readFile("src/frontend/components/drawer/media/MediaCard.svelte", "utf8"),
        readFile("src/frontend/utils/save.ts", "utf8"),
        readFile("src/electron/data/store.ts", "utf8")
    ])
    assert.match(types, /jaCoverPath\?: string/)
    assert.match(card, /jaCoverPath: chosen\.path/)
    assert.match(card, /delete next\[path\]\.jaCoverPath/)
    assert.match(card, /save\(\)/)
    assert.match(saves, /MEDIA: get\(media\)/)
    assert.match(backend, /MEDIA: \{ fileName: "media"/)
})
