<script lang="ts">
    import { mediaFolders, dataPath, activeDrawerTab } from "../../../stores"
    import Media from "./Media.svelte"
    import { getPrimaryJALibraryId } from "./jaDefaultLibraries"

    export let searchValue = ""
    $: hymnalFolder = getPrimaryJALibraryId($mediaFolders, $dataPath, "hymnal")
</script>

{#if hymnalFolder}
    <Media active={hymnalFolder} {searchValue} />
{:else}
    <div class="emptyHymnal">
        <h3>Himnario Adventista</h3>
        <p>No se encontró la biblioteca predeterminada. Comprueba la carpeta de datos o vincula una carpeta externa desde Multimedia.</p>
        <button type="button" on:click={() => activeDrawerTab.set("media")}>Abrir Multimedia</button>
    </div>
{/if}

<style>
    .emptyHymnal { display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 20px; text-align: center; }
    .emptyHymnal p { max-width: 420px; opacity: 0.8; }
    .emptyHymnal button { background: var(--primary); color: var(--text); border-radius: 5px; padding: 10px 16px; cursor: pointer; }
</style>
