# Dashboard rules

Binding rules for any Das Experten **dashboard** — analytics, monitoring, ops
consoles, distributor portals, any read-and-operate surface. A dashboard is
*scanned and operated*, not read top-to-bottom, so information design leads and
typography serves it. These rules sit on top of `ui-ux-rules.md` (tokens,
motion, hairlines) — they do not replace it.

**Reference build:** `SYSTEM/ui_kits/dashboard/` (the AI Visibility Overview).
When in doubt, match the kit. Sub-rule below → the check a reviewer applies.

## The bar (what every dashboard must clear)

A Das Experten dashboard reads as **one apothecary instrument**: warm paper
board, printed hairlines, decisive Fraunces numerals, German-heritage accent
used with restraint. It is not a generic SaaS grid of identical grey tiles.
If a screen could belong to any analytics SaaS, it fails.

## Layout & hierarchy

- **Summary before detail.** Top of the board carries the headline KPIs (share,
  totals, status); charts and breakdowns sit below. Never open with a detail
  chart the reader has to decode before the takeaway.
- **Board shell.** Content lives on a `--paper` board with `--radius-lg` and
  `--shadow-raised`, sitting on a `--paper-sunk` ground. The three-ribbon rule
  (`.dx-ribbon-rule`) runs along the top edge — brand signature, not decoration.
- **Card grid** on the 8pt scale (`--space-3` gutters). Cards are
  `--paper-raised`, `--radius-md`, `--shadow-hairline`. One dark **hero KPI**
  card (`--brand-schwarz`) is allowed per board to anchor the single most
  important number — echoing the villain-section inversion, not a second accent.
- **Responsive:** multi-column summary row collapses to 2-up then 1-up; detail
  panels stack. The board body never scrolls sideways — wide tables/charts get
  their own `overflow-x:auto` container.

## Numbers, labels & type

- **Big numbers are Fraunces** (`--font-accent`, weight 700) with
  `font-variant-numeric: tabular-nums` so digits align in columns. This is the
  brand's claim-numeral treatment — never set KPIs in the body sans.
- **Labels & panel titles** are Archivo Narrow, uppercase, `--tr-wider` /
  `--tr-widest`. **Meta stamps** (crawl date, data source, "updated 07:00") are
  Narrow in `--fg-3`.
- **Text wears text tokens, never a series color.** Values, axis labels, and
  legends stay in `--fg-1/2/3`; the colored mark beside them carries identity.

## State & semantic color (the part that must read at a glance)

- **Encode state in form as well as number.** A status dot, a pill, a colored
  delta — what needs attention must be visible without reading the digits.
- **Semantic color is reserved and separate from the brand accent:**
  `--status-success` (good / growth), `--status-warning` (watch), `--brand-rot`
  (decline / missing / critical). `--status-info` (`--line-innoweiss`) for
  neutral callouts. Never reuse a status hue as "series 4," and never let
  semantic red double as a decorative accent in the same view.
- **Deltas** pair an arrow glyph with the number and take the semantic hue
  (up = success green, down = rot). Direction is never color-alone.
- **Ship check-cross glyphs, never emoji** (`ui-ux-rules.md`): cited/passing =
  Lucide `check` in success green; missing/failing = Lucide `x` in rot.

## Charts & data marks (defer to the `dataviz` skill)

- **One y-axis. Never a dual-axis chart.** Two measures of different scale →
  two panels or index to a common base.
- **Series color follows the entity, in fixed order, never cycled.** House
  categorical order is schwarz → rot → gold, then product-line accents
  (`--line-*`) for a 4th+ series; a filter that drops a series must not repaint
  the survivors. Beyond ~5 series, fold the tail into "Other."
- **Sequential = one hue light→dark. Diverging = two hues + neutral-grey
  midpoint.** No rainbow ramps.
- **Marks:** thin lines (2px), area fills at low alpha over a recessive grid,
  an emphasized endpoint dot on sparklines. Bar tracks are `--bone`; fills use
  the entity color with a `--radius-pill` cap. Grid/axes stay recessive
  (hairline tokens), never competing with the data.
- **A legend is present for ≥2 series** (none for one — the title names it);
  ≤4 series are also direct-labeled so identity is never color-alone.
- Run `SKILLS/frontend-design`? No — for chart color run the estate `dataviz`
  skill's validator before shipping a categorical palette (CVD ≥ 12).

## Interaction

- What's interactive looks interactive: link-outs (`Full report ↗`, `all 21 →`)
  gain the 2px rot underline on hover; cards that drill in get the
  `--dx-hover-lift` fill. Refresh/updated stamp carries the `refresh-cw` glyph.
- Filters and time-range controls live in **one row above** the board, never
  scattered between panels.
- Hover tooltips on live charts (crosshair on line/area, per-mark on bars) are
  the default for any interactive build; a static KPI tile needs none.
- Touch targets ≥ 44px; honor `prefers-reduced-motion`.

## Anti-simplicity (dashboards are copy too)

Metric names and query labels keep the real terms — `ICAM-2`, `IL-6`,
`4×10^10 CFU`, `RDA 79`, engine names, exact percentages and strain codes —
verbatim. A gloss in parentheses may *add*; it never *replaces* the term. Do
not round a `225%` to "big jump" or relabel "grounding queries" as "searches."

## Reviewer checklist

1. Summary KPIs above detail; one dark hero card at most.
2. Board on paper-sunk ground, ribbon rule at the top edge.
3. Every color/space/radius/shadow from a token — zero hardcoded hex.
4. Big numbers in Fraunces + tabular-nums; labels in Archivo Narrow caps.
5. Status in reserved semantic hues, encoded in form (dot/pill/arrow) too.
6. One axis; series color per-entity in fixed order; recessive grid.
7. Check-cross glyphs, not emoji; Lucide icons at 1.5px stroke.
8. Terms and numbers kept verbatim (anti-simplicity).
