# ASSETS — canonical brand asset library

Reference files every design task draws from. **Never invent what exists
here** — renders start from these references (see `FOUNDATION/principles.md`
rule 3 and the asset-catalog gates inside the design skills).

| Folder | Contents | Copied from |
| --- | --- | --- |
| `logos/` | logo-full / logo-mark / logo-wordmark (design-system set), de-logo, de-loyalty-icon, logo_dark / logo_light (presenter set) | `dasexperten.com/Design/assets/`, `das-architektura/DESIGNS/`, `SKILLS/das-presenter/assets/` |
| `products/` | 21 product PNGs, SKU-coded `DE1xx` (brushes/floss) and `DE2xx` (toothpastes) | `SKILLS/das-presenter/assets/products/` |
| `characters/` | 86 photorealistic character reference models + `characters_mapping.json` (model ↔ element_id mapping) | `das-architektura/CHARACTERS (reference models)/`; mapping from `dasexperten.com/SKILLS/atlascloud/references/` |
| `packaging/` | `packaging-localizer/` (SVG templates, detox_cdr sources, out/ multilingual renders, worker src), `Das Experten Design System-handoff.zip`, `Microbiome Friendly-handoff.zip`, innoWeiss 70ml carton dieline photo | `das-architektura/DESIGNS/`, `dasexperten.com/Design/assets/` |

## Rules

- **PRIVACY:** `characters/` contains photorealistic faces — one of the
  reasons this repo is private. Never copy characters into a public repo.
- Product/lifestyle generation: match the SKU to its reference PNG here and
  its `element_id` (characters via `characters_mapping.json`); pass as
  reference elements — no generic tubes, no imagined packaging.
- Sources remain in place as working backups; this folder is canonical.
  On conflict, deSIGNER wins.
