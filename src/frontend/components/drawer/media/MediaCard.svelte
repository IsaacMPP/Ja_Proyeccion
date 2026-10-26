<script lang="ts">
    import { derived } from "svelte/store"
    import { AudioPlayer } from "../../../audio/audioPlayer"
    import { VideoPlayer } from "../../media/video/videoPlayer"
    import type { ContentFile, ContentProviderId } from "../../../../electron/contentProviders/base/types"
    import type { MediaStyle } from "../../../../types/Main"
    import { Main } from "../../../../types/IPC/Main"
    import { requestMain } from "../../../IPC/main"
    import { newToast } from "../../../utils/common"
    import { save } from "../../../utils/save"
    import type { ShowType } from "../../../../types/Show"
    import { addProjectItem } from "../../../converters/project"
    import { activeShow, customMessageCredits, media, mediaOptions, mediaTags, outLocked, outputs, photoApiCredits, styles } from "../../../stores"
    import { translateText } from "../../../utils/language"
    import { getKey } from "../../../values/keys"
    import Icon from "../../helpers/Icon.svelte"
    import { getMediaLayerType, getMediaStyle, getMediaType, loadThumbnail } from "../../helpers/media"
    import { findMatchingOut, getAllActiveOutputs, getFirstActiveOutput, setOutput } from "../../helpers/output"
    import Button from "../../inputs/Button.svelte"
    import { clearBackground, clearSlide } from "../../output/clear"
    import SelectElem from "../../system/SelectElem.svelte"
    import Card from "../Card.svelte"
    import MediaLoader from "./MediaLoader.svelte"

    export let name: string
    export let collectionName = ""
    export let path: string
    export let credits: any = {}
    export let type: ShowType
    export let active: string | null
    export let shiftRange: any[] = []
    export let thumbnailPath = ""
    export let thumbnail = true
    export let loadFullImage = false
    export let contentProvider: ContentProviderId | false = false
    export let contentFileData: ContentFile | null = null

    $: supportsAudioOnly = type === "video" && !contentProvider && !!path
    let startingAudio = false
    async function playHymnAudio(event: MouseEvent) {
        event.stopPropagation()
        if (startingAudio || !supportsAudioOnly) return
        startingAudio = true
        try {
            const played = await AudioPlayer.start(path, { name }, { pauseIfPlaying: false })
            if (!played) {
                newToast("No se pudo reproducir el audio de este MP4")
                return
            }
            // Solo audio es una acción nueva, no una transición sincronizada:
            // liberar únicamente las salidas que muestran este mismo video.
            // No tocar fondos diferentes, versículos ni otras pantallas.
            Object.entries($outputs).forEach(([outputId, output]) => {
                if ((output.out?.background?.path || output.out?.background?.id) === path) {
                    clearBackground(outputId)
                }
            })
        } catch (error) {
            console.error("JA: error al reproducir audio del himno", error)
            newToast("El archivo no contiene audio compatible o no se puede abrir")
        } finally {
            startingAudio = false
        }
    }

    $: customCoverPath = !contentProvider && type === "video" ? $media[path]?.jaCoverPath || "" : ""
    $: previewCoverPath = customCoverPath || thumbnailPath
    let changingCover = false

    async function chooseCover(event: MouseEvent) {
        event.stopPropagation()
        if (changingCover || !path || contentProvider || type !== "video") return
        iconClicked = setTimeout(() => (iconClicked = null), 100)
        changingCover = true
        try {
            const chosen = await requestMain(Main.JA_PICK_VIDEO_COVER, { videoPath: path, previousPath: customCoverPath })
            if (chosen?.status === "ok") {
                media.update((entries) => ({
                    ...entries,
                    [path]: { ...(entries[path] || {}), jaCoverPath: chosen.path }
                }))
                save()
                newToast("Portada personalizada guardada")
            } else if (chosen?.status === "error") {
                newToast(chosen.message)
            }
        } catch (error) {
            console.error("JA: No se pudo cambiar la portada", error)
            newToast("No fue posible cambiar la portada")
        } finally {
            changingCover = false
        }
    }

    async function resetCover(event: MouseEvent) {
        event.stopPropagation()
        if (changingCover || !customCoverPath) return
        iconClicked = setTimeout(() => (iconClicked = null), 100)
        changingCover = true
        try {
            // La asociación se elimina aunque ya no exista el archivo de la portada.
            await requestMain(Main.JA_REMOVE_VIDEO_COVER, { videoPath: path, coverPath: customCoverPath })
            media.update((entries) => {
                const next = { ...entries, [path]: { ...(entries[path] || {}) } }
                delete next[path].jaCoverPath
                return next
            })
            failed = false
            thumbnailPath = ""
            save()
            newToast("Miniatura automática restaurada")
        } catch (error) {
            console.error("JA: No se pudo restaurar la portada", error)
            newToast("No fue posible restaurar la portada")
        } finally {
            changingCover = false
        }
    }

    let failed = false
    $: if (thumbnail && !thumbnailPath && !loadFullImage && !customCoverPath) getThumbnail()
    async function getThumbnail() {
        failed = false
        thumbnailPath = await loadThumbnail(path)
        if (!thumbnailPath) failed = true
    }

    // Store ContentFile object and display name for later use (license check, convert to show, etc.)
    $: if (contentFileData && contentProvider && path) {
        media.update((m) => {
            if (!m[path]) m[path] = {}
            m[path].contentFile = { ...contentFileData, providerId: contentProvider }
            m[path].name = name
            return m
        })
    }

    // Memoized name computation
    let displayName = ""
    $: {
        const dotIndex = name.lastIndexOf(".")
        const newName = dotIndex > 0 ? name.slice(0, dotIndex) : name
        if (displayName !== newName) {
            displayName = newName
        }
    }

    let loaded = true
    let videoElem: HTMLVideoElement | undefined
    let hover = false
    let duration = 0

    const steps = 10
    function move(e: any) {
        if (!loaded || !videoElem) {
            // if (hover) clearTimeout(enterTimeout)
            hover = false
            return
        }

        let percentage: number = e.offsetX / e.target.offsetWidth

        let time = Math.floor(duration * ((Math.floor(percentage * steps) * steps + steps) / 100))
        if (time && videoElem.currentTime === time) return
        if (!isFinite(time)) return

        if (Number(time) === time) videoElem.currentTime = time
    }

    function mousedown(e: any) {
        if (e.ctrlKey || e.metaKey) return

        if (credits) {
            photoApiCredits.set(credits)
        }
    }

    // let enterTimeout = null
    function mouseenter(e: any) {
        const mediaGrid = document.querySelector(".grid")?.querySelector(".grid")
        if (!mediaGrid) return

        // don't load if clicked (probably selecting)
        // WIP return if scrolling & don't load if quickly dragging the mouse across..
        if (e.buttons > 0) return
        hover = true

        // don't load all the videos if scrolling, or selecting
        // const scrollTop = mediaGrid.scrollTop
        // if (enterTimeout) clearTimeout(enterTimeout)
        // enterTimeout = setTimeout(() => {
        //     enterTimeout = null
        //     // return if scrolling or selected
        //     if (scrollTop !== mediaGrid.scrollTop || $selected.data.find((a) => a.path === path)) return
        //     hover = true
        // }, 200)
    }

    let wait = false
    function click(e: any, forceMuted = false) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || $outLocked || wait || iconClicked) return

        // don't hide again when double clicking
        wait = true
        setTimeout(() => {
            wait = false
        }, 800)

        const activeOutputs = getAllActiveOutputs()

        const isActive = activeOutputs.some((a) => (a.out?.background?.path || a.out?.background?.id) === path)
        if (type === "video" && !contentProvider) {
            // Modes are mutually exclusive for this file, without a timed handoff.
            // Do not stop unrelated audio or change another output's background.
            AudioPlayer.stop(path)
            if (isActive) {
                activeOutputs.forEach((output) => {
                    if ((output.out?.background?.path || output.out?.background?.id) !== path) return
                    const videoAudio = VideoPlayer.getAudio(path, output.id)
                    if (videoAudio && !!videoAudio.muted !== forceMuted) VideoPlayer.toggleMute(path, output.id)
                })
                return
            }
        } else if (isActive) {
            clearBackground()
            return
        }

        let videoType = getMediaLayerType(path, mediaStyle)
        let loop = contentProvider || videoType === "foreground" ? false : true
        let muted = videoType === "background" ? true : false
        if (videoType === "foreground") clearSlide()

        // get style per output
        activeOutputs.forEach((output) => {
            const currentOutputStyle = $styles[output.style || ""]
            const currentMediaStyle = getMediaStyle($media[path], currentOutputStyle)
            setOutput("background", { path, type, loop, muted, startAt: 0, ...currentMediaStyle, ...(forceMuted ? { muted: true } : {}), ignoreLayer: videoType === "foreground" }, false, output.id)
        })

        // unsplash requires the download to be triggered when using their images
        if (credits && credits.type === "unsplash" && credits.trigger_download) {
            fetch(credits.trigger_download + "?client_id=" + getKey("unsplash"), { method: "GET" }).catch((err) => console.error("Could not trigger download:", err))
            customMessageCredits.set(`Photo by ${credits.artist} on Unsplash`)
        } else {
            customMessageCredits.set("")
        }
    }

    function projectVideoMuted(event: MouseEvent) {
        event.stopPropagation()
        if (type !== "video" || contentProvider) return
        click(event, true)
        iconClicked = setTimeout(() => (iconClicked = null), 100)
    }

    function dblclick(e: any) {
        if (e.ctrlKey || e.metaKey || iconClicked) return

        // add to project
        const data = { id: path, name, type: getMediaType(path.slice(path.lastIndexOf(".") + 1, path.length)) }
        addProjectItem(data)
    }

    // Memoized output and style computation
    const currentOutput = derived(outputs, ($outputs) => getFirstActiveOutput($outputs))
    const currentStyle = derived([currentOutput, styles], ([$currentOutput, $styles]) => $styles[$currentOutput?.style || ""] || {})

    // Memoized media style computation
    let mediaStyle: MediaStyle = {}
    $: if (path && JSON.stringify($media[path]) !== JSON.stringify(mediaStyle)) {
        mediaStyle = getMediaStyle($media[path], $currentStyle)
    }

    // fixed resolution
    let resolution = { width: 16, height: 9 }
    // $: resolution = getResolution(null, { $outputs, $styles })

    // Memoized computed properties
    let isFavourite = false
    let icon = "image"
    let tags: string[] = []

    $: {
        const mediaData = $media[path]
        isFavourite = mediaData?.favourite === true
        icon = type === "video" ? "movie" : "image"
        tags = mediaData?.tags || []
    }

    let iconClicked: NodeJS.Timeout | null = null
    function removeStyle(key: string) {
        iconClicked = setTimeout(() => (iconClicked = null), 50)

        media.update((a) => {
            if (!a[path]) return a

            if (key === "filters") {
                delete a[path].fit
                delete a[path].flipped
                delete a[path].flippedY
                delete a[path].blend
                delete a[path].filter
                delete a[path].cropping
            } else if (key === "tags") {
                a[path].tags = []
            } else {
                delete a[path][key]
            }

            return a
        })
    }
</script>

<SelectElem id="media" class="context #media_card" data={{ name, path, type, contentProvider }} {shiftRange} draggable fill>
    <Card
        resolution={{ width: 16, height: 9 }}
        loaded={(loaded && ($mediaOptions.mode === "grid" ? !!previewCoverPath || loadFullImage : true)) || (failed && !customCoverPath)}
        style={thumbnail ? `width: ${$mediaOptions.mode === "grid" ? 100 : 100 / $mediaOptions.columns}%;` : ""}
        mode={$mediaOptions.mode}
        width={100}
        preview={$activeShow?.id === path}
        outlineColor={findMatchingOut(path, $outputs)}
        active={findMatchingOut(path, $outputs) !== null}
        label={collectionName ? `${displayName} · ${collectionName}` : displayName}
        title={contentProvider ? "" : path}
        icon={thumbnail ? icon : null}
        white={type === "image"}
        showPlayOnHover
        checkered={$mediaOptions.mode === "grid" && mediaStyle.fit !== "blur" && !failed}
        on:mousedown={mousedown}
        on:click={click}
        on:dblclick={dblclick}
        on:mouseenter={mouseenter}
        on:mouseleave={() => (hover = false)}
        on:mousemove={move}
    >
        <!-- icons -->
        <div class="icons">
            {#if supportsAudioOnly}
                <div class="button"><Button style="padding: 3px;" title="Solo video: proyectar sin sonido" on:click={projectVideoMuted}><Icon id="volume_off" size={0.9} white /></Button></div>
                <div class="button"><Button style="padding: 3px;" title="Solo audio: escuchar el video sin cambiar las pantallas" on:click={playHymnAudio} disabled={startingAudio}><Icon id="audio" size={0.9} white /></Button></div>
            {/if}
            {#if !contentProvider && type === "video" && path}
                <div class="ja-cover-controls">
                    <div class="button">
                        <Button style="padding: 3px;" title="Elegir portada JPG o PNG" on:click={chooseCover} disabled={changingCover}>
                            <Icon id="image" size={0.9} white />
                        </Button>
                    </div>
                    {#if customCoverPath}
                        <div class="button">
                            <Button style="padding: 3px;" title="Restaurar miniatura automática" on:click={resetCover} disabled={changingCover}>
                                <Icon id="refresh" size={0.9} white />
                            </Button>
                        </div>
                    {/if}
                </div>
            {/if}
            {#if isFavourite && active !== "favourites"}
                <div style="max-width: 100%;">
                    <div class="button">
                        <Button style="padding: 3px;" redHover title={translateText("actions.remove")} on:click={() => removeStyle("favourite")}>
                            <Icon id="star" size={0.9} white />
                        </Button>
                    </div>
                </div>
            {/if}
            {#if mediaStyle.videoType}
                <div style="max-width: 100%;">
                    <div class="button">
                        <Button style="padding: 3px;" redHover title={translateText("actions.remove")} on:click={() => removeStyle("videoType")}>
                            <Icon id={`type_${mediaStyle.videoType}`} size={0.9} white />
                        </Button>
                    </div>
                </div>
            {/if}
            {#if !!mediaStyle.filter?.length || $media[path]?.fit || mediaStyle.flipped || mediaStyle.flippedY || (mediaStyle.blend && mediaStyle.blend !== "normal") || Object.keys(mediaStyle.cropping || {}).length}
                <div style="max-width: 100%;">
                    <div class="button">
                        <Button style="padding: 3px;" redHover title={translateText("actions.remove")} on:click={() => removeStyle("filters")}>
                            <Icon id="filter" size={0.9} white />
                        </Button>
                    </div>
                </div>
            {/if}
            {#if tags.length}
                <div style="max-width: 100%;">
                    <div class="button">
                        <Button style="padding: 3px;" redHover title={translateText("actions.remove")} on:click={() => removeStyle("tags")}>
                            <Icon id="tag" size={0.9} white />
                        </Button>
                    </div>
                    <span style="max-width: 100%;">
                        <p>{tags.length === 1 ? $mediaTags[tags[0]]?.name || "—" : tags.length}</p>
                    </span>
                </div>
            {/if}
        </div>

        {#if failed && !customCoverPath}
            <div class="icon">
                <Icon size={2.5} id="close" style="color: var(--disconnected);" white />
            </div>
        {:else if thumbnail}
            {#if previewCoverPath || loadFullImage}
                <MediaLoader bind:loaded bind:hover bind:duration bind:videoElem {resolution} {type} {path} thumbnailPath={previewCoverPath} {name} {mediaStyle} {loadFullImage} />
            {/if}
        {:else}
            <div class="icon">
                <Icon size={2.5} id={icon} white={type === "image"} />
            </div>
        {/if}
    </Card>
</SelectElem>

<style>
    .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        /* overflow: hidden; */
        height: 100%;
    }
    .icon :global(svg) {
        height: 100%;
    }

    .ja-cover-controls {
        display: flex;
        gap: 3px;
        background: rgba(6, 27, 48, 0.9);
        border: 1px solid rgba(246, 191, 25, 0.55);
        border-radius: 6px;
        overflow: hidden;
        pointer-events: all;
    }
    .ja-cover-controls :global(button:hover) { color: #f6bf19; }

    /* icons */

    .icons {
        pointer-events: none;
        display: flex;
        flex-direction: column;
        position: absolute;
        left: 0;
        z-index: 1;
        font-size: 0.9em;

        height: 80%;
        flex-wrap: wrap;

        max-width: calc(100% - 21px);
    }
    .icons div {
        opacity: 0.9;
        display: flex;
    }
    .icons .button {
        background-color: rgb(0 0 0 / 0.6);
        pointer-events: all;
    }
    .icons span {
        pointer-events: all;
        background-color: rgb(0 0 0 / 0.6);
        padding: 3px;
        font-size: 0.75em;
        font-weight: bold;
        display: flex;
        align-items: center;
    }
</style>
