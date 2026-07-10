# Animator Skill — Shortform / TikTok Protocol (PRIMARY SOURCE)

**Version:** 1.1
**Status:** ACTIVE — **primary design source for the `animator` skill** (TikTok / Reels / Shorts / UGC dynamic-camera video).

**Architecture (locked per Aram 2026-05-24):**
- **`motionizer`** — sibling skill. Brand-hero continuation of bannerizer / productcardmaker / imager. **Locked-static camera only**. Product visible. Brand-strict physics.
- **`animator`** (this folder) — dynamic camera, multi-cut, hook archetypes, UGC pain-point logic. Product can be visible, implied, or absent depending on scenario.
- **`video-master`** — orchestrator above both. Asks deep clarifying questions (platform, goal, audience, length, with/without product, with/without dialogue, with/without actor) and routes to motionizer or animator.

**File ownership:** Each skill owns its own `physics-rules.md` and `control-blocks.md` — **no cross-skill dependency**. Animator's `control-blocks.md` differs from motionizer's only in §0.4 Camera Policy (animator is dynamic-by-default, motionizer is static-by-default with limited motion). Physics-rules content is identical between the two.

---

## 1. SCENARIO FLOW

**Pitch first, then build.** Always present **3 scenario variants with different hooks** for the user to choose from. Show story logic, development, and dialogues. **Only after explicit approval**, transform the chosen storyline into a fragment chain.

**Length constraint:** each fragment ≤ 8 seconds. **1–2 fragments**, not more.

**KISS rule:** every fragment understandable on its own by a first-time 13–15-year-old viewer. No jargon, no leaps. Context comes only through narration/dialogue.

---

## 2. HOOK (0–2 seconds)

- Must open with **motion, surprise, or curiosity**.
- **No greetings** (no Hey guys).
- First frame must show **action**, not explanation.
- Always include a **text overlay (TO) ≤ 7 words**.
- If dialogue: keep it punchy (≤ 5–6 words).

### 2.1 Approved high-converting opener archetypes

| Category | Examples |
|---|---|
| Negative / Pain-Driven | Never do THIS… · Stop doing THIS wrong… · Do not make THIS error… |
| List & Superlatives | Top 3 hacks… · The #1 reason why… · X most surprising facts… |
| Shock / Pattern-Break | You won't believe this… · I wish I knew this earlier… · Everyone lies about THIS… |
| Relatable Pain-Point | Tired of wasting money on X? · If you struggle with THIS… · The hardest part about X is… |
| Secret / Insider | Nobody talks about THIS… · The hidden trick behind X… · This is what pros actually use… |
| Contrarian / Challenge | Forget everything you know about X… · You've been doing THIS wrong… · This works better than X… |
| Identity / Self-Targeting | If you're an X, watch this… · This is for people who… · Only true X know this… |

---

## 3. STRUCTURE & RHYTHM

- Linear flow: **Hook → Setup → Payoff → Loop**.
- Total length 8–20 s unless story requires more.
- **Resolve the promise at 85–95% of runtime.**
- Cut every **0.4–0.9 s**.
- Insert a **pattern interrupt ~70%** of the way through (angle change, prop, hand motion).
- Add a **loop** by flashing back to opening frame in ≤ 1 s.

---

## 4. ~~NO-TEXT RULE~~ — REMOVED

Per Aram (2026-05-24): the **NO-TEXT** rule was a workaround for early-era VEO text hallucinations (garbled letters, fake words, scrambled signage). **Modern backends render text reliably.** Text **may freely appear, animate, or disappear** in the frame as needed. **Do not enforce the no-text ban anywhere.**

What is still kept (lives in `control-blocks.md` §0.6 **Text-Protection Rule**): **if text is on screen, do not crop it with zoom or reframe** — that is a composition rule, not a generation ban. Text and its visibility timing are now fully under the prompt's control.

The **`TO:` (Text Overlay)** prefix syntax from the shortform protocol is **optional convention** for overlay vs in-scene text, not a mandatory format.

---

## 5. CHARACTER ID CORE (abbreviated form — for shortform / compact prompts)

On a character's **first appearance**, embed a **Character ID Core**: a concise, fixed string that locks **≥ 6 immutable traits**:

1. **Age-band**
2. **Build / height**
3. **Hair color + style**
4. **Eye color**
5. **One signature feature**
6. **Headline outfit**
7. **Voice**

Repeat the exact string, **character-for-character**, whenever that character is perceptible in any form (on-camera body, VO, silhouette, hands-only, footsteps, off-screen shout).

Update the ID **only** when an on-screen change alters one of its locked elements (coat torn, face bruised); from that moment, repeat the new string verbatim.

**Trait selection rules:**
- Choose features consistent with tone and context (glasses, jewelry, hat style, hairstyle, clothing details).
- **No scars, tooth gaps, injuries, or other body features** unless clearly necessary for story logic.

### 5.1 Abbreviation set (allowed)

| Abbreviation | Meaning |
|---|---|
| `y` | years |
| `cm` | centimeters |
| `sm` / `med` / `lg` | build |
| `dk` / `lt` | dark / light |
| `L` / `R` | left / right |
| `L-part` / `center-part` | hair parting |
| `stubble` | facial hair |
| `VO` | voice |
| Voice descriptors | `v-soft`, `soft`, `warm`, `raspy`, `gravelly`, `bright`, `airy` |
| Accents (`ac`) | British, US, Indian, German, Aus, Mexican, French, Russian, Arabic, Turkish, Persian, Slavonic |

### 5.2 Example

> Donna Maria — 72y; 158 cm slight build; warm olive skin; oval face, deep smile lines; arched brows; hazel-green eyes; silver hair in low bun; small gold hoop earrings; faded floral dress; dark shawl; worn leather shoes; v-soft alto, Italian ac.

**Narrator becomes `VO:` (not Narrator:)** in shortform context.

---

## 6. SCENE ID (location continuity)

The first time a location appears, create a concise **Scene ID** string that locks the **fixed set dressing and lighting** of that space.

> Study — embers glowing, mahogany desk, velvet box, mullioned window.

Whenever the next fragment takes place in that **exact same location at the same time-of-day**, start the **Vis** line with that identical Scene ID string, **verbatim**.

Only revise the Scene ID if something visibly changes on screen (fire dies, furniture moved, window shattered); then repeat the new version going forward.

---

## 7. VOICE, DIALOG, AUDIO, MUSIC

### 7.1 ~~Voiceover word limit (≤12 words)~~ — REMOVED
Per Aram (2026-05-24): the **≤12 words per sentence** cap was a workaround for early-era VEO lip-sync degradation on longer utterances. **Modern backends handle full-length sentences cleanly.** Voiceover length is now driven by clip duration and narrative need, not a hard word cap.
What stays universal:
- Dialogue still appears in the **Act** line of any fragment using the shortform format.
- Tone direction (confident / calm / playful / urgent) is still specified per scenario.
- Avoid filler (um, like, you know) unless explicitly a character trait.

### 7.2 ~~Dialog one-utterance-per-fragment + ≤20 words~~ — REMOVED
Per Aram (2026-05-24): the **one utterance ≤20 words per character per fragment** rule was an early-VEO constraint. **Modern backends generate multi-line dialogue and back-and-forth within a single clip.** Characters may speak as much as the scene needs, dialogue may include replies and overlapping is acceptable when justified.

**Example (now valid in modern pipeline):**
> Reporter — 28y; med build; brown bob; lt-blue eyes; press badge; navy blazer; bright soprano, US ac — asks, "Why did you build your own toothpaste line instead of licensing an existing brand?"
> Doctor — 45y; med build; salt-pepper L-part; dk-brown eyes; silver frames; white coat; soft baritone, US ac — replies, "Because every off-the-shelf paste relies on abrasives. We wanted enamel-safe whitening that actually works long-term — that meant enzymes, not silica."

### 7.3 Audio (Aud)
- Aud line contains **only ambient sounds** (steps, doors, wind, etc.).
- **Do not include music cues inside the Aud line.**

### 7.4 Music (Muz)
- Each music prompt ≤ 200 chars.
- Example: `Muz: Upbeat trap beat with tight hi-hats and booming bass; adds energy and urgency.`
- Example: `Muz: Suspenseful strings with rising tension.`
- If a fragment continues with the exact same music from the previous, mark it as `Muz: Previous`.

---

## 8. STORY DEVICES

- Use **open loops** (Only one hack worked…) and close them at payoff.
- Escalate stakes mid-way.
- End with a **loop-friendly moment** (return to start).

---

## 9. PRODUCT VISIBILITY RULE (mode-specific — UGC orientation)

**Do not show the product directly.** Focus only on:
- **Pain points** — the struggle or problem.
- **Results** — transformation.
- **Before & After contrasts.**

Props/scenes must **imply** the product without explicit reveal. Payoff comes from viewer imagining the solution, not staring at the item.

**Strict ban (oral-care context):** Do not depict toothbrushes, toothpastes, or dental flosses in any form (direct or implied).

**Exception:** If a fragment absolutely requires product visibility, add a line at the end with the prefix **`TO:`** in ALL CAPS.

> ⚠ **Direct conflict with current animator MODE A** (brand-strict, product-hero from bannerizer/productcardmaker). This rule applies ONLY in UGC/TikTok shortform mode — never override into brand-hero pipelines.

---

## 10. ~~VERTICAL CAMERA RULE~~ — REMOVED

Per Aram (2026-05-24): the **Roll the camera +90° (clockwise) → vertical portrait** workaround is **OBSOLETE** and **removed** from this skill entirely. Modern backends (Higgsfield Seedance 2.0, Kling 3.0, Nano Banana, Atlas) generate vertical 9:16 natively from the prompt's aspect-ratio parameter. No roll, no rotation trick, no central-60% framing instruction. **Do not inject this phrase anywhere.**

---

## 11. FRAGMENT FORMAT (shortform — 6 fixed lines)

```
Frag: X
Cmr: ~50 chars — shot description per the scenario's camera policy (see control-blocks.md §0.4)
Vis: ~3000 chars — static frame content (framing, light, appearance, effect)
Act: ~4000 chars — movements + dialogue (what characters do/say)
Aud: ~250 chars — ambient only
TO: no limit (ALL CAPS) — only when on-screen text is required
```

**Headings are sacrosanct.** Dialogue and carry-forward tags live inside those lines, never as extra lines or fields. Each line contains concrete details only — no placeholders, no extra fields. Keep heading spelling and sequence exactly as shown; add nothing else.

---

## 12. EXTRACTION AUDIT — what merges into mainstream animator files next round

**Universal gold → `physics-rules.md` v1.3:**
- Character ID Core abbreviated form (§5) — already have full form in MOVIEMAKER; adopting the compact abbreviated set for brand-strict single-clip prompts where token budget matters.
- Scene ID (§6) — useful for any sequence reusing a location.
- ~~Vertical camera fixed phrase~~ — REMOVED per Aram (§10 archived as deprecated).

**Universal gold → `control-blocks.md` v1.1:**
- ~~NO-TEXT rule (§4) + TO: override syntax~~ — REMOVED per Aram (early-VEO hallucination workaround, no longer needed). The composition rule **Text-Protection** (no cropping by zoom/reframe) lives in `control-blocks.md` §0.6 and is **separate**.
- Audio (Aud) vs Music (Muz) separation (§7.3, §7.4) — refines current single audio block.
- ~~Voiceover ≤12 words / Dialog ≤20 one-utterance-per-fragment (§7.1, §7.2)~~ — REMOVED per Aram (early-VEO lip-sync constraint, no longer needed). Only **tone direction** and **no-filler** convention stay.

**Mode-specific → `SKILL.md` router decision (§13):**
- 3-scenario pitch workflow (§1).
- Hook archetype selector (§2.1) — useful as UGC briefing tool, not for brand-hero.
- Linear flow / cut rhythm / pattern interrupt (§3).
- Product-ban (§9) — **direct conflict with brand-hero MODE A**.

---

## 13. ARCHITECTURAL DECISION — LOCKED (per Aram 2026-05-24)

Resolved as a **3-skill split**, not a 2-mode router:

| Skill | Scope | Camera | Product | Source material |
|---|---|---|---|---|
| **motionizer** | Continuation of bannerizer / productcardmaker / imager. Brand-hero, static product moves. | Locked-static only | Always visible, hero | `physics-rules.md` + `control-blocks.md` (canonical) |
| **animator** (this skill) | TikTok / Reels / Shorts / UGC dynamic-camera. Hooks, multi-cut, pain-point, lifestyle. | Dynamic — micro-drift / push-in / cut-sequence / pan-tilt / handheld | Visible, implied, or absent per scenario | This file + `moviemaker-protocol.md` (historical) + cross-skill refs into motionizer |
| **video-master** | Orchestrator above both. Asks deep clarifying questions and routes. | N/A (router) | N/A (router) | TBD — own SKILL.md round |

`ugc-master` skill stays unchanged — it handles **blogger outreach and barter**, not video creation. No overlap with animator.
