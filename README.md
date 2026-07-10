# deSIGNER — Design SSOT for Das Experten

> **The single source of truth for ANY design matter in the Das Experten estate** —
> design systems, UI/UX rules, banners, product cards, characters, packaging,
> design skills, design decisions in any project.
>
> Every design task in any project **starts and ends here**: read
> `MASTER_INDEX.md` first, edit design sources here first, then propagate
> to working copies. On any conflict between this repo and a copy elsewhere,
> **deSIGNER wins**.

## Role

- **Upstream** of everything design: the skill hub (`SKILLS` repo) remains the
  *runtime* Cowork loads from; deSIGNER is where design-skill *sources* are
  edited first.
- **Working mirror relationship:** all pre-existing copies in other repos
  (das-architektura, dasexperten.com, SKILLS, …) stay untouched as working
  backups. Nothing was moved or deleted during consolidation — copy-only.
- **Not in scope here:** product formulas / clinical data (stay in `technolog`
  and `product-skill`), website build files (`site/com` stays in
  dasexperten.com), skill runtime loading.

## HARD RULES

1. **PRIVATE repo.** Character reference images are photorealistic faces;
   packaging sources are unreleased. This repo must never be flipped public.
2. **Anti-simplicity.** In all design/product copy keep dense scientific and
   technical terms and numbers verbatim — `ICAM-2`, `IL-6`, `84 kDa`, `DPP-4`,
   `RDA 79`, `4×10^10 CFU`, strain codes, INCI, tech specs. A parenthetical
   gloss may *add* to a term, never *replace* it.
3. **deSIGNER wins.** If a design file here differs from a copy in another
   repo, this repo is canonical. Caught drift → entry in
   `GOVERNANCE/corrections-log.md`.
4. **No invented brand assets.** Never invent a Das Experten tube, brush head,
   packaging, label, or logo — use `ASSETS/` references (see the asset-catalog
   gates inside the design skills).
5. **Copy-only provenance.** Files here were copied (not moved) from their
   source repos — sources are recorded per block in `MASTER_INDEX.md`.

## How to use

1. Open `MASTER_INDEX.md` — the single map of the repo.
2. For brand look & feel → `SYSTEM/` (css tokens, fonts, previews, UI kits).
3. For rules and disciplines → `FOUNDATION/`.
4. For references (logos, products, characters, packaging) → `ASSETS/`.
5. For design-skill sources → `SKILLS/` (edit here first, then sync to the
   skill hub).
6. After any corrected design mistake → log it in
   `GOVERNANCE/corrections-log.md`; monthly, repeated entries are promoted
   into `FOUNDATION/` rules and the affected skill sources.
