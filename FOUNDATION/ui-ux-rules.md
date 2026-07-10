# UI/UX rules

Binding interface rules, condensed from the canonical system
(`SYSTEM/README.md` — read it for full context and rationale). These are the
checks a reviewer applies to any Das Experten interface.

## Tokens & surfaces

- **Tokens only.** Every color, font, space, radius, shadow comes from
  `SYSTEM/colors_and_type.css` variables (`--brand-rot`, `--brand-schwarz`,
  `--brand-gold`, `--paper`, `--paper-sunk`, `--paper-raised`, `--bone`,
  `--fg-2`, `--fg-3`, `--status-success`, …). Hardcoded hex = defect.
- Primary surface is warm paper `--paper #FBFAF6`, never pure white.
- Hairlines everywhere: 1px `rgba(26,21,25,.08)` on buttons, cards, inputs,
  dividers.
- Shadows are low and printed (schwarz at low alpha) — no blue tints, no
  colored "brand glow", no glassy elevation.
- Blur exactly once: sticky nav, 12px backdrop-filter over 92% paper tint.

## Type

- Display/headlines: **Eras Bold ITC** (`.dx-product-name` for product names —
  sentence-case, no tracking, no uppercase). Body/UI: **Archivo** 400–700.
  Eyebrows/meta: **Archivo Narrow**, ALL CAPS 11px, `letter-spacing: 0.18em`.
  Accent numerals: **Fraunces** italic. Clinical data / ingredients / lot
  numbers: **Manrope** 500.
- Headlines sentence- or title-case, never all-caps (ALL CAPS is reserved for
  micro labels).

## Layout

- 8pt grid (`--space-1`…`--space-10`); 12-col web grid, 1200px max, 72px
  desktop gutters.
- Fixed chrome: top ribbon 44px (schwarz, tagline + language + store locator),
  primary nav 72px sticky with hairline bottom border, footer on
  `--paper-sunk` with the three-ribbon rule as top divider.
- Product grid: 4-up desktop / 2-up tablet / 1-up mobile, 24px gutter.
- Cards: apothecary card (paper fill, hairline, 6px radius) or product card
  (white fill, hairline, 10px radius, 4px product-line accent strip on top,
  shot on `--paper-sunk` ground).

## Motion

- Durations 120/200/360ms; `--ease-standard` `cubic-bezier(.2,.7,.2,1)`;
  `--ease-emphasis` (small overshoot) only for primary CTA hover.
- Hovers **darken** (rot → deeper rot), never lighten; links gain a 2px red
  underline from below rather than changing color.
- Press: `scale(.98)` + shadow drop, 80ms.
- No bounces, no springy modals, no slide-ins for UI (carousels excepted);
  content reveals by 200ms fade.

## Iconography

- **Lucide** is the committed icon set (1.5px stroke). Emoji allowed only on
  social and raw store listings — never in product UI, packaging, decks,
  email templates. Ship `check-cross` glyphs instead of ✅/❌ on premium
  surfaces.
- The ribbons are a brand asset, not an icon — use `logo-mark` verbatim.

## Accessibility & touch

- Touch targets ≥ 44×44px (WCAG 2.5.5) — see `mobile-first.md`.
- `touch-action: manipulation` on all tap targets to kill the 300ms delay.
