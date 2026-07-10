# Principles — overall design direction

Distilled from the canonical design system (`SYSTEM/README.md`, source:
`dasexperten.com/Design/README.md`) and the estate-wide hard rules. When in
doubt, these principles decide.

## 1. Challenger voice, apothecary body

- Copy runs the three-beat challenger cadence: **provocation → evidence →
  resolution**. "Your toothpaste is failing you. Enzymes dissolve stains — no
  grinding, no damage. We fixed it."
- Visuals run the other way: calm, warm, dense, precise — *pharmacy ledger,
  not tech SaaS*. Warm paper (`#FBFAF6`), hairline rules, restrained radii,
  low printed shadows.
- The tension between loud copy and quiet surfaces IS the brand. Don't resolve
  it in either direction.

## 2. Anti-simplicity (HARD RULE)

Dense scientific and technical terminology **converts** — it impresses and
builds authority even for readers who don't parse it. Keep terms and numbers
verbatim: `ICAM-2`, `IL-6`, `84 kDa`, `DPP-4`, `RDA 79`, `4×10^10 CFU`,
strain codes (`CCFM1143`), INCI names, tech specs. A parenthetical gloss may
*add* ("GLP-1 (a 'fullness' hormone)"), never *replace* (`P9 (84 kDa)` ≠
"component"). Segment-checks pull toward simplification — authority outranks
lowest-common-denominator readability.

## 3. Asset truth (HARD RULE)

Never invent a Das Experten tube, brush head, packaging, label, or logo. No
generic black tubes, no imagined geometry, no placeholder products. Every
render starts from `ASSETS/` references (products, characters, logos,
packaging) and the asset-catalog gates inside the design skills. If a
reference is missing — stop and ask, don't improvise.

## 4. German heritage as accent, not costume

- The three ribbons (Schwarz–Rot–Gold) are the single repeating graphic
  motif — separators, underline accents, end-marks. Never stretched, never
  recolored, never redrawn as a stroked icon.
- Heritage colors are **accents**, never large fills.
- Keep some German untranslated (*"innovativ und praktisch"*, product marks,
  seals). Over-translating removes the point.

## 5. One system, one source

All colors, type, spacing, shadows, radii come from
`SYSTEM/colors_and_type.css` tokens. Hardcoded hex values in any surface are
a defect (see corrections log — the v15 quiz CSS carried ~40 of them and was
re-tokenized). New surfaces start from the UI kits, not from scratch.

## 6. deSIGNER wins

Design files in other repos are working copies / backups. Any conflict
resolves in favor of this repo; any caught drift becomes a
`GOVERNANCE/corrections-log.md` entry.
