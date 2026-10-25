<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte"
    import { encodeFilePath } from "../../helpers/media"

    export let file: { path: string; name: string }

    const dispatch = createEventDispatcher<{ close: void }>()
    let audio: HTMLAudioElement | null = null
    let devices: { id: string; label: string }[] = []
    let selectedDevice = ""
    let error = ""
    let playing = false
    let currentTime = 0
    let duration = 0
    let volume = 60
    let playEpoch = 0
    let destroyed = false

    type RoutedAudio = HTMLAudioElement & { setSinkId?: (deviceId: string) => Promise<void> }

    async function updateDevices() {
        error = ""
        try {
            if (!navigator.mediaDevices?.enumerateDevices) throw new Error("No disponible")
            const entries = (await navigator.mediaDevices.enumerateDevices())
                .filter((device) => device.kind === "audiooutput" && !!device.deviceId && device.deviceId !== "default" && device.deviceId !== "communications")
            devices = entries.map((device, index) => ({
                id: device.deviceId,
                label: device.label || `Dispositivo de audio ${index + 1}`
            }))
            if (!devices.some(device => device.id === selectedDevice)) selectedDevice = ""
        } catch (cause) {
            console.warn("JA: No pudimos enumerar las salidas de audio", cause)
            devices = []
            selectedDevice = ""
            error = "No se pudieron detectar los dispositivos de audio."
        }
    }

    function stop() {
        playEpoch++
        if (audio) {
            audio.pause()
            audio.removeAttribute("src")
            audio.load()
        }
        playing = false
        currentTime = 0
        duration = 0
    }
    function chooseOutput(event: Event) {
        stop()
        selectedDevice = (event.currentTarget as HTMLSelectElement).value
        error = ""
    }

    async function toggleAudition() {
        if (!audio || !selectedDevice) {
            error = "Selecciona primero unos audífonos u otra salida física de audio."
            return
        }
        if (playing) {
            audio.pause()
            playing = false
            return
        }
        const routed = audio as RoutedAudio
        if (typeof routed.setSinkId !== "function") {
            error = "Esta instalación de Windows no admite enviar la escucha previa a un dispositivo independiente."
            return
        }
        try {
            const epoch = ++playEpoch
            error = ""
            // Configurar la salida física ANTES de cargar y reproducir la pista;
            // no utilizar AudioPlayer ni las rutas de sonido del culto.
            await routed.setSinkId(selectedDevice)
            if (destroyed || epoch !== playEpoch || !audio) return
            if (!audio.getAttribute("src")) audio.src = encodeFilePath(file.path)
            audio.volume = volume / 100
            await audio.play()
            playing = true
        } catch (cause) {
            audio.pause()
            playing = false
            console.warn("JA: Error de reproducción de audición", cause)
            error = "No pudimos escuchar en ese dispositivo. Comprueba que esté conectado."
        }
    }
    function seek(event: Event) {
        if (!audio || !Number.isFinite(audio.duration)) return
        audio.currentTime = Number((event.currentTarget as HTMLInputElement).value)
        currentTime = audio.currentTime
    }
    function changeVolume(event: Event) {
        volume = Number((event.currentTarget as HTMLInputElement).value)
        if (audio) audio.volume = volume / 100
    }
    function formatTime(value: number) {
        const v = Number.isFinite(value) ? Math.floor(value) : 0
        return `${Math.floor(v / 60).toString().padStart(2, "0")}:${(v % 60).toString().padStart(2, "0")}`
    }
    function close() {
        stop()
        dispatch("close")
    }
    onMount(() => { void updateDevices() })
    onDestroy(() => { destroyed = true; stop() })
</script>

<div class="ja-audition-panel" role="region" aria-label="Escucha previa por dispositivo independiente">
    <div class="ja-audition-heading">
        <div>
            <strong>Escucha previa</strong>
            <small title={file.name}>{file.name}</small>
        </div>
        <button type="button" class="ja-audition-close" on:click={close} title="Cerrar escucha previa">Cerrar</button>
    </div>
    <p>Elige tus audífonos antes de escuchar. Si eliges los altavoces del culto, la pista también podrá escucharse en la sala.</p>
    <div class="ja-audition-controls">
        <label for="ja-audition-output">Salida para audición</label>
        <select id="ja-audition-output" value={selectedDevice} on:change={chooseOutput}>
            <option value="">Seleccionar dispositivo…</option>
            {#each devices as device (device.id)}
                <option value={device.id}>{device.label}</option>
            {/each}
        </select>
        <button type="button" on:click={updateDevices} title="Actualizar dispositivos">Actualizar</button>
        <button type="button" class="primary" disabled={!selectedDevice} on:click={toggleAudition}>{playing ? "Pausar" : "Escuchar"}</button>
        <button type="button" disabled={!audio || !audio.getAttribute("src")} on:click={stop}>Detener</button>
    </div>
    <div class="ja-audition-progress">
        <span>{formatTime(currentTime)}</span>
        <input aria-label="Avanzar audición" type="range" min="0" max={Number.isFinite(duration) && duration > 0 ? duration : 1} step="0.1" value={currentTime} disabled={!duration} on:input={seek} />
        <span>{formatTime(duration)}</span>
        <label for="ja-audition-volume">Volumen</label>
        <input id="ja-audition-volume" type="range" min="0" max="100" step="1" value={volume} on:input={changeVolume} />
    </div>
    {#if !devices.length}
        <p class="notice">Conecta audífonos o una segunda salida de sonido y pulsa «Actualizar».</p>
    {/if}
    {#if error}
        <p class="error" role="alert">{error}</p>
    {/if}
    <audio
        bind:this={audio}
        preload="none"
        on:timeupdate={() => { currentTime = audio?.currentTime || 0 }}
        on:durationchange={() => { duration = Number.isFinite(audio?.duration) ? audio?.duration || 0 : 0 }}
        on:ended={() => { playing = false }}
        on:error={() => { if (audio?.getAttribute("src")) { playing = false; error = "No se pudo leer el archivo de audio." } }}
    ><track kind="captions" /></audio>
</div>

<style>
    .ja-audition-panel {
        padding: 12px; display: flex; flex-direction: column; gap: 9px;
        background: #0d2c48; border-bottom: 2px solid #f6bf19; color: #e8f4fc;
        font-size: .86em;
    }
    .ja-audition-heading { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .ja-audition-heading > div { display: flex; flex-direction: column; min-width: 0; gap: 3px; }
    .ja-audition-heading strong { color: #f6bf19; }
    .ja-audition-heading small { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ja-audition-panel p { margin: 0; color: #bacfe0; white-space: normal; }
    .ja-audition-controls, .ja-audition-progress {
        display: flex; align-items: center; flex-wrap: wrap; gap: 7px;
    }
    .ja-audition-panel select { min-width: 150px; flex: 1; max-width: 280px; }
    .ja-audition-panel select, .ja-audition-panel button {
        color: #fff; background: #143e61; padding: 7px; border: 1px solid #47738f;
        border-radius: 6px; font: inherit;
    }
    .ja-audition-panel button { cursor: pointer; }
    .ja-audition-panel button:disabled { opacity: .4; cursor: not-allowed; }
    .ja-audition-panel button.primary { color: #071c2c; background: #f6bf19; font-weight: 700; }
    .ja-audition-progress input[type="range"]:first-of-type { flex: 2; min-width: 90px; }
    .ja-audition-progress input[type="range"]:last-of-type { width: 85px; }
    .ja-audition-progress label { margin-inline-start: auto; }
    .ja-audition-panel p.error { color: #ffb8b8; }
    .ja-audition-panel p.notice { color: #e5d394; }
</style>
