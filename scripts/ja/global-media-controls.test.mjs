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
