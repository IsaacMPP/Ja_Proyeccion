/**
 * Read TXT songs without touching their source files.
 * Bounded recursion prevents accidental imports of massive directories.
 */
import { promises as fs } from "fs"
import path from "path"

export const SONG_FOLDER_LIMITS = { maxFiles: 1000, maxDepth: 8, maxFileBytes: 1024 * 1024 }

export async function scanSongTextFiles(folder: string): Promise<{
    files: { name: string; relativePath: string; content: string }[]
    ignored: number
}> {
    const files: { name: string; relativePath: string; content: string }[] = []
    let ignored = 0

    async function scan(dir: string, depth: number) {
        if (depth > SONG_FOLDER_LIMITS.maxDepth) { ignored++; return }
        let entries: import("fs").Dirent[]
        try { entries = await fs.readdir(dir, { withFileTypes: true }) }
        catch (err) { console.error("JA song library: could not read folder", err); ignored++; return }

        entries.sort((a, b) => a.name.localeCompare(b.name, "es", { numeric: true }))
        for (const entry of entries) {
            if (files.length >= SONG_FOLDER_LIMITS.maxFiles) { ignored++; continue }
            if (entry.isSymbolicLink()) continue
            const filePath = path.join(dir, entry.name)
            if (entry.isDirectory()) {
                await scan(filePath, depth + 1)
            } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".txt") {
                try {
                    const stat = await fs.stat(filePath)
                    if (stat.size > SONG_FOLDER_LIMITS.maxFileBytes) { ignored++; continue }
                    const content = (await fs.readFile(filePath, "utf8")).replace(/^\uFEFF/, "")
                    if (!content.trim()) { ignored++; continue }
                    files.push({
                        name: path.basename(entry.name, path.extname(entry.name)),
                        relativePath: path.relative(folder, filePath).replace(/\\/g, "/"),
                        content
                    })
                } catch (err) {
                    console.error("JA song library: could not read TXT", err)
                    ignored++
                }
            }
        }
    }

    await scan(folder, 0)
    return { files, ignored }
}
