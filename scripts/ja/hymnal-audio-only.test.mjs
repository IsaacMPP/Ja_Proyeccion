import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

test("all local videos reuse FreeShow audio engine without changing projection outputs", () => {
    const card = fs.readFileSync("src/frontend/components/drawer/media/MediaCard.svelte", "utf8")
    const sidebar = fs.readFileSync("src/frontend/components/drawer/navigation/HymnalTabs.svelte", "utf8")
    assert.match(card, /AudioPlayer\.start\(path, \{ name \}\)/)
    assert.match(card, /supportsAudioOnly = type === "video" && !contentProvider && !!path/)
    assert.match(card, /Solo audio: escuchar el video sin cambiar las pantallas/)
    assert.match(sidebar, /AudioPlayer\.pause\(hymnAudioId\)/)
    assert.match(sidebar, /AudioPlayer\.play\(hymnAudioId\)/)
    assert.match(sidebar, /AudioPlayer\.stop\(hymnAudioId\)/)
    assert.doesNotMatch(card.slice(card.indexOf("async function playHymnAudio"), card.indexOf("$: customCoverPath")), /setOutput\(/)
})
