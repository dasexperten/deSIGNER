# MASTER_INDEX — the single map of deSIGNER

> Read this file before starting any design task. Consolidated 2026-07-10,
> copy-only (no source file was moved, deleted, or rewritten). Sources were
> verified live on 2026-07-10.

## Repo map

| Block | What lives there | Copied from (source of the copy) |
| --- | --- | --- |
| `FOUNDATION/` | Design disciplines: principles, UI/UX rules, mobile-first, partner standards | Distilled from `dasexperten.com/Design/README.md`, `dasexperten.com/BACKLOGS/2026-07-06_mobile-friendly-design-discipline.md`, ui-kit READMEs |
| `SYSTEM/` | Canonical Das Experten design system: `colors_and_type.css`, fonts, 17 preview pages, 4 UI kits, **das-dashboard + Operator mobile-ui**, app-icon masters | `dasexperten.com/Design/` + `dasoperator/Design/` (2026-07-13) |
| `ASSETS/logos/` | logo-full / logo-mark / logo-wordmark, de-logo, de-loyalty-icon, logo_dark / logo_light, **Operator app-icon set** | `dasexperten.com/Design/assets/`, `das-architektura/DESIGNS/`, `SKILLS/das-presenter/assets/`, `dasoperator/Design/assets/` |
| `ASSETS/products/` | 21 product PNGs (DE1xx / DE2xx) | `SKILLS/das-presenter/assets/products/` |
| `ASSETS/characters/` | 86 character reference models + `characters_mapping.json` | `das-architektura/CHARACTERS (reference models)/`; mapping from `dasexperten.com/SKILLS/atlascloud/references/` |
| `ASSETS/packaging/` | packaging-localizer full tree (SVG templates, detox_cdr, out/ renders, worker src), `Das Experten Design System-handoff.zip`, `Microbiome Friendly-handoff.zip`, innoweiss 70ml dieline photo | `das-architektura/DESIGNS/`, `dasexperten.com/Design/assets/` |
| `SKILLS/` | SSOT **sources** of the 13 design skills (runtime stays in the SKILLS hub) | `SKILLS` repo (dasexperten/SKILLS, mirrored from CoWork/SKILLS) |
| `GOVERNANCE/` | corrections-log.md (every caught design mistake + preventive rule), direction.md (polish & direction decisions) | New layer, created here |

## SYSTEM freshness note (P2 check, 2026-07-10)

`dasexperten.com/Design/` and `das-architektura/Design/` were **byte-identical**
at consolidation time (`diff -rq` clean). The `.com` copy carried the newer
commit (2026-07-09 13:18 +0400, `209cea3` vs 13:13, `ce7ba04`), so
`dasexperten.com/Design/` is recorded as the canonical origin. No discrepancy
to log.

## SYSTEM refresh 2026-07-13 — Das Operator mobile + app icon

Copied from live `dasoperator/Design/` (and brand runtime exports):

| Path | Content |
| --- | --- |
| `SYSTEM/das-dashboard.md` | Command-center pattern; **also ERP mobile default** |
| `SYSTEM/mobile-ui.md` | Global phone chrome for Operator (&lt;768px) |
| `SYSTEM/assets/app-icon-1024.png` | Full-square app icon master |
| `SYSTEM/assets/app-icon-squircle-1024.png` | Squircle preview |
| `ASSETS/logos/app-icon-*.png` + `favicon-32.png` | Runtime sizes |
| `FOUNDATION/das-operator-mobile.md` | Discipline rules for ERP mobile |

Live implementation remains in `dasoperator` web shell; deSIGNER is the design SSOT.

## Inventory (counts at consolidation, 2026-07-10)

- Characters: **86 images** + `characters_mapping.json`.
  The plan estimated “~95”; the live source folder
  `das-architektura/CHARACTERS (reference models)/` contained exactly 86 files
  — 86 is the true count, recorded here per the freshness/discrepancy rule.
- Products: **21 PNGs** (DE101…DE210; `desktop.ini` Windows junk in the source
  was not copied).
- Previews: **17 HTML pages** in `SYSTEM/preview/`.
- UI kits: **4** — distributor, ecommerce, marketing, packaging.
- Fonts: Eras-Bold_Regular.ttf, megafonts_inc.ttf
  (note from Design SKILL.md: the uploaded Eras TTF is corrupted; system falls
  back to Archivo Black — kept verbatim as in source).
- Design skills: **13 sources** — bannerizer, brush-zoom, cardmaker, imager,
  designer, motionizer, animator, higgsfield-generate,
  higgsfield-marketplace-cards, higgsfield-product-photoshoot, video-master,
  virality-master, frontend-design.

## The 13 design-skill sources

Each folder under `SKILLS/` is the SSOT source of the same-named skill in the
skill hub. Each copied `SKILL.md` carries a line in its body (sync-safe, not
in frontmatter):
`SOURCE OF TRUTH: deSIGNER/SKILLS/<name> — edit here first.`

Runtime loading is unchanged: Cowork keeps loading skills from the SKILLS hub.
Edit flow: change here → sync to hub → hub distributes.

## What deliberately stays elsewhere

- Product formulas / clinical data → `technolog`, `product-skill`
  (never re-key clinical numbers here; brand/product SSOT is das-architektura).
- Website build files → `dasexperten.com/site/com/`.
- **SEO / GEO / Ubersuggest / domain metrics** → `das-intelligence/references/domains/`
  (not design; numbers are not brand assets).
- Public design-methods showcase → `das-intelligence` skills (separate initiative).
- Estate secrets → `das-architektura/SECRETS/` (nothing secret lives here).

## Declaration

Every estate repo carries a `## DESIGN SSOT` block in its root README pointing
here. Design files elsewhere are working copies / backups; on any conflict,
deSIGNER wins.
