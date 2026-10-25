import assert from "node:assert/strict"
import { test } from "node:test"
import { getJAVideoLibraryName, matchesJAVideoName } from "../../src/frontend/components/drawer/media/jaVideoLibrary.ts"

test("Busca videos sin diferenciar acentos ni mayúsculas", () => {
    assert.equal(matchesJAVideoName("Cántico de Jóvenes.mp4", "cantico jovenes"), true)
    assert.equal(matchesJAVideoName("Canto para conquistadores.mkv", "aventu"), false)
})
test("Encuentra un número de himno con o sin ceros iniciales", () => {
    assert.equal(matchesJAVideoName("001 - Alabanza.mp4", "1"), true)
    assert.equal(matchesJAVideoName("Himno 1.avi", "001"), true)
    assert.equal(matchesJAVideoName("Himno 11.mp4", "1"), false)
})
test("Identifica carpeta raíz y subcarpeta sin mezclar nombres iguales", () => {
    const folders = {
        a: {name:"Himnario Adventista",path:"C:\\Iglesia\\Videos\\Himnos"},
        b: {name:"Cantos Jóvenes",path:"C:\\Iglesia\\Videos\\Jovenes"}
    }
    assert.equal(getJAVideoLibraryName("C:\\Iglesia\\Videos\\Himnos\\001.mp4", folders), "Himnario Adventista")
    assert.equal(getJAVideoLibraryName("C:\\Iglesia\\Videos\\Jovenes\\Especial\\001.mkv", folders), "Cantos Jóvenes")
    assert.equal(getJAVideoLibraryName("C:\\Iglesia\\Videos\\Himnos-Otros\\001.mp4", folders), "")
})
