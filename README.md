# Academic site skeleton

A minimal academic homepage: **home**, **research**, **cv**, and **about**.
It is cut down from [atreydesai.com](https://atreydesai.com/) and keeps that
site's design system, animated paper figures, and agent-friendly plumbing, with
the personal extras removed.

Built with SvelteKit, Tailwind CSS, and GSAP; deploys to Vercel.

## Running it

Use Node.js 26.12.1 (recorded in `.node-version`) and npm.

```sh
npm ci          # install the committed dependency lock
npm run dev     # local dev server
npm run build   # production build
npm test        # node tests for the agent endpoints and metadata
npm run check   # svelte-check
```

## Make it yours

Every piece of content is a placeholder ("Your Name", example.com, example
papers), so the site runs out of the box and shows each feature with dummy
data. Replace these before deploying:

1. **`src/lib/site.js`**: name, URL, email, Twitter handle, default
   description, footer time zone and location, and the schema.org details.
   Most of the site reads from here. Your name in a paper's author list is
   highlighted when it contains `SITE.name`.
2. **`src/content/homepage.yaml`**: intro paragraphs, the news banner and its
   updates log, research interests, and social links.
3. **`src/content/about.yaml`**: bio, footnotes (shown as margin sidenotes on
   wide screens), interests, credits, and so on.
4. **`src/content/cv.yaml`** and **`static/cv.pdf`**: the CV page and the PDF
   it embeds and offers for download.
5. **`src/content/papers/*.md`** and **`src/content/talks.yaml`**: one Markdown
   file per paper; the comment at the top of each example explains the
   fields. `featured: true` with a `priority` puts a paper on the homepage.
   PDFs and figures go in `static/papers/`.
6. **Animated figures**: `src/lib/explainers/` holds GSAP-driven SVG figures,
   registered by paper `id` in `src/lib/explainers/index.ts`. They were drawn
   for the original site's papers, so treat them as templates: the three
   example papers each borrow one, and the rest sit under `template-*` keys.
   Run `npm run dev` and open `/dev/explainers/` to see them all. Copy one,
   redraw it for your paper, register it under your paper's `id`, and delete
   the ones you don't use. A paper with no figure falls back to its `image`,
   or no media.
7. **Images**: `static/images/profile.webp` (homepage portrait, shown at
   250 × 250), `static/og-image.jpg` (square portrait for structured data),
   `static/og-image-wide.jpg` (1200 × 630 link-preview card), and the favicons
   (`favicon*.png`, `favicon.ico`, `apple-touch-icon.png`). The current ones
   are generated placeholders.
8. **Fonts**: `src/app.html` loads Adobe Typekit kit `nsg3mxc`, which belongs
   to the original site and only serves its domain. Make your own kit with
   Neue Haas Grotesk Display (500, 600, 700) and Text (400, 500, 700) and swap
   the ID in both links, or delete those links and the site falls back to
   metric-matched Helvetica Neue. Optima, the prose face, comes from the
   system.
9. **Static agent files**: `static/llms.txt`, `static/robots.txt` (the
   `Sitemap:` line), and `static/site.webmanifest` hard-code the name and URL.
10. **`vercel.json`**: optional `/resume` → `/cv/` redirects.

Search for leftover placeholders before you ship:

```sh
grep -rniE "your name|example\.(com|edu)|your-username|YOUR_ID|nsg3mxc" src static docs vercel.json
```

## What's kept and what's gone

Kept, because it is part of the design system or the academic content:

- The style guide (`docs/style-guide.md`) and its tokens in `src/app.css` and
  `tailwind.config.js`.
- Animated paper figures (explainers), research cards with hover previews,
  the year/topic filters on the research page.
- The riso news banner with its dated updates log, the expandable research
  interests, copy-to-clipboard email.
- Margin sidenotes on the about page.
- Knuth–Plass justification of running prose, dark mode, page transitions,
  scroll reveals, reduced-motion handling.
- Markdown content negotiation (`Accept: text/markdown`), `llms.txt`, the
  sitemap, and schema.org JSON-LD.
- Vercel Analytics and Speed Insights, which do nothing until you enable them
  on your Vercel project.

Removed: the blog, bookshelf, photography, the boba arcade and its easter eggs,
the music player, the custom cursor, falling leaves, the pixelated portrait,
the scrambling name, the morphing wordmark, live Manifold/Goodreads data on
the about page, Google Analytics, and the RSS feed.

## Working with an AI agent

`AGENTS.md` points coding agents at the style guide. Keep new UI inside the
documented tokens and recipes rather than adding raw values.
