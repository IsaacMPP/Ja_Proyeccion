import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

test("all video thumbnails use persistent JA directory and reuse existing previews", () => {
 const code = fs.readFileSync("src/electron/data/thumbnails.ts","utf8")
 assert.match(code, /getDataFolderRoot\(\), "Cache", "Miniaturas"/)
 assert.match(code, /fs\.copyFileSync\(legacy, target\)/)
 assert.match(code, /inputStats\.mtimeMs > outputStats\.mtimeMs/)
 assert.match(code, /MAX_THUMBNAIL_CAPTURES = 2/)
 assert.match(code, /fs\.accessSync\(preferred, fs\.constants\.W_OK\)/)
})
