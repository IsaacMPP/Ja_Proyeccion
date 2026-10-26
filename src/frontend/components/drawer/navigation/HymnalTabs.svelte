<script lang="ts">
    import { activeDrawerTab, drawerTabsData, mediaFolders } from "../../../stores"

    $: folders = Object.entries($mediaFolders).filter(([, folder]) => folder.jaLibraryRole === "hymnal")
    function manageLibrary() {
        if (folders.length) {
            drawerTabsData.update((tabs) => {
                if (!tabs.media) tabs.media = { enabled: true, activeSubTab: folders[0][0] }
                else tabs.media.activeSubTab = folders[0][0]
                return tabs
            })
        }
        activeDrawerTab.set("media")
    }
</script>

<div class="hymnalNav">
    <h4>Himnario Adventista</h4>
    {#if folders.length}
        <div class="linked">Biblioteca vinculada</div>
        {#each folders as [id, folder] (id)}
            <div class="folder" title={folder.path || ""}>{folder.name || "Himnario Adventista"}</div>
        {/each}
    {:else}
        <p>No hay una carpeta del Himnario vinculada.</p>
    {/if}
    <button type="button" on:click={manageLibrary}>Administrar biblioteca</button>
</div>

<style>
    .hymnalNav { padding: 14px 10px; display: flex; flex-direction: column; gap: 10px; }
    h4 { margin: 0; }
    .linked, p { opacity: 0.7; font-size: 0.9em; }
    .folder { background: var(--primary-dark); border-left: 3px solid var(--primary); padding: 10px 8px; overflow-wrap: anywhere; }
    button { padding: 9px; border: 1px solid var(--secondary); background: transparent; color: var(--text); cursor: pointer; border-radius: 5px; }
</style>
