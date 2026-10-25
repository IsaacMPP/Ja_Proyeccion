/** JA Proyección: turn an imported TXT directory into an independent FreeShow category. */
import { get } from "svelte/store"
import type { Show } from "../../types/Show"
import type { ToMainSendPayloads } from "../../types/IPC/ToMain"
import { ToMain } from "../../types/IPC/ToMain"
import { history } from "../components/helpers/history"
import { activeDrawerTab, activePopup, categories, drawerTabsData, shows } from "../stores"
import { newToast } from "../utils/common"
import { convertText } from "./txt"

export function receiveSongTextFolder(data: ToMainSendPayloads[ToMain.JA_SONG_FOLDER_RESULT]) {
    const categoryId = `ja_biblioteca_${data.folderId}`
    const categoryName = data.folderName.trim() || "Cantos importados"
    const existing = get(categories)
    if (!existing[categoryId]) {
        history({
            id: "UPDATE",
            newData: { data: { name: categoryName, icon: "song" } },
            oldData: { id: categoryId },
            location: { page: "drawer", id: "category_shows" }
        })
    }

    // Track the source without publishing the machine's absolute folder paths.
    const known = new Set(Object.values(get(shows)).map((s) => s.quickAccess?.jaSource).filter(Boolean))
    const imported: { id: string; show: Show }[] = []
    let duplicates = 0
    let errors = 0

    for (const file of data.files) {
        const source = `${data.folderId}:${file.relativePath.toLowerCase()}`
        if (known.has(source)) { duplicates++; continue }
        try {
            const numberMatch = file.name.match(/^(\d{1,4})\s*[._–-]\s*(.+)$/)
            const title = numberMatch?.[2]?.trim() || file.name
            const result = convertText({ name: title, category: categoryId, text: file.content, noFormatting: true, returnData: true }) as { id: string; show: Show }
            if (!result?.show) { errors++; continue }
            result.show.category = categoryId
            result.show.origin = "ja-song-folder"
            result.show.quickAccess = { ...result.show.quickAccess, jaSource: source }
            if (numberMatch && !result.show.quickAccess.number) result.show.quickAccess.number = numberMatch[1]
            imported.push(result)
            known.add(source)
        } catch (error) {
            console.error("JA song library: could not convert TXT", error)
            errors++
        }
    }

    if (imported.length) {
        // Batch save even for a single song: importing must NOT add it to the active service project.
        history({ id: "SHOWS", newData: { data: imported, replace: true }, location: { page: "show" } })
    }

    activeDrawerTab.set("shows")
    drawerTabsData.update((tabs) => {
        tabs.shows = { ...tabs.shows, activeSubTab: categoryId, enabled: tabs.shows?.enabled !== false }
        return tabs
    })
    activePopup.set(null)
    newToast(`Biblioteca ${categoryName}: ${imported.length} cantos importados, ${duplicates} repetidos, ${errors + data.ignored} omitidos.`)
}
