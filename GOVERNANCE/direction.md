# Direction — standing polish & direction decisions

Owner-level design direction. Additions go at the top, dated. These decisions
outrank taste debates; changing one requires the owner.

## 2026-07-11 — 🔒 FROZEN: mobile language-flags row (gold standard)

**Owner decision (verbatim intent):** *"это золотой стандарт. больше его не
трогаешь и ни в коем случае не меняешь."* The mobile language-flags row is
**locked**. Do NOT change it — not the wrapping, not the alignment, not the
sizing — in any future session, without an explicit new owner instruction.

Frozen behaviour: **one single row, never wrapping**, all 14 flags, distributed
**edge-to-edge across the full width** (no centered blank gaps), sizes fluid so
they fit from ~320px up. RTL (Arabic) inherits the same, symmetric.

Canonical CSS (live `dasexperten.com/site/com/styles.css`, in `@media (max-width:720px)`):

```css
.ribbon .lang{width:100%;flex-wrap:nowrap;justify-content:space-between;gap:clamp(2px,1.1vw,8px);overflow:visible}
.ribbon .lang a{gap:0;flex:0 0 auto;padding:2px 0}
.ribbon .lang .code{display:none}
.ribbon .lang .flag{width:clamp(11px,4.2vw,18px);height:clamp(11px,4.2vw,18px)}
```

History that led here (do not repeat the wrong turns): centered-with-side-gaps ❌,
wrapped-to-2-rows (ZH dropped down) ❌ → **nowrap + space-between + vw sizing ✅**.

## 2026-07-10 — deSIGNER is the design SSOT

Every design task in any project starts and ends in this repo. All existing
design copies in other repos remain untouched as working backups; on any
conflict, deSIGNER wins. Consolidation was copy-only — nothing was moved,
deleted, or rewritten in any source repository.

## Standing direction (carried from the design system, 2026-07)

- **Elevated challenger-apothecary.** The UI kits are a deliberately
  *elevated reinterpretation* of the brand DNA (logo + packaging + public
  copy) pushed toward a premium / clinical / modern direction — not
  pixel-faithful recreations of the live Wix site. When the live site and the
  system disagree, the system is the direction, the site is legacy.
- **Anti-simplicity is direction, not preference.** Dense scientific terms and
  numbers stay verbatim on every surface (see `FOUNDATION/principles.md` §2).
- **Pharmacy, not playful DTC.** No bounces, no glow, no glassy shadows, no
  pure white. Warm paper, hairlines, printed shadows, restrained radii.
- **German stays German.** Product marks, seals, tagline *"innovativ und
  praktisch"* — over-translation is off-brand.
- **Asset truth.** No invented tubes, brush heads, labels, logos — references
  from `ASSETS/` only.
