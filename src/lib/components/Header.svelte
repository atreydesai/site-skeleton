<script lang="ts">
  import { page } from "$app/state";
  import DarkModeToggle from "./DarkModeToggle.svelte";
  import { SITE } from "$lib/site";

  const links = [
    { name: "about", href: "/about/" },
    { name: "research", href: "/research/" },
    { name: "cv", href: "/cv/" },
  ];

  function isActive(href: string, pathname: string): boolean {
    const normalizedHref = href === "/" ? href : href.replace(/\/$/, "");
    const normalizedPath = pathname === "/" ? pathname : pathname.replace(/\/$/, "");
    return (
      normalizedPath === normalizedHref ||
      normalizedPath.startsWith(`${normalizedHref}/`)
    );
  }
</script>

<!-- Full-width so the sticky band covers wide pages too; the inner shell keeps
     the usual measure. Sticky only from md up: on phones the nav wraps under
     the wordmark and a pinned header would eat too much of the screen. -->
<header
  class="site-header layer-sticky w-full md:sticky"
  data-sveltekit-preload-code="eager"
>
  <div class="page-shell-standard pt-7 md:pb-3 md:pt-8">
    <div class="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-6">
      <!-- Just the wordmark: the page's own title and the highlighted nav item
           already say where you are. -->
      <a
        href="/"
        aria-label="{SITE.wordmark}, home"
        class="wordmark w-fit shrink-0 text-base leading-none text-ink-900 transition-colors duration-200 hover:text-accent-dark dark:text-cream-100 dark:hover:text-accent"
      >
        {SITE.wordmark}
      </a>

      <div class="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-3 md:flex md:w-auto md:items-center">
        <nav
          aria-label="Site pages"
          class="type-nav flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1"
        >
          {#each links as link (link.href)}
            {@const active = isActive(link.href, page.url.pathname)}
            <a
              href={link.href}
              aria-current={active ? "page" : undefined}
              class="whitespace-nowrap transition-colors duration-200 {active ? 'text-accent-dark dark:text-accent-light' : 'text-ink-500 hover:text-accent-dark dark:text-cream-400 dark:hover:text-accent'}"
            >
              {link.name}
            </a>
          {/each}
        </nav>
        <DarkModeToggle />
      </div>
    </div>
  </div>
</header>

<style>
  /* Pinned band in the page colour, with no rule under it, so it reads as part
     of the page. It sticks at a negative offset: the first 1.25rem of its top
     padding scrolls away before it pins, so the pinned bar is slimmer than the
     resting header without changing the page's layout. */
  @media (min-width: 768px) {
    .site-header {
      top: -1.25rem;
      background-color: var(--color-surface-page);
    }
  }

  /* The wordmark is live text in the interface face, a touch heavier than
     the nav. The style guide's one weight exception (500) is for this. */
  .wordmark {
    font-family: var(--font-ui);
    font-weight: 500;
    letter-spacing: -0.01em;
    white-space: nowrap;
  }
</style>
