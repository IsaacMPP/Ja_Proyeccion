import assert from "node:assert/strict"
import { test } from "node:test"
import { readFile } from "node:fs/promises"
import { baseVerseNumber, selectedBaseVerseNumbers } from "../../src/frontend/components/drawer/bible/jaVerseNavigation.ts"

test("Subversos y fragmentos de versículos largos no producen NaN", () => {
    assert.equal(baseVerseNumber("2_1"), 2)
    assert.equal(baseVerseNumber("2_4"), 2)
    assert.equal(baseVerseNumber("3-5"), 3)
    assert.equal(baseVerseNumber(4), 4)
    assert.ok(Number.isNaN(baseVerseNumber("texto")))
    assert.deepEqual(selectedBaseVerseNumbers([["1_1"], ["1_2"], [2, "3_1"], ["4-5"]]), [1,2,3,4])
    assert.deepEqual(selectedBaseVerseNumbers([["10"], ["11"], ["11_3"], ["x"]]), [10,11])
})
test("Navegación bíblica espera que el versículo esté cargado antes de proyectarlo", async () => {
    const src = await readFile("src/frontend/components/drawer/bible/Scripture.svelte", "utf8")
    assert.doesNotMatch(src, /getVerses\(verseNumbers\.map\(Number\)\)/)
    assert.match(src, /currentData\.getVerses\(baseNumbers\)/)
    assert.match(src, /await openVerse\(\[newSelection\]\)/)
    assert.match(src, /if \(isActiveInOutput\) await playScripture\(\)/)
    assert.match(src, /await openBook\(newSelection\.book, newSelection\.chapters/)
    assert.match(src, /navigateVerse\(e\.key === "ArrowLeft"\)/)
    assert.match(src, /let navigatingVerse = false/)
})
test("Diseño en vivo: eventos input, salida activa y color sin imagen previa", async () => {
    const [info, projection] = await Promise.all([
        readFile("src/frontend/components/drawer/info/ScriptureInfo.svelte", "utf8"),
        readFile("src/frontend/components/drawer/bible/scripture.ts", "utf8")
    ])
    assert.match(info, /refreshLiveJAScripture\(\)/)
    assert.match(info, /on:input=\{\(e\) => setJAStyle\("fontSize"/)
    assert.match(info, /on:input=\{\(e\) => setJAStyle\("color"/)
    assert.match(info, /on:input=\{\(e\) => setJAStyle\("backgroundColor"/)
    assert.match(info, /updated\.backgroundPath = ""/)
    assert.match(info, /<details class="ja-scripture-preview">/)
    assert.ok(info.indexOf('<section class="ja-bible-design"') < info.indexOf('<Zoomed'))
    assert.match(projection, /function refreshLiveJAScripture\(/)
    assert.match(projection, /setOutput\("background", null\)/)
    assert.match(projection, /lastScriptureBackground/)
})
