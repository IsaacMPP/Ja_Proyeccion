import assert from "node:assert/strict"
import { test } from "node:test"
import { resolvePhysicalDisplayBounds } from "../../src/electron/output/helpers/displayRouting.ts"

const primary = { id: 10, bounds: { x: 0, y: 0, width: 1920, height: 1080 } }
const left = { id: 20, bounds: { x: -1280, y: 0, width: 1280, height: 720 } }
const above = { id: 30, bounds: { x: 0, y: -1080, width: 1920, height: 1080 } }

test("Pantalla elegida prevalece sobre coordenadas anteriores en la laptop", () => {
    assert.deepEqual(resolvePhysicalDisplayBounds({
        displays: [primary, left], bounds: primary.bounds, targetScreenId: "20",
        controllerScreenId: 10, autoPosition: false
    }), left.bounds)
})
test("Modo automático ubica el proyector a la izquierda sin mover Windows", () => {
    assert.deepEqual(resolvePhysicalDisplayBounds({
        displays: [left, primary], bounds: primary.bounds, targetScreenId: "10",
        controllerScreenId: 10, autoPosition: true
    }), left.bounds)
})
test("Si el monitor elegido está arriba, respeta su ID y resolución", () => {
    assert.deepEqual(resolvePhysicalDisplayBounds({
        displays: [primary, above, left], bounds: primary.bounds,
        targetScreenId: "30", controllerScreenId: 10, autoPosition: true
    }), above.bounds)
})
test("Una configuración manual bloqueada mantiene sus coordenadas", () => {
    assert.deepEqual(resolvePhysicalDisplayBounds({
        displays: [primary, left], bounds: primary.bounds, targetScreenId: "20",
        controllerScreenId: 10, autoPosition: true, boundsLocked: true
    }), primary.bounds)
})
test("Con tres pantallas sin selección no inventa qué proyector usar", () => {
    assert.deepEqual(resolvePhysicalDisplayBounds({
        displays: [primary, left, above], bounds: primary.bounds,
        controllerScreenId: 10, autoPosition: true
    }), primary.bounds)
})
test("La posición externa ya guardada permanece al ejecutar proyección automática", () => {
    assert.deepEqual(resolvePhysicalDisplayBounds({
        displays: [primary, left], bounds: left.bounds, targetScreenId: "20",
        controllerScreenId: 10, autoPosition: true
    }), left.bounds)
})
