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
        assert.match(view, /ja-logo\.png/)
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
    assert.match(loading, /ja-logo\.png/)
    assert.match(index, /<title>JA Proyección<\/title>/)
})

test("La vista JA corresponde a la maqueta sin imágenes de cantos ficticios", async () => {
    const [splash, top, drawer, grid, store, common, hero, logo] = await Promise.all([
        readFile("src/frontend/components/main/Splash.svelte", "utf8"),
        readFile("src/frontend/components/main/Top.svelte", "utf8"),
        readFile("src/frontend/components/drawer/Drawer.svelte", "utf8"),
        readFile("src/frontend/components/drawer/media/MediaGrid.svelte", "utf8"),
        readFile("src/frontend/stores.ts", "utf8"),
        readFile("src/frontend/utils/common.ts", "utf8"),
        readFile("public/ja-hero.jpg"),
        readFile("public/ja-logo.png")
    ])
    assert.match(splash, /ja-hero\.jpg/)
    assert.match(splash, /Presentaciones que inspiran/)
    assert.match(splash, /ja-main-action/)
    assert.match(top, /height: 58px/)
    assert.match(drawer, /height: 48px/)
    assert.match(grid, /border-radius: 7px/)
    assert.match(store, /columns: 4/)
    assert.match(common, /DEFAULT_DRAWER_HEIGHT = 365/)
    assert.ok(hero.length > 2000, "El fondo de culto debe estar empaquetado")
    assert.ok(logo.length > 2000, "El emblema real debe estar empaquetado")
    assert.doesNotMatch(splash, /01 - Firmes y Adelante\.mp4/)
})

test("El icono de Windows y el logotipo JA coinciden y no usan AOP", async () => {
    const [logo, icon, loading] = await Promise.all([
        readFile("public/ja-logo.png"),
        readFile("public/icon.png"),
        readFile("public/loading.html", "utf8")
    ])
    assert.ok(logo.equals(icon), "El icono y el logo usan el mismo emblema JA")
    assert.equal(logo.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "El logo debe ser un PNG válido")
    assert.ok(logo.readUInt32BE(16) >= 256, "El logo debe tener al menos 256 px de ancho")
    assert.ok(logo.readUInt32BE(20) >= 256, "El logo debe tener al menos 256 px de alto")
    assert.match(loading, /object-fit: cover/)
    assert.doesNotMatch(loading, /AOP/)
    assert.match(loading, /justify-content: center/)
    assert.match(loading, /white-space: nowrap/)
})
