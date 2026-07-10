# Animator Skill — Cinematic Moviemaker Protocol (HISTORICAL REFERENCE)

**Status:** **ARCHIVED / partial source.** Per Aram (2026-05-24), the source MOVIEMAKER GPT was authored **before native image-to-video was available**, so its multi-fragment stitching workflow was a workaround for that gap. Modern backends (Higgsfield Seedance 2.0, Kling 3.0, Nano Banana 2/Pro, Atlas) take a reference image + prompt and produce a continuous clip directly — **fragment stitching is not needed**. This file is kept only as a quarry for the still-useful items called out in §5 below. The full workflow in §1–§4 is **not** activated as an animator mode.

**Version:** 1.0 (frozen, do not extend)
**Origin:** Adapted verbatim from internal MOVIEMAKER protocol (originally labeled Veo 3.1). Engine label stripped — Veo 3 is **disabled** as a backend in this skill.

**Do NOT treat as single source of truth.** Treat as a vocabulary and discipline source from a previous era; the live animator design is in `physics-rules.md`, `control-blocks.md`, and the upcoming `SKILL.md`.

---

## 1. CORE CONCEPT: INGREDIENTS

The protocol always begins from user-provided images of characters and objects — **ingredients**.
- First, identify these ingredients and **name them**.
- If any ambiguity appears during identification, **ask for clarification**.
- An ingredient may be visible in some fragments and not visible in others.
- Multiple ingredients can appear within the same fragment.
- Every cinematic fragment is based strictly on what is visible — realism and full policy compliance.

**Visibility rule:** if any image/object/ingredient is to appear (including assets the system provides), the prompt must specify **when** and **in which fragment** it appears, and clearly note its appearance and what happens to it.

---

## 2. WORKFLOW

### Step 1 — User provides image
- User uploads or pastes the photo of an ingredient.
- Observe only what is visible: characters, props, lighting, setting.
- Nothing is assumed beyond plausible inference.
- All content stays within safety and realism standards.

### Step 2 — Identify main object under focus
- Upon receiving the ingredients, identify the main object or subject that draws the viewer's focus.
- Name it for usage in fragments, **always followed by `(DOWNLOADED INGREDIENT)`**.
- If unclear, ask: **Is this the main object under focus, and can it change during the movie?**
  - If **cannot change** — the object remains the consistent visual and narrative anchor across all fragments.
  - If **can change** — focus may shift naturally, with user approval.

### Step 3 — Ask for dialogue language
- Lock the chosen dialogue language for the scenario (default to English if unspecified).
- **STRICTLY keep all descriptive sections in English** regardless of dialogue language.

### Step 4 — Storyline option
- Ask for a text or article to use for drafting the storyline.
- Draft a **Storyline Summary** (≈ 1 paragraph).
- During the Storyline Summary, advise where to place the ingredients. If user approves, proceed. If not, user specifies the fragments.

### Step 5 — Scene planning
- Propose a `Recommended_Fragments` count (typically **1 / 3 / 5 / 7**).
- **Ingredient scheduling:** if any additional image/object/ingredient is to appear, propose its **first appearance** and any **subsequent reappearances** by specific fragment number(s).

### Step 6 — Cinematic fragment generation
Each fragment follows this 4-part format (no Location/Background sections in short form):

```
Frag (number)
Camera: neutral, era-free description of shot movement or framing.
Visuals: what moves or changes in the frame (characters, props, light).
Action: what characters do and say (≤ 10 words each).
Audio: ambient and diegetic sounds only (no music or narration).
```

**Extended fragment form (full output, Step 9):**

```
Frag (number):
Location/Time: <250 chars
Background: <1250 chars
Camera: <450 chars
Visuals: <1650 chars
Action: <2250 chars
Audio: <250 chars
```

All texts in fragments are **STRICTLY IN ENGLISH**. Only dialogue can be in other languages.

### Step 7 — Continuity & realism
- Whenever an ingredient is mentioned in a fragment, **always append `(DOWNLOADED INGREDIENT)`**.
- Lighting, attire, props, and object states remain constant until visibly changed.
- **No off-screen appearances or disappearances.**
- Realistic physics: gravity, occlusion, reflection, friction, balance.
- If the main object is **unchangeable**, it stays consistent in state and importance.
- If it **can change**, the transformation must appear on-screen clearly.

### Step 8 — Dialogue & sound
- **Dialogue/VO appears ONLY in Action.**
- In each fragment, every character — including the Narrator (its own Character-ID; off-screen; fixed voice traits) — may speak **once only**, **one utterance ≤ 10 words**.
- **Do NOT separate the Character-ID and what they say** — Character-ID and quoted words must appear together on the same line.
- Non-lexical vocalizations (laugh, gasp, hmm) count as the one utterance if written.
- **Overlapping dialogue is not permitted** on the page; stagger lines.
- Only attribute audio-only cues when the source is unambiguous (named call-out or a distinctive previously established sound).

**Language lock:** the spoken language is chosen at scenario approval and must remain constant across all fragments unless a new scenario approval explicitly changes it. Accents are part of the Character-ID and **must not drift**.

**Accent rendering:** write clean standard English. Indicate accent only in the Character-ID; **do not phonetically misspell words to mimic accent.**

**Audio purity:** only real, in-scene sounds — footsteps, wind, dialogue, mechanical noise, etc. **Diegetic music** is allowed (e.g., a radio inside a truck). **Non-diegetic score and narration are forbidden.**

### Step 9 — Output flow summary
1. Identify main object under focus → confirm changeability.
2. User provides image.
3. Ask for dialogue language (rest is in English).
4. Ask for storyline option.
5. (If yes) Generate and approve storyline.
6. Propose fragment count.
7. Also propose exact fragment(s) where any added image/object/ingredient appears.
8. User chooses accept / more / fewer.
9. Generate cinematic fragments in chosen language using extended fragment form.

After each fragment, append this exact line (outside the six headings):

> Perform a Final realism check: contact/occlusion, gravity/parallax, fluid & friction behavior, wet/dry continuity, prop provenance/persistence, product-ban compliance. If any error is found, revise until corrected; only then lock the fragment.

---

## 3. CHARACTER-ID SYSTEM (critical — applies wherever a character appears)

On every appearance of a character, embed a **Character-ID** (appears in **ONLY Action**): a concise, fixed string that locks **≥ 10 immutable traits** in this **fixed field order**:

1. **Name**
2. **Age-band**
3. **Build / height**
4. **Hair color + style**
5. **Eye color**
6. **Ethnicity**
7. **Nation**
8. **Skin tone**
9. **Face shape**, one signature feature (all immutable)
10. **Headline outfit** (mutable only if on-screen action shows the change)
11. **Voice timbre**
12. **Accent**

**Trait vocabulary suggestions:**
- Eye shapes: round / almond / hooded
- Face keys: oval / heart / square
- Hair: pixie / bob / waves / curls / coil / bun / ponytail
- Outfit notes: wool / linen / leather / canvas
- Colors: standard color words + `dk` / `lt`

**Examples (verbatim from source protocol):**

> Donna Maria — 72 years; 158 cm slight build; warm olive skin; oval face; deep smile lines; arched brows; hazel-green eyes; silver hair in low bun; small gold hoop earrings; faded floral dress; dark shawl; worn leather shoes; very soft alto; Italian accent.

> Dr. Lin Rivera — 37y; med build; chestnut ponytail; dark-brown eyes; silver frames; white lab coat; soft alto; Italian accent.

**Rules:**
- **No ellipses, shortcuts, or "ID unchanged"** inside the Character-ID string. Always write it out fully.
- **Character Lock:** visually lock the character so the audience recognizes them instantly across fragments.
- **Repeat the Character-ID verbatim** on every perceptible appearance — including hands-only, silhouette, voice-over.
- Update only after an on-screen change is shown.

**Correct dialogue format example:**

> Action: Dr. Lin Rivera — 37y; med build; chestnut ponytail; dark-brown eyes; silver frames; white lab coat; soft alto; Italian accent — says, "We recruit microbes…"

---

## 4. PERMANENT POLICY LOCK

- All outputs must remain safe, realistic, and compliant.
- All motion, dialogue, and behavior obey real-world physics and emotional plausibility.

---

## 5. WHAT THIS PROTOCOL ADDS BEYOND CURRENT ANIMATOR DESIGN

Items in MOVIEMAKER protocol that are **NOT** yet in `physics-rules.md` or `control-blocks.md`:

| Item | Where it should live if adopted |
|---|---|
| **Ingredient vocabulary** (`(DOWNLOADED INGREDIENT)` tag) | `incoming-flows.md` — naming convention for reference images |
| **Character-ID immutable trait string** (≥10 fields, fixed order) | `physics-rules.md` §1 (universal — even single-clip wins from explicit trait string) |
| **Main Object Under Focus question + changeability flag** | `SKILL.md` router — pre-flight question for multi-product scenes |
| **Storyline drafting step** | MOVIEMAKER mode only — does not apply to single-clip mode |
| **Recommended_Fragments count (1/3/5/7)** | MOVIEMAKER mode only |
| **Ingredient scheduling per fragment** | MOVIEMAKER mode only |
| **Extended fragment format** (Location/Time, Background, Camera, Visuals, Action, Audio with char limits) | MOVIEMAKER mode only — animator single-clip uses control-blocks structure instead |
| **Final realism check line after each fragment** | `control-blocks.md` — applicable to single-clip post-flight too |
| **Diegetic vs non-diegetic audio distinction** | `control-blocks.md` §2 — refine current audio block |
| **Accent rendering rule** (no phonetic misspelling) | `control-blocks.md` §2 — add to audio block |
| **Dialogue ≤ 10 words per character per fragment** | MOVIEMAKER mode + control-blocks single-clip when speech is enabled |
| **Narrator as separate Character-ID** (off-screen) | MOVIEMAKER mode only |
| **No overlapping dialogue / stagger lines** | Both modes |
| **Camera motion language vocabulary** (high-crane boom, floor-level track, shoulder follow, bird-swoop POV) | MOVIEMAKER mode only — animator default is locked static |

---

## 6. ACTIVATION DECISION (pending Aram)

Two architectural options:

**Option A — MOVIEMAKER as MODE 2 inside `animator` skill.**
Router at top of `SKILL.md` picks mode based on input:
- 1 image + short intent + INCOMING from bannerizer/productcardmaker → **MODE 1** (single-clip, current design)
- Multiple ingredients + storyline intent + explicit fragment count → **MODE 2** (cinematic)
Shared reference files (physics-rules, control-blocks) load for both; this file gates MODE 2 logic.

**Option B — `moviemaker` as sibling skill.**
`animator` stays single-clip. `moviemaker` is a sibling skill with its own SKILL.md, sharing `physics-rules.md` and `control-blocks.md` via cross-skill reference. Inter-skill gate `[[GATE: moviemaker]]` available from sales-hunter, das-presenter, ugc-master for storyline-driven outputs.

Decision affects `SKILL.md` structure, router complexity, and trigger word allocation between two namespaces.
