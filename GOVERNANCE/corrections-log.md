# Corrections log

One entry per caught design mistake. Format: date — what was wrong — the rule
that prevents recurrence — where the rule now lives.

## 2026-07-13 — ERP mobile chrome + app icon locked in deSIGNER

- **What shipped:** Das Operator phone UI defaulted to das-dashboard pattern
  (tricolor ribbon, paper-sunk canvas, raised cards); new PWA app icon
  (heritage waves on schwarz).
- **Rule:** ERP mobile language is canonical in deSIGNER
  (`SYSTEM/mobile-ui.md`, `SYSTEM/das-dashboard.md`,
  `FOUNDATION/das-operator-mobile.md`). Working copies in dasoperator Design/
  and das-architektura Design/ must stay mirrors; deSIGNER wins on conflict.
- **Lives in:** `FOUNDATION/das-operator-mobile.md`, `SYSTEM/mobile-ui.md`,
  `ASSETS/logos/app-icon-*.png`.

## 2026-07-13 — fake SEO metrics on ERP home (design-adjacent honesty)

- **Wrong:** AI Visibility demo showed invented DA 26 / linking 164 /
  backlinks 412 on the home dashboard.
- **Rule:** dashboard numbers must be real source or marked `· demo data`
  (das-dashboard rule). Authority KPIs come from Ubersuggest → ERP KV only.
- **Lives in:** `SYSTEM/das-dashboard.md` (demo marker rule); metrics dossier
  lives in `das-intelligence/references/domains/dasexperten.com/` (not design).

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

## 2026-07-11 — header nav wider than the ribbon (overflow) + dead icon buttons

- **Wrong:** the header nav row (logo · 12 menu links · 2 icon buttons · Cart)
  needed ~1479px and overflowed the 1280px layout by ~200px, so the icons and
  Cart poked out **past the black language ribbon's right edge**; long-label
  languages (RU/DE/FR/PL) overflowed worst. The two header icon buttons
  (search ⌕, account ◎) were also dead UI with no behavior.
- **Rule:** the nav row must **always be exactly as wide as the ribbon above it —
  no wider, no narrower — in every language and at every viewport.** The menu item
  set and their order are fixed; no ⌕/◎ icons in the header. The **only** two
  levers allowed to make it fit are the menu **font-size** and the **Shop/Cart
  button width** — never resize the logo, drop/reorder items, or let it overflow.
- **Lives in:** `FOUNDATION/ui-ux-rules.md` (Header menu — nav ↔ ribbon parity);
  and in the site repo `dasexperten.com/CLAUDE.md` (HARD RULES).

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
