# Motionizer Skill — Prompt Control Blocks

**Version:** 1.1

**Changelog**
- **v1.1** — added Scene ID Lock (§1.7, location continuity), Aud / Muz audio split (§2.4–§2.5 with diegetic vs non-diegetic distinction), Final Realism Check post-flight rule (§7), updated Prompt Assembly Order (§4) to include Scene ID.
- **v1.0** — initial named-block taxonomy (Hero / Character / Identity / Motion / Geometry / Material / Negative).
**Origin:** Block taxonomy adapted from a Veo 3 prompt-engineering protocol, generalized and de-Veo'd for the production backends motionizer actually targets — **Higgsfield engines** (Seedance 2.0, Kling 3.0, Nano Banana 2/Pro) and **Atlas** (candidate, to be evaluated in `backend-router.md`). **Veo 3 is NOT a target backend.** Named blocks are kept because they impose useful discipline on the model regardless of engine — they read as plain instructions to Higgsfield/Atlas.
**Status:** MANDATORY. Motionizer must assemble the final prompt from these named blocks. Physics and identity rules from `physics-rules.md` are injected **inside** the relevant blocks below, not appended as a free-text tail.
**Relationship to physics-rules.md:** physics-rules.md = ground truth about reality (anatomy, materials, kinematics). control-blocks.md = container structure that delivers that truth to the model. Both load together.
**Ownership:** Property of `motionizer` skill. Self-contained. No cross-skill dependency.

---

## 0. CORE PRINCIPLES (apply to every prompt motionizer builds)

### 0.1 Reference Image is Truth
The reference image is the **primary source of truth**. Preserve the original appearance of all characters and objects unless a change is explicitly requested by the user.

### 0.2 Determinism Over Creativity
All prompts prioritize **control, determinism, and visual fidelity** over creativity. If a change is not explicitly specified, it **must not occur**.

### 0.3 Visibility ≠ Importance
Importance — not visibility — determines which blocks are applied. A background watch on a hand may be unimportant; a brand-logo bottle in the same frame may be hero. The user's intent decides, not pixel area.

### 0.4 Camera Policy — STATIC BY DEFAULT, motion allowed when scenario justifies

Motionizer continues a composed brand asset from `bannerizer` / `productcardmaker` / `imager`. The default is **locked-static** — most scenarios are served by zero camera movement because the source frame already has intentional composition and product placement.

**Default (used unless scenario overrides):**
- **Zero** movement, **zero** drift, **zero** shake, **zero** zoom, **zero** reframing.
- The frame remains **identical to the reference image at all times**.

**Allowed motion when scenario calls for it (motionizer-permitted set):**
- `slow-zoom-in` / `slow-zoom-out` — linear, no rotation, no pan.
- `slow-rotate-around-character` — orbit a speaking character / talking head shot. Smooth circular path, constant radius, constant height.
- `parallax-micro-drift` — sub-2% imperceptible drift to dodge frozen-photo look.

**Forbidden inside motionizer (kicked to `animator` via `[[GATE: animator]]`):**
- Hard cuts / cut-sequence.
- Handheld shake.
- Aggressive pan or tilt.
- Whip-zoom, snap-zoom, dolly-zoom.
- Any camera move that does not preserve the composed asset's design intent.

**Subject motion** (paste extrudes, brush head rotates, label glints, character micro-breathes, character speaks with Duchenne smile) is allowed independently of camera policy — covered by `physics-rules.md`.

**HARD RULE for ANY camera motion:** see §0.6 Text-Protection. If text is present on screen and camera will move, text **must fade out before the move would crop it**. No text crops, ever, under any policy.

### 0.5 No Inferred Action
Only explicitly defined intentional actions are permitted. **No inferred gestures, movements, or interactions.** If the user didn't say it, it doesn't happen.

### 0.6 Text-Protection Rule (HARD RULE — overrides any camera policy)

**No text crop. Ever. Under any scenario, any camera policy, any backend.**

Applies to **every** text element on screen, whatever its origin:
- Overlay added by motionizer (text-overlay block).
- Baked-into-reference-image text (brand wordmark, label copy, packaging ingredients, dieline text).
- Part of the scene (sign, document, screen UI, sticker).

**Behavior under camera motion (zoom, rotate-around-character, parallax-drift, or any future policy):**
1. **Option A — text stays fully whole.** Camera motion is **clamped** to stop before any text element would touch any edge of the frame. If the clamp distance is uncomfortable for the shot, switch to Option B.
2. **Option B — text fades out cleanly BEFORE the camera move would clip it.** Fade-out completes at least 4 frames (~0.13 s at 30 fps) before the first frame in which the text would lose readability or touch an edge.
3. **Option C — text re-appears AFTER the camera settles** at the new framing, only if it fits the new composition fully. Otherwise it stays gone.

**Never:**
- Slice a letter at any edge.
- Push past a brand wordmark and let it disappear off-frame mid-shot.
- Let a logo become partially cropped during a zoom-in.
- Pan past a label and only catch half of it.

**Legibility floor:** minimum 24 px text height on a 1080×1920 vertical canvas (proportional on 1920×1080 horizontal or 1080×1080 square). If a zoom would reduce text below this threshold OR partially clip it, the zoom **stops at the safe distance** or the text **fades per Option B**.

**Brand wordmarks** (Das Experten, SCHWARZ, INNOWEISS, DETOX, SYMBIOS, etc.) on packaging or product surfaces are treated as protected text. Same rules apply.

This rule **overrides** scenario camera policy. If a scenario asks for a zoom that would crop brand text, the engine **must** insert the fade or **must** clamp the zoom. There is no third option.

---

## 1. NAMED CONTROL BLOCKS

The motionizer must explicitly invoke these blocks **by name** in the final prompt. Naming the blocks imposes structural discipline on the model and dramatically reduces drift across Higgsfield engines and Atlas alike.

### 1.1 Hero Object Definition (non-character objects only)
Define key items as hero objects.
- Lock **identity, geometry, shape, scale, size, color, texture, material, details**.
- **No redesign. No enhancement.**
- Motion is allowed unless explicitly forbidden by the user, provided identity, geometry, and materials remain unchanged.
- If nothing else is mentioned, the hero performs **biological / involuntary / physiological micro-movements only** (subtle reflective shimmer if reflective, gentle settling if liquid, etc. — within reality).

### 1.2 Character Definition
Define all human figures as characters.
- Lock character **identity and appearance** to the reference image.
- Lock **body proportions, height, build, posture baseline, clothing, accessories**.
- **No** body reshaping or proportion changes.
- **No** clothing redesign, deformation, or physics simulation (unless explicitly requested — e.g., a scene that requires fabric flow).
- Body motion allowed **only if explicitly specified and constrained**.
- **No inferred gestures or movements.**

### 1.3 Immutable Facial Identity Protocols
Lock facial identity to the reference image.
- **No identity drift.**
- **No facial deformation.**
- **No change** to facial geometry, proportions, bone structure, silhouette.
- Only explicitly defined intentional actions permitted.

**Allowed emotional expression** (via micro-movements, without facial deformation):
- Subtle mouth curvature changes.
- Limited lip-corner movement.
- Slight cheek tension.
- Minimal muscle activation required for emotion.
- Lip movement for speech.
- Breath-driven mouth opening.
- Subtle cheek and lip-corner activation.
- Natural laughter articulation.

Emotion is conveyed through **voice, body motion, and context** — not facial reshaping.

**Disallowed:**
- Facial reshaping.
- Exaggerated expressions.
- Jaw stretching or compression.
- Eye enlargement or squint exaggeration.
- Eyebrow deformation beyond slight positional shift.
- Any change to facial proportions or structure.

Facial emotion must remain **photorealistic and restrained**, as if the same face is expressing emotion without changing shape.

> **Cross-reference:** §1.2 of `physics-rules.md` (pixel-identity preservation) overrides any conflict.

### 1.4 Motion Constraint
Motion is allowed unless explicitly restricted by the user. Any motion must remain physically plausible and must not alter identity, geometry, proportions, or materials. **Motion may not introduce deformation, morphing, or redesign.**

Sub-locks (apply by default unless user overrides):

- **Pose Lock** — baseline posture preserved; localized limb motion allowed when interacting with hero objects.
- **Action Lock** — no intentional actions, gestures, or pose transitions are permitted unless explicitly described.
- **Facial Lock** — facial identity and structure remain unchanged; no expressive change beyond §1.3 allowances.
- **Silhouette Lock** — body outline and proportions remain constant; no deformation or drift.

**Allowed Motion (Micro-Only, default):**
- Subtle breathing-related chest and shoulder rise/fall.
- Minimal involuntary muscle stabilization.
- Imperceptible hand/finger tension shifts with zero positional change.

**Motion Quality (always):**
All permitted motion must be **sub-perceptual, continuous, and biologically natural**, maintaining the appearance of visual stillness without frozen rigidity.

**Explicit user action override:**
If an action or motion is explicitly described by the user, it is allowed within realistic anatomical and physical limits. **No additional actions may be inferred or added** beyond what the user described.

### 1.5 Object Geometry Lock
- **No scaling.**
- **No resizing.**
- **No warping, bending, stretching, or deformation.**
- **Silhouette remains constant.**

> Product-specific exceptions (e.g., toothpaste tube squeeze, toothbrush bristle deflection) live in `physics-rules.md` §2–§4 and are injected only when the matching product is present.

### 1.6 Surface & Material Lock
- **No recoloring.**
- **No texture regeneration.**
- **No material or finish change.**
- **No gloss, roughness, or lighting-based alteration.**

### 1.7 Scene ID Lock (location continuity)

The first time a location appears, declare a concise **Scene ID** string that locks the **fixed set dressing, lighting, and time-of-day** of that space.

> Bathroom — soft tile reverb, white porcelain sink, frosted-glass window, cool morning daylight, towel-warmer rail.

When the next shot (or fragment, or loop continuation) takes place in **that exact same location at the same time-of-day**, the Scene ID string is repeated **verbatim** at the start of the scene anchor.

**Revision rule:** the Scene ID is updated **only when something visibly changes on screen** (fire dies, furniture moved, window shattered, daylight shifts to dusk). From that frame on, the new version repeats verbatim.

**Why it matters:** without an explicit Scene ID, the model regenerates ambient details slightly differently each shot — wall color drifts, sink moves, lighting warms or cools. Scene ID locks the set so multi-shot or looped output looks like one continuous environment.

### 1.8 Negative Prompt
The final prompt must end with a Negative Prompt block containing at minimum:
- No identity drift.
- No body proportion changes.
- No clothing deformation or redesign (unless flow explicitly requested).
- No object morphing or resizing.
- No added or removed details.
- No new objects, products, props, accessories, or background elements not present in reference.
- No camera movement, pan, tilt, zoom, drift, or shake.
- No watermark, logo, or text overlay (unless the reference already contains brand text — then preserve verbatim).
- No exaggerated facial expressions, jaw stretching, eye enlargement, eyebrow deformation.
- No lip-sync drift or speech with occupied mouth.

Motionizer may append product-specific negatives (e.g., **no bristle fan-out without contact**, **no foam without brushing motion**) when products are detected.

---

## 2. SOUND & AUDIO REASONING

Audio behavior follows user intent. Narration, voice-over, and sound effects are allowed regardless of character visibility.

### 2.1 Ambient Sound (always inferred from image)
Determine the ambient environmental sound context implied by the reference image:
- Indoor bathroom — soft tile reverb, faint water trickle if sink visible.
- Studio / seamless backdrop — dead-room silence.
- Outdoor / street — light traffic, ambient air.
- Kitchen / living room — subtle household texture.
- Nature — wind, leaves, birds proportional to scene.

**Do not invent sound effects beyond what is visually plausible.**

### 2.2 Character Audio (requires user clarification when ambiguous)
If the brief involves a character but does not specify audio behavior, ask **one inline question** in plain text (no picker UI):

> Does she speak in the clip, or is it silent / non-verbal? If speech — give me the exact line, accent, and tone (calm / warm / energetic / etc.).

**Options that resolve the question:**
- **Speaks** — user provides exact dialogue text, accent, tone (neutral / calm / emotional / aggressive).
- **Non-verbal** — silence / smile / laugh / cry / awe / other (must be specified). Emotional expressions still obey §1.3 Immutable Facial Identity Protocols — no facial deformation or exaggeration.

### 2.3 Mouth-Occupied Silence Override
When `physics-rules.md` §1.5 fires (mouth occupied by brush, foam, paste), audio output is **forced to silence** regardless of any speech instruction. The user is notified in the motionizer step log if their request conflicted.

### 2.4 Aud vs Muz Separation (audio channels are distinct)

Audio output is structured as **two distinct channels** that must never be conflated:

- **Aud** — **ambient + diegetic sound only.** Real, in-scene sounds the camera/microphone would capture in that space: footsteps, wind, doors, water, brush stroke, paste squeeze, breath, fabric, mechanical noise.
- **Muz** — **music.** Score, beat, instrumental texture, vocal track. **Specified separately** with its own descriptor line, ≤ 200 characters per cue.

**Example:**
> Aud: faint sink water trickle, soft tile reverb, brush-bristle scrape on enamel.
> Muz: warm acoustic guitar with low piano pad, calm morning mood.

If a fragment continues with the exact same music from the previous segment, mark it as `Muz: Previous`.

### 2.5 Diegetic vs Non-Diegetic Rule (motionizer scope)

- **Diegetic** sound = exists inside the scene's world (a radio playing on the bathroom shelf, a phone ringing on the table, footsteps in the corridor).
- **Non-diegetic** sound = added in post for the viewer's benefit, with no in-scene source (background score, narration laid over the cut, sound-design whoosh between scenes).

**Motionizer policy:**
- **Diegetic sound and diegetic music are allowed** (Aud and Muz channels) — they must have a visually plausible source in the scene.
- **Non-diegetic music is allowed** for brand-hero outputs (banners, hero cards) where mood music is industry-standard. Mark clearly in the Muz line as `Muz: non-diegetic — [descriptor]`.
- **Non-diegetic narration is allowed** (voice-over by a Narrator / VO Character ID per `physics-rules.md` §1.9c) but must be specified explicitly; never auto-generated.

---

## 3. UNCERTAINTY HANDLING

If user intent is ambiguous in a way that affects structure or block selection, **do not assume**.

- Ask **one concise inline question** in plain text.
- Offer 2–3 concrete framings inside the question (not a multiple-choice picker, not a button widget — just plain prose).
- Do not ask open-ended questions.
- Do not ask multiple questions at once.

**Typical clarification triggers and the framing motionizer uses:**

| Trigger | Inline question to user |
|---|---|
| Multiple people in image | Are all of them characters, or is one the hero and the others background atmosphere? |
| Multiple products visible | Which is the hero — the brush, the tube, both, or is everything background? |
| No specified action | What should she do — micro-only stillness, brush her teeth, dispense paste, hold up the product, or something else? |
| Audio unclear | Speech or silent / non-verbal? If speech: give me the line, accent, tone. |
| Camera override | Camera locked static (default), or do you want a specific motion (push-in, orbit, etc.)? |
| Duration unclear | How long — 3s, 5s, 8s, or longer? Affects backend choice. |

---

## 4. PROMPT ASSEMBLY ORDER

Motionizer builds the final prompt by stacking blocks in this exact order. The engine reads top-to-bottom; earlier blocks have higher priority.

1. **Scene anchor** (one line: who, where, what visible — from reference image).
2. **Scene ID Lock** — verbatim string locking location, set dressing, lighting, time-of-day (per §1.7).
3. **Character ID** (one per character per `physics-rules.md` §1.9 — full form or Core abbreviated). Anchors the semantic trait set.
4. **Hero Object Definition** — every locked product (with `physics-rules.md` §2/§3/§4 injection for matching SKU class).
5. **Character Definition** — every locked human (with `physics-rules.md` §1.4 anatomical canon).
6. **Immutable Facial Identity Protocols** — with `physics-rules.md` §1.2 pixel-identity as override-priority statement.
7. **Motion Constraint** — Pose / Action / Facial / Silhouette Locks. Insert the explicit user action here (one sentence) if any. Inject `physics-rules.md` §2.8 / §3.9 / §4.3 brushing/squeeze/floss kinematics if matching product is in scene.
8. **Object Geometry Lock + Surface & Material Lock** — combined block.
9. **Audio block** — Aud (ambient/diegetic) + Muz (music, separate line) + character audio per §2.
10. **Camera block** — per scenario's camera policy (motionizer-permitted set per §0.4).
11. **Negative Prompt** — universal list + product-specific negatives.

---

## 5. OUTPUT REQUIREMENT (MANDATORY)

The motionizer's final dispatched prompt to the backend must be:
- A **single, self-contained prompt** containing all required blocks by name.
- **No explanations, no commentary, no preamble** in the dispatched string itself.
- If the scene change is not explicitly specified, **it must not occur**.
- **Accuracy and consistency override creativity.**

Motionizer's chat-side output to the user is separate: it shows (a) the dispatched prompt, (b) which `physics-rules.md` sections were injected, (c) backend engine chosen, (d) link to the resulting MP4 once rendered, (e) optional virality-master score if chain enabled.

---

## 6. FINAL REALISM CHECK (post-flight, mandatory)

After the prompt is built and before dispatching to the backend, motionizer runs a **Final Realism Check** against this checklist. The check is logged in the chat-side output. If any item fails, the prompt is **revised until corrected**; only then dispatch proceeds.

> **Final Realism Check:** contact / occlusion; gravity / parallax; fluid & friction behavior; wet / dry continuity; prop provenance / persistence; product-ban compliance; pixel-identity preservation (§1.2 of `physics-rules.md`); text-protection (§0.6); mouth-occupied silence (§1.5 of `physics-rules.md`); Scene ID and Character ID consistency (§1.7 here, §1.9 of `physics-rules.md`); negative prompt completeness.

The exact log line appended to the dispatched prompt's metadata trail:

> Final Realism Check: contact/occlusion ✓, gravity/parallax ✓, fluid & friction ✓, wet/dry continuity ✓, prop provenance ✓, pixel-identity ✓, text-protection ✓, mouth-silence ✓, Scene ID ✓, Character ID ✓, negative prompt ✓.

If any item is ✗, motionizer states which and what was changed before re-running the check.

---

## 7. ENGINE-SPECIFIC NOTES

| Engine | Block recognition | Pixel-identity | Lip-sync | Max duration | Audio |
|---|---|---|---|---|---|
| **Higgsfield Seedance 2.0** | Plain instruction — names treated as guidance | Medium-High | Medium | ~5s typical | No native — post-add |
| **Higgsfield Kling 3.0** | Plain instruction | High | High | ~10s | Yes |
| **Higgsfield Nano Banana 2 / Pro** | Reference-locked, very strong identity | Highest | N/A (image edit / short loop) | 1–3s | No |
| **Atlas** | TBD — verify in `backend-router.md` | TBD | TBD | TBD | TBD |
| ~~Veo 3~~ | **Disabled — not a target backend.** | — | — | — | — |

Backend selection lives in `backend-router.md` (built in next round).
