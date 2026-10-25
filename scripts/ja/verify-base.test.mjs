import test from "node:test"
import assert from "node:assert/strict"
import { verifyBase, required } from "./verify-base.mjs"

test("la base fuente está completa", () => {
    assert.deepEqual(verifyBase(), [])
})
test("rutas críticas incluyen Biblia, video y audio", () => {
    for (const target of ["Scripture.svelte", "VideoShow.svelte", "AudioPreview.svelte"]) {
        assert.ok(required.some((p) => p.endsWith(target)))
    }
})
