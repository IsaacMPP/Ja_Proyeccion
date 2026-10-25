import { test } from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { compile, preprocess } from "svelte/compiler"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

// Detectar errores de sintaxis Svelte en los módulos JA ANTES de ejecutar
// todo el build de Windows. Los tests de cadenas no detectaban este fallo.
const paths = [
    "src/frontend/components/drawer/info/ScriptureInfo.svelte",
    "src/frontend/components/drawer/navigation/ScriptureTabs.svelte",
    "src/frontend/components/drawer/bible/Scripture.svelte"
]

test("Los componentes JA de Biblia se procesan y compilan con Svelte 3", async () => {
    for (const filename of paths) {
        const source = await readFile(filename, "utf8")
        const preprocessed = await preprocess(source, vitePreprocess(), { filename })
        const result = compile(preprocessed.code, { filename, generate: false, css: false })
        assert.ok(result.ast, filename + " debe parsear sin errores")
    }
})
test("Los handlers de alineación no usan aserciones TypeScript en el markup", async () => {
    const s = await readFile(paths[0], "utf8")
    assert.match(s, /function changeJAAlignment\(value: string\)/)
    assert.match(s, /on:change=\{\(e\) => changeJAAlignment\(e\.currentTarget\.value\)\}/)
    assert.doesNotMatch(s, /e\.currentTarget\.value as JAScriptureDesign/)
    assert.match(s, /\^scripture_\[0-9\]\+\$/)
})
