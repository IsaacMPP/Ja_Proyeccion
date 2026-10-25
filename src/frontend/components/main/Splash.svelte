<script lang="ts">
    import { onMount } from "svelte"
    import { activePopup, activeProject, projects, projectView, quickSearchActive, showRecentlyUsedProjects, shows, special, version } from "../../stores"
    import { history } from "../helpers/history"
    import Icon from "../helpers/Icon.svelte"
    import T from "../helpers/T.svelte"
    import Link from "../inputs/Link.svelte"
    import MaterialButton from "../inputs/MaterialButton.svelte"
    import Center from "../system/Center.svelte"
    import { getVOTD } from "./votd"

    function createProject() {
        // if opened project is empty go to project list (to reduce confusion)
        if ($projects[$activeProject || ""]?.shows?.length === 0) {
            activeProject.set(null)
            projectView.set(true)
        }

        history({ id: "UPDATE", location: { page: "show", id: "project" } })

        showRecentlyUsedProjects.set(false)
    }

    let links: string[] = []
    function extractLinksAndCleanText(text: string) {
        links = []

        // extract and remove links from <a> tags
        const textWithoutATags = text.replace(/<a\s[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>.*?<\/a>/gi, (_match, url) => {
            links.push(url)
            return ""
        })
        // extract and remove raw links from plain text
        const finalText = textWithoutATags.replace(/https?:\/\/[^\s<>"']+/gi, (url) => {
            links.push(url)
            return ""
        })

        return finalText.replaceAll("\n", "<br>").replace(/\s+/g, " ").trim()
    }

    let votd: string = ""
    onMount(async () => {
        if ($special.splashText) return
        votd = await getVOTD()
    })
</script>

<Center class="context #splash">
    <div class="ja-welcome">
        <img src="./ja-logo.svg" alt="Emblema JA" draggable={false} />
        <h1>JA <span>Proyección</span></h1>
        <p class="ja-subtitle">Multimedia y presentaciones para tu iglesia</p>
        <p class="ja-version">Versión {$version}</p>
    </div>
    {#if $special.splashText}
        <p style="padding-top: 30px">
            {@html extractLinksAndCleanText($special.splashText)}
            <span class="links" style="display: flex;flex-direction: column;align-items: center;">
                {#each links as link}
                    <Link url={link}>
                        {link.replace(/^(https?:\/\/)/, "")}
                        <Icon id="launch" white />
                    </Link>
                {/each}
            </span>
        </p>
    {:else if Object.keys($shows).length < 20}
        <!-- shows up for new users (can be found in "About" menu) -->
        <p style="padding-top: 30px">
            <Link url="https://github.com/IsaacMPP/Ja_Proyeccion">
                <T id="main.docs" />
                <Icon id="launch" white />
            </Link>
        </p>
    {:else if votd}
        <p class="votd" style="padding-top: 30px" data-title="Verse of the Day [votd.org]">
            <Link url="https://votd.org/">
                {votd}
            </Link>
        </p>
    {/if}

    <span style="padding-top: 30px" class="buttons">
        <MaterialButton icon="search" title="main.quick_search" on:click={() => quickSearchActive.set(true)}>
            <T id="main.quick_search" />
        </MaterialButton>
        <MaterialButton icon="project" title="tooltip.project" on:click={createProject}>
            <T id="new.project" />
        </MaterialButton>
        <MaterialButton
            icon="add"
            title="tooltip.show"
            on:click={(e) => {
                if (e.detail.ctrl) {
                    history({ id: "UPDATE", newData: { remember: { project: $activeProject } }, location: { page: "show", id: "show" } })
                } else activePopup.set("show")
            }}
        >
            <T id="new.show" />
        </MaterialButton>
    </span>
</Center>

<style>
    .ja-welcome {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        margin: 0 auto;
        padding: 18px 22px 4px;
        text-align: center;
        max-width: min(95%, 680px);
    }
    .ja-welcome img {
        width: min(200px, 30vw);
        max-height: 122px;
        object-fit: contain;
        filter: drop-shadow(0 8px 16px rgba(1, 9, 19, 0.3));
    }
    .ja-welcome h1 {
        font-size: clamp(2em, 4vw, 3.65em);
        color: var(--text);
        line-height: 1.08;
        letter-spacing: -0.05em;
        overflow: visible;
    }
    .ja-welcome h1 span {
        color: var(--secondary);
    }
    .ja-welcome .ja-subtitle {
        font-size: 0.98em;
        opacity: 0.82;
        white-space: normal;
    }
    .ja-welcome .ja-version {
        font-size: 0.78em;
        opacity: 0.55;
    }


    p {
        overflow: initial;
    }

    .buttons {
        display: flex;
        flex-direction: column;
        gap: 7px;
        min-width: min(290px, 80vw);
    }
    .buttons :global(button:first-child) {
        border-color: var(--secondary);
    }

    .buttons :global(button) {
        justify-content: start;
        padding: 9px 14px;
        border-radius: 9px;
        min-height: 37px;
        background: var(--primary-darker);
        border: 1px solid var(--primary-lighter);
        transition: border-color 0.15s ease, background-color 0.15s ease;
    }
    .buttons :global(button:hover) {
        background: var(--primary-lighter);
        border-color: var(--secondary);
    }

    .votd {
        padding: 0 10px;
        max-width: 580px;
        white-space: normal;
        text-align: left;
        font-style: italic;
        font-size: 0.9em;
    }
    .votd :global(a) {
        text-decoration: none;
    }

    @media screen and (max-height: 500px) {
        h1 {
            font-size: 3em;
        }
    }
    @media screen and (max-height: 400px) {
        h1 {
            font-size: 2em;
        }
    }
    @media screen and (max-width: 800px) {
        h1 {
            font-size: 2em;
        }
    }
</style>
