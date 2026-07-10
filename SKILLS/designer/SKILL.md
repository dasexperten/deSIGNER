---
name: designer
description: >
  Das Experten packaging skill, 3 modes. MODE A — AI image prompts for toothpaste dielines. MODE B — surgical text edits in user-supplied SVG from CorelDRAW, with legalizer/marketolog/benefit-gate chain. MODE C — textless background image prompts matching SVG geometry for Corel overlay, with product-skill/marketolog/benefit-gate chain. ALWAYS trigger on: "designer", "коробка", "упаковка", "box", "packaging", "dieline", "развёртка", "сделай упаковку", "дизайн коробки", "CorelDRAW", "Corel file", "SVG", "дизайнерский файл", "edit SVG", "правка SVG", "обнови дилайн", "проверь мой SVG", "only design", "just design", "только дизайн", "без текста", "фоновый дизайн", "background design", "generate background", or SKU name (SYMBIOS, INNOWEISS, DETOX, SCHWARZ, GINGER FORCE, THERMO 39°) with design context, or .svg/.cdr file upload. Router at top of SKILL.md picks the correct mode. Fire immediately.
---

SOURCE OF TRUTH: deSIGNER/SKILLS/designer — edit here first.

## [[GATE — Das Experten Asset Catalog]] (HARD STOP before any image / video generation)

If the user request, parent-task body, or any input mentions a Das Experten SKU code (DExxx — DE101, DE201, DE206, DE209, etc.) or a product name (SCHWARZ, SYMBIOS, ETALON, GROSSE, ZERO, INNOWEISS, DETOX, THERMO 39, GINGER FORCE, NANO MASSAGE, KRAFT, AKTIV, BIO, COCOCANNABIS, MITTEL, SENSITIV, EVOLUTION, BUDDY, INTENSIV, INTERDENTAL, etc.):

1. Read `/root/das-experten-context/assets/product-references.md` **first**, before composing any prompt
2. Find the SKU's `element_id` in the Product Elements table
3. Pass `element_id` as **Higgsfield Reference Element** (Nano Banana 2/Pro, GPT Image 2, Seedream, Cinema Studio all support this — see CLI examples at the bottom of the catalog file)
4. For lifestyle / talent / model shots — also pick a Soul Character from the same file's Character Elements table and pass its `element_id` as a second reference

**NEVER invent a Das Experten tube, brush head, packaging, label, or logo.** No generic black tubes. No imagined geometry. No placeholder products.

If the SKU isn't in the catalog — STOP, post a `kanban_comment` on the current task explaining what's missing, and ask Aram. Do not generate a placeholder.

## Optional: Imager skill enhancement (Mode A and Mode C only)

If `imager` skill is loaded, Mode A (dieline prompts) and Mode C (textless backgrounds) MAY hand off to imager for finished images instead of text-prompts. Without imager, original text-prompt deliverables apply. Mode B (SVG editor) is unaffected.
---

## OPTIONAL: IMAGER SKILL HAND-OFF (when available)

If the `imager` skill is loaded in the current Project (check by trying `view /mnt/skills/user/imager/SKILL.md` — if file exists, imager is available), this skill MAY hand off the final image rendering step to imager via `[[GATE: imager?...]]` for a finished image URL instead of a text-prompt deliverable.

**This is opt-in, not mandatory.** If imager is NOT available, this skill continues its original behavior — produces an agency-grade text-prompt that the user can paste into Midjourney, Imagen, Gemini, or any external tool.

### When to invoke (only if imager skill is loaded)

Trigger `[[GATE: imager]]` ONLY when ALL of these are true:
- The user explicitly asked for a finished image (not a prompt)
- The imager skill SKILL.md exists at `/mnt/skills/user/imager/SKILL.md`
- The imager-bridge Worker is reachable (https://imager-bridge.dasexperten.workers.dev)

If any of these fail → fall back to original behavior (output the agency-grade text-prompt).

### Gate invocation syntax (when used)

```
[[GATE: imager?
  sku=<SKU>
  &scene=<scene_type>
  &character=<NameOrEmpty>
  &lang=<en|ru|de|vi|ar|zh|...>
  &aspect=<4:3|3:4|1:1|16:9|9:16>
  &campaign=<campaign_slug>
  &prompt_extras=<this_skill's_text_prompt>
]]
```

Pass this skill's full agency-grade text-prompt (the one originally intended as deliverable) as `prompt_extras`. Imager merges it with reference-locks and brand-DNA from R2 library.

### Failure handling

If imager returns `status: failure` OR is unreachable → **fall back to outputting the text-prompt to the user** as the original deliverable. Never leave the user without an output. The text-prompt is a perfectly valid deliverable on its own — imager is an **enhancement**, not a replacement.

### Conflict with this skill's prior text

If anywhere below in this SKILL.md the deliverable is described as "text-prompt for image generation tool" — that documentation is STILL VALID. Imager is one possible execution path, not a replacement of intent. The text-prompt remains a first-class deliverable.

---


# Designer — Das Experten Packaging Design

Three operating modes. The router at the top decides which mode runs based on trigger words or uploaded files.

---

## MODE ROUTER — RUN FIRST, BEFORE ANY OTHER STEP

Check the user's message against these triggers in order. Check **Mode C first**, then Mode B, then fall through to Mode A.

### MODE C — Only Design (lazy-load `references/only_design.md`)

Activate if any of these are present:
- Trigger words: "only design", "just design", "только дизайн", "без текста", "фоновый дизайн", "background design", "design concept", "generate background", "redesign background", "design-only SVG", "make background only"
- User explicitly says "I want the design without text" / "сделай фон без текста" / "generate only visuals"

**Action:** Load `references/only_design.md` and follow that workflow. **Skip Mode A (Steps 1–8 below) AND Mode B entirely.**

### MODE B — SVG Editor (lazy-load `references/svg_editor.md`)

Activate if Mode C did NOT fire AND any of these are present:
- Trigger words: "CorelDRAW", "Corel file", "SVG", "дизайнерский файл", "Corel file проверка дизайна", "edit SVG", "правка SVG", "обнови дилайн", "edit dieline", "проверь мой SVG", "fix SVG text", "SVG editor mode"
- User uploads a `.svg` file with any design/packaging context
- User uploads a `.cdr` file (respond: SVG export needed — see svg_editor.md intake rules)

**Action:** Load `references/svg_editor.md` and follow that workflow. **Skip Mode A (Steps 1–8 below) entirely.**

### MODE A — AI Prompt Generator (use rest of this file)

Activate if neither Mode C nor Mode B triggers fired, and any of these are present:
- Trigger words: "designer", "коробка", "упаковка", "box", "packaging", "dieline", "развёртка", "макет коробки", "prompt для коробки", "сделай упаковку", "дизайн коробки", "packaging prompt", "generate box"
- SKU name with design context and no SVG file

**Action:** Proceed with STEP 1–8 below.

---

# MODE A — AI Prompt Generator

Generates precise, layout-accurate image prompts for Das Experten toothpaste box dielines.
Output: structured prompt for AI image generator (Midjourney / DALL·E / Stable Diffusion).

---

## MANDATORY EXECUTION RULES

- NEVER skip steps. Hard stop after each step that requires user input.
- NEVER invent ingredients, barcodes, or legal text — pull from product-skill.
- NEVER alter any FROZEN BLOCK content — not one word, not one comma.
- NEVER use «» quotation marks anywhere in output.
- ALWAYS use exact box dimensions as specified below.
- ALWAYS apply LOGO LOCK — no exceptions, every prompt, every panel.
- Output language for prompt: English. Explanations to Aram: match his message language.

---

## LOGO LOCK — MANDATORY, NO EXCEPTIONS

The das experten logo is a REFERENCE element in every single prompt. Never describe it with generic font names. Never approximate it. Always write exactly this block:

```
LOGO: [REFERENCE — insert exact das experten logo as provided asset.
Font: Eras Bold — no substitutions, no approximations, ever.
Flag stripe: three diagonal stripes, fixed colors — black / red / yellow.
Never alter stripe order, angle, or colors under any circumstances.
Light background panel → logo text color: black.
Dark background panel → logo text color: white.
"innovativ und praktisch" tagline: Eras Bold italic, same color as main logo text.
Proportions, letter-spacing, size relationships: fixed — never alter.]
```

LOGO LOCK applies to every panel containing the logo:
- Front panel — large logo
- Back panel — small logo
- Left side panel — rotated 90° logo
- Right side panel — rotated 90° logo (small)

NEVER use "geometric sans-serif", "clean wordmark", "bold sans-serif" or any other
verbal approximation. REFERENCE only. Always. Without exception.

---

## BOX DIMENSIONS — GLOBAL FIXED

```
Box type:      Rectangular tube (toothpaste carton)
Total length:  170 mm
Front panel:   170 mm × 40 mm  (wide face)
Back panel:    170 mm × 40 mm  (wide face)
Side panel L:  170 mm × 30 mm  (narrow face)
Side panel R:  170 mm × 30 mm  (narrow face)
Top flap:      40 mm × 30 mm
Bottom flap:   40 mm × 30 mm
Volume:        70 ml (all SKUs — fixed)
```

Dieline layout (flat unfolded, left to right):
```
[LEFT SIDE 30mm] | [FRONT 40mm] | [RIGHT SIDE 30mm] | [BACK 40mm] | [GLUE TAB ~10mm]
                                    TOP FLAP (40×30mm)
                                    BOTTOM FLAP (40×30mm)
```

---

## STEP 1 — IDENTIFY SKU & MARKET

Ask (if not already stated):
1. Which SKU? (SYMBIOS / INNOWEISS / DETOX / SCHWARZ / GINGER FORCE / THERMO 39°)
2. Which market/language version? (RU / EN / MENA / CIS-multi / custom)
3. Manufacturer — default or different? (default = World Dentists Association America Limited)
4. Any custom text for front panel? (if not — use standard from product-skill)

**Hard stop. Wait for answer.**

---

## STEP 2 — LOAD PRODUCT DATA

Call `[[GATE: product-knowledge]]` to retrieve:
- Full ingredients list (EN + RU)
- Barcode number for this SKU
- Key claims / hero ingredient

Pull from product-skill silently. Do not ask Aram to provide these.

Signal when done:
> "Product data loaded for [SKU]. Building prompt now."

---

## STEP 3 — GENERATE BATCH NUMBER

Formula: `ГГММХХ`
- ГГ = last 2 digits of current year (e.g., 26)
- ММ = current month (2 digits, e.g., 04)
- ХХ = sequential batch number (default: 01 unless Aram specifies)

Example: April 2026, batch 1 → `260401`

Expiry date = production month + 60 months.
Example: 04/2026 → Expiry: 04/2031

---

## STEP 4 — ASSEMBLE FROZEN BLOCKS

### GLOBAL FROZEN BLOCK — INSERT VERBATIM, NO CHANGES

```
Produced and distributed under exclusive formulas and license of Das Experten Corporation
(International Trademark Registration: 1550919).
Manufactured by [MANUFACTURER].

Importer / Импортер / Ιεισαγωγέας / öbölféndeyintu / Імпортер / Importator:
ME  Das Experten International LLC, Sharjah Media City, Sharjah, UAE; email@dasexperten.de
RU  ООО «Дас Экспертен Евразия» ИНН: 9704117379, КПП: 770401001; +7 (930) 955 40 25; eurasia@dasexperten.de
UA  «RUSH» LLC, 6 Volodymyr Antonovich street, Dnipro, Ukraine, 49101
TDB «Imp 7» — 21007, Україна, м. Вінниця, вул. Академіка Янгеля, 4; +380 (98) 1166300
KG  ОсОО «Арктиан» — Кыргызская Республика, г. Бишкек, пр. Алматова 4; +996 (555) 909775; arktiibishkek@gmail.com
PL  «Naturam» LLC 09-400, Rzeczpospolita Polska, Płock, Plac Narutowicza 1; +48 (24) 264 64 24; biuro@naturam.pl
RO  «M Natusana» SRL: 2019, Republica Moldova, Chișinău, strada Mihai Eminescu 31; +373 (68) 726677
GE  TORI-GEORGIA LLC, Tbilisi, Georgia; TBC Bank
AM  Dasex Group LLC, Yerevan, Lechi 9, apt. 17; +374 (10) 211140; dasexgroup@gmail.com

Warning / Меры предосторожности: Do not swallow. Keep away from children under 6 years of age.
Storage conditions / Условия хранения: Store at temperature max 25°C, in a dry place away from children.
Usage directions / Способ применения: Clean teeth for 2 minutes minimum twice per day.
```

**MANUFACTURER default value:**
> World Dentists Association America Limited, Rm. 803, Chevalier House, 45-51 Chatham Road South, Kowloon, Hong Kong, CN.

If Aram specifies a different manufacturer — replace ONLY the manufacturer line. All other text stays frozen.

---

### PRODUCT FROZEN BLOCK — PER SKU

```
Ingredients / Состав: [FROM PRODUCT-SKILL — verbatim]
Barcode: [FROM PRODUCT-SKILL]
Volume / Объём: 70 ml
Batch no. / Номер партии: [GENERATED — STEP 3]
Expiry date / Годен до: [GENERATED — STEP 3]
Production date / Дата изготовления: on the top of the box and the tube
```

---

## STEP 5 — BUILD LAYOUT MAP

Exact layout derived from master mockups. Every panel, every language zone must match.

---

### TOP FLAP (170 × 30 mm) — HORIZONTAL STRIP ABOVE FRONT PANEL

```
LEFT ZONE:
  LOGO [REFERENCE] — small version
  Product name — medium bold
  Certification icons (microbiome friendly, FREE, leaf, rabbit) — right of product name

LANGUAGE COLUMNS — equal-width columns filling remaining width:
  Fixed sequence: TR | AM | GE | ES | FR | VN | AR
  Each language column contains:
    - Language code label (bold, e.g. "TR", "AM", "GE")
    - Product description in that language (very small font, 4-6 lines)
  AR column: right-to-left text, same column width as others
  All columns same height, same font size, same visual weight
  Column dividers: thin vertical lines or spacing only — match mockup
```

---

### FRONT PANEL (170 × 40 mm) — PRIMARY FACE

```
TOP ZONE:
  LEFT: LOGO [REFERENCE] — large version
        "innovativ und praktisch" tagline below logo — Eras Bold italic
  RIGHT: Product name — large bold [product color]
         Product subtitle (e.g. "mit Enzymen", "mit Kokosnusskohle") — small regular
         Product visual element — photorealistic (ingredient/bacteria/charcoal etc.)

MIDDLE ZONE:
  HEADLINE LINE 1 — RUSSIAN — large bold [product text color]
  HEADLINE LINE 2 — RUSSIAN — medium regular [product text color]

LOWER ZONE:
  Certification icons row — left aligned:
  microbiome friendly badge | FREE badge | leaf icon | cruelty-free rabbit icon

BOTTOM STRIP:
  KEY ITALIC CLAIM — RUSSIAN — small italic [product text color]
  Format: partial bold (hero ingredient name bold) + regular text
  Example: "Бактерия Bacillus coagulans, известная еще как "король пробиотиков"..."
```

---

### BACK PANEL (170 × 40 mm)

```
TOP ZONE:
  LEFT: LOGO [REFERENCE] — small version
        Product name — medium bold

ZONE 1 — DESCRIPTION BLOCK (upper half, 2 columns):
  LEFT COLUMN (wider, ~60% width):
    EN — language code bold + English product description (3-5 lines, very small font)
    RU — language code bold + Russian product description (3-5 lines, very small font)
    [AR in small script] — Arabic description line in Arabic script (RTL within column)

  RIGHT COLUMN (~40% width):
    AR full block — Arabic description, right-to-left, very small font
    Fills column top to bottom

ZONE 2 — TECHNICAL BLOCK (lower half, 2 columns):
  LEFT COLUMN:
    "Ingredients / Состав:" label bold
    Full INCI ingredient list — verbatim from product-skill (very small font)
    Blank line separator
    "Expiry date / Срок годности:" — 60 months
    "Batch no. / Номер партии / Дата изготовления:" — generated per STEP 3
    "Production date / Дата изготовления:" on top of box and tube
    Blank line
    "Warning / Меры предосторожности:" — FROZEN verbatim
    "Storage conditions / Условия хранения:" — FROZEN verbatim
    "Usage directions / Способ применения:" — FROZEN verbatim

  RIGHT COLUMN:
    TOP: Manufacturer + DEC trademark block — FROZEN verbatim
    MIDDLE: Importer block — FROZEN verbatim (all countries, very small font)
    BOTTOM: EAN-13 barcode — product GTIN from product-skill
            "Volume / Объём: 70ml" below barcode
```

---

### BOTTOM FLAP (170 × 30 mm) — HORIZONTAL STRIP BELOW FRONT PANEL

```
This is the ENGLISH language face — mirror logic of top flap but EN version:

LEFT ZONE:
  LOGO [REFERENCE] — small version
  Product name — medium bold
  Certification icons

CENTER/RIGHT ZONE:
  HEADLINE EN — large bold (English equivalent of Russian front headline)
  SUB-HEADLINE EN — medium regular
  KEY ITALIC CLAIM EN — small italic (English equivalent of Russian claim)

Example (SYMBIOS):
  "Living probiotic toothpaste for bio cleaning of your teeth."
  "Supports good bacteria in saliva. Boosts mouth's natural defense."
  "Bacillus coagulans, known as King of probiotics reduces oral levels of
   Streptococcus mutans* (the main cause of caries)."
```

---

### LEFT SIDE PANEL (170 × 30 mm)

```
ORIENTATION: All text rotated 90° — reads bottom to top
  LOGO [REFERENCE] — rotated, top of panel
  Product name — large bold, vertical
  Batch no. — small, vertical
  Expiry date — small, vertical
  Certification icons — stacked vertically, small
```

---

### RIGHT SIDE PANEL (170 × 30 mm)

```
ORIENTATION: All elements vertical
  EAC certification mark (Евразийское соответствие)
  CE mark
  Recycling triangle
  GMP icon
  PAP / FSC or other print certification icons
  LOGO [REFERENCE] — small, rotated
```

---

## STEP 6 — WRITE THE PROMPT

Use this exact template. Fill ALL fields before output. Zero placeholders in final prompt.
Prompt must specify exact mm dimensions AND exact position for every single element.

```
Create an ultra-photorealistic, print-ready packaging dieline for a toothpaste carton box.
Flat unfolded view. All panels fully visible simultaneously. No 3D perspective.

=== OVERALL DIELINE STRUCTURE ===

Total dieline width: 530mm (30 + 40 + 30 + 40 + 10 glue tab) + flaps above/below front.
Total dieline height: 170mm (all panels) + 30mm (top flap) + 30mm (bottom flap) = 230mm total.

Panel layout — horizontal sequence left to right, all 170mm tall:
  PANEL 1: Left side panel   — 30mm wide × 170mm tall
  PANEL 2: Front panel       — 40mm wide × 170mm tall  ← PRIMARY FACE
  PANEL 3: Right side panel  — 30mm wide × 170mm tall
  PANEL 4: Back panel        — 40mm wide × 170mm tall
  PANEL 5: Glue tab          — 10mm wide × 170mm tall (plain, no content)

Attached to PANEL 2 (Front panel) only:
  TOP FLAP:    170mm wide × 30mm tall — attached at top edge of front panel
  BOTTOM FLAP: 170mm wide × 30mm tall — attached at bottom edge of front panel

Panel separation rule: ONE single thin dashed line between every panel. Nothing else.
No white gaps. No white strips. No white borders. No padding. Zero gap between panels.
Every panel sits flush against the next. Only one thin dashed fold line marks each boundary.

=== GLOBAL LOGO RULE — ALL PANELS — NO EXCEPTIONS ===

LOGO: [REFERENCE — insert exact das experten logo as provided asset.
Font: Eras Bold — no substitutions, no approximations, ever.
Flag stripe: three diagonal stripes left side of logo — black / red / yellow top to bottom. Fixed. Never alter order, angle, or colors.
Dark background panel → logo text color: white.
Light background panel → logo text color: black.
"innovativ und praktisch" tagline: Eras Bold italic, same color as main logo text, directly below "das experten" wordmark.
Proportions, kerning, weight, size relationships: fixed — never alter under any circumstances.]

=== PANEL 1: LEFT SIDE PANEL — 30mm wide × 170mm tall ===

Background: [PRODUCT SIDE COLOR — from SKU color table]
All content rotated 90° clockwise — text reads from bottom to top.

Position from bottom of panel going upward:
  2mm from bottom edge:
    LOGO [REFERENCE] — rotated 90° clockwise. Height (when rotated) = 12mm. Width = 28mm.
  18mm from bottom edge:
    Product name "[PRODUCT NAME]" — Eras Bold, large, rotated 90°. Height = 8mm.
  30mm from bottom edge:
    "Batch no.: [BATCH]" — regular, very small (5pt), rotated 90°.
  38mm from bottom edge:
    "Expiry date: [EXPIRY]" — regular, very small (5pt), rotated 90°.
  50mm from bottom edge:
    Certification icons stacked vertically (rotated 90°), each icon 8mm × 8mm:
    microbiome friendly badge | FREE badge | leaf icon | rabbit icon

=== PANEL 2: FRONT PANEL — 40mm wide × 170mm tall — PRIMARY FACE ===

Background: [PRODUCT FRONT COLOR — from SKU color table]

ZONE A — TOP BAR: from top edge, height 14mm, full 170mm width
  Position x=2mm, y=2mm from top-left corner:
    LOGO [REFERENCE] — height 10mm, width proportional (~60mm).
    "innovativ und praktisch" tagline directly below logo text, same x position.
  Position x=65mm, y=2mm:
    "[PRODUCT NAME]" — Eras Bold, 18pt, [product accent color].
    "[PRODUCT SUBTITLE]" — Eras Bold regular, 8pt, directly below product name.
  Position x=120mm to x=168mm, y=2mm to y=14mm:
    Photorealistic product visual element — [FROM SKU COLOR TABLE].
    Size: 48mm wide × 30mm tall. Flush to right edge (2mm margin).

ZONE B — HEADLINE BLOCK: from y=16mm to y=32mm
  Position x=2mm, y=16mm:
    "[HEADLINE LINE 1 — RUSSIAN]" — Eras Bold, 16pt, [headline color], full width to x=118mm.
  Position x=2mm, y=26mm:
    "[HEADLINE LINE 2 — RUSSIAN]" — Eras Bold regular, 10pt, [headline color].

ZONE C — ICONS ROW: from y=33mm to y=40mm
  Position x=2mm, y=34mm:
    Certification icons in one horizontal row, each icon 7mm × 7mm, 2mm gap between:
    microbiome friendly badge | FREE badge | leaf icon | cruelty-free rabbit icon

ZONE D — BOTTOM CLAIM STRIP: from y=155mm to y=168mm
  Position x=2mm, y=155mm:
    "[KEY ITALIC CLAIM — RUSSIAN]" — Eras Bold italic, 7pt, [claim color].
    Hero ingredient name within sentence: bold weight. Rest of sentence: italic regular weight.
    Text wraps within x=2mm to x=168mm. Max 2 lines.

=== PANEL 3: RIGHT SIDE PANEL — 30mm wide × 170mm tall ===

Background: [PRODUCT SIDE COLOR — from SKU color table]
All content vertical, no rotation needed for icons.

Position from top of panel going downward, centered horizontally (x=15mm center):
  y=5mm:   EAC certification mark — 18mm × 18mm, centered.
  y=27mm:  CE mark — 12mm × 12mm, centered.
  y=43mm:  Recycling triangle symbol — 10mm × 10mm, centered.
  y=57mm:  GMP icon — 12mm × 12mm, centered.
  y=73mm:  PAP icon — 10mm × 10mm, centered.
  y=155mm: LOGO [REFERENCE] small, rotated 90° — height 8mm, width 26mm.

=== PANEL 4: BACK PANEL — 40mm wide × 170mm tall ===

Background: [PRODUCT BACK COLOR — same as front]

ZONE A — TOP BAR: y=2mm to y=10mm, full width
  Position x=2mm, y=2mm:
    LOGO [REFERENCE] small — height 6mm, width proportional (~36mm).
    "innovativ und praktisch" tagline directly below.
  Position x=42mm, y=2mm:
    "[PRODUCT NAME]" — Eras Bold, 10pt, [product accent color].

ZONE B — DESCRIPTION BLOCK: y=12mm to y=70mm. Split into 2 columns:

  LEFT COLUMN: x=2mm to x=100mm (width 98mm)
    y=12mm: "EN" — Eras Bold 6pt bold label.
    y=15mm: English product description — regular 5pt, line height 6pt.
            [EN DESCRIPTION TEXT] — max 8 lines within this column width.
    y=45mm: "RU" — Eras Bold 6pt bold label.
    y=48mm: Russian product description — regular 5pt, line height 6pt.
            [RU DESCRIPTION TEXT] — max 8 lines within this column width.

  RIGHT COLUMN: x=104mm to x=168mm (width 64mm)
    x=168mm right-aligned, RTL text direction.
    y=12mm: Arabic description block — Arabic script, 5pt, RTL, line height 6pt.
            [AR DESCRIPTION TEXT] — fills column top to bottom.

ZONE C — TECHNICAL BLOCK: y=72mm to y=140mm. Split into 2 columns:

  LEFT COLUMN: x=2mm to x=100mm (width 98mm)
    y=72mm:  "Ingredients / Состав:" — Eras Bold 5pt bold.
    y=76mm:  [FULL INCI INGREDIENTS VERBATIM] — regular 4.5pt, line height 5.5pt.
    y=105mm: Thin hairline separator line.
    y=107mm: "Expiry date / Срок годности: 60 months/месяцев" — regular 4.5pt.
    y=112mm: "Batch no. / Номер партии: [BATCH]" — regular 4.5pt.
    y=117mm: "Production date / Дата изготовления: on top of box and tube" — regular 4.5pt.
    y=122mm: Thin hairline separator line.
    y=124mm: "Warning / Меры предосторожности: Do not swallow. Keep away from children under 6 years of age." — regular 4.5pt.
    y=130mm: "Storage conditions / Условия хранения: Store at temperature max 25°C, in a dry place." — regular 4.5pt.
    y=136mm: "Usage directions / Способ применения: Clean teeth for 2 minutes minimum twice per day." — regular 4.5pt.

  RIGHT COLUMN: x=104mm to x=168mm (width 64mm)
    y=72mm:  "Produced and distributed under exclusive formulas and license of
              Das Experten Corporation (International Trademark Registration: 1550919).
              Manufactured by [MANUFACTURER NAME AND FULL ADDRESS]."
              — regular 4.5pt, line height 5.5pt.
    y=92mm:  "Importer / Импортер / Ιεισαγωγέας / öbölféndeyintu / Імпортер / Importator:"
              — Eras Bold 4.5pt.
    y=97mm:  Importer lines — regular 4pt, line height 5pt:
              "ME  Das Experten International LLC, Sharjah Media City, Sharjah, UAE; email@dasexperten.de"
              "RU  ООО Дас Экспертен Евразия ИНН: 9704117379, КПП: 770401001; +7 (930) 955 40 25; eurasia@dasexperten.de"
              "UA  RUSH LLC, 6 Volodymyr Antonovich street, Dnipro, Ukraine, 49101"
              "TDB Imp 7 — 21007, Вінниця, вул. Академіка Янгеля, 4; +380 (98) 1166300"
              "KG  ОсОО Арктиан — Бишкек, пр. Алматова 4; +996 (555) 909775; arktiibishkek@gmail.com"
              "PL  Naturam LLC 09-400, Płock, Plac Narutowicza 1; +48 (24) 264 64 24; biuro@naturam.pl"
              "RO  M Natusana SRL: Chișinău, strada Mihai Eminescu 31; +373 (68) 726677"
              "GE  TORI-GEORGIA LLC, Tbilisi, Georgia; TBC Bank"
              "AM  Dasex Group LLC, Yerevan, Lechi 9, apt. 17; +374 (10) 211140; dasexgroup@gmail.com"

ZONE D — BARCODE BLOCK: x=104mm to x=168mm, y=142mm to y=168mm
    EAN-13 barcode — number [GTIN] — width 58mm × height 20mm.
    Positioned x=106mm, y=142mm.
    "[BARCODE NUMBER]" digit string below barcode bars — 5pt centered.
    "Volume / Объём: 70ml" — regular 5pt, x=106mm, y=164mm.

=== TOP FLAP — 170mm wide × 30mm tall (attached above front panel) ===

Background: [PRODUCT TOP COLOR — same as front]

ZONE A — LEFT BLOCK: x=2mm to x=55mm, full height
  x=2mm, y=2mm:
    LOGO [REFERENCE] — height 8mm, width proportional (~32mm).
    "innovativ und praktisch" tagline directly below.
  x=2mm, y=14mm:
    "[PRODUCT NAME]" — Eras Bold, 9pt, [product accent color].
  x=2mm, y=20mm:
    Certification icons in one horizontal row, each 6mm × 6mm, 1mm gap:
    microbiome friendly badge | FREE badge | leaf icon | rabbit icon.

ZONE B — LANGUAGE COLUMNS: x=57mm to x=168mm, full height 30mm
  7 equal columns. Each column width = (111mm ÷ 7) = ~15.8mm.
  Each column starts 2mm from top, ends 2mm from bottom.
  Single thin hairline vertical divider between each column.

  COLUMN 1 (TR): x=57mm to x=72mm
    y=2mm: "TR" — Eras Bold 5pt bold, [accent color].
    y=6mm: Turkish text — regular 4pt, line height 5pt, left-aligned.

  COLUMN 2 (AM): x=73mm to x=88mm
    y=2mm: "AM" — Eras Bold 5pt bold, [accent color].
    y=6mm: Armenian text — regular 4pt, line height 5pt, left-aligned.

  COLUMN 3 (GE): x=89mm to x=104mm
    y=2mm: "GE" — Eras Bold 5pt bold, [accent color].
    y=6mm: Georgian text — regular 4pt, line height 5pt, left-aligned.

  COLUMN 4 (ES): x=105mm to x=120mm
    y=2mm: "ES" — Eras Bold 5pt bold, [accent color].
    y=6mm: Spanish text — regular 4pt, line height 5pt, left-aligned.

  COLUMN 5 (FR): x=121mm to x=136mm
    y=2mm: "FR" — Eras Bold 5pt bold, [accent color].
    y=6mm: French text — regular 4pt, line height 5pt, left-aligned.

  COLUMN 6 (VN): x=137mm to x=152mm
    y=2mm: "VN" — Eras Bold 5pt bold, [accent color].
    y=6mm: Vietnamese text — regular 4pt, line height 5pt, left-aligned.

  COLUMN 7 (AR): x=153mm to x=168mm
    y=2mm: "AR" — Eras Bold 5pt bold, [accent color], right-aligned.
    y=6mm: Arabic text — regular 4pt, line height 5pt, RIGHT-TO-LEFT direction.

=== BOTTOM FLAP — 170mm wide × 30mm tall (attached below front panel) ===

Background: [PRODUCT BOTTOM COLOR — same as front]

ZONE A — LEFT BLOCK: x=2mm to x=55mm, full height
  x=2mm, y=2mm:
    LOGO [REFERENCE] — height 8mm, width proportional (~32mm).
    "innovativ und praktisch" tagline directly below.
  x=2mm, y=14mm:
    "[PRODUCT NAME]" — Eras Bold, 9pt, [product accent color].
  x=2mm, y=20mm:
    Certification icons row, each 6mm × 6mm, 1mm gap:
    microbiome friendly badge | FREE badge | leaf icon | rabbit icon.
  x=2mm, y=26mm:
    "Batch no.: [BATCH]   Expiry date: [EXPIRY]" — regular 5pt.

ZONE B — ENGLISH CONTENT BLOCK: x=57mm to x=168mm, full height
  x=57mm, y=4mm:
    "[HEADLINE EN LINE 1]" — Eras Bold, 13pt, [headline color].
  x=57mm, y=13mm:
    "[HEADLINE EN LINE 2]" — Eras Bold regular, 9pt, [headline color].
  x=57mm, y=20mm:
    "[KEY ITALIC CLAIM EN]" — Eras Bold italic, 6pt, [claim color].
    Hero ingredient name within sentence: bold weight. Rest: italic.
    Wraps within x=57mm to x=168mm.

=== TYPOGRAPHY RULES ===

Font family: Eras Bold for ALL brand text, headlines, labels.
Body/description/legal text: clean regular sans-serif, minimum 4pt, all lines must be individually legible.
All text minimum 2mm from any panel edge.
Character sets: Latin, Cyrillic, Arabic (RTL), Armenian, Georgian, Vietnamese — all required.
No text overlap. No text outside panel boundaries.

=== PRINT SPECS ===

Resolution: 300 DPI minimum.
Color: CMYK-ready.
Panel separation: ONE single thin dashed fold line between panels. No white gaps. No white strips. No borders. Zero spacing between panels. Panels are flush.
Background fills each panel edge to edge — no margin between panel background and fold line.
```

---

## COLOR SCHEMES BY SKU

| SKU | Background | Accent | Product Visual |
|-----|-----------|--------|----------------|
| SYMBIOS | White / light green | Green | Probiotic bacteria illustration, green microorganisms |
| INNOWEISS | White / light blue | Blue + silver | Oxygen bubbles, clean white background |
| DETOX | Deep burgundy / purple | White | Cinnamon sticks + clove buds, warm spices |
| SCHWARZ | Black / dark charcoal | White + grey | Coconut shell charcoal chunks, dark dramatic |
| GINGER FORCE | Bright yellow | Brown + gold | Fresh ginger root, earthy tones |
| THERMO 39° | White / orange-red | Orange | Thermometer visual, warm gradient |

---

## PRODUCT HEADLINES BY SKU (FRONT PANEL — DEFAULT RU VERSION)

| SKU | Line 1 | Line 2 | Italic claim |
|-----|--------|--------|--------------|
| SYMBIOS | Пробиотическая зубная паста для био очищения зубов. | Усиливает собственную защиту слюны. Улучшает микрофлору полости рта. | Бактерия Bacillus coagulans, известная как "король пробиотиков", помогает в профилактике кариеса. |
| INNOWEISS | Инновационная многоуровневая отбеливающая зубная паста с энзимами | Интеллектуальный механизм расщепляет налет пропорционально превращая его в активный кислород. | Активный кислород обладает высокой отбеливающей способностью. |
| DETOX | Зубная паста с эфирными маслами корицы и гвоздики. | Обеспечивает комплексный уход за зубами и деснами. Успокаивает десны и укрепляет их. | Масло гвоздики давно известно своими спазмолитическим и лечебными свойствами. |
| SCHWARZ | Черная зубная паста с активированным углем из кокосовых стружек. | Эффективно отбеливает зубы, не повреждая эмаль. Предупреждает образование зубного камня. | Активированный уголь из кокосовых стружек имеет более мягкую и щадящую текстуру. |
| GINGER FORCE | Имбирная зубная паста | Обеспечивает здоровье полости рта и долговременную свежесть дыхания. | Масло имбирного корня заботится о здоровье зубов и десен и помогает при сухости во рту. |
| THERMO 39° | [Load from product-skill] | [Load from product-skill] | [Load from product-skill] |

---

## SCHWARZ RULE — MANDATORY

NEVER use the word "detox" for SCHWARZ toothpaste in any panel text.
Use: "delicate charcoal care" or "activated charcoal whitening" instead.

---

## STEP 7 — OUTPUT

Deliver:
1. **FULL PROMPT** — complete, copy-paste ready, no placeholders remaining
2. **LAYOUT SUMMARY** — brief table: what text appears in which panel
3. **FROZEN BLOCK STATUS** — confirm: "Global frozen block: INSERTED VERBATIM. Product frozen block: LOADED FROM PRODUCT-SKILL."

Do NOT deliver the prompt with any placeholder like [INSERT HERE] remaining.
All fields must be filled before output.

---

## STEP 8 — 3D VISUAL BLOCK (via bannerizer gate)

After delivering the dieline prompt, always ask:
> "Do you also need a 3D render of the assembled box? And a hero visual (ingredient/mood image)?"

### If 3D box render requested:

Call `[[GATE: bannerizer]]` with context:
- Product: [SKU NAME]
- Color scheme: [from COLOR SCHEMES table]
- Visual element: [from COLOR SCHEMES table]
- Task: 3D photorealistic render of assembled toothpaste carton box

Use this prompt template from `references/3d_visual_block.md`.

**3D BOX RENDER — base structure:**
```
Create an ultra-photorealistic 3D render of an assembled toothpaste carton box.

PRODUCT: das experten [SKU NAME]
BOX DIMENSIONS: 170mm long × 40mm wide × 30mm deep (assembled)
ORIENTATION: Slight 3/4 angle — front panel and left side panel both visible.
             Front panel faces viewer at approximately 30° angle.

FRONT PANEL VISIBLE CONTENT:
  - das experten logo (top-left) with German flag diagonal stripe
  - [PRODUCT NAME] large typography (top-right)
  - [PRODUCT SUBTITLE] small below product name
  - [HERO HEADLINE] bold center text
  - [PRODUCT VISUAL ELEMENT] photorealistic ingredient image (top-right corner)
  - Certification icons row (bottom)
  - Key italic claim (bottom strip)

COLOR SCHEME: [FROM SKU COLOR TABLE]

SURFACE: Matte finish packaging. Slight edge shadow. No gloss unless product calls for it.
BACKGROUND: Clean white studio background OR [product-themed background if hero visual requested].
LIGHTING: Soft studio 3-point lighting. Main light from upper-left.
          Subtle shadow beneath box on surface.
STYLE: Premium pharmaceutical product photography. No motion blur. Sharp edges.
       Photorealistic. No cartoon or illustrated style.
RESOLUTION: 4K equivalent. Square format 1:1.
```

### If hero visual requested:

Ask: "What mood — clinical/clean, dramatic/dark, natural/botanical, or lifestyle?"
Then call `[[GATE: bannerizer]]` with full product context + chosen mood.
Load `references/3d_visual_block.md` for hero visual prompt templates by SKU.

---

## REFERENCE FILES (lazy load)

Load only when needed:
- `references/svg_editor.md` — **MODE B — SVG Editor workflow + gate protocol.** Load when user triggers SVG Editor Mode (see router at top of file). Contains full 6-step workflow, intake validation, edit type classification (A/B/C/D), gate routing matrix (marketolog / legalizer / benefit-gate / product-skill / pricer / conversion), hard rules, patch protocol, delivery format, per-SKU defaults.
- `references/only_design.md` — **MODE C — Only Design workflow + gate protocol.** Load when user triggers Only Design Mode (see router at top of file). Generates textless background/visual image prompts that match the SVG's geometry, for use as a background layer in CorelDRAW. Contains 6-step workflow, text zone detection algorithm, zone classification (CLEAN/MINIMAL/DENSE/FREE), moodboard options, SKU hero visuals table, gate routing (product-skill / marketolog / benefit-gate), hard rules (zero text, respect zones), prompt template, delivery format, integration with Mode B.
- `references/global_frozen_block.md` — full verbatim importer + legal text (used by both modes)
- `references/product_data.md` — per-SKU ingredients, barcodes, claims
- `references/3d_visual_block.md` — 3D box render + hero visual prompt templates per SKU (MODE A only)

When product-skill is unavailable, load `references/product_data.md` as fallback.
