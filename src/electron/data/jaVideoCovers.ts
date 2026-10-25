/**
 * Portadas locales de video para JA Proyección.
 * Solo copia imágenes JPG/PNG a la carpeta de datos; no modifica videos ni imágenes originales.
 */
import { createHash, randomUUID } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import { nativeImage } from "electron"
import { getDataFolderPath, selectFilesDialog } from "../utils/files"

type CoverResult = { status: "ok"; path: string } | { status: "cancelled" } | { status: "error"; message: string }
const MAX_IMAGE_BYTES = 20 * 1024 * 1024
const MAX_IMAGE_PIXELS = 40_000_000

function videoKey(videoPath: string): string {
    return createHash("sha256").update(path.normalize(videoPath)).digest("hex")
}
function ownCoverPath(videoPath: string, coverPath: string): boolean {
    if (!videoPath || !coverPath) return false
    const folder = path.resolve(getDataFolderPath("userData", "JA-Video-Covers"))
    const resolved = path.resolve(coverPath)
    return path.dirname(resolved) === folder && path.basename(resolved).startsWith(videoKey(videoPath) + "-") && /\.(png|jpe?g)$/i.test(resolved)
}
async function cleanupPrevious(videoPath: string, coverPath?: string) {
    if (!coverPath || !ownCoverPath(videoPath, coverPath)) return
    try {
        await fs.unlink(coverPath)
    } catch (error: any) {
        if (error?.code !== "ENOENT") console.warn("JA: Could not delete old cover", error)
    }
}

export async function pickJAVideoCover({ videoPath, previousPath }: { videoPath: string; previousPath?: string }): Promise<CoverResult> {
    if (!videoPath || typeof videoPath !== "string" || /^(https?:|data:|blob:)/i.test(videoPath)) {
        return { status: "error", message: "Selecciona primero un video local." }
    }
    const selected = await selectFilesDialog("Elegir portada del video", { name: "Imágenes JPG o PNG", extensions: ["jpg", "jpeg", "png"] }, false)
    if (!selected.length) return { status: "cancelled" }
    const input = selected[0]
    try {
        if (!/\.(png|jpe?g)$/i.test(input)) return { status: "error", message: "La portada debe ser JPG o PNG." }
        const stats = await fs.stat(input)
        if (!stats.isFile() || !stats.size || stats.size > MAX_IMAGE_BYTES) {
            return { status: "error", message: "La imagen está vacía o supera 20 MB." }
        }
        const image = nativeImage.createFromPath(input)
        const dimensions = image.getSize()
        if (image.isEmpty() || dimensions.width < 1 || dimensions.height < 1 || dimensions.width * dimensions.height > MAX_IMAGE_PIXELS) {
            return { status: "error", message: "No pudimos leer la imagen o tiene dimensiones demasiado grandes." }
        }
        const dir = getDataFolderPath("userData", "JA-Video-Covers")
        const destination = path.join(dir, `${videoKey(videoPath)}-${randomUUID()}${path.extname(input).toLowerCase()}`)
        await fs.copyFile(input, destination)
        await cleanupPrevious(videoPath, previousPath)
        return { status: "ok", path: destination }
    } catch (error) {
        console.error("JA cover selection failed", error)
        return { status: "error", message: "No se pudo guardar la portada. Comprueba que la imagen esté disponible." }
    }
}
export async function removeJAVideoCover({ videoPath, coverPath }: { videoPath: string; coverPath: string }): Promise<{ success: boolean }> {
    if (!ownCoverPath(videoPath, coverPath)) return { success: false }
    await cleanupPrevious(videoPath, coverPath)
    return { success: true }
}
