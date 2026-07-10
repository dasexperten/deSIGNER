# Partner standards — B2B / distributor-facing design

Standards for surfaces shown to distributors, wholesale buyers, and Tier A
partners. Reference implementation: `SYSTEM/ui_kits/distributor/` (portal
dashboard).

## Portal chassis

- **Dark sidebar** in brand schwarz with nav + avatar; the sidebar mirrors the
  schwarz/rot/gold hierarchy used across the brand.
- Top bar: search, language, notification.
- KPI cards ×4 — one inverted in brand-schwarz with a **gold numeral**
  (Fraunces accent).
- Recent orders table, activity feed, catalog quick-access grid.

## B2B-specific content rules

- Wholesale pricing and **MOQ** shown directly on catalog cards — partners
  need numbers, not teasers.
- Clinical/spec density stays (anti-simplicity applies to B2B *more*, not
  less): RDA values, CFU counts, strain codes, INCI on spec sheets verbatim.
- UI language is **English** for the partner portal; product marks stay in
  their German lockups (innoWeiss, Detox — never translated).
- Same token system as consumer surfaces — partners see the same brand, in a
  denser, table-first layout.

Add new partner-facing standards here as they are decided (e.g. deck
templates for distributor pitches, price-list layout rules); promote repeated
corrections from `GOVERNANCE/corrections-log.md`.
