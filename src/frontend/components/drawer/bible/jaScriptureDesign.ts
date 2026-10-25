import type { Template } from "../../../../types/Show"

/**
 * Estilo bíblico JA, copia independiente del diseño FreeShow.
 * No modifica las plantillas de otros cultos ni el texto bíblico.
 */
export const JA_SCRIPTURE_TEMPLATE_ID = "ja_scripture_custom"
export const JA_SCRIPTURE_FONTS = ["Arial", "Montserrat", "Inter", "Tahoma", "Verdana", "Georgia"] as const
export type JAScriptureAlign = "left" | "center" | "right"
export type JAScriptureDesign = {
    fontFamily: string
    fontSize: number
    align: JAScriptureAlign
    color: string
    backgroundColor: string
    backgroundPath: string
}

export const DEFAULT_JA_SCRIPTURE_DESIGN: JAScriptureDesign = {
    fontFamily: "Arial", fontSize: 80, align: "center", color: "#ffffff",
    backgroundColor: "#102940", backgroundPath: ""
}

function cssUpdate(style: string, property: string, value: string): string {
    const declarations = (style || "").split(";").map(s => s.trim()).filter(Boolean)
    const rest = declarations.filter(d => d.split(":")[0]?.trim().toLowerCase() !== property)
    rest.push(property + ": " + value)
    return rest.join(";") + ";"
}
function cleanColor(value: string): string {
    return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#ffffff"
}
function validImagePath(value: string): string {
    return typeof value === "string" && !/^(https?:|javascript:|data:)/i.test(value) ? value : ""
}
export function applyJAScriptureDesign(template: Template, values: JAScriptureDesign): Template {
    const next: Template = JSON.parse(JSON.stringify(template))
    const fontFamily = JA_SCRIPTURE_FONTS.includes(values.fontFamily as any) ? values.fontFamily : "Arial"
    const fontSize = Math.max(30, Math.min(160, Math.round(Number(values.fontSize) || 80)))
    const align = ["left", "center", "right"].includes(values.align) ? values.align : "center"
    const color = cleanColor(values.color)
    next.name = "Biblia JA — personalizado"
    next.category = "scripture"
    next.settings = {
        ...(next.settings || {}), mode: "scripture",
        backgroundColor: cleanColor(values.backgroundColor),
        backgroundPath: validImagePath(values.backgroundPath)
    }
    let count = 0
    for (const item of next.items || []) {
        for (const line of item.lines || []) {
            const matchingText = (line.text || []).some(part => part.value?.includes("{scripture_text}") || /\{scripture\d+_text\}/.test(part.value || ""))
            if (!matchingText) continue
            line.align = "text-align: " + align + ";"
            for (const part of line.text || []) {
                if (!part.value?.includes("{scripture_text}") && !/\{scripture\d+_text\}/.test(part.value || "")) continue
                part.style = cssUpdate(part.style || "", "font-family", "'" + fontFamily + "', Arial, sans-serif")
                part.style = cssUpdate(part.style, "font-size", fontSize + "px")
                part.style = cssUpdate(part.style, "color", color)
                count++
            }
        }
    }
    if (!count) throw new Error("La plantilla no contiene texto bíblico editable.")
    return next
}

export function readJAScriptureDesign(template: Template | undefined): JAScriptureDesign {
    const result = { ...DEFAULT_JA_SCRIPTURE_DESIGN }
    if (!template) return result
    if (template.settings?.backgroundColor) result.backgroundColor = template.settings.backgroundColor
    result.backgroundPath = template.settings?.backgroundPath || ""
    for (const item of template.items || []) {
        for (const line of item.lines || []) {
            for (const part of line.text || []) {
                if (!part.value?.includes("{scripture_text}") && !/\{scripture\d+_text\}/.test(part.value || "")) continue
                const css = part.style || ""
                const get = (name: string) => css.split(";").map(x => x.trim()).find(d => d.split(":")[0]?.trim().toLowerCase() === name)?.split(":").slice(1).join(":").trim()
                const family = (get("font-family") || "").replace(/[\'"]/g, "").split(",")[0]?.trim()
                if (family && JA_SCRIPTURE_FONTS.includes(family as any)) result.fontFamily = family
                const size = parseInt(get("font-size") || "", 10)
                if (Number.isFinite(size) && size > 0) result.fontSize = size
                const color = get("color")
                if (color && /^#[0-9a-fA-F]{6}$/.test(color)) result.color = color
                if (line.align?.includes("text-align: left")) result.align = "left"
                else if (line.align?.includes("text-align: right")) result.align = "right"
                else if (line.align?.includes("text-align: center")) result.align = "center"
                return result
            }
        }
    }
    return result
}
