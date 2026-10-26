<script lang="ts">
    import { onDestroy } from "svelte"
    import { AudioPlayer } from "../../../audio/audioPlayer"
    import { uid } from "uid"
    import { Main } from "../../../../types/IPC/Main"
    import { ToMain } from "../../../../types/IPC/ToMain"
    import { destroyMain, receiveToMain, sendMain } from "../../../IPC/main"
    import { dataPath, mediaFolders, playingAudio } from "../../../stores"
    import { getAccess } from "../../../utils/profile"
    import { history } from "../../helpers/history"
    import { getPrimaryJALibraryId, defaultJALibraryPath } from "../media/jaDefaultLibraries"

    $: folders = Object.entries($mediaFolders).filter(([, folder]) => folder.jaLibraryRole === "hymnal")
    $: hymnAudio = Object.entries($playingAudio).find(([, item]) => !!item.path && Object.values($mediaFolders).some((folder) => folder.jaLibraryRole === "hymnal" && item.path?.replace(/\\/g, "/").startsWith((folder.path || "").replace(/\\/g, "/") + "/")))
    $: hymnAudioId = hymnAudio?.[0] || ""
    $: hymnAudioItem = hymnAudio?.[1]
    function toggleAudio() {
        if (!hymnAudioId) return
        if (hymnAudioItem?.paused) AudioPlayer.play(hymnAudioId)
        else AudioPlayer.pause(hymnAudioId)
    }
    function stopHymnAudio() {
        if (hymnAudioId) AudioPlayer.stop(hymnAudioId)
    }

    $: primaryId = getPrimaryJALibraryId($mediaFolders, $dataPath, "hymnal")
    $: readOnly = getAccess("media").global === "read" || getAccess("media").global === "none"
    const channel = uid()

    function linkExternalHymnal() {
        if (readOnly) return
        sendMain(Main.OPEN_FOLDER, { channel })
    }
    const listener = receiveToMain(ToMain.OPEN_FOLDER2, (data) => {
        if (data.channel !== channel || !data.path || readOnly) return
        const selectedPath = data.path
        // The default or any already-registered folder must not be linked twice.
        if (Object.values($mediaFolders).some((folder) => folder.path?.replace(/\\/g, "/").toLowerCase() === selectedPath.replace(/\\/g, "/").toLowerCase())) return
        history({
            id: "UPDATE",
            newData: { data: { name: "Himnario adicional", icon: "folder", path: selectedPath, jaLibraryRole: "hymnal" } },
            location: { page: "drawer", id: "category_media" }
        })
    })
    onDestroy(() => destroyMain(listener))
</script>

<div class="hymnalNav">
    <h4>Himnario Adventista</h4>
    {#if folders.length}
        <div class="linked">Bibliotecas disponibles</div>
        {#each folders as [id, folder] (id)}
            <div class:primary={id === primaryId} class="folder" title={folder.path || ""}>{folder.name || "Himnario Adventista"}</div>
        {/each}
    {:else}
        <p>No se encontró la biblioteca principal del Himnario.</p>
        <p>Carpeta esperada: {defaultJALibraryPath($dataPath, "Himnario Adventista")}</p>
    {/if}
    {#if hymnAudioId}
        <div class="hymnAudioStatus">
            <div class="linked">Audio en reproducción</div>
            <div>{hymnAudioItem?.name || "Himno"}</div>
            <div class="audioActions">
                <button type="button" on:click={toggleAudio}>{hymnAudioItem?.paused ? "Reanudar" : "Pausar"}</button>
                <button type="button" on:click={stopHymnAudio}>Detener</button>
            </div>
        </div>
    {/if}
    <button type="button" disabled={readOnly} on:click={linkExternalHymnal}>Vincular carpeta externa</button>
</div>

<style>
    .hymnalNav { padding: 14px 10px; display: flex; flex-direction: column; gap: 10px; }
    h4 { margin: 0; }
    .linked, p { opacity: 0.7; font-size: 0.9em; }
    .folder { background: var(--primary-dark); padding: 10px 8px; overflow-wrap: anywhere; }
    .primary { border-left: 3px solid var(--primary); }
    button { padding: 9px; border: 1px solid var(--secondary); background: transparent; color: var(--text); cursor: pointer; border-radius: 5px; }
    .hymnAudioStatus { padding: 10px; border: 1px solid var(--secondary); border-radius: 5px; overflow-wrap: anywhere; }
    .audioActions { display: flex; gap: 5px; margin-top: 8px; }
    button:disabled { opacity: 0.4; cursor: default; }
</style>
