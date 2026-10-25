import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

test("grid renders a bounded visible window without animated loading backlog", () => {
  const grid = fs.readFileSync("src/frontend/components/drawer/media/MediaGrid.svelte", "utf8")
  const media = fs.readFileSync("src/frontend/components/drawer/media/Media.svelte", "utf8")
  assert.match(grid, /OVERSCAN_ROWS/)
  assert.match(grid, /i >= firstItemIndex && i < lastItemIndex/)
  assert.doesNotMatch(grid, /lazyLoader|slowlyChange|debouncedScroll/)
  assert.doesNotMatch(media, /\{#key searchedFiles\}/)
  assert.match(media, /shiftRange=\{mediaShiftRange\}/)
})
