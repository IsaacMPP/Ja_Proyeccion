import type { BrowserWindow, Rectangle } from "electron"
import { screen } from "electron"
import { isMac, mainWindow, toApp } from "../.."
import { MAIN, OUTPUT } from "../../../types/Channels"
import type { Output } from "../../../types/Output"
import { OutputHelper } from "../OutputHelper"
import { setOutputAlwaysOnTop } from "./OutputAlwaysOnTop"
import { OutputBounds } from "./OutputBounds"
import { resolvePhysicalDisplayBounds } from "./displayRouting"

export class OutputVisibility {
    static toggleOutputs(data: { outputs: (Output & { id: string })[]; state: boolean; autoStartup?: boolean; autoPosition?: boolean }) {
        const newStates: { id: string; active: boolean | "invisible" }[] = []

        data.outputs.forEach((output) => {
            const autoPosition = output.boundsLocked ? false : data.autoPosition
            const newState = OutputVisibility.toggleOutput(output, data.state, data.autoStartup, autoPosition)
            newStates.push({ id: output.id, active: newState })
        })

        toApp(OUTPUT, { channel: "OUTPUT_STATE", data: newStates })
    }

    static toggleOutput(output: Output & { id: string }, state: boolean, autoStartup?: boolean, autoPosition?: boolean) {
        if (!output?.id) return false

        let window: BrowserWindow = OutputHelper.getOutput(output.id)?.window

        if (!window || window.isDestroyed()) {
            OutputHelper.Lifecycle.createOutput(output)
            window = OutputHelper.getOutput(output.id)?.window
            if (!window || window.isDestroyed()) return false
        }

        if (output.invisible) {
            OutputHelper.setOutput(output.id, { ...OutputHelper.getOutput(output.id), invisible: true })
            if (window.isVisible()) this.hideWindow(window)
            // capture-only: render at the configured resolution (DPI-corrected)
            OutputBounds.updateBounds({ id: output.id, bounds: output.bounds })
            return "invisible"
        }

        const displays = screen.getAllDisplays()
        const isSingleScreenAutoStartup = autoStartup && displays.length <= 1
        if (isSingleScreenAutoStartup) return false

        const bounds: Rectangle = this.resolveOutputBounds(output, autoPosition)

        const windowCoveringMain = !!mainWindow && this.amountCovered(bounds, mainWindow.getBounds()) > 0.5
        // Al proyectar automáticamente, no cubrir jamás los controles del operador.
        // Quien desee usar el monitor principal intencionalmente puede hacerlo en modo manual.
        const unassignedOutputOnOperator = !output.screen && !output.boundsLocked && windowCoveringMain
        const invalidWindowPosition = (!!autoPosition && (displays.length <= 1 || windowCoveringMain)) || unassignedOutputOnOperator

        if (state === true && !invalidWindowPosition) {
            // Posicionar ANTES de mostrar: evita un destello negro sobre la laptop.
            window.setBounds(bounds)
            this.showWindow(window, output.alwaysOnTop !== false)

            OutputHelper.Bounds.updateBounds({ id: output.id, bounds })
            return true
        } else {
            this.hideWindow(window, output)
            // returning to capture-only: render at the configured resolution (DPI-corrected)
            OutputBounds.updateBounds({ id: output.id, bounds: output.bounds })

            if (state === true && !autoStartup) toApp(MAIN, { channel: "ALERT", data: "error.display" })
            return false
        }
    }

    static resolveOutputBounds(output: Partial<Output> & { bounds: Rectangle; boundsLocked?: boolean; screen?: string | null }, autoPosition = false): Rectangle {
        const displays = screen.getAllDisplays()
        const controllerScreenId = mainWindow && !mainWindow.isDestroyed() ? screen.getDisplayMatching(mainWindow.getBounds()).id : null
        return resolvePhysicalDisplayBounds({
            displays,
            bounds: output.bounds,
            targetScreenId: output.screen,
            controllerScreenId,
            autoPosition,
            boundsLocked: output.boundsLocked,
            isMac
        })
    }

    static getSecondDisplay(bounds: Rectangle) {
        const displays = screen.getAllDisplays()
        if (displays.length !== 2) return bounds

        const mainWindowBounds = mainWindow!.getBounds()
        const amountCoveredByWindow = this.amountCovered(displays[1].bounds, mainWindowBounds)

        let secondDisplay = displays[1]
        if (amountCoveredByWindow > 0.5) secondDisplay = displays[0]

        return { ...secondDisplay.bounds }
    }

    static amountCovered(displayBounds: Rectangle, windowBounds: Rectangle) {
        const overlapX = Math.max(0, Math.min(displayBounds.x + displayBounds.width, windowBounds.x + windowBounds.width) - Math.max(displayBounds.x, windowBounds.x))
        const overlapY = Math.max(0, Math.min(displayBounds.y + displayBounds.height, windowBounds.y + windowBounds.height) - Math.max(displayBounds.y, windowBounds.y))
        const overlapArea = overlapX * overlapY

        const totalArea = displayBounds.width * displayBounds.height
        const overlapAmount = overlapArea / totalArea

        return overlapAmount
    }

    // MacOS Menu Bar
    // https://stackoverflow.com/questions/39091964/remove-menubar-from-electron-app
    // https://stackoverflow.com/questions/69629262/how-can-i-hide-the-menubar-from-an-electron-app
    // https://github.com/electron/electron/issues/1415
    // https://github.com/electron/electron/issues/1054

    static showWindow(window: BrowserWindow, alwaysOnTop = true) {
        if (!window || window.isDestroyed()) return

        window.showInactive()
        if (alwaysOnTop) setOutputAlwaysOnTop(window, true)
        window.moveTop()
    }

    static hideWindow(window: BrowserWindow, data: Output | null = null) {
        if (!window || window.isDestroyed()) return

        OutputBounds.disableWindowMoveListener()

        window.setKiosk(false)
        window.hide()

        // seems to be fixed:
        if (!data) return

        // // this is only needed if the output is being captured!! (has to reset for capture to work when window is hidden)
        // const captureEnabled = Object.values(OutputHelper.getOutput(data.id!)?.captureOptions?.options || {}).find((a) => a === true)
        // if (!captureEnabled) return

        // console.info("RESTARTING OUTPUT:", data.id)
        // toApp(OUTPUT, { channel: "RESTART", data: { id: data.id } })
    }

    /*
    static hideAllPreviews() {
        OutputHelper.getKeys().forEach((outputId) => {
            let output = OutputHelper.getOutput(outputId)
            if (output.previewWindow) output.previewWindow.hide()
        })
    }

    static showAllPreviews() {
        OutputHelper.getKeys().forEach((outputId) => {
            let output = OutputHelper.getOutput(outputId)
            if (output.previewWindow) output.previewWindow.showInactive()
        })
    }
    */
}
