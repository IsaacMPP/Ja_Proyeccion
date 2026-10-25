import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { test } from "node:test"

test("La identidad JA se muestra en la cabecera, inicio y créditos", async () => {
    const [top, splash, about] = await Promise.all([
        readFile("src/frontend/components/main/Top.svelte", "utf8"),
        readFile("src/frontend/components/main/Splash.svelte", "utf8"),
        readFile("src/frontend/components/main/popups/About.svelte", "utf8")
    ])
    for (const view of [top, splash, about]) {
        assert.match(view, /ja-logo\.svg/)
        assert.match(view, /Proyección/)
    }
    assert.doesNotMatch(top, /<h1[^>]*>FreeShow<\/h1>/)
    assert.doesNotMatch(splash, /<h1>FreeShow<\/h1>/)
    assert.match(about, /GPL-3\.0/)
})

test("El tema oficial usa azul, dorado y conserva los temas opcionales", async () => {
    const [themes, migration] = await Promise.all([
        readFile("src/frontend/components/settings/tabs/defaultThemes.ts", "utf8"),
        readFile("src/frontend/utils/updateSettings.ts", "utf8")
    ])
    assert.match(themes, /primary: "#102940"/)
    assert.match(themes, /secondary: "#f6bf19"/)
    assert.match(themes, /light: \{/)
    assert.match(migration, /oldFreeShowDefault/)
})

test("La ventana de carga y el título del navegador usan JA Proyección", async () => {
    const [loading, index] = await Promise.all([
        readFile("public/loading.html", "utf8"),
        readFile("public/index.html", "utf8")
    ])
    assert.match(loading, /JA Proyección/)
    assert.match(loading, /ja-logo\.svg/)
    assert.match(index, /<title>JA Proyección<\/title>/)
})
