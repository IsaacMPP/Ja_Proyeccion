import assert from "node:assert/strict"
import { test } from "node:test"
import { readFile } from "node:fs/promises"
import { applyJAScriptureDesign, readJAScriptureDesign, DEFAULT_JA_SCRIPTURE_DESIGN, JA_SCRIPTURE_TEMPLATE_ID } from "../../src/frontend/components/drawer/bible/jaScriptureDesign.ts"
import { findSpanishEdition, JA_SPANISH_EDITIONS } from "../../src/frontend/components/drawer/bible/jaSpanishBibles.ts"

test("El catálogo tiene ediciones pedidas pero no distribuye sus textos protegidos", () => {
    assert.ok(JA_SPANISH_EDITIONS.find(x => x.code === "RVR1960" && x.copyright))
    assert.ok(JA_SPANISH_EDITIONS.find(x => x.code === "RVR1995" && x.copyright))
    assert.ok(JA_SPANISH_EDITIONS.find(x => x.code === "NVI" && x.copyright))
    assert.ok(JA_SPANISH_EDITIONS.find(x => x.code === "RV1909" && !x.copyright))
    assert.equal(findSpanishEdition("Reina-Valera 1960"), "RVR1960")
    assert.equal(findSpanishEdition("RVR 95"), "RVR1995")
    assert.equal(findSpanishEdition("Nueva Versión Internacional"), "NVI")
    assert.equal(findSpanishEdition("Reina-Valera 1909"), "RV1909")
    assert.equal(findSpanishEdition("Reina Valera sin año"), "")
})
const original = {
    name: "Original", color: null, category: "scripture",
    settings: { mode: "scripture", backgroundColor: "#000000", styleOverrides: [{ id: "brackets", pattern: "[]", templateId: "brackets" }] },
    items: [
        { style: "top: 20px;", align: "", lines: [{ align: "text-align: left;", text: [{ value: "{scripture_number}", style: "font-size:40px;" }, { value: "{scripture_text}", style: "font-size:80px;color: #ffffff;" }] }] },
        { style: "top: 900px;", align: "", lines: [{ align: "", text: [{ value: "{scripture_reference}", style: "font-size:55px;" }] }] }
    ]
}
test("El diseño JA personaliza los versos sin cambiar referencia ni plantilla original", () => {
    const styled = applyJAScriptureDesign(original, { ...DEFAULT_JA_SCRIPTURE_DESIGN, fontFamily: "Georgia", fontSize: 92, align: "right", color: "#ffeedd", backgroundColor: "#123456", backgroundPath: "C:/Fondos/imagen.jpg" })
    assert.equal(styled.name, "Biblia JA — personalizado")
    assert.equal(styled.items[0].lines[0].align, "text-align: right;")
    assert.match(styled.items[0].lines[0].text[1].style, /font-size: 92px/)
    assert.match(styled.items[0].lines[0].text[1].style, /Georgia/)
    assert.equal(styled.settings.backgroundColor, "#123456")
    assert.equal(styled.settings.backgroundPath, "C:/Fondos/imagen.jpg")
    assert.equal(styled.items[1].lines[0].text[0].style, "font-size:55px;")
    assert.equal(original.items[0].lines[0].text[1].style, "font-size:80px;color: #ffffff;")
    assert.equal(readJAScriptureDesign(styled).fontSize, 92)
    assert.equal(readJAScriptureDesign(styled).fontFamily, "Georgia")
})
test("Limita tamaños, tipografías, colores y rutas de fondo inesperados", () => {
    const changed = applyJAScriptureDesign(original, { ...DEFAULT_JA_SCRIPTURE_DESIGN, fontFamily: "url(evil)", fontSize: 400, color: "red; background:blue", backgroundColor: "purple", backgroundPath: "javascript:alert(1)" })
    assert.match(changed.items[0].lines[0].text[1].style, /font-size: 160px/)
    assert.equal(changed.settings.backgroundPath, "")
    assert.equal(changed.settings.backgroundColor, "#ffffff")
    assert.equal(JA_SCRIPTURE_TEMPLATE_ID, "ja_scripture_custom")
})
test("Flechas solas y controles visibles, sin secuestrar búsqueda", async () => {
    const [scripture, info, tabs] = await Promise.all([
        readFile("src/frontend/components/drawer/bible/Scripture.svelte", "utf8"),
        readFile("src/frontend/components/drawer/info/ScriptureInfo.svelte", "utf8"),
        readFile("src/frontend/components/drawer/navigation/ScriptureTabs.svelte", "utf8")
    ])
    assert.match(scripture, /jaArrowsEnabled/)
    assert.match(scripture, /e\.preventDefault\(\)/)
    assert.match(scripture, /closest\("input, textarea, select, button/)
    assert.match(scripture, /_moveSelection\(e\.key === "ArrowLeft"\)/)
    assert.match(info, /"fontFamily"/)
    assert.match(info, /"fontSize"/)
    assert.match(info, /"backgroundPath"/)
    assert.match(info, /"backgroundColor"/)
    assert.match(info, /"align"/)
    assert.match(info, /save\(\)/)
    assert.match(tabs, /setDrawerTabData\("scripture", existing\.id\)/)
    assert.match(tabs, /Biblias en español/)
    assert.match(tabs, /sin autorización/)
})
