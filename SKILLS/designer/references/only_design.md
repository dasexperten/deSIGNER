# Only Design Mode — Das Experten Background Generator

**Lazy-load reference.** Loaded only when the user requests background/visual design generation separated from text content. Loaded on triggers: "only design", "just design", "только дизайн", "без текста", "фоновый дизайн", "background design", "design concept", "generate background", "redesign background", "design-only SVG", "make background only".

This mode is **separate** from MODE A (AI Prompt Generator) and MODE B (SVG Editor). When this mode is active, SKILL.md's Steps 1–8 (full dieline prompt generation) are bypassed, and svg_editor.md's text-editing workflow is also bypassed.

---

## Core principle

**Input = user's SVG file (from CorelDRAW). Output = AI image prompt for a background/design-only layer that matches the SVG's geometry but contains ZERO TEXT.**

The user already owns the text (in their Corel file, locked and correct). Claude reads the SVG to understand *where* text lives and *what size* it is — then generates a visual background prompt that **leaves those zones clean and readable**, fills the free space with hero visuals / patterns / gradients, and emits ZERO characters, letters, words, or numbers on the output.

The user's workflow: generate image → drop into Corel as a background layer beneath their text layer → final print-ready file.

---

## Table of contents

1. Workflow (6 steps with hard stops)
2. Text zone detection algorithm
3. Zone classification (CLEAN / MINIMAL / DESIGN-FREE)
4. Moodboard options per SKU
5. Gate routing matrix
6. Prompt template structure
7. Hard rules (9 rules, non-negotiable)
8. Delivery format
9. Integration with MODE B (SVG Editor)
10. Failure modes and recovery

---

## 1. WORKFLOW — 6 steps

### STEP 1 — SVG Intake (shared with MODE B)

User uploads SVG exported from CorelDRAW. Claude:

1. Validates SVG (same rules as `svg_editor.md` Section 2 — text must be real `<text>` not `<path>`).
2. Parses all `<text>` and `<tspan>` elements with their `x`, `y`, `font-size`, `font-weight` attributes.
3. Detects panel structure (4 rows + 2 flaps per dieline standard — see SKILL.md geometry).
4. Reports:
   > "Вижу N текстовых блоков в M панелях. Сейчас размечу текстовые зоны для дизайна."

**No hard stop** — proceeds directly to STEP 2.

### STEP 2 — Zone Mapping

For each panel, enumerate text zones and classify each by font-size:

- **CLEAN zone** (font-size ≥ 10pt, typically headlines, product name, large numeric):
  Background must be flat, low-contrast, minimal pattern. Maximum legibility required.
- **MINIMAL zone** (font-size 4–9pt, subheads, italic claims, section labels):
  Background can have subtle gradient or faint pattern. Low visual weight.
- **DENSE zone** (font-size < 4pt, legal copy, ingredients, importer, fine print):
  Background must be PURE clean area — zero pattern, zero visual elements, white or near-white.
- **FREE zone** (empty areas ≥ 10×10mm with no text inside):
  Full design freedom — hero visuals, ingredient illustrations, gradients, patterns, moodboard elements.

Output a zone map to the user:

```
Zone map — INNOWEISS 70ml TT
  ROW 1 TOP FLAP:      3 CLEAN + 8 DENSE + 0 FREE
  ROW 2 FRONT:         2 CLEAN + 2 MINIMAL + 3 FREE
  ROW 3 LEGAL:         0 CLEAN + 5 DENSE + 0 FREE  (entire row must stay clean)
  ROW 4 BACK:          2 CLEAN + 2 MINIMAL + 3 FREE
  ROW 2 RIGHT FLAP:    0 CLEAN + 12 MINIMAL + 2 FREE
  ROW 4 LEFT FLAP:     2 CLEAN + 2 MINIMAL + 1 FREE
```

**Hard stop.** Ask user:
> "Какой мудборд использовать для дизайна? Выбери: clinical / botanical / luxury-dark / minimalist / playful / custom (опиши). Или пришли референс-картинку."

### STEP 3 — Moodboard & SKU Hero Visual

User picks a mood. Claude loads SKU-specific hero visual from Section 4 table. Combines:
- Moodboard directive (tone, lighting, texture)
- SKU color palette
- SKU hero visual (enzymes bubbles / charcoal / ginger root / clove-cinnamon / probiotic bacteria / thermometer)

### STEP 4 — Gate Routing (optional)

For background-only generation, gates are **lighter** than MODE B because no text is produced. But still applied where relevant:

| Gate | When applied | What it checks |
|---|---|---|
| `[[GATE: product-skill]]` | Always if hero visual involves ingredients | Botanical accuracy (real ginger root, real clove buds, real coconut charcoal — not cartoon or wrong species) |
| `[[GATE: marketolog]]` | If user requests a mood that diverges from brand positioning | Mood matches Das Experten brand voice (enzyme-innovation, microbiome-science, German-quality aesthetic — NOT loud, NOT playful if SKU is clinical) |
| `[[GATE: benefit-gate]]` | If moodboard has consumer psychology implications (e.g., "luxury" vs "affordable") | Audience-match for intended market |

**No legalizer gate** for this mode — no text produced, no regulatory risk.

Gates return ✅ PASS / ⚠️ AMEND / ❌ BLOCK. Report to user, wait for green light before generating prompt.

### STEP 5 — Build Prompt

Assemble the image generation prompt using the template in Section 6. Every text zone is explicitly marked "leave clean — no text, background pattern only or flat color", every FREE zone gets design instructions.

### STEP 6 — Delivery

Return to user:
1. **Full image prompt** — copy-paste ready for Midjourney / DALL·E / Stable Diffusion / Flux
2. **Zone overlay preview** (optional) — annotated SVG showing which zones are CLEAN vs FREE
3. **Corel integration note** — instructions for placing the generated image as a background layer under the text layer
4. **Negative prompt block** — strong "NO TEXT" directives

---

## 2. TEXT ZONE DETECTION ALGORITHM

Parse the SVG and classify each `<text>` element:

```
For each <text> element in SVG:
    font_size_mm = attribute 'font-size' converted to mm
    x, y, width, height = bounding box

    if font_size_mm >= 3.5:       # Large (headlines, product name)
        zone_class = CLEAN
    elif 1.5 <= font_size_mm < 3.5:  # Medium (subheads, italic claims, labels)
        zone_class = MINIMAL
    else:                          # Small (legal, ingredients, importer)
        zone_class = DENSE

    Add zone rectangle to panel's zone list.

After processing all text:
    Merge adjacent same-class zones in each panel into combined rectangles.
    Inverse = FREE zones.
```

Output the zone map as mm-coordinates within each panel for use in the prompt.

---

## 3. ZONE CLASSIFICATION RULES

### CLEAN zones (headlines, product name, large numerics)
- Background requirement: **flat color** matching SKU base, or **very subtle gradient** (≤15% color variation)
- NO photographic imagery
- NO patterns with high detail
- Pattern allowed: thin concentric circles, scattered dots, max 8% opacity
- Must provide at least 4.5:1 contrast against headline text color

### MINIMAL zones (subheads, italic claims, section labels)
- Background can have light gradient or sparse pattern
- Low opacity patterns (<20%)
- NO text overlays, NO illustrations crossing into this zone
- Contrast with body text ≥ 3:1

### DENSE zones (legal row, ingredients block, importer, fine print)
- **PURE white or near-white** (`#FFFFFF` to `#FAFAFA`)
- ZERO pattern inside this zone
- ZERO imagery
- Acts as a sterile print area — the Corel text layer sits on clean background
- If the entire ROW 3 is DENSE (which is typical), treat the whole row as a white strip

### FREE zones (areas with no text)
- Full design freedom — go bold here
- Hero visual placement
- Pattern density up to 100%
- Gradients, illustrations, photographic elements all allowed
- Must not bleed into adjacent CLEAN/MINIMAL/DENSE zones
- Preserve a 2mm "safety margin" around each text zone

---

## 4. MOODBOARD OPTIONS & SKU HERO VISUALS

### Moodboard styles

| Style | Tone | Lighting | Texture | Use for |
|---|---|---|---|---|
| **clinical** | sterile, white, precise | bright, even, no shadows | smooth, matte | SYMBIOS, INNOWEISS, medical market |
| **botanical** | natural, earthy, fresh | soft daylight | organic, grainy | GINGER FORCE, DETOX, natural retail |
| **luxury-dark** | premium, sophisticated | low-key, directional | velvet, silk textures | SCHWARZ, premium positioning |
| **minimalist** | clean, airy, geometric | flat, shadowless | paper, linear | INNOWEISS neutral, B2B presentations |
| **playful** | bright, energetic | vivid colors | rounded, bubbly | mass-market retail, social media |
| **warm-spice** | cozy, inviting, rich | golden hour | textural, wood-grain | DETOX, seasonal limited editions |
| **custom** | user-described | — | — | anything not above |

### SKU hero visuals (photo-real)

| SKU | Hero subject | Color palette | Mood default |
|---|---|---|---|
| **SYMBIOS** | Probiotic bacteria illustration, micro-scale Bacillus coagulans cells in green-tinted fluid, scientific/cellular aesthetic | White + light green (#E8F5E9) + accent green (#2E7D32) | clinical |
| **INNOWEISS** | Oxygen bubbles rising in clear water, white/blue gradient, clean laboratory look, enzyme molecules abstract | White + light blue (#E3F2FD) + accent blue (#0072CE) + navy (#002B5C) | clinical |
| **DETOX** | Whole cinnamon sticks + clove buds, warm spice arrangement, aromatic steam, dark wood surface | Deep burgundy (#6A1B1B) + purple (#4A148C) + white accent | warm-spice |
| **SCHWARZ** | Coconut shell charcoal chunks, dark dramatic lighting, black matte surface, mineral texture | Black (#0A0A0A) + dark charcoal (#2A2A2A) + white accent | luxury-dark |
| **GINGER FORCE** | Fresh ginger root with texture, golden-brown tones, earthy ground, sliced cross-section detail | Bright yellow (#FFC107) + brown (#6D4C41) + gold (#B8860B) | botanical / warm-spice |
| **THERMO 39°** | Thermometer visual with warm-to-hot gradient, glowing elements, 39°C temperature reading graphic | White + orange (#FF6F00) + red accent (#D32F2F) | clinical + warm |

### Universal brand constraints (apply to ALL moodboards)

- NEVER loud or pompous
- NEVER generic / stocky / AI-cliché
- German-quality aesthetic hint (precision, clean edges, restraint) — but NEVER written as "German" anywhere
- Enzyme / microbiome / science positioning cues where natural
- Natural ingredients cue — botanical references where fit
- NEVER include teeth, dentist chairs, dental tools (too literal, lowers brand)
- NEVER mouth / lip close-ups
- NEVER "before/after" imagery

---

## 5. GATE ROUTING MATRIX

| User request content | product-skill | marketolog | benefit-gate |
|---|---|---|---|
| Standard moodboard (clinical/botanical/etc.) with SKU hero visual | ✅ (verify botanical accuracy) | — | — |
| Custom mood not in Section 4 list | ✅ | ✅ (brand voice check) | ✅ (audience check) |
| Ingredient visuals (cinnamon, ginger, charcoal) | ✅ (species/form accuracy) | — | — |
| Photographic style for B2B proposal | — | ✅ | ✅ |
| Abstract / non-ingredient design | — | ✅ | — |
| Seasonal / limited edition concept | — | ✅ | ✅ |
| Regional adaptation (e.g., Vietnam-targeted visuals) | — | ✅ | ✅ |

Every gate returns ✅ PASS / ⚠️ AMEND / ❌ BLOCK. All AMEND / BLOCK surface to user with a suggested alternative — never reject without offering a path.

---

## 6. PROMPT TEMPLATE STRUCTURE

Use this scaffold. Fill every placeholder before output. Zero brackets remaining.

```
Create a flat, print-ready 300 DPI TEXTLESS DIELINE BACKGROUND for a toothpaste carton box.
Horizontal unfolded layout. Design-only layer — ZERO text of any kind on the output.
This image will be placed as a background layer beneath an existing text layer in CorelDRAW.

=== CRITICAL RULE — ZERO TEXT ===

The output must contain NO:
- letters (Latin, Cyrillic, Arabic, Georgian, Armenian, any alphabet)
- numbers, digits, numerals
- logos with text (das experten wordmark is NOT in this output — only the flag stripe element allowed as decoration, never the wordmark)
- barcodes (actual or fake)
- words, word-fragments, abbreviations
- captions, labels, watermarks
- any character resembling a letter or number

If the model attempts to render text anywhere, REGENERATE. This is a design-only layer.

=== GEOMETRY ===

[Insert the same 30/40/30/40 stack + 2 side flaps geometry block from SKILL.md MODE A, verbatim.]

=== TEXT ZONES — KEEP CLEAN (no imagery here) ===

[For each CLEAN zone detected, list mm coordinates and specify "flat background only"]

Example:
- ROW 2 FRONT, x=4mm to x=168mm, y=18mm to y=26mm: RU headline zone — flat light background, no pattern, no imagery.
- ROW 2 FRONT, x=94mm to x=165mm, y=3mm to y=16mm: product name zone — flat or very subtle gradient.
- ROW 4 BACK, x=4mm to x=168mm, y=18mm to y=26mm: EN headline zone — flat light background.
- ROW 3 LEGAL, x=30mm to x=200mm, y=70mm to y=100mm: ENTIRE LEGAL ROW — pure white, zero pattern, zero imagery across full width.

=== TEXT ZONES — MINIMAL BACKGROUND (subtle pattern OK) ===

[For each MINIMAL zone, list coordinates]

Example:
- ROW 1 TOP FLAP language columns: subtle concentric circle pattern at <10% opacity allowed.
- ROW 2 FRONT italic claim zone (y=30mm to y=38mm): light blue gradient band allowed, <15% variation.

=== FREE ZONES — FULL DESIGN HERE ===

[For each FREE zone, describe what design elements to place]

Example:
- ROW 2 FRONT free zone x=115mm to x=150mm, y=5mm to y=15mm: photorealistic oxygen bubbles rising cluster, soft focus, blue tint (#0072CE), size approximately 30×10mm, blend into panel background at edges.
- ROW 4 BACK free zone (mirror of ROW 2): same hero visual, mirrored composition.
- ROW 2 RIGHT FLAP free zone x=20mm to x=30mm, y=5mm to y=35mm: abstract enzyme molecule pattern, minimal lines, blue #0072CE on white.
- ROW 1 TOP FLAP free zone x=50mm to x=60mm: small bubble cluster matching FRONT panel.

=== MOODBOARD ===

Style: [CLINICAL / BOTANICAL / LUXURY-DARK / MINIMALIST / PLAYFUL / WARM-SPICE / CUSTOM]
Tone: [from Section 4 moodboard table]
Lighting: [from Section 4]
Texture: [from Section 4]

=== SKU HERO VISUAL ===

Product: [SKU NAME]
Hero subject: [from Section 4 hero visuals table]
Color palette:
  Primary: [hex from SKU table]
  Secondary: [hex from SKU table]
  Accent: [hex from SKU table]
Photo style: photo-real, studio lighting, shallow depth of field, editorial cosmetics grade

=== DECORATIVE ELEMENTS ===

Background pattern (applied only to MINIMAL zones, never to CLEAN or DENSE):
- Thin concentric circles, diameter 6-30mm, stroke 0.1mm, color [SKU accent light tint], opacity 8%
- Scattered dots, diameter 0.3-0.8mm, color [SKU accent], low density 20 dots per 100mm²

German flag stripe element (allowed, no text):
- Three wavy horizontal strokes: black top, red middle, yellow bottom
- Placed in decoration positions only — never as part of a wordmark
- Small scale (width 6-10mm typical)

=== NEGATIVE PROMPT (STRONG) ===

no text, no letters, no numbers, no typography, no words, no captions, no labels,
no watermark, no logo wordmark, no characters, no alphabets, no script,
no teeth, no dentist, no mouth close-up, no lips, no dental tools,
no before/after, no medical diagrams, no human figures,
no stock photography look, no generic AI cliché,
no loud colors, no pompous design, no cartoon style

=== PRINT SPECS ===

Resolution: 300 DPI minimum.
Color: CMYK-ready, gamut-safe.
Bleed: 2mm beyond dieline edges.
Output format: flat unfolded dieline, ready to place in CorelDRAW as background layer.
File aspect: horizontal landscape, [CANVAS_WIDTH_MM]mm × [CANVAS_HEIGHT_MM]mm.

=== COREL INTEGRATION NOTE ===

This image will be placed in CorelDRAW as a locked background layer beneath the existing
text layer. The text layer contains all typography (headlines, legal, importer, batch,
barcode digits, language columns). Ensure the generated background does NOT interfere with
the text layer above it — specifically, keep CLEAN and DENSE zones spotless.
```

---

## 7. HARD RULES

Non-negotiable.

1. **ZERO text** on output — if AI renders text, reject and regenerate with stronger negative prompt.
2. **Respect zone map** — CLEAN zones stay clean, DENSE zones stay pure white, no imagery bleeds into text areas.
3. **Geometry never changes** — same 30/40/30/40 stack + 2 side flaps as user's SVG.
4. **SKU color palette is authoritative** — user can override with "custom", otherwise use Section 4 tables.
5. **No "detox" visual cliché for SCHWARZ** — charcoal is positioned as "delicate charcoal care", not "detox cleanse".
6. **No teeth / mouth / dentist imagery** ever — too literal, lowers brand.
7. **No human figures** on product background — this is a clean product design layer, not a lifestyle image.
8. **Photographic hero visuals must be botanically accurate** — real ginger root species, real cinnamon sticks (Ceylon or Cassia both ok, specify), real clove buds, real coconut charcoal (black, porous, mineral texture). Gate through product-skill.
9. **Never output logo with text** — the "das experten" wordmark belongs to the text layer in Corel. Only the flag stripe element (three wavy lines in black/red/yellow) may appear as decoration, isolated from any wordmark.

---

## 8. DELIVERY FORMAT

Every successful Mode C run returns:

### A. Full image prompt (inline in chat, code block)

Complete, copy-paste ready for Midjourney / DALL·E / Stable Diffusion / Flux. All placeholders resolved, zone coordinates filled, moodboard selected, hero visual specified.

### B. Zone map summary (markdown table)

```
Zone map — [SKU] — [MOOD]
| Panel | CLEAN zones | MINIMAL zones | DENSE zones | FREE zones |
|---|---|---|---|---|
| ROW 1 TOP FLAP | logo, innoWeiss | lang codes | lang paragraphs | right-of-innoWeiss gap |
| ROW 2 FRONT | logo, headline, innoWeiss | italic claim | — | right side, bubble area |
| ROW 3 LEGAL | — | — | entire row | — |
| ROW 4 BACK | logo, headline, innoWeiss | italic claim | — | right side, bubble area |
| RIGHT FLAP | — | icon labels | — | enzyme pattern area |
| LEFT FLAP | innoWeiss | mit Enzymen, batch/expiry | — | flag marker area |
```

### C. Gate report (if any gate ran)

```
Gate reports:
  [product-skill]  Ginger root species check: ✅ PASS — Zingiber officinale matches.
  [marketolog]     Botanical moodboard vs enzyme positioning: ⚠️ AMEND — soften botanical, add clinical elements.
```

### D. Corel integration note (inline)

> "Импортируй готовую картинку в Corel как bitmap layer. Помести её НИЖЕ текстового слоя (Lock background layer). Проверь, что все чёрные / тёмные тексты попадают на CLEAN зоны — если нет, регенерируй с подправленным zone map."

### E. Regeneration advice (if user wants variations)

> "Чтобы получить несколько вариантов того же layout но разных mood — перегенерируй с тем же промптом, меняя только секцию MOODBOARD. Geometry, zone map и hero visual остаются теми же — меняется только стиль."

---

## 9. INTEGRATION WITH MODE B (SVG Editor)

Modes B and C are complementary:

- **Mode B** edits the text layer (in SVG) — governs what's written.
- **Mode C** generates the background layer (as image prompt) — governs what's visual.

A typical full workflow:
1. User exports SVG from Corel (text as real text, not curves).
2. Mode B round: user lists text edits, Claude applies through gate chain, returns patched SVG.
3. Mode C round: user picks a moodboard, Claude generates background-only image prompt.
4. User takes both artifacts to Corel: patched SVG (text layer) + generated image (background layer).
5. Final production file in Corel → export to PDF for printer.

Claude can run both modes in the same conversation if the user explicitly asks for both. Never auto-chain — only on explicit request.

---

## 10. FAILURE MODES

### Case: AI generated text despite "no text" negative prompt

Response:
> "Генератор проигнорировал запрет. Регенерируй с усиленной negative prompt: добавь 'absolutely no typography, no characters, no glyphs, reject any textual element'. Midjourney версии 6+ лучше подчиняется негативам, DALL·E хуже."

Provide a revised prompt with stronger negative section.

### Case: Hero visual bleeds into text zone

Response:
> "Hero visual зашёл в CLEAN зону [zone name]. Перегенерируй с усиленным zone enforcement: добавь в промпт 'strict preservation of clean zones at coordinates [...mm to ...mm], no imagery crossing into these boundaries'."

### Case: User asks for moodboard not in Section 4

Activate full gate chain: `[[GATE: marketolog]]` + `[[GATE: benefit-gate]]` to verify mood matches Das Experten brand and target audience. If gates return AMEND, propose closest brand-compatible alternative.

### Case: User provides reference image

Treat reference as additional moodboard input. Describe the reference in the moodboard section:
> "Moodboard: [base style] with reference inspiration — [describe the reference: color, composition, lighting]."

Run marketolog gate on the reference-derived mood to catch off-brand inspirations.

### Case: SVG has no text zones (pure decorative file)

Response:
> "Этот SVG не содержит текстовых блоков. Mode C нуждается в text zone map чтобы понимать, где оставить чистые зоны. Альтернатива: опиши словами, где в макете будут тексты (x/y/размеры), и я сгенерирую промпт."

### Case: User wants background without SKU hero visual

Response:
> "Абстрактный дизайн без hero visual — вариант 'clean abstract'. Работает через marketolog gate, чтобы не оторваться от брендовой эстетики."

Run with marketolog, proceed with pure-pattern background.

### Case: Regeneration of same layout with different mood

User can loop Mode C multiple times on the same SVG, changing only the moodboard each run. Geometry, zone map, and SKU hero remain locked. Only mood / palette / decorative elements shift.

---

## Skill integration notes

- This reference is loaded **only** on the trigger words listed at the top.
- When this reference is active, SKILL.md's Mode A workflow (Steps 1–8) and `svg_editor.md`'s Mode B workflow are both bypassed.
- All three modes can be invoked within the same conversation via their respective trigger words. The most recently triggered mode is the active one.
- This reference is **read-only**. Updates go through editing this file directly in the skill folder.
- Output of Mode C is an image prompt, not a direct image. User takes the prompt to Midjourney / DALL·E / Flux / Stable Diffusion and runs it there.
