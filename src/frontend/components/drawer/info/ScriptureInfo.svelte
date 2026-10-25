<script lang="ts">
    import type { MediaStyle } from "../../../../types/Main"
    import type { BibleContent } from "../../../../types/Scripture"
    import type { Item } from "../../../../types/Show"
    import { activeEdit, activePage, activeScripture, activeStyle, drawerTabsData, media, outputs, scriptureSettings, settingsTab, styles, templates } from "../../../stores"
    import { setDefaultScriptureTemplates } from "../../../utils/createData"
    import { save } from "../../../utils/save"
    import { confirmCustom } from "../../../utils/popup"
    import { mediaExtensions } from "../../../values/extensions"
    import T from "../../helpers/T.svelte"
    import { clone } from "../../helpers/array"
    import { history } from "../../helpers/history"
    import { getMediaStyle } from "../../helpers/media"
    import { getAllNormalOutputs, getFirstActiveOutput } from "../../helpers/output"
    import InputRow from "../../input/InputRow.svelte"
    import Link from "../../inputs/Link.svelte"
    import MaterialButton from "../../inputs/MaterialButton.svelte"
    import MaterialColorInput from "../../inputs/MaterialColorInput.svelte"
    import MaterialFilePicker from "../../inputs/MaterialFilePicker.svelte"
    import MaterialNumberInput from "../../inputs/MaterialNumberInput.svelte"
    import MaterialPopupButton from "../../inputs/MaterialPopupButton.svelte"
    import MaterialToggleSwitch from "../../inputs/MaterialToggleSwitch.svelte"
    import Media from "../../output/layers/Media.svelte"
    import Textbox from "../../slide/Textbox.svelte"
    import Zoomed from "../../slide/Zoomed.svelte"
    import { createScriptureShow, getActiveScripturesContent, getMergedAttribution, getScriptureSlidesNew, textKeys, useOldScriptureSystem } from "../bible/scripture"
    import { applyJAScriptureDesign, readJAScriptureDesign, DEFAULT_JA_SCRIPTURE_DESIGN, JA_SCRIPTURE_FONTS, JA_SCRIPTURE_TEMPLATE_ID } from "../bible/jaScriptureDesign"
    import type { JAScriptureDesign } from "../bible/jaScriptureDesign"

    export let optionsOpen: boolean

    let biblesContent: BibleContent[] = []
    let selectedChapters: number[] = []
    let selectedVerses: (number | string)[][] = []

    $: activeScriptureId = $drawerTabsData.scripture?.activeSubTab || ""

    $: if (activeScriptureId || $activeScripture.reference) loadScriptureData()
    async function loadScriptureData() {
        const content = await getActiveScripturesContent()
        if (content?.length) {
            biblesContent = content
            selectedChapters = biblesContent[0]?.chapters || []
            selectedVerses = biblesContent[0]?.activeVerses || []
        }
    }

    // Los cambios se aplican solo a la plantilla independiente JA.
    let jaDesign: JAScriptureDesign = { ...DEFAULT_JA_SCRIPTURE_DESIGN }
    let jaStyleMessage = ""
    $: if ($templates[JA_SCRIPTURE_TEMPLATE_ID]) {
        jaDesign = readJAScriptureDesign($templates[JA_SCRIPTURE_TEMPLATE_ID])
    }

    function setJAStyle<K extends keyof JAScriptureDesign>(key: K, value: JAScriptureDesign[K]) {
        const updated = { ...jaDesign, [key]: value }
        if (styleScriptureTemplate) {
            jaStyleMessage = "La salida tiene una plantilla bíblica avanzada que tiene prioridad. Ábrela con Editar plantilla para cambiar sus estilos."
            return
        }
        try {
            const original = $templates[JA_SCRIPTURE_TEMPLATE_ID] || $templates[templateId] || $templates.scripture
            if (!original) throw new Error("No hay plantilla bíblica disponible")
            const next = applyJAScriptureDesign(original, updated)
            templates.update((current) => ({ ...current, [JA_SCRIPTURE_TEMPLATE_ID]: next }))
            scriptureSettings.update((settings) => ({ ...settings, template: JA_SCRIPTURE_TEMPLATE_ID }))
            jaDesign = updated
            jaStyleMessage = "Diseño bíblico JA guardado."
            save()
        } catch (error) {
            console.error("JA: No pudimos ajustar la Biblia:", error)
            jaStyleMessage = "No se pudo aplicar el diseño. Comprueba la plantilla activa."
        }
    }

    let slides: Item[][] = [[]]

    // background
    $: templateId = styleScriptureTemplate || $scriptureSettings.template || "scripture" // $styles[styleId]?.templateScripture || ""
    $: template = $templates[templateId] || {}
    $: templateBackground = template.settings?.backgroundPath

    // auto change template based on number of bibles (if default)
    // if collection, but only one of the Bibles load, biblesContent will be length 1 & not change the template, which is fine, but maybe confusing
    $: if (activeScriptureId || templateId || biblesContent.length) setTimeout(checkTemplate, 100)
    $: isDefault = typeof templateId === "string" ? /^scripture(?:_\\d+)?$/.test(templateId) : false
    function checkTemplate() {
        if (!isDefault || !biblesContent.length) return

        let newTemplateId = "scripture_" + biblesContent.length
        scriptureSettings.update((a) => {
            a.template = $templates[newTemplateId] ? newTemplateId : "scripture"
            return a
        })
    }

    $: {
        if (selectedVerses.length || $scriptureSettings) getSlides({ biblesContent, selectedChapters, selectedVerses })
        else slides = [[]]
    }
    async function getSlides(data: any) {
        slides = (await getScriptureSlidesNew(data, true)).slides
    }

    $: showVersion = biblesContent.find((a) => a?.attributionRequired) || $scriptureSettings.showVersion

    function update(id: string, value: any) {
        scriptureSettings.update((a) => {
            a[id] = value
            return a
        })

        if (Object.keys(textKeys).includes(id)) updateCustomText(id, value)

        if (id === "splitLongVerses") longVersesMenuOpened = value
        else if (id === "showVerse" || id === "showVersion") referenceMenuOpened = showVersion || $scriptureSettings.showVerse ? (value ? true : referenceMenuOpened) : false
    }

    // custom text
    $: customText = $scriptureSettings.customText || getDefaultText()
    function getDefaultText() {
        let text = ""

        Object.keys(textKeys).forEach((key) => {
            let isEnabled = $scriptureSettings[key]
            if (key === "showVersion" && biblesContent.find((a) => a?.attributionRequired)) isEnabled = true
            if (isEnabled) {
                if (text.length) text += "\n"
                text += textKeys[key]
            }
        })

        update("customText", text)

        return text
    }
    function updateCustomText(id: string, value: boolean) {
        let key = textKeys[id]

        if (value) {
            if (customText.includes(key)) return

            if (customText.length && !customText.includes("\n")) customText += "\n"
            customText += key
            update("customText", customText)

            return
        }

        customText = customText.replaceAll(key, "")
        if (!customText.split("\n")[0] && customText.length) customText = customText.replaceAll("\n", "")
        update("customText", customText)
    }

    function editTemplate() {
        if (styleScriptureTemplate) {
            activeStyle.set(styleId)
            settingsTab.set("styles")
            activePage.set("settings")
            return
        }

        // activeDrawerTab.set("templates")
        // closeDrawer()
        // drawerTabsData.update(a => {
        //     a.template.activeSubTab = "all"
        //     return a
        // })
        activeEdit.set({ type: "template", id: templateId, items: [] })
        activePage.set("edit")
    }

    $: containsJesusWords = Object.values(biblesContent?.[0]?.verses?.[0] || {})?.find((text: any) => text?.includes('<span class="wj"') || text?.includes("<red") || text?.includes("color:red;") || text?.includes("!{"))

    $: previousSlides = "{}"
    let currentOutputSlides: any[] = []
    $: if (slides?.[0] && JSON.stringify(slides[0]) !== previousSlides) {
        currentOutputSlides = slides[0]
        previousSlides = JSON.stringify(slides[0])
    }

    $: styleId = getFirstActiveOutput($outputs)?.style || ""
    $: outputStyle = $styles[styleId]
    $: background = $templates[templateId]?.settings?.backgroundColor || outputStyle?.background || "#000000"

    $: attributionString = getMergedAttribution(biblesContent)

    let longVersesMenuOpened = false
    let referenceMenuOpened = false

    $: onlyOneNormalOutput = getAllNormalOutputs().length === 1
    $: styleScriptureTemplate = onlyOneNormalOutput ? $styles[styleId]?.templateScripture || "" : ""

    // auto convert
    $: if (useOldSystem && usingDefault && (!styleScriptureTemplate || styleScriptureTemplate.includes("scripture"))) convertToNew()
    $: useOldSystem = useOldScriptureSystem(templateId, $templates) && !styleScriptureTemplate
    $: usingDefault = typeof templateId === "string" ? /^scripture(?:_\\d+)?$/.test(templateId) : false
    async function convertToNew() {
        if (!usingDefault) {
            if (!(await confirmCustom("This will apply the default template, and convert that to the new format. Your current template will not change.<br>You can use it as an example to adapt your existing templates. Continue?"))) return
        }

        setDefaultScriptureTemplates()
        update("template", "scripture")
        useOldSystem = false
    }

    function setTemplateSettings(key: string, value: any) {
        if (!templateId) return

        let settings = template.settings || {}
        settings[key] = value

        let newData = { key: "settings", data: clone(settings) }

        history({ id: "UPDATE", newData, oldData: { id: templateId }, location: { page: "edit", id: "template_settings", override: templateId } })
    }

    // get styling
    $: bgPath = templateBackground
    let mediaStyle: MediaStyle = {}
    $: if (bgPath) mediaStyle = getMediaStyle($media[bgPath], outputStyle)
</script>

<!-- scripture is for focusedArea -->
<div class="scroll split scripture" style="padding-bottom: 46px;">
    <Zoomed style="width: 100%;" {background}>
        {#if selectedVerses.length}
            {#if bgPath}
                <Media path={bgPath} {mediaStyle} videoData={{ paused: false, muted: true, loop: true }} mirror />
            {/if}

            {#key currentOutputSlides}
                {#each currentOutputSlides as item}
                    <Textbox {item} {outputStyle} ref={{ id: "scripture" }} />
                {/each}
            {/key}

            {#if attributionString}
                <p class="attributionString">{attributionString.slice(0, 135)}</p>
            {/if}
        {/if}
    </Zoomed>

    <!-- settings -->
    <div class="settings border">
        <label class="ja-scripture-arrows">
            <input type="checkbox" checked={$scriptureSettings.jaArrowsEnabled !== false}
                on:change={(e) => { update("jaArrowsEnabled", e.currentTarget.checked); save() }} />
            <span>Flechas del teclado: <strong>← anterior · → siguiente</strong></span>
        </label>
        {#if optionsOpen}
            <!-- Verse numbers -->
            <MaterialToggleSwitch label="scripture.verse_numbers" style="width: 100%;" checked={$scriptureSettings.verseNumbers} on:change={(e) => update("verseNumbers", e.detail)} />
            <!-- DEPRECATED -->
            <!-- <MaterialColorInput label="edit.color" value={$scriptureSettings.numberColor || "#919191"} defaultValue="#919191" on:change={(e) => update("numberColor", e.detail)} />
                <MaterialNumberInput label="edit.size (%)" value={$scriptureSettings.numberSize || 50} defaultValue={50} on:change={(e) => update("numberSize", e.detail)} /> -->

            <!-- {#if $scriptureSettings.versesOnIndividualLines || sorted.length > 1} -->
            <MaterialToggleSwitch label="scripture.verses_on_individual_lines" checked={$scriptureSettings.versesOnIndividualLines} defaultValue={false} on:change={(e) => update("versesOnIndividualLines", e.detail)} />
            <!-- {/if} -->

            <!-- Long verses -->
            <InputRow arrow={$scriptureSettings.splitLongVerses} bind:open={longVersesMenuOpened}>
                <MaterialToggleSwitch label="scripture.divide_long_verses" style="width: 100%;" checked={$scriptureSettings.splitLongVerses} defaultValue={false} on:change={(e) => update("splitLongVerses", e.detail)} />

                <svelte:fragment slot="menu">
                    {#if $scriptureSettings.splitLongVerses}
                        <MaterialToggleSwitch label="scripture.split_long_verses_suffix" checked={$scriptureSettings.splitLongVersesSuffix} defaultValue={false} on:change={(e) => update("splitLongVersesSuffix", e.detail)} />
                        <!-- we allow as low as 3 because of certain languages like Chinese -->
                        <MaterialNumberInput label="edit.size" value={$scriptureSettings.longVersesChars || 100} defaultValue={100} min={3} on:change={(e) => update("longVersesChars", e.detail)} />
                        <MaterialNumberInput label="scripture.tolerance" value={$scriptureSettings.longVersesTolerance || 0} defaultValue={0} min={0} max={100} on:change={(e) => update("longVersesTolerance", e.detail)} />
                    {/if}
                </svelte:fragment>
            </InputRow>

            <!-- Red Jesus -->
            {#if $scriptureSettings.redJesus || containsJesusWords}
                <MaterialToggleSwitch label="scripture.red_jesus" style="width: 100%;" checked={$scriptureSettings.redJesus} defaultValue={false} on:change={(e) => update("redJesus", e.detail)} />
                <!-- DEPRECATED -->
                <MaterialColorInput label="edit.color" value={$scriptureSettings.jesusColor || "#FF4136"} defaultValue="#FF4136" on:change={(e) => update("jesusColor", e.detail)} />
            {/if}

            <!-- Smart split -->
            <MaterialToggleSwitch label="scripture.smart_split" style="margin-top: 10px;width: 100%;" checked={$scriptureSettings.smartSplit !== false} defaultValue={true} on:change={(e) => update("smartSplit", e.detail)} />

            {#if $scriptureSettings.smartSplit === false}
                <MaterialNumberInput label="scripture.max_verses" value={$scriptureSettings.versesPerSlide} defaultValue={3} min={1} max={100} on:change={(e) => update("versesPerSlide", e.detail)} hideWhenZero />
            {/if}
        {:else}
            <!-- Controles sencillos JA: una copia propia, sin alterar las plantillas de FreeShow. -->
            <section class="ja-bible-design" aria-label="Personalizar Biblia JA">
                <h3>Diseño de la Biblia</h3>
                <p>Configura la proyección de versículos con una plantilla JA. Los ajustes se conservan al reiniciar.</p>
                <div class="ja-bible-fields">
                    <label>Fuente
                        <select value={jaDesign.fontFamily} on:change={(e) => setJAStyle("fontFamily", e.currentTarget.value)}>
                            {#each JA_SCRIPTURE_FONTS as font}
                                <option value={font}>{font}</option>
                            {/each}
                        </select>
                    </label>
                    <label>Tamaño de letra: {jaDesign.fontSize} px
                        <input type="range" min="30" max="160" step="2" value={jaDesign.fontSize} on:change={(e) => setJAStyle("fontSize", Number(e.currentTarget.value))} />
                    </label>
                    <label>Alineación
                        <select value={jaDesign.align} on:change={(e) => setJAStyle("align", e.currentTarget.value as JAScriptureDesign["align"])}>
                            <option value="left">Izquierda</option><option value="center">Centro</option><option value="right">Derecha</option>
                        </select>
                    </label>
                    <label>Color del texto
                        <input type="color" value={jaDesign.color} on:change={(e) => setJAStyle("color", e.currentTarget.value)} />
                    </label>
                    <label>Color de fondo
                        <input type="color" value={jaDesign.backgroundColor} on:change={(e) => setJAStyle("backgroundColor", e.currentTarget.value)} />
                    </label>
                </div>
                <MaterialFilePicker
                    label="Imagen de fondo"
                    value={jaDesign.backgroundPath}
                    filter={{ name: "Imágenes", extensions: ["png", "jpg", "jpeg", "webp"] }}
                    allowEmpty
                    on:change={(e) => setJAStyle("backgroundPath", e.detail)}
                />
                {#if jaDesign.backgroundPath}
                    <button type="button" class="ja-clear-background" on:click={() => setJAStyle("backgroundPath", "")}>Quitar imagen y usar color de fondo</button>
                {/if}
                {#if jaStyleMessage}<p class="ja-style-message" role="status">{jaStyleMessage}</p>{/if}
                {#if styleScriptureTemplate}
                    <p class="ja-style-message">Hay una plantilla de salida con prioridad; utiliza Editar plantilla para ajustar esa salida.</p>
                {/if}
            </section>

            <!-- Template -->
            <InputRow style={templateBackground ? "" : "margin-bottom: 10px;"}>
                <MaterialPopupButton id="scripture_drawer" label="info.template" disabled={!!styleScriptureTemplate} value={templateId} name={template?.name} popupId="select_template" icon="templates" on:change={(e) => update("template", e.detail)} allowEmpty={!isDefault} />
                {#if (templateId && template) || styleScriptureTemplate}
                    <MaterialButton title="titlebar.edit" icon="edit" on:click={editTemplate} />
                {/if}
            </InputRow>

            <!-- Template Settings - Quick Edit -->
            {#if templateBackground}
                <InputRow style="margin-bottom: 10px;border-left: 4px solid var(--primary-lighter);">
                    <MaterialFilePicker label="edit.background_media" value={templateBackground} filter={{ name: "Media files", extensions: mediaExtensions }} on:change={(e) => setTemplateSettings("backgroundPath", e.detail)} />
                </InputRow>
            {/if}

            {#if useOldSystem || (styleScriptureTemplate ? useOldScriptureSystem(styleScriptureTemplate) : false)}
                <p style="margin-bottom: 10px;font-size: 0.9rem;opacity: 0.7;white-space: normal;">
                    You are using a template with no scripture values! - <Link url="https://freeshow.app/docs/scripture#template">Read more</Link>
                </p>
            {/if}
            {#if useOldSystem}
                <MaterialButton variant="outlined" style="margin-bottom: 10px;" on:click={convertToNew}>
                    {#if usingDefault}
                        Convert template to new system
                    {:else}
                        Use default template
                    {/if}
                </MaterialButton>
            {/if}

            <!-- info={selectedVerses[0]?.length > 1 ? `${Math.ceil(selectedVerses[0].length / $scriptureSettings.versesPerSlide)}` : ""} -->
            <MaterialButton variant="outlined" icon="slide" title="new.show_convert [Ctrl+N]" on:click={createScriptureShow}>
                <T id="new.show_convert" />
            </MaterialButton>
        {/if}
    </div>
</div>

<style>
    .ja-scripture-arrows {
        display: flex; align-items: center; gap: 8px; padding: 9px;
        color: #f3f7fb; background: #163953; border: 1px solid #315c79;
        border-radius: 7px; margin-bottom: 10px; font-size: .82em;
        white-space: normal; cursor: pointer;
    }
    .ja-scripture-arrows input { accent-color: #f6bf19; }
    .ja-bible-design {
        padding: 12px; margin-bottom: 14px; display: flex; flex-direction: column; gap: 9px;
        border-radius: 9px; background: #0e2d49; border: 1px solid #37607a;
    }
    .ja-bible-design h3 { font-size: 1em; color: #f6bf19; margin: 0; }
    .ja-bible-design p { color: #c2d9e8; font-size: .82em; margin: 0; white-space: normal; }
    .ja-bible-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .ja-bible-fields label { display: flex; flex-direction: column; gap: 5px; font-size: .82em; }
    .ja-bible-fields select, .ja-bible-fields input[type=color] {
        min-height: 30px; padding: 4px; border: 1px solid #466c85;
        color: #fff; background: #153c5c; border-radius: 6px; font: inherit;
    }
    .ja-bible-fields input[type=range] { width: 100%; accent-color: #f6bf19; }
    .ja-clear-background { padding: 7px 9px; background: #194666; color: #fff;
        border: 1px solid #497994; border-radius: 7px; cursor: pointer; }
    .ja-style-message { border-left: 3px solid #f6bf19; padding-left: 8px; }
    @media (max-width: 600px) { .ja-bible-fields { grid-template-columns: 1fr; } }
    .scroll {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
    }

    div.scroll :global(.zoomed) {
        height: initial !important;
    }

    .settings {
        display: flex;
        flex-direction: column;
        padding: 10px;
        flex: 1;
    }

    .settings :global(.dropdown) {
        /* position: absolute; */
        width: 160%;
        inset-inline-end: 0;
    }

    .attributionString {
        position: absolute;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);

        font-size: 28px;
        font-style: italic;
        opacity: 0.7;
    }
</style>
