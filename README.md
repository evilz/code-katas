# Code Katas

Consolidated kata repository for `evilz`.

This repository contains:

- `katas/`: one top-level folder per kata or kata collection.
- `katas/<slug>/README.md`: the source of truth for each catalog entry and detail page.
- `src/pages/katas/`: Astro pages that render the catalog and detail pages.

The site uses AstroWind and is configured for GitHub Pages at:

<http://www.evilznet.com/code-katas/>

## Catalog model

The site discovers katas from `katas/*/README.md`.

The README title and first paragraph are used as the default catalog title and summary. Languages are detected from the
files inside the kata folder.

## Development

```bash
npm ci
npm run dev
npm run build
```

## Add a kata

1. Copy the repository content under `katas/<slug>`.
2. Add `katas/<slug>/README.md` with the kata title and a short first paragraph.
3. Run `npm run build` before pushing.
