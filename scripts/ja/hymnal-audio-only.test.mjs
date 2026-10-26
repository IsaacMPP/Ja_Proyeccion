import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

test("all local videos reuse FreeShow audio engine without changing projection outputs", () => {
    const card = fs.readFileSync("src/frontend/components/drawer/media/MediaCard.svelte", "utf8")
    const sidebar = fs.readFileSync("src/frontend/components/drawer/navigation/HymnalTabs.svelte", "utf8")
    assert.ok(card.includes("AudioPlayer.start(path, { name }, { pauseIfPlaying: false })"), "audio-only must use the shared player without pausing an existing track")
    assert.match(card, /supportsAudioOnly = type === "video" && !contentProvider && !!path/)
    assert.match(card, /Solo audio: escuchar el video sin cambiar las pantallas/)
    const globalAudio = fs.readFileSync("src/frontend/components/output/tools/Audio.svelte", "utf8")
    assert.ok(globalAudio.includes("AudioPlayer.start(path"), "global audio transport must start audio")
    assert.ok(globalAudio.includes("AudioPlayer.stop(key)"), "global audio transport must stop audio")
    assert.ok(!sidebar.includes("AudioPlayer."), "Himnario must not duplicate transport controls")
    const audioAction = card.slice(card.indexOf("async function playHymnAudio"), card.indexOf("$: customCoverPath"))
    assert.ok(audioAction.includes("matchingOutputs"), "do not alter unrelated outputs")
    assert.ok(audioAction.includes("!AudioPlayer.audioExists(path)"), "verify actual audio player state")
    assert.ok(audioAction.includes("clearBackground(outputId)"), "remove matching video before starting audio")
    assert.ok(audioAction.includes("while (VideoPlayer.audioExists(path)"), "wait for video fade-out to release playback before starting sound")
    assert.ok(audioAction.indexOf("while (VideoPlayer.audioExists(path)") < audioAction.indexOf("await AudioPlayer.start("), "audio starts only after video exits")
    assert.ok(audioAction.includes('if (!current) setOutput("background", background, false, outputId)'), "restore only if audio failed and output remains empty")
    assert.ok(audioAction.includes("=== path"), "preserve unrelated projected content")
})
