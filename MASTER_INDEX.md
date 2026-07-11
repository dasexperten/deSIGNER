# MASTER_INDEX — the single map of deSIGNER

> Read this file before starting any design task. Consolidated 2026-07-10,
> copy-only (no source file was moved, deleted, or rewritten). Sources were
> verified live on 2026-07-10.

## Repo map

| Block | What lives there | Copied from (source of the copy) |
| --- | --- | --- |
| `FOUNDATION/` | Design disciplines: principles, UI/UX rules, mobile-first, partner standards | Distilled from `dasexperten.com/Design/README.md`, `dasexperten.com/BACKLOGS/2026-07-06_mobile-friendly-design-discipline.md`, ui-kit READMEs |
| `SYSTEM/` | Canonical Das Experten design system: `colors_and_type.css`, fonts, 17 preview pages, 5 UI kits (incl. `dashboard/` — reference build for the dashboard rule) | `dasexperten.com/Design/` (see freshness note below) |
| `ASSETS/logos/` | logo-full / logo-mark / logo-wordmark, de-logo, de-loyalty-icon, logo_dark / logo_light | `dasexperten.com/Design/assets/`, `das-architektura/DESIGNS/`, `SKILLS/das-presenter/assets/` |
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

## Inventory (counts at consolidation, 2026-07-10)

- Characters: **86 images** + `characters_mapping.json`.
  The plan estimated “~95”; the live source folder
  `das-architektura/CHARACTERS (reference models)/` contained exactly 86 files
  — 86 is the true count, recorded here per the freshness/discrepancy rule.
- Products: **21 PNGs** (DE101…DE210; `desktop.ini` Windows junk in the source
  was not copied).
- Previews: **17 HTML pages** in `SYSTEM/preview/`.
- UI kits: **5** — distributor, ecommerce, marketing, packaging, dashboard
  (dashboard added 2026-07-10 as the reference build for
  `FOUNDATION/dashboard-rules.md`).
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
- Public design-methods showcase → `das-intelligence` (separate initiative).
- Estate secrets → `das-architektura/SECRETS/` (nothing secret lives here).

## Declaration

Every estate repo carries a `## DESIGN SSOT` block in its root README pointing
here. Design files elsewhere are working copies / backups; on any conflict,
deSIGNER wins.
