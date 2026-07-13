# Mobile-first discipline

Source: `dasexperten.com/BACKLOGS/2026-07-06_mobile-friendly-design-discipline.md`
(the mobile-friendly pass shipped as dasexperten.com PR #25). These are now
standing rules for every Das Experten web surface, not a one-off fix.

## Standing rules

1. **Touch targets ≥ 44×44px** (WCAG 2.5.5). Icon buttons, burger menus, nav
   links, flag/locale links — pad until the effective tap area reaches 44px
   (e.g. mobile nav links at 13px vertical padding ≈ 44px tap height).
2. **`touch-action: manipulation`** on every tappable control (CTAs, icon
   buttons, burger, quiz options/back) — removes the 300ms tap delay.
3. **Breakpoints:** ≤720px is the primary mobile switch; add a **≤480px**
   tier where layouts must collapse further (footer to 1 column, grids stack,
   trust items tighten).
4. **Design tokens, not hex,** in every component — the v15 quiz CSS carried
   ~40 hardcoded hex values and was re-tokenized to `--brand-rot`,
   `--brand-schwarz`, `--brand-gold`, `--paper-raised`, `--paper-sunk`,
   `--bone`, `--fg-2`, `--fg-3`, `--status-success`.
5. **Font-loading chain:** `<link rel="preconnect">` to
   `https://fonts.googleapis.com` and `https://fonts.gstatic.com` (crossorigin)
   before the CSS links on every page — one TCP/TLS round-trip saved per page.
   (Applied to all 250 HTML files, root + 14 locales.)

## Known gaps carried forward (from the same pass)

- No `srcset`/`<picture>` — hero/product images serve full-res to all
  viewports (needs generated 2× sizes).
- Google Fonts still `@import`-ed inside `colors_and_type.css` — should move
  to `<link rel="stylesheet">` in HTML (requires `?v=N` cache bump + locale
  re-test).
- `loyalty.html` carries a ~200-line inline `<style>` re-declaring tokens —
  refactor pending.
- `og:image` points at the `dasexperten.de` domain — move to `.com`.

When any of these gaps is closed, update this file and log the correction in
`GOVERNANCE/corrections-log.md`.

---

## Das Operator ERP mobile (2026-07-13)

Storefront rules above (≤720 / ≤480) apply to **dasexperten.com**.

The **ERP** (`erp.dasexperten.com`) has its own phone chrome, approved as the
global default for all Operator pages &lt;768px:

→ full rules: [`FOUNDATION/das-operator-mobile.md`](./das-operator-mobile.md)  
→ pattern: [`SYSTEM/das-dashboard.md`](../SYSTEM/das-dashboard.md)  
→ implementation map: [`SYSTEM/mobile-ui.md`](../SYSTEM/mobile-ui.md)

ERP breakpoint is **767px** (Tailwind `md`), tricolor ribbon + paper-sunk tray.
Do not mix storefront and ERP chrome casually.
