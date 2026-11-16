# Repository instructions

## Design system

The visual language is documented in `docs/style-guide.md`. Read it before
changing any UI. In short:

- Use the documented semantic tokens and component recipes (`type-*`,
  `control-*`, `section-heading`, `page-shell-*`, and so on), not raw hex
  values or one-off spacing.
- Serif (Optima) for what you read, sans (Neue Haas Grotesk) for what you scan
  or click. No monospace. The site is unbolded: only display titles carry
  weight.
- Every animation respects `prefers-reduced-motion`; every control has the
  shared focus ring.

## Content

Site identity lives in `src/lib/site.js`. Page copy lives in `src/content/`
(YAML for the homepage, about page, CV, and talks; one Markdown file per
paper). Prefer editing content files over hard-coding text in routes.

Animated paper figures live in `src/lib/explainers/`, keyed by paper `id` in
`src/lib/explainers/index.ts`, and build on `ExplainerFrame.svelte` and
`motion.ts`. Preview them at `/dev/explainers/`.

## Checks

Run `npm run check`, `npm test`, and `npm run build` before considering a
change done.
