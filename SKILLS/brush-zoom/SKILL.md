---
name: brush-zoom
description: "Standard composition format for Das Experten toothbrush banners featuring an extreme macro zoom of the brush head as the dominant visual element. ALWAYS use this skill when creating any banner, slide, or visual prompt for a Das Experten toothbrush product. Trigger on ANY of these exact phrases or close variants: \"brush zoom\", \"head zoom\", \"macro head\", \"macro brush\", \"brush banner\", \"баннер щётка\", \"слайд щётка\", \"баннер для щётки\", \"промпт для щётки\", or any request to make a banner/slide for a named Das Experten brush (SCHWARZ brush, ETALON brush, GROSSE brush, ZERO brush, NANO MASSAGE brush, etc.). Always combine with the bannerizer skill for full prompt generation."
---

SOURCE OF TRUTH: deSIGNER/SKILLS/brush-zoom — edit here first.

## [[GATE — Das Experten Asset Catalog]] (HARD STOP before any image / video generation)

If the user request, parent-task body, or any input mentions a Das Experten SKU code (DExxx — DE101, DE201, DE206, DE209, etc.) or a product name (SCHWARZ, SYMBIOS, ETALON, GROSSE, ZERO, INNOWEISS, DETOX, THERMO 39, GINGER FORCE, NANO MASSAGE, KRAFT, AKTIV, BIO, COCOCANNABIS, MITTEL, SENSITIV, EVOLUTION, BUDDY, INTENSIV, INTERDENTAL, etc.):

1. Read `/root/das-experten-context/assets/product-references.md` **first**, before composing any prompt
2. Find the SKU's `element_id` in the Product Elements table
3. Pass `element_id` as **Higgsfield Reference Element** (Nano Banana 2/Pro, GPT Image 2, Seedream, Cinema Studio all support this — see CLI examples at the bottom of the catalog file)
4. For lifestyle / talent / model shots — also pick a Soul Character from the same file's Character Elements table and pass its `element_id` as a second reference

**NEVER invent a Das Experten tube, brush head, packaging, label, or logo.** No generic black tubes. No imagined geometry. No placeholder products.

If the SKU isn't in the catalog — STOP, post a `kanban_comment` on the current task explaining what's missing, and ask Aram. Do not generate a placeholder.


# BRUSH ZOOM — Standard Composition Format

This skill defines the locked composition standard for all Das Experten toothbrush banners.
It is used **in combination with the bannerizer skill** — BRUSH ZOOM defines the composition
and hero visual rules; bannerizer handles structure, palette, copy, and final prompt generation.

---

## BRUSH ZOOM Composition Standard

COMPOSITION RULE: Never split the banner into two separate halves. Always render as one unified cinematic scene with depth-of-field layering — product in foreground sharp, character and atmosphere in background bokeh. No hard left/right divide.

### Core Layout Rule

```
Dual-focus composition:
- LEFT SIDE → Character (if included) or text block
- RIGHT SIDE → Extreme macro zoom of toothbrush head at 80% visual weight
- OVERALL MOOD → Set by product DNA (see Product Mood Table below)
```

### Hero Visual — Brush Head Zoom

The brush head is ALWAYS the dominant product render in this format.

**Mandatory rendering rules:**
- Extreme macro zoom — brush head fills 80% of the right side of the frame
- Brush head angled slightly toward the viewer — never flat/straight-on
- Bristle zone fully visible — no occlusion by hand, character, or text
- Each filament rendered in obsessive detail:
  - Micro-tapered tips visible
  - Material infusion visible (charcoal, gold-ion, silicone, etc. — per product)
  - Micro-spacing between bristle clusters visible
  - Subtle translucency at filament tips
- Micro-specular highlights on individual bristle tips catching light like fiber optics
- Shallow depth of field: bristles in razor focus, background softly bokeh-blurred

**Hero product fidelity block — insert verbatim:**
> Hero product(s) = exact user-uploaded photo(s). Ultra-photorealistic, agency-level, zero geometry/label/color/proportion changes. Perfect fidelity on gloss, cap reflections, material texture, label clarity. Seamless micro-shadows and ground reflections.

---

## Product Mood Table

Each brush has a default mood tone. Use this to set the overall banner atmosphere.

| Brush | Mood | Key Visual Energy |
|---|---|---|
| SCHWARZ brush | Predatory, intense, raw | Dark, dramatic, cinematic |
| ETALON brush | Clean, precise, clinical | White/silver, minimal, scientific |
| GROSSE brush | Powerful, full-coverage | Bold, wide, energetic |
| ZERO brush | Precision, orthodontic | Tight, focused, technical |
| NANO MASSAGE brush | Gentle, family, soft | Warm, soft light, approachable |
| AKTIV brush | Ultra-soft, delicate | Pastel-adjacent, soft shadows |
| SENSITIV brush | Safe, enamel-care | Clean white, calm, trusted |
| MITTEL brush | Workhorse, stain removal | Mid-tone, confident, direct |
| KRAFT brush | Aggressive, heavy-duty | Dark, industrial, strong |
| INTENSIV brush | Dense, ultra-clean | Deep blue/white, clinical |
| 3D brush | Dynamic, multi-angle | Motion-implied, energetic |

---

## Character Rules (when included)

**Character verbatim block — insert exactly as written:**
> CHARACTER: exact user-uploaded photo(s). Ultra-photorealistic, agency-level, zero geometry/facial features/skin tone/proportion changes. Perfect fidelity on clothing texture, hair detail, skin texture, expression. Seamless integration into scene lighting and background. Natural shadow and light interaction consistent with scene key light direction.

**GRIP LOCK — fires automatically when character + brush are both in scene.**
Insert verbatim:
> GRIP LOCK: Character holds the referenced toothbrush in exact realistic grip — thumb pad presses firmly on mid-body near head for controlled hold, index and middle fingers wrap partially around handle opposite thumb creating natural pinch, ring finger supports lower curve, pinky relaxed with light contact near base. Palm cups lower handle for stability, slight wrist flexion toward camera, natural finger curves, moderate pressure causing subtle volumetric deformation on handle walls, realistic muscle tension in thenar eminence and forearm flexors, correct joint angles — no hyperextension, gravity-consistent natural droop of wrist. Brush head fully visible beyond fingers, no occlusion of bristle zone, clear bristle detail and color visible.

**Rules:**
- NEVER ask user to upload character photo — always insert verbatim block
- NEVER describe character independently — fidelity block only
- Grip Lock fires automatically — skip ONLY if user explicitly says no contact
- Character always positioned LEFT side of composition
- Brush head always positioned RIGHT side, extended toward camera

---

## 3D Technological Visual Options (for SCHWARZ brush)

Select based on user choice or brief context:

| Option | Description |
|---|---|
| Stain absorption field | Dark pigment particles (coffee, wine, tobacco) pulled into bristle tips — cinematic particle physics, motion blur on trails only |
| Charcoal fiber cross-section | Single PBT bristle sliced open — charcoal matrix inside, ember-red glow, biotech schematic style, 3–4× scale |
| Activated carbon molecular mesh | Dark porous honeycomb carbon structure floating behind brush, biotech bubble style |
| None | Brush head carries full visual — clean dark background only |

For other brush models, select 3D visual appropriate to their technology:
- GROSSE → Gold-ion antibacterial field (Au⁺ particle cloud)
- ETALON → 360° spiral filament cross-section schematic
- NANO MASSAGE → NanoFlex silicone micro-bubble visualization
- ZERO → Orthodontic bracket clearance schematic

---

## Text Rules for Brush Banners

- **No English words on banner** — only abbreviations (PBT, RDA, Au⁺, etc.)
- All copy in Russian unless user specifies otherwise
- Left-aligned text block, standard horizontal reading orientation
- Stacked top to bottom: headline → subheadline → benefits list
- Flush left, minimum 20px margin from all edges
- No rotation, no tilt, no decorative orientation

**Disclaimer — always include, bottom right corner:**
> Реклама. ООО "Дас Экспертен Евразия", ИНН 9704117379

---

## Integration with Bannerizer

This skill defines:
- Composition format (dual-focus, brush head 80% right)
- Hero visual rules (brush head zoom)
- Character + Grip Lock verbatim blocks
- Product mood table
- 3D visual options per brush
- Text language rules

The **bannerizer skill** handles:
- Slide structure selection (A/B/C/D/E/F)
- Content block generation
- Headline generation (Hero Intrigue Lock)
- Palette selection
- Final prompt assembly and rationale notes

**Workflow:**
1. Read BRUSH ZOOM skill → lock composition format
2. Read bannerizer skill → run steps 2–7
3. Insert BRUSH ZOOM composition block at start of final prompt
4. Insert verbatim hero/character/grip blocks per BRUSH ZOOM rules
5. Output final prompt

---

## Quick Reference — Composition Block (copy-paste)

```
Dual-focus composition: left side occupied by [CHARACTER / text block],
right side dominated by an extreme macro zoom of a charcoal toothbrush
head at 80% visual weight. Overall mood: [INSERT FROM PRODUCT MOOD TABLE].
```