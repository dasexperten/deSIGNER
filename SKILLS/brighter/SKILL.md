---
name: brighter
description: "Punch up an existing UI that reads flat/generic-gray into the actual Das Experten brand identity — no new colors or fonts invented, only existing tokens from the design system applied harder. Trigger on: make it brighter, make it bolder, make it pop, highlight this, make it stand out, make it eye-catching, punch it up, brighter, bolder, spice it up, make it less boring. Fires immediately on trigger, no confirmation needed for a same-scope visual pass."
---

SOURCE OF TRUTH: deSIGNER/SKILLS/brighter — edit here first.

# Brighter

Takes a UI that already works functionally but looks like default Tailwind/shadcn gray, and reapplies the actual Das Experten brand identity from `SYSTEM/colors_and_type.css` (mirrored as `styles/das-design-tokens.css` in each site/app repo). Distilled from the `dasoperator` `/emailer` redesign (2026-07-11) — that pass is the reference case: same layout, same scope, just swapped generic styling for house tokens.

**Scope discipline:** this is a styling pass, not a redesign. Don't add features, don't restructure layout, don't change copy. If the request also implies new functionality, that's a separate task — do the brightening on top of it, not instead of scoping it down.

## The recipe (in priority order)

1. **Headings, labels, key numbers → `var(--font-display)`, weight 800–900.** Never leave a heading on the generic body font at `font-bold` (browser bold ≈ 700 on a thin sans reads weak). Archivo Black / Eras Bold ITC stack is the brand's actual bold, not CSS `font-weight` on a generic face.
2. **Primary actions → solid fill, not outline.** Buttons/CTAs get `background: var(--brand-rot)` (or `var(--brand-schwarz)` for a secondary action) with white text — never a bordered/ghost button for the primary action on a page. Add `box-shadow: var(--shadow-raised)` so it reads as pressable, not flat.
3. **Active/selected state → fill, not underline.** Tabs, selected rows, toggled filters: an active state drawn as a thin colored underline or border reads timid. Fill the active element with `--brand-rot` (or `--paper-sunk` for a lighter selected-but-not-primary state) instead.
4. **Card elevation → `shadow-raised` / `shadow-md`, not `shadow-sm`.** Flat 1px-hairline cards disappear into the page. Bump to the raised shadow token so content containers have real depth.
5. **Never invent a color or font.** Pull only from `SYSTEM/colors_and_type.css` tokens: `--brand-rot` (crimson), `--brand-schwarz` (warm black), `--brand-gold` (sodium yellow, sparingly — accent only, never a large fill), `--font-display` (Archivo Black stack), `--shadow-raised` / `--shadow-float`. If a page has its own local token file (e.g. `dasoperator/web/styles/das-design-tokens.css`), use that copy — same values, don't reference a different repo's file path from app code.
6. **Never use thin weights.** `100`–`300` / `font-weight: 100-300` / "light" anything is off-limits — Aram has flagged this repeatedly (see `frontend-design/SKILL.md` — same rule, don't relitigate it, just apply it).
7. **Restrained radii, printed elevation — not glassy/soft.** The brand leans clinical/apothecary: small radii (`--radius-sm`/`--radius-md`, pills only on tags/chips), hard-edged shadows over blurred glow. Don't reach for big border-radius or soft neumorphic shadows to "make it pop" — that's a different brand's bold, not this one's.

## Concrete before/after (from the emailer pass)

- Tab bar: text buttons with a 2px colored underline on the active tab → filled pill/chip, `--brand-rot` background + white text on active, `--paper-sunk` background on inactive, `font-display` weight 800.
- Section heading (`<h2>Mailboxes</h2>`, plain `text-lg font-bold`) → `font-display`, weight 900, `--fs-h3` size.
- Refresh button (bordered ghost button) → solid `--brand-schwarz` fill, white text, `shadow-raised`.
- Reply/Send buttons (already brand-rot filled) → kept the fill, added `shadow-raised` for tactile depth — proof this recipe is additive polish, not a rebuild.
- Mailbox address / message subject (`font-bold` on body font) → `font-display`, weight 800.
- Card containers (`shadow-sm`) → `shadow-md`.

## When NOT to reach for this skill

- The user is asking for a new feature or layout change — that's `frontend-design` (or the app's own patterns), not this.
- The surface isn't Das Experten brand at all (e.g. Microbiome Friendly, a client's independent brand) — use that brand's own tokens; don't leak `--brand-rot` into a non-Das project.
- The UI is already using the design-system tokens correctly and just needs a genuinely new visual direction — that's a design decision for Aram (A/B/C), not an automatic brighten pass.
