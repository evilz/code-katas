# Code Katas

Consolidated kata repository for `evilz`.

This repository contains:

- `katas/`: imported kata and practice repositories.
- `src/data/kata/`: Markdown files that describe each imported source and feed the site catalog.
- `src/pages/katas/`: Astro pages that render the catalog and detail pages.

The site uses AstroWind and is configured for GitHub Pages at:

<https://evilz.github.io/code-katas>

## Imported sources

| Source repository                  | Local path                         | Status   |
| ---------------------------------- | ---------------------------------- | -------- |
| `evilz/kata`                       | `katas/kata`                       | migrated |
| `evilz/KataTrainReservation`       | `katas/kata-train-reservation`     | migrated |
| `evilz/Racing-Car-Katas`           | `katas/racing-car-katas`           | migrated |
| `evilz/refactoring.guru-examples`  | `katas/refactoring-guru-examples`  | migrated |
| `evilz/millenium-falcon-challenge` | `katas/millenium-falcon-challenge` | review   |

## Development

```bash
npm ci
npm run dev
npm run build
```

## Add a kata

1. Copy the repository content under `katas/<slug>`.
2. Add `src/data/kata/<slug>.md` with source metadata and maintenance notes.
3. Run `npm run build` before pushing.
