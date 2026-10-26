<script lang="ts">
    import { mediaFolders, activeDrawerTab } from "../../../stores"
    import Media from "./Media.svelte"

    export let searchValue = ""
    $: hymnalFolder = Object.entries($mediaFolders).find(([, folder]) => folder.jaLibraryRole === "hymnal")?.[0] || ""
</script>

{#if hymnalFolder}
    <Media active={hymnalFolder} {searchValue} />
{:else}
    <div class="emptyHymnal">
        <h3>Himnario Adventista</h3>
        <p>Vincula la carpeta de tus videos MP4 una sola vez desde Multimedia → Vincular biblioteca JA.</p>
        <button type="button" on:click={() => activeDrawerTab.set("media")}>Abrir Multimedia</button>
    </div>
{/if}

<style>
    .emptyHymnal { display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 20px; text-align: center; }
    .emptyHymnal p { max-width: 420px; opacity: 0.8; }
    .emptyHymnal button { background: var(--primary); color: var(--text); border-radius: 5px; padding: 10px 16px; cursor: pointer; }
</style>
