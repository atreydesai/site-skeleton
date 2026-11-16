<script lang="ts">
  import "../app.css";

  import { browser, dev } from "$app/environment";
  import { onMount } from "svelte";

  import { inject } from "@vercel/analytics";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

  import { fly } from "svelte/transition";

  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { startJustify } from "$lib/justify";
  import { startClickTracking } from "$lib/analytics";
  import {
    PAGE_TRANSITIONS_ENABLED,
    PAGE_TRANSITION_DURATION_MS,
    PAGE_TRANSITION_IN_DELAY_MS,
    PAGE_TRANSITION_IN_X,
    PAGE_TRANSITION_OUT_Y,
  } from "$lib/motion";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  // Both are read through live media queries (kept in sync in onMount): a
  // trackpad can be attached or Reduce Motion flipped while the page is open.
  const TOUCH_QUERY = "(hover: none) and (pointer: coarse)";
  const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

  let isTouch = browser && matchMedia(TOUCH_QUERY).matches;
  let reducedMotion = browser && matchMedia(REDUCED_MOTION_QUERY).matches;

  // Transitions are a desktop-pointer nicety; on touch they compete with the
  // platform's own back-swipe animation.
  $: animatePages = PAGE_TRANSITIONS_ENABLED && !isTouch && !reducedMotion;

  onMount(() => {
    // Knuth–Plass justification for running prose, site-wide.
    const stopJustify = startJustify();
    const stopClickTracking = startClickTracking();

    // Input mode and Reduce Motion can both change while the page is open —
    // a trackpad gets attached, or the setting is flipped in System Settings.
    const touchMedia = window.matchMedia(TOUCH_QUERY);
    const motionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
    const syncTouch = () => (isTouch = touchMedia.matches);
    const syncMotion = () => (reducedMotion = motionMedia.matches);
    syncTouch();
    syncMotion();
    touchMedia.addEventListener("change", syncTouch);
    motionMedia.addEventListener("change", syncMotion);

    // Vercel Analytics + Speed Insights (no-ops until enabled on the Vercel
    // project). They use buffered PerformanceObservers, so deferring their
    // injection still captures paint/LCP events from earlier in the page.
    inject({ mode: dev ? "development" : "production" });
    injectSpeedInsights();

    return () => {
      stopJustify();
      stopClickTracking();
      touchMedia.removeEventListener("change", syncTouch);
      motionMedia.removeEventListener("change", syncMotion);
    };
  });
</script>

<div class="min-h-screen flex flex-col">
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] btn-primary focus:cursor-auto"
  >
    Skip to content
  </a>

  <Header />

  <!-- One stable <main> landmark holds the skip-link target; only the layer
       inside it is keyed on the route. The two layers overlap in a single
       grid cell while the transition runs, so the outgoing page can't stack
       below the incoming one and double the page height mid-navigation. -->
  <main id="main-content" class="page-stack flex-1">
    {#if animatePages}
      {#key data.pathname}
        <div
          class="page-layer"
          in:fly={{
            x: PAGE_TRANSITION_IN_X,
            duration: PAGE_TRANSITION_DURATION_MS,
            delay: PAGE_TRANSITION_IN_DELAY_MS,
          }}
          out:fly={{
            y: PAGE_TRANSITION_OUT_Y,
            duration: PAGE_TRANSITION_DURATION_MS,
          }}
        >
          <slot />
        </div>
      {/key}
    {:else}
      <div class="page-layer">
        <slot />
      </div>
    {/if}
  </main>

  <Footer />
</div>

<style>
  /* Single-cell grid: during a route change both the outgoing and incoming
     layers occupy the same cell rather than stacking in flow. */
  .page-stack {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
  }

  .page-layer {
    grid-area: 1 / 1;
    /* Let wide children (a wide table) size their own scroll container
       instead of forcing the grid track open. */
    min-width: 0;
  }
</style>
