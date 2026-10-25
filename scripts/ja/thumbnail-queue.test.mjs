import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

test("video thumbnail capture limits parallel work and deduplicates queued requests", () => {
    const source = fs.readFileSync("src/electron/data/thumbnails.ts", "utf8")
    assert.match(source, /MAX_THUMBNAIL_CAPTURES = 2/)
    assert.match(source, /activeThumbnailCaptures < MAX_THUMBNAIL_CAPTURES/)
    assert.match(source, /activeThumbnailIds\.has\(id\)/)
    assert.match(source, /thumbnailQueue\.some/)
    assert.match(source, /activeThumbnailIds\.delete\(mediaId\)/)
    assert.doesNotMatch(source, /currentlyGenerating\.clear\(\)/)
})
