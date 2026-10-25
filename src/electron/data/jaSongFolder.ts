/**
 * JA Proyección: non-destructive, bounded directory import for plain-text songs.
 * Supported first iteration: UTF-8 .txt files (including subdirectories).
 * No filesystem writes and no shell commands. Symlinks are deliberately skipped.
 */
import { createHash } from "crypto"
import path from "path"
import { ToMain } from "../../types/IPC/ToMain"
import { sendToMain } from "../IPC/main"
import { selectFolderDialog } from "../utils/files"
import { scanSongTextFiles } from "./jaSongScanner"

export async function importSongTextFolder() {
    const folder = await selectFolderDialog("Selecciona una carpeta de cantos (archivos TXT)")
    if (!folder) return

    const { files, ignored } = await scanSongTextFiles(folder)
    if (!files.length) {
        sendToMain(ToMain.ALERT, "No se encontraron cantos TXT válidos en la carpeta seleccionada.")
        return
    }

    sendToMain(ToMain.JA_SONG_FOLDER_RESULT, {
        folderId: createHash("sha256").update(path.resolve(folder).toLowerCase()).digest("hex").slice(0, 16),
        folderName: path.basename(folder),
        files,
        ignored
    })
}
