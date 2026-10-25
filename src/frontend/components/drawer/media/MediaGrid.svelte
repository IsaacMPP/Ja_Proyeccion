<script lang="ts">
    import { onDestroy } from "svelte"

    export let items: any[] = []
    export let columns = 1

    let cardHeight = 0

    let customCard: HTMLDivElement | undefined
    let ready = false
    $: if (customCard && columns) initialize()
    onDestroy(() => { if (scrollFrame !== null) cancelAnimationFrame(scrollFrame) })
    function initialize() {
        if (!customCard) return
        cardHeight = customCard.offsetHeight
        ready = true
    }

    let scrollYPos = 0
    let viewHeight = 0
    let firstItemIndex = 0
    let lastItemIndex = 0
    let scrollFrame: number | null = null
    const OVERSCAN_ROWS = 3

    // Windowing is based on visible rows, without an animated per-card backlog.
    // This prevents a large hymnal from processing hundreds of media cards per scroll.
    $: if (ready && items && columns && cardHeight > 0 && viewHeight > 0) updateVisibleItems()

    function updateVisibleItems() {
        if (!cardHeight || !viewHeight || !columns) return
        const firstRow = Math.max(0, Math.floor(scrollYPos / cardHeight) - OVERSCAN_ROWS)
        const visibleRows = Math.ceil(viewHeight / cardHeight) + OVERSCAN_ROWS * 2 + 1
        firstItemIndex = Math.min(items.length, firstRow * columns)
        lastItemIndex = Math.min(items.length, (firstRow + visibleRows) * columns)
    }

    function scroll(e: Event) {
        scrollYPos = (e.currentTarget as HTMLDivElement).scrollTop
        if (scrollFrame !== null) return
        scrollFrame = requestAnimationFrame(() => {
            scrollFrame = null
            updateVisibleItems()
        })
    }
</script>

<div class="grid" on:scroll={scroll} bind:clientHeight={viewHeight}>
    {#each items as item, i (item.path || i)}
        {#if i === 0}
            <div bind:this={customCard} class="card" style="width: {100 / columns}%;">
                <slot {item} />
            </div>
        {:else if i >= firstItemIndex && i < lastItemIndex}
            <div class="card" style="width: {100 / columns}%;">
                <slot {item} />
            </div>
        {:else}
            <div style="width: {100 / columns}%;height: {cardHeight}px;"></div>
        {/if}
    {/each}
</div>

<style>
    .grid {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        padding: 8px 10px;
        background: #071b30;

        width: 100%;
        height: 100%;

        overflow-y: auto;
        overflow-x: hidden;

        padding-bottom: 60px;
    }

    .card {
        display: flex;
        flex-direction: column;
        padding: 5px 7px 8px;
        min-width: 0;
        gap: 2px;
    }
    .card :global(.main) {
        border-radius: 7px;
    }
    .card :global(img),
    .card :global(video) {
        border-radius: 6px;
    }
</style>
