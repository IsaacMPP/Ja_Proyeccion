import assert from "node:assert/strict"
import { test } from "node:test"
import { readFile } from "node:fs/promises"
import { getJAAudioLibraryName, matchesJAAudioName, normalizeJAAudioTerm, uniqueJAAudioRoots } from "../../src/frontend/components/drawer/audio/jaAudioLibrary.ts"

test("Búsqueda por letras, acentos y palabras no contiguas", () => {
    assert.equal(normalizeJAAudioTerm("  Reúnión, Júvenil  "), "reunionjuvenil")
    assert.equal(matchesJAAudioName("Pista - Jesús mi Señor.MP3", "jesus senor"), true)
    assert.equal(matchesJAAudioName("El gozo del Señor.wav", "gozo señor"), true)
    assert.equal(matchesJAAudioName("Música para piano.mp3", "coro"), false)
})
test("Un número representa número completo, nunca extensión MP3", () => {
    assert.equal(matchesJAAudioName("001 - Himno de alabanza.mp3", "1"), true)
    assert.equal(matchesJAAudioName("Himno 025.wav", "25"), true)
    assert.equal(matchesJAAudioName("Himno 325.mp3", "25"), false)
    assert.equal(matchesJAAudioName("Sin numero.mp3", "3"), false)
    assert.equal(matchesJAAudioName("Pista 03.mp3", "03"), true)
})
test("La etiqueta de biblioteca identifica carpeta más específica, incluso a la izquierda", () => {
    const folders = {
        one: { name: "Pistas", path: "D:\\Iglesia\\Pistas" },
        two: { name: "Jóvenes", path: "D:\\Iglesia\\Pistas\\Jovenes" },
        three: { name: "Otros", path: "D:\\Iglesia\\Pistas2" }
    }
    assert.equal(getJAAudioLibraryName("D:\\Iglesia\\Pistas\\Jovenes\\01.mp3", folders), "Jóvenes")
    assert.equal(getJAAudioLibraryName("D:\\Iglesia\\Pistas\\01.mp3", folders), "Pistas")
    assert.equal(getJAAudioLibraryName("D:\\Iglesia\\Pistas2\\01.wav", folders), "Otros")
    assert.equal(getJAAudioLibraryName("D:\\Externo\\01.wav", folders), "")
})
test("Se eliminan carpetas duplicadas ignorando mayúsculas y separadores", () => {
    assert.deepEqual(uniqueJAAudioRoots({
        a: { path: "C:\\Audio\\Culto" },
        b: { path: "c:/audio/culto/" },
        c: { path: "D:/Pistas" },
        d: { path: "" }
    }), ["C:\\Audio\\Culto", "D:/Pistas"])
})
test("Integración conserva listas y reproduce con AudioPlayer, sin inventar motor nuevo", async () => {
    const [library, audioFile, audition] = await Promise.all([
        readFile("src/frontend/components/drawer/audio/Audio.svelte", "utf8"),
        readFile("src/frontend/components/drawer/audio/AudioFile.svelte", "utf8"),
        readFile("src/frontend/components/drawer/audio/AudioAudition.svelte", "utf8")
    ])
    assert.match(library, /Esta carpeta/)
    assert.match(library, /Todas las carpetas/)
    assert.match(library, /getJAAudioLibraryName/)
    assert.match(library, /matchesJAAudioName/)
    assert.match(library, /requestFiles\(source, 5\)/)
    assert.match(audioFile, /AudioPlayer\.start\(/)
    assert.match(audioFile, /Preescuchar/)
    assert.match(audition, /await routed\.setSinkId\(selectedDevice\)/)
    assert.ok(audition.indexOf("await routed.setSinkId(selectedDevice)") < audition.indexOf("await audio.play()"))
    assert.doesNotMatch(audition, /AudioPlayer\.start\(/)
    assert.doesNotMatch(audition, /autoplay/)
})
