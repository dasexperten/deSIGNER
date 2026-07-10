# SVG Editor Mode — Das Experten Dieline Text Editor

**Lazy-load reference.** Loaded only when the user's request involves editing an SVG dieline file exported from CorelDRAW. Loaded on triggers: "CorelDRAW", "Corel file", "SVG", "дизайнерский файл", "Corel file проверка дизайна", "edit SVG", "правка SVG", "обнови дилайн", "edit dieline", "проверь мой SVG", "fix SVG text", "SVG editor mode".

This mode is **separate** from the AI prompt-generator workflow in SKILL.md. When this mode is active, SKILL.md's Steps 1–8 (prompt generation) are bypassed.

---

## Core principle

**Default mode = B1 (Audit).** Input = user's SVG file. Output = text-only audit list in the format БЫЛО / СТАЛО / ПОЧЕМУ. Claude reads every `<text>` and `<tspan>` node, runs the text through legalizer / marketolog / benefit-gate, and returns a block-by-block list of proposed edits for Aram to apply manually in CorelDRAW. **No SVG file is generated. No automatic patching.**

**Optional mode = B2 (Execute).** Triggered only by explicit command: "применить правки", "execute B2", "сделай SVG", "собери файл", "apply edits". Without the command B2 never runs. If Aram stays silent after B1, the job is closed.

**B1 scope = text only.** Orthography, legal wording, marketing force, brand compliance with Das Experten. Geometry, fonts, colors, hierarchy, overflow, layout — explicitly out of scope.

---

## Table of contents

1. Workflow (B1 Audit default + B2 Execute optional)
2. SVG intake validation
3. Edit type classification (A / B / C / D)
4. Gate routing matrix
5. Hard rules (11 rules, non-negotiable)
6. SCHWARZ rule
7. Patch protocol
8. Delivery format
9. Per-SKU defaults (for auto-correct suggestions)
10. Common failure modes and how to handle them

---

## 1. WORKFLOW

### B1 — Audit (default, always runs on SVG upload)

#### Step 1 — SVG Intake

1. Parse the file, count `<text>` vs `<path>` elements.
2. If text is converted to curves → HARD STOP:
   > "Этот SVG содержит текст, конвертированный в кривые. Я не смогу прочитать его текстово. Перезаэкспортируй из CorelDRAW с опцией Text → Export as text (не as curves)."
3. If the file is a base64 bitmap wrapped in SVG (>70% of file size) → HARD STOP:
   > "Corel экспортировал файл как растровое изображение внутри SVG-обёртки. В диалоге экспорта сними галочку Rasterize / Convert to bitmap и перезаэкспортируй."
4. Build the text map: enumerate every `<text>` node with panel context (TOP FLAP / FRONT / LEGAL / BACK / LEFT FLAP / RIGHT FLAP).
5. Confirm briefly:
   > "Прочитал N текстовых блоков в M панелях. Запускаю аудит."

Proceed directly to Step 2 — no hard stop, no waiting.

#### Step 2 — Run Gate Chain

Silently run every text block through:
- **legalizer** — importer details, manufacturer, trademarks, warnings, ingredients, tax IDs, phone/email formats
- **marketolog** — headlines, subheadlines, italic claims, CTAs, promo text (sharpness, decision-forcing, brand voice)
- **benefit-gate** — audience alignment, conversion logic, GOLDEN RULE test

Each gate flags blocks that need changes. Skip blocks that pass all gates — they do not appear in the audit.

For each flagged block, classify the edit type (see Section 3) to determine which gate(s) drove the flag.

#### Step 3 — Deliver Audit Report

Return a **block-by-block list** (not a table). Format per edit:

```
**Правка №[N] — [короткий заголовок]**
Панель: [TOP FLAP / FRONT / LEGAL / BACK / LEFT FLAP / RIGHT FLAP]

БЫЛО:
[current text, exactly as it appears in the SVG]

СТАЛО:
[proposed text]

ПОЧЕМУ:
[1–3 sentences. State which gate raised the flag and the reason.
Example: "legalizer — телефон KG-импортёра в неправильном формате, должен быть +996 (XXX) XXXXXX."]
```

After the last block, finish with exactly this line:

> **Аудит завершён. Правки вноси в Corel вручную.**

**Do NOT generate an SVG file. Do NOT offer to generate one. B1 ends here unless Aram explicitly triggers B2.**

---

### B2 — Execute (optional, explicit command only)

Runs **only** when Aram says one of: "применить правки", "execute B2", "сделай SVG", "собери файл", "apply edits", or equivalent unambiguous command.

If triggered:

1. **Re-confirm scope:** ask which audit edits to apply — all, or a subset by number (e.g. "применить 1, 3, 5").
2. **Apply via `str_replace`** on the XML content, using enough surrounding tag context to guarantee a single match (see Section 7 — Patch protocol).
3. **Save** to `/mnt/user-data/outputs/[sku]_dieline_v[N]_patched.svg`, present via `present_files`.
4. **Return patch log:** markdown table with # / Location / Before / After / Gate / Status (see Section 8 — Delivery format).
5. Offer next iteration: "Ещё правки?"

**If no B2 trigger is received, the job ends at B1 Step 3. Do not loop back, do not prompt, do not offer.**

---

## 2. SVG INTAKE VALIDATION

On every SVG input, validate in this order:

| Check | Pass criterion | Fail action |
|---|---|---|
| File is valid XML | Parses without error | Ask user to re-export |
| Contains `<text>` elements | Count ≥ 1 | HARD STOP — Text was converted to curves |
| No dominant embedded bitmap | Base64 images < 70% of file size | HARD STOP — Rasterized SVG |
| Font-family attribute present | Fonts named on text elements | Warn user — text may render with fallback |
| Coordinates in mm | `viewBox` present, units consistent | Warn user — may lose print precision |

Report validation result clearly before proceeding to edits.

---

## 3. EDIT TYPE CLASSIFICATION

Every edit falls into exactly one type.

### TYPE A — Technical edits (no gate)

- Batch number update (e.g., HH42402 → HH62405)
- Expiry date update (02/2029 → 06/2031)
- SKU code on label
- Barcode number
- Production date
- Typo fix in technical identifiers

Applied directly. No gate.

### TYPE B — Content edits (marketolog + benefit-gate)

- Product headline (RU / EN / other language)
- Subheadline / product description
- Italic claim / tagline
- Product name / subtitle
- Language column translations (consumer-facing text)

Gate chain: `[[GATE: marketolog]]` → `[[GATE: benefit-gate]]`
If touches product properties (enzymes, RDA, ingredients in claim text): add `[[GATE: product-skill]]`.

### TYPE C — Legal / regulatory edits (legalizer)

- Importer block (ME / RU / UA / KG / PL / RO / GE / AM / any country)
- Manufacturer line (World Dentists Association America Limited default)
- Warning text (storage, usage, safety)
- Ingredients list (INCI)
- Trademark / registration number (DEC, WIPO IR 1550919, IR 1675375)
- Certification icons text (EAC, CE, GMP, Halal)
- Bank details if printed (never usually, but if so)
- Tax ID, registration number, address

Gate chain: `[[GATE: legalizer]]`
Any change touching ingredients: add `[[GATE: product-skill]]` to verify scientific correctness.

### TYPE D — Commercial / pricing edits (conversion gate + legalizer + pricer)

- Price on pack (if applicable — rare)
- Promotional / CTA text on pack
- "New!" / "Limited edition" / urgency markers
- QR code destination text

Gate chain: `[[GATE: pricer]]` → `[[GATE: conversion gate]]` → `[[GATE: legalizer]]`

---

## 4. GATE ROUTING MATRIX

| Edit content | marketolog | benefit-gate | legalizer | product-skill | pricer | conversion |
|---|---|---|---|---|---|---|
| Headline (TYPE B) | ✅ | ✅ | — | — | — | — |
| Subheadline (TYPE B) | ✅ | ✅ | — | — | — | — |
| Italic claim (TYPE B) | ✅ | ✅ | — | ✅ (if enzyme/ingredient mentioned) | — | — |
| Translation (TYPE B) | ✅ | ✅ | — | — | — | — |
| Importer block (TYPE C) | — | — | ✅ | — | — | — |
| Manufacturer (TYPE C) | — | — | ✅ | — | — | — |
| Warnings/storage/usage (TYPE C) | — | — | ✅ | ✅ | — | — |
| Ingredients (TYPE C) | — | — | ✅ | ✅ | — | — |
| Trademark (TYPE C) | — | — | ✅ | — | — | — |
| Batch/expiry (TYPE A) | — | — | — | — | — | — |
| SKU code (TYPE A) | — | — | — | — | — | — |
| Barcode digits (TYPE A) | — | — | — | — | — | — |
| Promo / CTA (TYPE D) | ✅ | ✅ | ✅ | — | — | ✅ |
| Price (TYPE D) | — | — | ✅ | — | ✅ | ✅ |

Each gate returns one of three statuses: ✅ PASS, ⚠️ AMEND, ❌ BLOCK.

---

## 5. HARD RULES

Non-negotiable. These override any request.

0. **DEFAULT MODE IS B1 AUDIT-ONLY.** Never generate, modify, or return an SVG file in B1. The only deliverable of B1 is a text audit list in БЫЛО / СТАЛО / ПОЧЕМУ format. B2 (SVG generation) runs only on explicit trigger command from Aram.
1. **NEVER generate SVG from scratch.** Only edit the user's input SVG.
2. **NEVER modify** attributes: `x`, `y`, `width`, `height`, `transform`, `font-family`, `font-size`, `font-weight`, `fill`, `stroke`, `opacity`, `viewBox`, any positioning or styling attribute.
3. **NEVER modify** `<path>`, `<image>`, `<polygon>`, `<rect>`, `<circle>`, `<line>`, `<g transform="...">` structure.
4. **NEVER add** new elements to the SVG (no new `<text>`, no new `<g>`) without explicit user command.
5. **NEVER delete** elements without explicit user confirmation (ask twice if ambiguous).
6. **NEVER modify** frozen blocks (importer list, manufacturer line, warnings text) without `[[GATE: legalizer]]` approval.
7. **NEVER fabricate** bank details, IBAN, SWIFT, tax IDs, registration numbers, contact phone/email. If user asks to add something unknown — hard stop, request exact data.
8. **NEVER translate** existing text without explicit user command. RU stays RU. EN stays EN.
9. **Language of output messages to user:** match the language of the user's message.
10. **NEVER use** `«»` quotation marks in any generated text.

---

## 6. SCHWARZ RULE

**NEVER** use the word "detox" / "детокс" in any edit for SCHWARZ SKU. Use "delicate charcoal care" / "деликатный уход с углём" / "activated charcoal whitening" / "отбеливание активированным углём" instead.

This rule is enforced regardless of gate status. If the user explicitly asks to add "detox" to a SCHWARZ SKU, respond:
> "SCHWARZ rule: слово detox запрещено для этого SKU. Предлагаю 'delicate charcoal care' или 'activated charcoal whitening'."

---

## 7. PATCH PROTOCOL

### XML-safe text replacement

When editing text, always use `str_replace` with enough XML context to guarantee a single match:

**Wrong (too short, may match elsewhere):**
```
old: "HH42402"
new: "HH62405"
```

**Right (includes surrounding tags):**
```
old: '>Batch no./Номер партии: HH42402<'
new: '>Batch no./Номер партии: HH62405<'
```

### Character escaping

- Escape `<`, `>`, `&` in text content: `&lt;`, `&gt;`, `&amp;`
- Preserve existing entities (don't double-escape)
- Respect whitespace in `<text>` nodes — CorelDRAW may use non-breaking spaces (`&#160;`)

### Multi-occurrence edits

If the same text appears in multiple panels (e.g., "innoWeiss" on TOP FLAP, FRONT, LEFT FLAP), ask user which instances to edit. Don't blanket-replace.

### Empty tspan handling

CorelDRAW sometimes splits text into multiple `<tspan>` elements per word or letter for precise positioning. If the user's request replaces a phrase that spans multiple tspans, collapse them carefully — preserve the first tspan's attributes and drop others.

---

## 8. DELIVERY FORMAT

Every successful edit round returns three things:

### A. Patch log (inline, in chat)

```
# Patch log — INNOWEISS 70ml TT — Edit round 3

| # | Location           | Before                          | After                           | Gate       | Status |
|---|--------------------|---------------------------------|----------------------------------|------------|--------|
| 1 | LEFT FLAP, batch   | HH42402                         | HH62405                          | —          | ✅     |
| 2 | LEFT FLAP, expiry  | 02/2029                         | 06/2031                          | —          | ✅     |
| 3 | FRONT, RU headline | Инновационая многоуровневая...  | Инновационная многоуровневая...  | marketolog | ✅     |
```

### B. SVG file

Saved to `/mnt/user-data/outputs/[sku]_dieline_v[N]_patched.svg`, presented via `present_files`.

### C. Diff summary (optional, only if > 5 edits)

```
XML lines changed: 7
Elements touched: 5 (all <text>)
Elements unchanged: 483
No attributes modified. No structure modified.
```

---

## 9. PER-SKU DEFAULTS

Reference table for auto-correct suggestions and validation. If user asks "is this headline the standard one for SKU X?", check here.

### Headlines (RU default, FRONT panel)

| SKU | Line 1 | Line 2 | Italic claim |
|-----|--------|--------|--------------|
| SYMBIOS | Пробиотическая зубная паста для био очищения зубов. | Усиливает собственную защиту слюны. Улучшает микрофлору полости рта. | Бактерия Bacillus coagulans, известная как король пробиотиков, помогает в профилактике кариеса. |
| INNOWEISS | Инновационная многоуровневая отбеливающая зубная паста с энзимами. | Интеллектуальный механизм расщепляет налет пропорционально превращая его в активный кислород. | Активный кислород обладает высокой отбеливающей способностью. |
| DETOX | Зубная паста с эфирными маслами корицы и гвоздики. | Обеспечивает комплексный уход за зубами и деснами. Успокаивает десны и укрепляет их. | Масло гвоздики давно известно своими спазмолитическим и лечебными свойствами. |
| SCHWARZ | Черная зубная паста с активированным углем из кокосовых стружек. | Эффективно отбеливает зубы, не повреждая эмаль. Предупреждает образование зубного камня. | Активированный уголь из кокосовых стружек имеет более мягкую и щадящую текстуру. |
| GINGER FORCE | Имбирная зубная паста. | Обеспечивает здоровье полости рта и долговременную свежесть дыхания. | Масло имбирного корня заботится о здоровье зубов и десен и помогает при сухости во рту. |
| THERMO 39° | [load from product-skill] | [load from product-skill] | [load from product-skill] |

### Color accents by SKU

| SKU | Primary | Accent | Hero visual |
|---|---|---|---|
| SYMBIOS | White / light green | Green | Probiotic bacteria |
| INNOWEISS | White / light blue | Blue + silver | Oxygen bubbles |
| DETOX | Deep burgundy / purple | White | Cinnamon + clove |
| SCHWARZ | Black / charcoal | White + grey | Coconut charcoal |
| GINGER FORCE | Bright yellow | Brown + gold | Ginger root |
| THERMO 39° | White / orange-red | Orange | Thermometer |

### Manufacturer defaults

- **CIS toothpaste**: Guangzhou Honghui (legal seller/payer: VTB Shanghai, SWIFT VTBRCNSH). Brand on pack: World Dentists Association America Limited (HK).
- **International toothpaste**: Guangzhou MEIZHIYUAN.
- **Brushes (all markets)**: Yangzhou Jinxia. Seller: DEI.
- Never change manufacturer without `[[GATE: legalizer]]`.

### Importer block reference

See `references/global_frozen_block.md` for the verbatim CIS importer list (ME/RU/UA/KG/PL/RO/GE/AM). Any country change goes through legalizer.

### Batch number formula

`ГГММХХ` — year/month/sequential.
Expiry = production + 60 months.
(April 2026, batch 1 = `260401`, expiry 04/2031.)

---

## 10. COMMON FAILURE MODES

### Case: User uploads SVG but asks for new panel to be added

Response:
> "Добавление нового блока — это структурное изменение, не текстовая правка. SVG Editor Mode такое не делает. Два варианта: (a) сделай блок сам в Corel и пришли заново, (b) переключимся на AI Prompt Generator Mode для пересборки дизайна."

### Case: User asks to change a color

Response:
> "Цвет — не текст. Edit Mode меняет только текстовое содержимое. Открой SVG в Corel и смени цвет там, это займёт 10 секунд."

### Case: User asks to translate all text to another language

Response:
> "Это массовая правка TYPE B. Прогоню через marketolog + benefit-gate + product-skill. Сначала подтверди — какой целевой язык, какой рынок, и сохраняем ли structure существующих языковых колонок."

Apply gate chain on every target text block.

### Case: Gate returns BLOCK on a critical edit

Response:
> "[Gate name] заблокировал правку X по причине: [details]. Предлагаю альтернативу: [alternative]. Выбирай путь."

Wait for user decision.

### Case: User asks to update importer block for a new country

Response:
> "Новый импортёр — это legalizer territory. Мне нужны: полное юр. название, адрес, телефон/email, банковские реквизиты если печатаются, ИНН/tax ID. Без этого не генерю."

Wait for exact data. NEVER fabricate.

### Case: SVG contains text in `<tspan>` with character-level positioning

CorelDRAW often exports text like:
```xml
<text><tspan x="10">Б</tspan><tspan x="12">а</tspan><tspan x="14">т</tspan>...</text>
```

In this case, don't try to collapse tspans. Instead, edit letter by letter. If the edit changes text length significantly (e.g., "Батч" → "Batch"), warn user:
> "CorelDRAW использовал посимвольное позиционирование. После правки текст может выглядеть неровно. Рекомендую открыть файл в Corel и выровнять вручную."

---

## Skill integration notes

- This reference is loaded **only** on trigger words listed at the top.
- When this reference is active, the AI prompt-generator steps in SKILL.md (Steps 1–8) are bypassed.
- This reference is **read-only**. Updates to this workflow should be made by editing this file directly in the skill, not by monkey-patching during a conversation.
- If the user wants to switch from SVG Editor Mode back to Prompt Generator Mode mid-conversation, they can trigger with the prompt-generator words (e.g., "designer", "коробка", "packaging prompt") and the router in SKILL.md will switch modes.
