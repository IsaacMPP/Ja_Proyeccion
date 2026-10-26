import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

test("global FreeShow audio transport includes stop and hymnal avoids duplicate controls", () => {
 const transport = fs.readFileSync("src/frontend/components/output/tools/Audio.svelte","utf8")
 const hymnal = fs.readFileSync("src/frontend/components/drawer/navigation/HymnalTabs.svelte","utf8")
 assert.match(transport,/AudioPlayer\.stop\(key\)/)
 assert.match(transport,/AudioPlayer\.start\(path/)
 assert.doesNotMatch(hymnal,/AudioPlayer\.(play|pause|stop)/)
})
test("all local videos support video-only via existing muted output flag", () => {
 const card = fs.readFileSync("src/frontend/components/drawer/media/MediaCard.svelte","utf8")
 assert.match(card,/Solo video: proyectar sin sonido/)
 assert.match(card,/click\(event, true\)/)
 assert.match(card,/forceMuted \? \{ muted: true \}/)
 assert.match(card,/setOutput\("background"/)
})

test("video modes replace audio-only playback and change mute on existing video", () => {
 const card = fs.readFileSync("src/frontend/components/drawer/media/MediaCard.svelte","utf8")
 assert.ok(card.includes("AudioPlayer.stop(path)"), "video must stop this file's audio-only player")
 assert.ok(card.includes("VideoPlayer.getAudio(path, output.id)"), "existing video playback is checked by output")
 assert.ok(card.includes("VideoPlayer.toggleMute(path, output.id)"), "mute is updated, not toggled off as background")
 assert.ok(card.includes('AudioPlayer.start(path, { name }, { pauseIfPlaying: false })'), "solo audio should not pause a playing audio track")
 assert.ok(card.includes("clearBackground(outputId)"), "audio-only must remove the matching projected video")
})
