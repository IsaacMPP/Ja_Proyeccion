<script lang="ts">
    import { uid } from "uid"
    import { Main } from "../../../../types/IPC/Main"
    import type { ClickEvent, FileFolder } from "../../../../types/Main"
    import { requestMain } from "../../../IPC/main"
    import { AudioPlayer } from "../../../audio/audioPlayer"
    import { AudioPlaylist } from "../../../audio/audioPlaylist"
    import { addProjectItem } from "../../../converters/project"
    import { activePlaylist, activePopup, activeRename, audioFolders, audioPlaylists, drawerTabsData, effectsLibrary, labelsDisabled, media, outLocked, selectAllAudio, selected } from "../../../stores"
    import { translateText } from "../../../utils/language"
    import Icon from "../../helpers/Icon.svelte"
    import T from "../../helpers/T.svelte"
    import { clone, keysToID, sortFilenames } from "../../helpers/array"
    import { splitPath } from "../../helpers/get"
    import { getExtension, getFileName, getMediaType } from "../../helpers/media"
    import { joinTime, secondsToTime } from "../../helpers/time"
    import FloatingInputs from "../../input/FloatingInputs.svelte"
    import MaterialButton from "../../inputs/MaterialButton.svelte"
    import MaterialNumberInput from "../../inputs/MaterialNumberInput.svelte"
    import Center from "../../system/Center.svelte"
    import DropArea from "../../system/DropArea.svelte"
    import AudioStreams from "../live/AudioStreams.svelte"
    import Microphones from "../live/Microphones.svelte"
    import Folder from "../media/Folder.svelte"
    import AudioEffect from "./AudioEffect.svelte"
    import AudioFile from "./AudioFile.svelte"
    import AudioAudition from "./AudioAudition.svelte"
    import { getJAAudioLibraryName, matchesJAAudioName, uniqueJAAudioRoots } from "./jaAudioLibrary"
    import Metronome from "./Metronome.svelte"

    export let active: string | null
    export let searchValue = ""

    type File = { path: string; name: string; extension?: string; folder?: boolean; favourite?: boolean; audio?: boolean }

    // let files: File[] = []
    let scrollElem: HTMLElement | undefined

    let playlistSettings = false
    // Control seguro: búsqueda local/global sin alterar carpetas ni listas del usuario.
    let jaSearchScope: "folder" | "all" = "folder"
    let jaSearchKey = ""
    let jaSearchBusy = false
    let jaSearchDirty = false
    let auditionFile: { path: string; name: string } | null = null
    $: isLocalAudioFolder = !!(active && $audioFolders[active])
    $: jaSearchEverywhere = active === "all" || (isLocalAudioFolder && jaSearchScope === "all")


    $: playlist = active && $audioPlaylists[active]

    $: isDefault = ["all", "favourites", "effects_library", "inputs", "metronome"].includes(active || "")
    $: rootPath = isDefault || playlist ? "" : active !== null ? $audioFolders[active]?.path || "" : ""
    $: path = isDefault || playlist ? "" : rootPath
    $: name = active === "all" ? "category.all" : active === "favourites" ? "category.favourites" : active === "effects_library" ? "category.sound_effects" : rootPath === path ? (active !== "inputs" && active !== "metronome" && active !== null ? $audioFolders[active]?.name || "" : "") : splitPath(path).name

    // get list of files & folders
    let prevActive: null | string = null
    $: if (active || path || (active === "effects_library" && $effectsLibrary)) updateContent()
    function updateContent() {
        if (active === "favourites") {
            prevActive = active

            allRelevantFiles = keysToID($media)
                .filter((a) => a.favourite === true && a.audio === true)
                .map((a) => {
                    return { isFolder: false, path: a.id, name: getFileName(a.id), stats: {} as any }
                })

            openFolder("favourites")
        } else if (active === "effects_library") {
            prevActive = active

            allRelevantFiles = $effectsLibrary.map((a) => {
                return { isFolder: false, path: a.path, name: a.name, stats: {} as any }
            })

            openFolder("effects_library")
        } else if (active === "all") {
            if (active === prevActive) return
            prevActive = active

            void requestFiles(uniqueJAAudioRoots($audioFolders))
        } else if (path.length) {
            if (path === prevActive) return
            prevActive = path

            void requestFiles(path)
        } else {
            // inputs & metronome
            prevActive = active
        }
    }

    let foldersList: FileFolder[] = []
    let filesList: FileFolder[] = []
    let allRelevantFiles: FileFolder[] = []

    let requesting = 0
    let currentDepth = 0
    async function requestFiles(path: string | string[], depth: number = 0) {
        if (!path || (Array.isArray(path) && !path.length)) {
            allRelevantFiles = []
            foldersList = []
            filesList = []
            filteredFiles = []
            searchedFiles = []
            return
        }

        currentDepth = depth

        requesting++
        let currentRequest = requesting
        const data = await requestMain(Main.READ_FOLDER, { path, depth })
        if (!data || requesting !== currentRequest) return

        const seen = new Set<string>()
        allRelevantFiles = Object.values(data).filter((a) => {
            if (a.isFolder) return a.files.length > 0
            if (getMediaType(getExtension(a.name)) !== "audio") return false
            const key = a.path.replace(/\\/g, "/").toLocaleLowerCase()
            if (seen.has(key)) return false
            seen.add(key)
            return true
        })

        openFolder(active === "all" ? "all" : (path as string))
    }

    function openFolder(path: string) {
        if (path === "all" || path === "favourites" || path === "effects_library") {
            foldersList = []
            filesList = allRelevantFiles.filter((a) => !a.isFolder)

            filterFiles()
            return
        }

        if (searchValue.trim()) {
            foldersList = []
            filesList = allRelevantFiles.filter((a) => !a.isFolder)

            filterFiles()
            return
        }

        const folder = allRelevantFiles.find((a) => a.isFolder && a.path === path)
        if (!folder) return

        foldersList = allRelevantFiles.filter((a) => a.isFolder && (folder as any).files.includes(a.path))
        filesList = allRelevantFiles.filter((a) => !a.isFolder && (folder as any).files.includes(a.path))

        filterFiles()
    }

    // $: if ($sorted) filterFiles()
    let filteredFiles: FileFolder[] = []
    function filterFiles() {
        if (active === "inputs" || active === "metronome") return

        let localFilteredFiles: FileFolder[] = sortFilenames(filesList)

        // sort
        // let sortType = $sorted.media?.type || "name"
        // if (sortType === "name") localFilteredFiles = sortFilenames(localFilteredFiles)
        // else if (sortType === "name_des") localFilteredFiles = localFilteredFiles.reverse()
        // else if (sortType === "created") localFilteredFiles = localFilteredFiles.sort((a, b) => (a.isFolder || b.isFolder ? 1 : b.stats.birthtimeMs - a.stats.birthtimeMs))
        // else if (sortType === "modified") localFilteredFiles = localFilteredFiles.sort((a, b) => (a.isFolder || b.isFolder ? 1 : b.stats.mtimeMs - a.stats.mtimeMs))

        // append folders
        localFilteredFiles = [...sortFilenames(foldersList), ...localFilteredFiles]

        filteredFiles = clone(localFilteredFiles)
        if (searchValue.length < 2) searchedFiles = clone(filteredFiles)
        else filterSearch()

        // scroll to top
        scrollElem?.scrollTo(0, 0)
    }

    // Búsqueda rápida y resistente a acentos, numeración 001/1 y cambios de ámbito.
    $: if (searchValue !== undefined || jaSearchScope || active || rootPath) void filterSearch()
    let searchedFiles: FileFolder[] = []
    async function filterSearch() {
        if (jaSearchBusy) {
            jaSearchDirty = true
            return
        }
        jaSearchBusy = true
        try {
            if (active === "inputs" || active === "metronome" || !!playlist || active === "effects_library" || active === "favourites") {
                searchedFiles = clone(filteredFiles).filter(file => !searchValue.trim() || matchesJAAudioName(file.name, searchValue))
                return
            }

            const term = searchValue.trim()
            if (!term) {
                if (jaSearchKey) {
                    jaSearchKey = ""
                    if (active === "all") await requestFiles(uniqueJAAudioRoots($audioFolders), 0)
                    else if (rootPath) await requestFiles(path, 0)
                }
                searchedFiles = clone(filteredFiles)
                return
            }
            if (active === "all" || isLocalAudioFolder) {
                const source: string | string[] = jaSearchEverywhere ? uniqueJAAudioRoots($audioFolders) : path
                const key = JSON.stringify([source, 5])
                if (jaSearchKey !== key || currentDepth < 5) {
                    jaSearchKey = key
                    await requestFiles(source, 5)
                }
            }
            searchedFiles = clone(filteredFiles).filter(file => !file.isFolder && matchesJAAudioName(file.name, term))
            scrollElem?.scrollTo(0, 0)
        } finally {
            jaSearchBusy = false
            if (jaSearchDirty) {
                jaSearchDirty = false
                void filterSearch()
            }
        }
    }

    function keydown(e: KeyboardEvent) {
        if (e.key === "Enter" && searchValue.length > 1 && e.target?.closest(".search")) {
            let file = searchedFiles.filter((a) => !a.isFolder)[0]
            if (!file) return

            // play
            if (e.ctrlKey || e.metaKey) {
                AudioPlayer.start(file.path, { name: file.name })
                return
            }

            // add to project
            const data = { id: file.path, name: file.name, type: "audio" as const }
            addProjectItem(data)
            return
        }

        if (e.target?.closest?.("input") || e.target?.closest?.(".edit")) return

        if ((e.ctrlKey || e.metaKey) && e.key === "Backspace") {
            if (rootPath === path) return
            goBack()
        }
    }

    function goBack() {
        const lastSlash = path.lastIndexOf("\\") > -1 ? path.lastIndexOf("\\") : path.lastIndexOf("/")
        const folder = path.slice(0, lastSlash)
        path = folder.length > rootPath.length ? folder || rootPath : rootPath
    }

    // selected will be cleared when clicked, so store them on mousedown
    let selectedFiles: File[] = []
    function storeSelected() {
        if ($selected.id === "audio") selectedFiles = clone($selected.data)
        else selectedFiles = []
    }

    function createPlaylist(e: ClickEvent) {
        let playlistName = ""
        let files: { path: string; name: string }[] = filteredFiles.filter((a) => !a.isFolder)
        if (selectedFiles.length) files = selectedFiles.map((a) => ({ path: a.path, name: a.name }))

        if (e.detail.ctrl) {
            files = []
        } else if (!isDefault) {
            playlistName = name
            if (name.includes(".")) playlistName = translateText(`category.${name.slice(name.indexOf(".") + 1)}`)
        }

        let playlistId = uid()
        audioPlaylists.update((a) => {
            a[playlistId] = {
                name: playlistName,
                songs: files.map((a) => a.path)
            }

            return a
        })

        drawerTabsData.update((a) => {
            a.audio.activeSubTab = playlistId
            return a
        })

        if (!playlistName || !files.length) {
            activeRename.set("category_audio_" + playlistId)
        }
    }

    // select all
    $: if ($selectAllAudio) selectAll()
    function selectAll() {
        if (playlist) {
            let data = playlist.songs.map((file, index) => {
                return { path: file, name: getFileName(file), index }
            })

            selected.set({ id: "audio", data })
            selectAllAudio.set(false)
            return
        }

        let data = filteredFiles
            .filter((a) => getExtension(a.name))
            .map((file) => {
                return { path: file.path, name: file.name, index: -1 }
            })

        selected.set({ id: "audio", data })
        selectAllAudio.set(false)
    }

    $: pathString = path.replace(rootPath, "").replace(name, "").replaceAll("\\", "/").split("/").filter(Boolean).join("/")

    let updater = 1
    $: if (active) {
        setTimeout(update, 500)
        setTimeout(update, 2000) // double check
    }
    function update() {
        updater++
    }

    let inputsTab = $drawerTabsData.audio?.openedSubSubTab?.microphones || "microphones"

    function setSubSubTab(id: string) {
        if (!active) return

        drawerTabsData.update((a) => {
            if (!a.audio) a.audio = { enabled: true, activeSubTab: active }
            if (!a.audio.openedSubSubTab) a.audio.openedSubSubTab = {}
            a.audio.openedSubSubTab[active] = id
            return a
        })

        if (active === "inputs") inputsTab = id
    }
</script>

<svelte:window on:keydown={keydown} />

<!-- TABS -->

{#if active === "inputs"}
    <div class="tabs">
        <MaterialButton style="flex: 1;" isActive={inputsTab === "microphones"} on:click={() => setSubSubTab("microphones")}>
            <Icon size={1.2} id="microphone" white />
            <p><T id="live.microphones" /></p>
        </MaterialButton>
        <MaterialButton style="flex: 1;" isActive={inputsTab === "audio_streams"} on:click={() => setSubSubTab("audio_streams")}>
            <Icon size={1.2} id="audio_stream" white />
            <p><T id="live.audio_streams" /></p>
        </MaterialButton>
    </div>
{/if}

<!-- JA: carpetas de audio y búsqueda rápida, sin duplicar el reproductor original. -->
{#if active === "all" || (isLocalAudioFolder && !playlist)}
    <div class="ja-audio-toolbar">
        <strong>Pistas de audio</strong>
        <span>Buscar en:</span>
        {#if isLocalAudioFolder}
            <button type="button" class:chosen={jaSearchScope === "folder"} aria-pressed={jaSearchScope === "folder"} on:click={() => (jaSearchScope = "folder")}>Esta carpeta</button>
            <button type="button" class:chosen={jaSearchScope === "all"} aria-pressed={jaSearchScope === "all"} on:click={() => (jaSearchScope = "all")}>Todas las carpetas</button>
        {:else}
            <span>Todas las carpetas</span>
        {/if}
        {#if searchValue.trim()}
            <small>{searchedFiles.filter(file => !file.isFolder).length} resultados</small>
        {/if}
    </div>
{/if}
{#if auditionFile}
    {#key auditionFile.path}
        <AudioAudition file={auditionFile} on:close={() => (auditionFile = null)} />
    {/key}
{/if}

<div class="scroll" style="flex: 1;overflow-y: auto;" class:full={active === "inputs" || active === "effects_library"} bind:this={scrollElem}>
    <div class="grid" style={active !== "inputs" && active !== "effects_library" && !playlist && searchedFiles.length ? "" : "height: 100%;"}>
        {#if active === "inputs"}
            {#if inputsTab === "microphones"}
                <Microphones />
            {:else if inputsTab === "audio_streams"}
                <AudioStreams />
            {/if}
        {:else if active === "metronome"}
            <Metronome />
        {:else if playlist && playlistSettings}
            <div class="settings">
                <MaterialNumberInput label="settings.audio_crossfade (s)" value={playlist?.crossfade || 0} max={60} on:change={(e) => AudioPlaylist.update(active || "", "crossfade", e.detail)} sliderValues={{ max: 10, step: 0.5 }} showSlider />
                <MaterialNumberInput label="settings.playlist_volume (%)" value={Number(((playlist?.volume || 1) * 100).toFixed(2))} min={1} max={100} on:change={(e) => AudioPlaylist.update(active || "", "volume", e.detail / 100)} showSlider />
            </div>
        {:else if playlist}
            <DropArea id="audio_playlist" selectChildren let:fileOver file>
                {#if playlist.songs.length}
                    {#each playlist.songs as song, index}
                        <AudioFile path={song} name={getFileName(song)} {active} playlist {index} {fileOver} on:audition={(e) => (auditionFile = e.detail)} />
                    {/each}
                {:else}
                    <Center faded>
                        <T id="empty.general" />
                    </Center>
                {/if}
            </DropArea>
        {:else if active === "effects_library"}
            <DropArea id="effects_library" selectChildren file>
                {#if searchedFiles.length}
                    <div class="effects">
                        {#each searchedFiles as file}
                            <AudioEffect path={file.path} name={file.name} />
                        {/each}
                    </div>
                {:else}
                    <Center faded>
                        <T id="empty.general" />
                    </Center>
                {/if}
            </DropArea>
        {:else if searchedFiles.length}
            {#key rootPath}
                {#key path}
                    {#each searchedFiles as file}
                        {#if file.isFolder}
                            <Folder name={file.name} path={file.path} mode="list" on:open={(e) => (path = e.detail)} />
                        {:else}
                            <AudioFile path={file.path} name={file.name} {active} libraryName={jaSearchEverywhere && searchValue.trim() ? getJAAudioLibraryName(file.path, $audioFolders) : ""} on:audition={(e) => (auditionFile = e.detail)} />
                        {/if}
                    {/each}
                {/key}
            {/key}
        {:else}
            <Center style="opacity: 0.2;">
                <Icon id="noAudio" size={5} white />
            </Center>
        {/if}
    </div>
</div>

{#if active === "effects_library" || active === "metronome"}
    <!-- nothing -->
{:else if active === "inputs"}
    {#if inputsTab === "audio_streams"}
        <FloatingInputs onlyOne>
            <MaterialButton icon="add" style="flex: 1;" on:click={() => activePopup.set("audio_stream")} center title="new.audio_stream">
                {#if !$labelsDisabled}<T id="new.audio_stream" />{/if}
            </MaterialButton>
        </FloatingInputs>
    {/if}
{:else if playlist}
    <FloatingInputs side="left">
        <MaterialButton
            disabled={$outLocked}
            title={$activePlaylist?.id === active ? "media.stop" : "media.play"}
            on:click={() => {
                if ($outLocked) return
                $activePlaylist?.id === active ? AudioPlaylist.stop() : AudioPlaylist.start(active || "")
            }}
        >
            <Icon size={1.3} id={$activePlaylist?.id === active ? "stop" : "play"} white={$activePlaylist?.id !== active} />
        </MaterialButton>

        <div class="divider" />

        <MaterialButton
            title="media.toggle_shuffle"
            on:click={() => {
                if (!active) return
                AudioPlaylist.update(active, "mode", $audioPlaylists[active]?.mode === "shuffle" ? "default" : "shuffle")
                // if ($activePlaylist?.id === active) playlistNext("", $activePlaylist.active)
            }}
        >
            <Icon size={1.1} id="shuffle_play" white={$audioPlaylists[active || ""]?.mode !== "shuffle"} />
        </MaterialButton>
        <MaterialButton
            title={`media._loop${$audioPlaylists[active || ""]?.loop !== false ? ": settings.enabled" : ""}`}
            on:click={() => {
                if (!active) return
                AudioPlaylist.update(active, "loop", $audioPlaylists[active]?.loop === undefined ? false : !$audioPlaylists[active]?.loop)
            }}
        >
            <Icon size={1.1} id="loop" white={$audioPlaylists[active || ""]?.loop === false} />
        </MaterialButton>

        <!-- auto play next song in playlist -->
        <MaterialButton
            title={`media.auto_next${$audioPlaylists[active || ""]?.autoNext !== false ? ": settings.enabled" : ""}`}
            on:click={() => {
                if (!active) return
                AudioPlaylist.update(active, "autoNext", $audioPlaylists[active]?.autoNext === undefined ? false : !$audioPlaylists[active]?.autoNext)
            }}
        >
            <Icon size={1.1} id="auto" white={$audioPlaylists[active || ""]?.autoNext === false} />
        </MaterialButton>

        <div class="divider" />

        <!-- total length of playlist -->
        <p class="time">
            {updater &&
                joinTime(
                    secondsToTime(
                        playlist.songs.reduce((sum, path) => {
                            const duration = AudioPlayer.getDurationSync(path)
                            return sum + duration
                        }, 0)
                    )
                )}
        </p>
    </FloatingInputs>

    <FloatingInputs round>
        <MaterialButton isActive={playlistSettings} title="audio.playlist_settings" on:click={() => (playlistSettings = !playlistSettings)}>
            <Icon size={1.1} id="options" white={!playlistSettings} />
        </MaterialButton>
    </FloatingInputs>
{:else if active === "all" || active === "favourites"}
    <!-- nothing -->
{:else}
    <!--  -->
    {#if rootPath !== path}
        <FloatingInputs side="left">
            <MaterialButton disabled={rootPath === path} title="actions.back" on:click={goBack}>
                <Icon id="back" white />
            </MaterialButton>

            <div class="divider"></div>

            <p style="opacity: 0.8;display: flex;align-items: center;padding: 0 15px;">
                <span style="opacity: 0.3;font-size: 0.9em;max-width: 500px;overflow: hidden;direction: rtl;">{pathString ? "/" : ""}{pathString}</span>
                {name}

                <!-- files count -->
                <!-- {#if content && rootPath !== path}
            <span style="opacity: 0.5;font-size: 0.9em;margin-inline-start: 10px;">{content}</span>
        {/if} -->
            </p>
        </FloatingInputs>
    {/if}

    <!-- only show if audio content -->
    {#if filteredFiles.filter((a) => !a.isFolder)?.length}
        <FloatingInputs onlyOne on:mousedown={storeSelected}>
            <MaterialButton title="new.playlist" on:click={createPlaylist}>
                <Icon size={1.2} id="playlist_create" />
                {#if !$labelsDisabled}<p><T id="new.playlist" /></p>{/if}
            </MaterialButton>
        </FloatingInputs>
    {/if}
{/if}

<style>
    .ja-audio-toolbar {
        display: flex; flex-wrap: wrap; align-items: center; gap: 7px; padding: 8px 10px;
        border-bottom: 1px solid #2a5678; background: #0b2b47; color: #d8e7f2; font-size: .8em;
    }
    .ja-audio-toolbar strong { margin-right: 7px; color: #f6bf19; }
    .ja-audio-toolbar button {
        border-radius: 6px; border: 1px solid #436b88; background: #143956;
        color: #eaf4fa; padding: 5px 9px; font: inherit; cursor: pointer;
    }
    .ja-audio-toolbar button.chosen {
        background: #f6bf19; color: #092034; border-color: #f6bf19; font-weight: 700;
    }
    .ja-audio-toolbar small { margin-left: auto; color: #adcadc; }
    .tabs {
        display: flex;
        position: relative;
        background-color: var(--primary-darkest);
        align-items: center;
    }

    .tabs :global(button) {
        border-radius: 0;
        border: none !important;
        border-bottom: 1px solid var(--primary-lighter) !important;
        padding: 8px;
    }
    .tabs :global(button.isActive) {
        border-bottom: 1px solid var(--secondary) !important;
    }

    .scroll {
        padding-bottom: 60px;
    }
    .scroll.full {
        padding-bottom: 0;
    }

    .grid {
        display: flex;
        flex-direction: column;
        /* flex-wrap: wrap; */
        flex: 1;
        /* gap: 10px;
    padding: 10px; */
        /* padding: 5px; */
        place-content: flex-start;
    }

    .grid :global(button) {
        /* font-size: 1em; */
        padding: 6px 15px;

        justify-content: space-between;
    }
    .grid :global(.selectElem:not(.isSelected):nth-child(even)) {
        background-color: rgb(0 0 20 / 0.08);
    }

    .settings {
        margin: 15px;
        padding: 10px;

        border: 1px solid var(--primary-lighter);

        border-radius: 8px;
        overflow: hidden;
    }

    .effects {
        display: flex;
        align-items: center;
        justify-content: center;
        align-content: center;
        flex-wrap: wrap;
        gap: 5px;

        width: 100%;
        min-height: 100%;
        box-sizing: border-box;
        padding: 10px;
    }
    .effects :global(.selectElem button) {
        background-color: var(--primary-darkest);
        /* transition: 0.2s outline; */
    }

    .time {
        display: flex;
        align-items: center;

        font-size: 0.9em;
        padding: 0 10px;
        opacity: 0.8;
    }
</style>
