<script lang="ts">
    import { activePopup, activeScripture, drawerTabsData, labelsDisabled, openScripture, scriptures } from "../../../stores"
    import { getAccess } from "../../../utils/profile"
    import { setDrawerTabData } from "../../helpers/historyHelpers"
    import { findSpanishEdition, JA_SPANISH_EDITIONS } from "../bible/jaSpanishBibles"
    import { keysToID } from "../../helpers/array"
    import Icon from "../../helpers/Icon.svelte"
    import T from "../../helpers/T.svelte"
    import MaterialButton from "../../inputs/MaterialButton.svelte"
    import NavigationSections from "./NavigationSections.svelte"

    const profile = getAccess("scripture")
    $: readOnly = profile.global === "read"

    $: activeSubTab = $drawerTabsData.scripture?.activeSubTab || ""

    $: scripturesList = keysToID($scriptures)

    $: collections = scripturesList.filter((a) => a.collection)
    $: apiBibles = scripturesList.filter((a) => a.api)
    $: localBibles = scripturesList.filter((a) => !a.collection && !a.api)
    $: favoritesList = scripturesList.filter((a) => a.favorite)

    // El catálogo muestra versiones conocidas, pero nunca finge que el texto
    // está instalado. Los archivos protegidos se obtienen con permiso.
    $: spanishInstalled = scripturesList.map((entry) => ({
        id: entry.id, edition: findSpanishEdition(entry.customName || entry.name || "")
    })).filter(entry => entry.edition)
    function activateSpanishEdition(code: string) {
        const existing = spanishInstalled.find(entry => entry.edition === code)
        if (existing) {
            setDrawerTabData("scripture", existing.id)
        } else if (!readOnly) {
            newScripture()
        }
    }

    let sections: any[] = []
    $: sections = [...(favoritesList.length ? [[{ id: "TITLE", label: "category.favourites" }, ...convertToButton(favoritesList)]] : []), [{ id: "TITLE", label: "scripture.collections" }, ...convertToButton(collections)], [{ id: "TITLE", label: "scripture.bibles_section" }, ...convertToButton(localBibles), ...(localBibles.length && apiBibles.length ? [{ id: "SEPARATOR", label: "API" }] : []), ...convertToButton(apiBibles)]]

    function convertToButton(categories: any[]) {
        return categories
            .sort((a, b) => (b.customName || b.name).localeCompare(a.customName || a.name))
            .reverse()
            .map((a: any) => {
                const icon = a.api ? "scripture_alt" : a.collection ? "collection" : "scripture"
                const count = a.collection?.versions?.length || 0
                return { id: a.id, label: a.customName || a.name, icon, count, onDoubleClick: () => startScripture(), boxedIcon: true }
            })
    }

    function startScripture() {
        openScripture.set({ play: true, book: Number($activeScripture.reference?.book || 1), chapter: $activeScripture.reference?.chapters[0], verses: $activeScripture.reference?.verses })
    }

    function newScripture() {
        activePopup.set("import_scripture")
    }

    function createCollection() {
        activePopup.set("create_collection")
    }

    function updateName(e: any) {
        const { id, value } = e.detail
        scriptures.update((a) => {
            a[id].customName = value
            return a
        })
    }
</script>

<NavigationSections {sections} active={activeSubTab} on:rename={updateName}>
    <div slot="section_0" style={favoritesList.length ? "" : "padding: 8px;{collections.length ? 'padding-top: 12px;' : ''}"}>
        {#if !favoritesList.length}
            <MaterialButton disabled={readOnly || (!apiBibles.length && !localBibles.length)} style="width: 100%;" title="popup.import_scripture" variant="outlined" on:click={createCollection} small>
                <Icon id="add" size={$labelsDisabled ? 0.9 : 1} white={$labelsDisabled} />
                {#if !$labelsDisabled}<T id="new.collection" />{/if}
            </MaterialButton>
        {/if}
    </div>
    <div slot="section_1" style="padding: 8px;{apiBibles.length || localBibles.length ? 'padding-top: 12px;' : ''}">
        {#if favoritesList.length}
            <MaterialButton disabled={readOnly || (!apiBibles.length && !localBibles.length)} style="width: 100%;" title="popup.import_scripture" variant="outlined" on:click={createCollection} small>
                <Icon id="add" size={$labelsDisabled ? 0.9 : 1} white={$labelsDisabled} />
                {#if !$labelsDisabled}<T id="new.collection" />{/if}
            </MaterialButton>
        {:else}
            <MaterialButton style="width: 100%;" title="popup.import_scripture" variant="outlined" disabled={readOnly} on:click={newScripture} small>
                <Icon id="add" size={$labelsDisabled ? 0.9 : 1} white={$labelsDisabled} />
                {#if !$labelsDisabled}<T id="new.scripture" />{/if}
            </MaterialButton>
        {/if}
    </div>
    <div slot="section_2" style="padding: 8px;{apiBibles.length || localBibles.length ? 'padding-top: 12px;' : ''}">
        {#if favoritesList.length}
            <MaterialButton style="width: 100%;" title="popup.import_scripture" variant="outlined" disabled={readOnly} on:click={newScripture} small>
                <Icon id="add" size={$labelsDisabled ? 0.9 : 1} white={$labelsDisabled} />
                {#if !$labelsDisabled}<T id="new.scripture" />{/if}
            </MaterialButton>
        {/if}
    </div>
</NavigationSections>

<div class="ja-bible-versions">
    <h3>Biblias en español</h3>
    <p>Selecciona una traducción instalada o agrégala desde una fuente autorizada.</p>
    {#each JA_SPANISH_EDITIONS as edition (edition.code)}
        {@const available = spanishInstalled.some(entry => entry.edition === edition.code)}
        <button type="button" disabled={readOnly && !available} class:available class:selected={available && spanishInstalled.some(entry => entry.edition === edition.code && entry.id === activeSubTab)} on:click={() => activateSpanishEdition(edition.code)}>
            <span><strong>{edition.short}</strong> <small>{edition.name}</small></span>
            <span class="ja-edition-state">{available ? "Elegir" : "Agregar"}</span>
        </button>
    {/each}
    <p class="ja-bible-rights">RVR60, RVR95, NVI y otras ediciones modernas tienen derechos de autor. Su texto no se incluye sin autorización. RV1909 es de dominio público.</p>
</div>

<style>
    .ja-bible-versions {
        flex: none; padding: 12px 10px; margin: 8px; border: 1px solid #315e7d;
        border-radius: 9px; background: #0b2a45; color: #fff;
        max-height: 46vh; overflow-y: auto;
    }
    .ja-bible-versions h3 { margin: 0 0 5px; color: #f6bf19; font-size: .98em; }
    .ja-bible-versions p { margin: 0 0 10px; font-size: .8em; color: #c6d8e5; white-space: normal; }
    .ja-bible-versions button {
        display: flex; width: 100%; align-items: center; justify-content: space-between;
        text-align: left; gap: 7px; margin: 4px 0; padding: 7px;
        background: #153d5a; color: #eaf3fb; border: 1px solid #2c5371;
        border-radius: 6px; font: inherit; cursor: pointer;
    }
    .ja-bible-versions button.available { border-color: #4a806f; }
    .ja-bible-versions button.selected { border-color: #f6bf19; }
    .ja-bible-versions button:disabled { opacity: .4; cursor: not-allowed; }
    .ja-bible-versions button span:first-child { display: flex; flex-direction: column; min-width: 0; }
    .ja-bible-versions button small { color: #a9c6d9; }
    .ja-edition-state { font-size: .78em; color: #f6bf19; white-space: nowrap; }
    .ja-bible-versions .ja-bible-rights { margin-top: 9px; line-height: 1.5; }
</style>
