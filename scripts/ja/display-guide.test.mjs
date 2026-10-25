import { test } from "node:test"
import assert from "node:assert/strict"
import { getPhysicalOutputId, isExternalDisplay } from "../../src/frontend/components/settings/displayGuide.ts"

const primary = { id: 10, bounds: { x: 0, y: 0, width: 1920, height: 1080 }, isPrimary: true }
const external = { id: 20, bounds: { x: -1920, y: 0, width: 1920, height: 1080 }, isPrimary: false }

test("Protege la pantalla principal: nunca la ofrece como proyector rápido", () => {
    assert.equal(isExternalDisplay(primary, [primary, external]), false)
    assert.equal(isExternalDisplay(external, [primary, external]), true)
    assert.equal(isExternalDisplay(primary, [primary]), false)
    assert.equal(isExternalDisplay({ ...external, isPrimary: undefined }, [primary, external]), false)
})
test("Respeta pantallas externas ubicadas a la izquierda o arriba", () => {
    const above = { ...external, bounds: { x: 0, y: -1080, width: 1920, height: 1080 } }
    assert.equal(isExternalDisplay(above, [primary, above]), true)
})
test("Elige una salida física y nunca configura accidentalmente NDI o escenario", () => {
    const outputs = {
        ndi: { enabled: true, ndi: true },
        stage: { enabled: true, stageOutput: "stage-id" },
        physical: { enabled: false, invisible: false },
        capture: { enabled: true, invisible: true }
    }
    assert.equal(getPhysicalOutputId(outputs, "ndi"), "physical")
    assert.equal(getPhysicalOutputId(outputs, "physical"), "physical")
    assert.equal(getPhysicalOutputId({ ndi: { ndi: true }, stage: { stageOutput: "x" } }, "ndi"), "")
})
test("No modifica entradas y permite múltiples pantallas", () => {
    const input = { x: { active: true }, y: { ndi: true } }
    assert.equal(getPhysicalOutputId(input, "x"), "x")
    assert.deepEqual(input, { x: { active: true }, y: { ndi: true } })
})
