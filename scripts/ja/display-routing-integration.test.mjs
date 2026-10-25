import assert from "node:assert/strict"
import { test } from "node:test"
import { readFile } from "node:fs/promises"

test("El motor respeta la pantalla elegida incluso si coordenadas anteriores eran de la laptop", async () => {
    const [routing, visibility] = await Promise.all([
        readFile("src/electron/output/helpers/displayRouting.ts", "utf8"),
        readFile("src/electron/output/helpers/OutputVisibility.ts", "utf8")
    ])
    assert.match(visibility, /resolvePhysicalDisplayBounds\(/)
    assert.match(visibility, /targetScreenId: output\.screen/)
    assert.match(routing, /selected && \(!autoPosition \|\| selected\.id !== controllerScreenId\)/)
})
test("La ventana de proyección se mueve ANTES de mostrarse y protege los controles", async () => {
    const visibility = await readFile("src/electron/output/helpers/OutputVisibility.ts", "utf8")
    assert.match(visibility, /unassignedOutputOnOperator/)
    assert.match(visibility, /windowCoveringMain/)
    assert.match(visibility, /displays\.length <= 1/)
    assert.ok(visibility.indexOf("window.setBounds(bounds)") < visibility.indexOf("this.showWindow(window"), "Mover primero y mostrar después")
})
