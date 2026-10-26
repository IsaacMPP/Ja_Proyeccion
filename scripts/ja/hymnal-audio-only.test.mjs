import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

test("all local videos reuse FreeShow audio engine without changing projection outputs", () => {
    const card = fs.readFileSync("src/frontend/components/drawer/media/MediaCard.svelte", "utf8")
    const sidebar = fs.readFileSync("src/frontend/components/drawer/navigation/HymnalTabs.svelte", "utf8")
    assert.match(card, /AudioPlayer\.start\(path, \{ name \}\)/)
    assert.match(card, /supportsAudioOnly = type === "video" && !contentProvider && !!path/)
    assert.match(card, /Solo audio: escuchar el video sin cambiar las pantallas/)
    const globalAudio = fs.readFileSync("src/frontend/components/output/tools/Audio.svelte", "utf8")
    assert.ok(globalAudio.includes("AudioPlayer.start(path"), "global audio transport must start audio")
    assert.ok(globalAudio.includes("AudioPlayer.stop(key)"), "global audio transport must stop audio")
    assert.ok(!sidebar.includes("AudioPlayer."), "Himnario must not duplicate transport controls")
    assert.doesNotMatch(card.slice(card.indexOf("async function playHymnAudio"), card.indexOf("$: customCoverPath")), /setOutput\(/)
})
