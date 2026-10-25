<script lang="ts">
    import { createEventDispatcher } from "svelte"
    import { AudioPlayer } from "../../../audio/audioPlayer"
    import { AudioPlaylist } from "../../../audio/audioPlaylist"
    import { addProjectItem } from "../../../converters/project"
    import { activePlaylist, activeShow, media, outLocked, playingAudio } from "../../../stores"
    import Icon from "../../helpers/Icon.svelte"
    import { joinTime, secondsToTime } from "../../helpers/time"
    import Button from "../../inputs/Button.svelte"

    import SelectElem from "../../system/SelectElem.svelte"

    export let path: string
    export let name: string
    export let active: string | null = null
    export let playlist = false
    export let index = -1
    export let fileOver = false
    export let libraryName = ""

    const dispatch = createEventDispatcher<{ audition: { path: string; name: string } }>()

    $: audioKey = playlist && index > -1 ? AudioPlayer.getKey(path, index) : path
    $: outline = !!$playingAudio[audioKey] && (!$activePlaylist || $activePlaylist?.index === index)
</script>

<SelectElem id="audio" data={{ path, name, index }} {fileOver} borders={playlist ? "edges" : "all"} trigger={playlist ? "column" : null} draggable>
    <div class="ja-audio-row">
    <div class="ja-audio-play">
    <Button
        class="context #audio_button{playlist ? '_playlist' : ''}"
        {outline}
        active={$activeShow?.id === path}
        border
        style="width: 100%;"
        title={path}
        bold={false}
        on:click={(e) => {
            if ($outLocked || e.ctrlKey || e.metaKey || e.shiftKey) return

            if (playlist) AudioPlaylist.start(active || "", path, index, { pauseIfPlaying: true })
            else AudioPlayer.start(path, { name }, { playMultiple: e.altKey })
        }}
        on:dblclick={(e) => {
            if (e.ctrlKey || e.metaKey || e.shiftKey) return
            addProjectItem({ id: path, name, type: "audio" })
        }}
    >
        <span style="max-width: 90%;">
            {#await AudioPlayer.getDuration(path)}
                <Icon id="music" white right />
            {:then duration}
                <Icon id={$playingAudio[audioKey]?.paused === true ? "play" : $playingAudio[audioKey]?.paused === false ? "pause" : $media[path]?.favourite === true && active !== "favourites" ? "star" : AudioPlayer.getAudioType(path, duration)} white={$playingAudio[audioKey]?.paused === true || (!$playingAudio[audioKey] && ($media[path]?.favourite !== true || active === "favourites"))} right />
            {/await}
            <p>{name.slice(0, name.lastIndexOf("."))}</p>
        </span>
        <span style="opacity: 0.8;">
            {#if libraryName}
                <small class="ja-audio-library" title={libraryName}>{libraryName}</small>
            {/if}
            {#await AudioPlayer.getDuration(path)}
                <p>00:00</p>
            {:then duration}
                <p>{joinTime(secondsToTime(duration))}</p>
            {/await}
        </span>
    </Button>
    </div>
    <button
        type="button"
        class="ja-audition-action"
        title="Escucha previa: requiere elegir audífonos u otra salida de audio"
        on:click|stopPropagation={() => dispatch("audition", { path, name })}
    >Preescuchar</button>
    </div>
</SelectElem>

<style>
    .ja-audio-row { display: flex; align-items: stretch; width: 100%; gap: 5px; }
    .ja-audio-play { flex: 1; min-width: 0; }
    .ja-audio-play :global(button) { min-width: 0; }
    .ja-audition-action {
        flex: none; margin: 3px 7px 3px 0; padding: 5px 10px; cursor: pointer;
        font: inherit; font-size: .75em; border: 1px solid #456f8d;
        border-radius: 6px; color: #f5d568; background: #143956;
    }
    .ja-audition-action:hover { border-color: #f6bf19; background: #205275; }
    .ja-audio-library {
        display: inline-block; max-width: 150px; overflow: hidden;
        text-overflow: ellipsis; white-space: nowrap; color: #b9d5e5;
        padding: 2px 6px; border: 1px solid #375c75; border-radius: 5px;
    }
    span {
        display: flex;
        align-items: center;
        gap: 5px;
    }
</style>
