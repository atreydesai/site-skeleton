<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import Seo from "$lib/components/Seo.svelte";
    import { aboutData } from "$lib/content";
    import { parseInline, escapeHtml } from "$lib/utils/text";
    import { SITE } from "$lib/site";

    // Sidenote layout: each footnote floats in the right margin beside its
    // marker, faint until you hover the note or the marker.
    let containerEl: HTMLElement;
    let noteTops: Record<number, number> = {};
    let notesReady = false;
    let hovered: number | null = null;
    let layoutRaf = 0;

    // Matches the `xl:` breakpoint the two footnote renderings switch on.
    const SIDENOTE_QUERY = "(min-width: 1280px)";
    // Server-render and first paint assume the bottom list, which is the
    // rendering that exists without JS.
    let wideNotes = false;

    const footnotes = aboutData.footnotes;

    // Place each sidenote level with its marker, then push notes down just
    // enough that none overlap (classic Tufte-style margin note stacking).
    function layoutNotes() {
        if (!containerEl) return;
        if (!window.matchMedia(SIDENOTE_QUERY).matches) return;

        const containerTop =
            containerEl.getBoundingClientRect().top + window.scrollY;
        const entries = aboutData.footnotes
            .map((fn) => {
                const marker = document.querySelector(
                    `[data-footnote="${fn.id}"]`,
                );
                const note = document.getElementById(`fn-${fn.id}`);
                if (!marker || !note) return null;
                return {
                    id: fn.id,
                    markerTop:
                        marker.getBoundingClientRect().top +
                        window.scrollY -
                        containerTop,
                    height: note.offsetHeight,
                };
            })
            .filter((e): e is NonNullable<typeof e> => e !== null)
            .sort((a, b) => a.markerTop - b.markerTop);

        const tops: Record<number, number> = {};
        let prevBottom = 0;
        for (const e of entries) {
            const top = Math.max(e.markerTop, prevBottom);
            tops[e.id] = top;
            prevBottom = top + e.height + 16;
        }
        noteTops = tops;
        if (!notesReady) {
            // Let the computed tops paint before fading the notes in, so the
            // (transitioned) `top` doesn't animate from its initial 0.
            requestAnimationFrame(() => (notesReady = true));
        }
    }

    function scheduleLayout() {
        if (!browser) return;
        cancelAnimationFrame(layoutRaf);
        layoutRaf = requestAnimationFrame(layoutNotes);
    }

    onMount(() => {
        // Sidenotes and the bottom list are two renderings of the same notes,
        // and only one is displayed at a time. Whichever is visible owns the
        // `#fn-N` ids so a marker link always lands somewhere on screen.
        const wideMedia = window.matchMedia(SIDENOTE_QUERY);
        const syncWide = () => (wideNotes = wideMedia.matches);
        syncWide();
        wideMedia.addEventListener("change", syncWide);

        // Small delay to ensure all dynamic content is rendered (including
        // from parseLinks), then position the sidenotes.
        const setupTimeout = setTimeout(() => {
            layoutNotes();

            // Pointing at or focusing a marker brightens its note. Markers
            // come from @html, so the listeners are attached here; focus is
            // wired alongside hover so the pairing isn't pointer-only.
            document.querySelectorAll("[data-footnote]").forEach((marker) => {
                const id = parseInt(
                    marker.getAttribute("data-footnote") || "0",
                );
                marker.addEventListener("mouseenter", () => (hovered = id));
                marker.addEventListener("mouseleave", () => (hovered = null));
                marker.addEventListener("focus", () => (hovered = id));
                marker.addEventListener("blur", () => (hovered = null));
            });
        }, 100);

        // Re-measure when fonts land or the column reflows.
        document.fonts?.ready.then(scheduleLayout);
        const ro = new ResizeObserver(scheduleLayout);
        ro.observe(containerEl);
        window.addEventListener("resize", scheduleLayout);

        return () => {
            clearTimeout(setupTimeout);
            ro.disconnect();
            window.removeEventListener("resize", scheduleLayout);
            cancelAnimationFrame(layoutRaf);
            wideMedia.removeEventListener("change", syncWide);
        };
    });

    // Hovering a sidenote highlights its marker in the text (markers are
    // injected via @html, so toggle the class imperatively).
    $: if (browser) {
        document
            .querySelectorAll(".footnote-ref.fn-hot")
            .forEach((el) => el.classList.remove("fn-hot"));
        if (hovered != null) {
            document
                .querySelectorAll(`[data-footnote="${hovered}"]`)
                .forEach((el) => el.classList.add("fn-hot"));
        }
    }

    // Parse markdown-style links, emphasis, and footnote markers in about-page text.
    const parseLinks = (text: string) =>
        parseInline(text, {
            italic: true,
            footnotes: true,
            strongClass: "text-ink-900 dark:text-cream-100",
        });
</script>

<Seo
    title="About | {SITE.name}"
    description="About {SITE.name}: background, research, and interests."
    url="{SITE.url}/about/"
    pageType="AboutPage"
    about={true}
/>

<!-- Centered layout container with footnotes on the side -->
<div class="about-layout" bind:this={containerEl}>
    <!-- Sidenotes (desktop only): each note sits in the right margin beside
         its marker, faint until hovered. -->
    <aside class="about-sidenotes layer-raised hidden xl:block">
        <div class="relative h-full">
            {#each footnotes as footnote (footnote.id)}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="sidenote footnote-item text-xs text-ink-500 dark:text-cream-500 leading-relaxed"
                    class:fn-ready={notesReady}
                    class:fn-active={hovered === footnote.id}
                    style="top: {noteTops[footnote.id] ?? 0}px"
                    id={wideNotes ? `fn-${footnote.id}` : undefined}
                    on:mouseenter={() => (hovered = footnote.id)}
                    on:mouseleave={() => (hovered = null)}
                >
                    <a
                        href="#fnref-{footnote.id}"
                        class="footnote-backref text-accent-dark dark:text-accent-light"
                        aria-label="Back to reference {footnote.id}"
                        on:focus={() => (hovered = footnote.id)}
                        on:blur={() => (hovered = null)}>{footnote.id}.</a
                    >
                    {@html escapeHtml(footnote.content)}
                </div>
            {/each}
        </div>
    </aside>

    <!-- Main content - centered like other pages -->
    <div class="about-main page-shell page-shell-standard">
        <!-- Professional Section -->
        <section class="mb-12">
            <header class="page-header page-header-title-only">
                <h1 class="type-page-title text-ink-900 dark:text-cream-100">
                    who am i?
                </h1>
            </header>

            <div
                class="type-body flow-prose measure-reading text-ink-700 dark:text-cream-300"
            >
                <h2 class="section-heading">professionally speaking...</h2>

                <p>
                    {@html parseLinks(aboutData.professional.intro)}
                </p>

                {#each aboutData.professional.paragraphs as paragraph}
                    <p>
                        {@html parseLinks(
                            paragraph.text,
                        )}{#if paragraph.footnote}<a
                                    id="fnref-{paragraph.footnote}"
                                    href="#fn-{paragraph.footnote}"
                                    class="footnote-ref"
                                    data-footnote={paragraph.footnote}
                                    aria-label="Footnote {paragraph.footnote}"
                                    on:mouseenter={() => (hovered = paragraph.footnote ?? null)}
                                    on:mouseleave={() => (hovered = null)}
                                    on:focus={() => (hovered = paragraph.footnote ?? null)}
                                    on:blur={() => (hovered = null)}
                                    >[{paragraph.footnote}]</a
                                >{/if}
                    </p>
                {/each}

            </div>
        </section>

        <!-- Personal Section -->
        <section class="mb-12">
            <h2 class="section-heading">personally speaking...</h2>

            <div
                class="type-body flow-prose measure-reading text-ink-700 dark:text-cream-300"
            >
                {#each aboutData.personal.descriptions as description}
                    <p>
                        {@html parseLinks(description)}
                    </p>
                {/each}

                <p>
                    <span class="text-ink-500 dark:text-cream-500"
                        >other interests:</span
                    >
                    {@html parseLinks(aboutData.personal.interests)}
                </p>

                {#if aboutData.personal.blogs.length > 0}
                    <p>
                        <span class="text-ink-500 dark:text-cream-500"
                            >blogs i like:</span
                        >
                        {#each aboutData.personal.blogs as blog, i}
                            <a
                                href={blog.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="link">{blog.name}</a
                            >{#if i < aboutData.personal.blogs.length - 1},
                            {/if}
                        {/each}
                    </p>
                {/if}

            </div>
        </section>

        <!-- Where are you from -->
        <section class="mb-12">
            <h2 class="section-heading">where are you from?</h2>

            <div class="measure-reading text-ink-700 dark:text-cream-300">
                <p>
                    {@html parseLinks(aboutData.location.text)}
                </p>
            </div>
        </section>

        <!-- Why does this website look like this -->
        <section class="mb-12">
            <h2 class="section-heading">
                why does this website look like this?
            </h2>

            <div class="flow-prose measure-reading text-ink-700 dark:text-cream-300">
                <p>
                    <span class="text-ink-500 dark:text-cream-500"
                        >inspiration:</span
                    >
                    {aboutData.website.inspiration}
                </p>

                {#if aboutData.website.inspirationList.length > 0}
                    <ul class="space-y-0.5 text-sm">
                        {#each aboutData.website.inspirationList as site}
                            <li>
                                <a
                                    href={site.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="link">{site.name}</a
                                >:
                                <span class="text-ink-500 dark:text-cream-500"
                                    >{site.description}</span
                                >
                            </li>
                        {/each}
                    </ul>
                {/if}

                <p>
                    <span class="text-ink-500 dark:text-cream-500"
                        >built with:</span
                    >
                    {@html parseLinks(aboutData.website.builtWith)}
                </p>
            </div>
        </section>

        <!-- Friends -->
        {#if aboutData.friends?.length}
            <section class="mb-12">
                <h2 class="section-heading">friends of {SITE.givenName.toLowerCase()}</h2>

                <div class="measure-reading text-ink-700 dark:text-cream-300">
                    <ul class="space-y-0.5 text-sm">
                        {#each aboutData.friends as friend}
                            <li>
                                <a
                                    href={friend.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="link">{friend.name}</a
                                >
                            </li>
                        {/each}
                    </ul>
                </div>
            </section>
        {/if}

        <!-- Things I'm thinking about -->
        <section class="mb-12">
            <h2 class="section-heading">thoughts floating around in my head</h2>

            <div class="flow-prose measure-reading text-ink-700 dark:text-cream-300">
                <ul class="list-disc list-inside space-y-2">
                    {#each aboutData.thoughts as thought}
                        <li>{@html parseLinks(thought)}</li>
                    {/each}
                </ul>
            </div>
        </section>

        <!-- Mobile footnotes (shown at bottom wherever the sidenotes aren't) -->
        <div class="xl:hidden mt-12 pt-8">
            <h3 class="type-label mb-4 text-ink-500 dark:text-cream-400">footnotes</h3>
            <div class="space-y-4">
                {#each footnotes as footnote}
                    <div
                        class="text-xs text-ink-500 dark:text-cream-500 leading-relaxed"
                        id={wideNotes ? undefined : `fn-${footnote.id}`}
                    >
                        <a
                            href="#fnref-{footnote.id}"
                            class="footnote-backref text-accent-dark dark:text-accent-light"
                            aria-label="Back to reference {footnote.id}"
                            >{footnote.id}.</a
                        >
                        {@html escapeHtml(footnote.content)}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    .about-layout {
        position: relative;
        width: 100%;
        max-width: 820px;
        margin-inline: auto;
    }

    .about-main {
        width: 100%;
        max-width: calc(68ch + 3rem);
        margin-inline: 0;
    }

    @media (min-width: 1280px) {
        .about-layout {
            display: grid;
            width: min(calc(68ch + 19rem), calc(50% + 410px));
            max-width: none;
            margin-left: calc(50% - 410px);
            margin-right: 0;
            grid-template-columns: calc(68ch + 3rem) minmax(0, 14rem);
            column-gap: var(--space-8);
            justify-content: start;
            align-items: stretch;
        }

        .about-main {
            grid-column: 1;
            grid-row: 1;
            max-width: none;
        }

        .about-sidenotes {
            position: relative;
            grid-column: 2;
            grid-row: 1;
            width: 100%;
        }
    }

    /* Use :global() for footnote styles since they're dynamically generated via @html */
    :global(.footnote-ref) {
        font-size: 0.75rem;
        line-height: 1;
        vertical-align: super;
        color: theme("colors.accent.DEFAULT");
        cursor: pointer;
        text-decoration: none;
        transition: color var(--motion-base) var(--ease-standard);
    }

    :global(.footnote-ref:hover) {
        color: theme("colors.accent.dark");
    }

    /* The markers are links, so the shared :focus-visible ring applies. Only
       the corner radius is local, so the ring hugs the [n] rather than boxing
       a full line height. */
    :global(.footnote-ref),
    .footnote-backref {
        border-radius: var(--radius-control);
    }

    .footnote-backref {
        text-decoration: none;
    }

    /* Jumping to a note shouldn't land it under the sticky page top. */
    .footnote-item,
    .about-main [id^="fn-"] {
        scroll-margin-top: var(--space-16);
    }

    /* Margin sidenotes: absolutely positioned level with their markers
       (stacked apart when they'd overlap), faint until hovered: either the
       note itself or its marker in the text. Hidden until first layout so
       they don't flash at top: 0. */
    .sidenote {
        position: absolute;
        left: 0;
        right: 0;
        opacity: 0;
        transition: opacity var(--motion-slow) var(--ease-standard);
    }
    .sidenote.fn-ready {
        opacity: 0.45;
        transition:
            opacity var(--motion-slow) var(--ease-standard),
            top var(--motion-slow) var(--ease-emphasized);
    }
    .sidenote.fn-ready:hover,
    .sidenote.fn-ready.fn-active {
        opacity: 1;
    }

    /* Dark theme only: at 0.45 the resting note composited to 3.1:1 on
       ink-900, below AA for 12px text. 0.62 keeps it clearly recessive next
       to the full-opacity hover/focus state while staying legible. */
    :global(.dark) .sidenote.fn-ready {
        opacity: 0.62;
    }


    /* Marker echo: while its sidenote is hovered, the in-text marker warms. */
    :global(.footnote-ref.fn-hot) {
        color: theme("colors.accent.dark");
    }

</style>
