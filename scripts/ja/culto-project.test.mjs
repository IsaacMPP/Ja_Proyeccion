import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const helper = fs.readFileSync("src/frontend/components/show/jaCultoProject.ts", "utf8")
const projects = fs.readFileSync("src/frontend/components/show/Projects.svelte", "utf8")
test("JA service template creates editable native project sections", () => {
    assert.match(helper, /type: "section"/)
    assert.match(helper, /"Lectura bíblica"/)
    assert.match(helper, /"Canto de apertura"/)
    assert.match(helper, /"Tema central"/)
    assert.match(helper, /parent: "\/"/)
    assert.match(projects, /on:click=\{createCultoJA\}/)
    assert.match(projects, /id: "project"/)
    assert.match(projects, /openProject\(id, false\)/)
})
