# Corrections log

One entry per caught design mistake. Format: date — what was wrong — the rule
that prevents recurrence — where the rule now lives.

## 2026-07-11 — mobile flags wrapped / centered (now frozen)

- **Wrong:** the mobile language-flags row was first centered (blank gaps at the
  edges), then wrapped to a second row (Chinese/ZH flag dropped down). Both are
  unacceptable — the row must be one line, spread edge-to-edge.
- **Rule:** flags row = single `nowrap` row, `justify-content:space-between`,
  fluid `vw` flag size + gap so all 14 fit from ~320px up. **FROZEN by owner —
  do not change without a new owner instruction.**
- **Lives in:** `GOVERNANCE/direction.md` (🔒 FROZEN entry, 2026-07-11);
  live CSS in `dasexperten.com/site/com/styles.css`.


## 2026-07-06 — hardcoded hex instead of tokens (quiz CSS)

- **Wrong:** System Diagnostic Chamber v15 quiz CSS used ~40 hardcoded hex
  colors instead of the design-token system.
- **Rule:** tokens only — every color/font/space/radius/shadow comes from
  `SYSTEM/colors_and_type.css` variables; hardcoded hex is a defect.
- **Lives in:** `FOUNDATION/ui-ux-rules.md` (Tokens & surfaces),
  `FOUNDATION/mobile-first.md` rule 4.

## 2026-07-06 — sub-44px touch targets and tap delay

- **Wrong:** icon buttons 38×38px, burger without explicit sizing, mobile nav
  links under 44px effective tap height, no `touch-action` on tap targets.
- **Rule:** touch targets ≥ 44×44px (WCAG 2.5.5) and
  `touch-action: manipulation` on every tappable control.
- **Lives in:** `FOUNDATION/mobile-first.md` rules 1–2.

## 2026-07-10 — consolidation-time inventory discrepancy (characters count)

- **Wrong:** planning estimate said "~95" character reference models; the live
  source folder contained exactly **86** files.
- **Rule:** counts come from the source at copy time, never from estimates;
  discrepancies are recorded in `MASTER_INDEX.md` (done) and here.
- **Lives in:** `MASTER_INDEX.md` (Inventory).

## Known carried-forward defects (from mobile pass, not yet fixed)

Tracked in `FOUNDATION/mobile-first.md` (Known gaps): missing `srcset`,
`@import`-ed Google Fonts, `loyalty.html` inline token re-declaration,
`og:image` on the `.de` domain. Move each up into a dated entry when fixed.
