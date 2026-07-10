---
name: motionizer
description: "Das Experten brand-hero image-to-video. Turns static brand asset (banner, product card, infographic, packaging) into short brand-strict motion clip. Trigger on: motionizer, оживи карточку, оживи баннер, motionize, motion banner, animate banner, animate card, brand video, product motion, видео из карточки, видео из баннера, brush motion, tube extrude, 360 product, parallax banner, infographic stat motion, talking head static, before after static. Also fires via [[GATE: motionizer]] from bannerizer, productcardmaker, imager, das-presenter, technolog after their static output. Camera STATIC by default; only slow-zoom, slow-rotate-around-character, parallax-micro-drift permitted. Aggressive camera (cuts, handheld, whip, pan-tilt) forbidden — hands off to sibling `animator`. Backend Higgsfield only (Seedance 2.0 default, Kling 3.0 for lip-sync + start+end keyframes). Fires immediately on trigger."
---

SOURCE OF TRUTH: deSIGNER/SKILLS/motionizer — edit here first.

## [[GATE — Das Experten Asset Catalog]] (HARD STOP before any image / video generation)

If the user request, parent-task body, or any input mentions a Das Experten SKU code (DExxx — DE101, DE201, DE206, DE209, etc.) or a product name (SCHWARZ, SYMBIOS, ETALON, GROSSE, ZERO, INNOWEISS, DETOX, THERMO 39, GINGER FORCE, NANO MASSAGE, KRAFT, AKTIV, BIO, COCOCANNABIS, MITTEL, SENSITIV, EVOLUTION, BUDDY, INTENSIV, INTERDENTAL, etc.):

1. Read `/root/das-experten-context/assets/product-references.md` **first**, before composing any prompt
2. Find the SKU's `element_id` in the Product Elements table
3. Pass `element_id` as **Higgsfield Reference Element** (Nano Banana 2/Pro, GPT Image 2, Seedream, Cinema Studio all support this — see CLI examples at the bottom of the catalog file)
4. For lifestyle / talent / model shots — also pick a Soul Character from the same file's Character Elements table and pass its `element_id` as a second reference

**NEVER invent a Das Experten tube, brush head, packaging, label, or logo.** No generic black tubes. No imagined geometry. No placeholder products.

If the SKU isn't in the catalog — STOP, post a `kanban_comment` on the current task explaining what's missing, and ask Aram. Do not generate a placeholder.


# Motionizer

Brand-hero image-to-video skill. Continuation of `bannerizer` / `productcardmaker` / `imager` / `das-presenter` / `technolog`. Turns a static brand asset into a short branded motion clip.

**Three principles motionizer never bends:**
1. **Pixel-identity preservation** (`references/physics-rules.md` §1.2). The character / product in the reference image stays pixel-identical. No drift, no redesign.
2. **Text protection** (`references/control-blocks.md` §0.6). No text crop ever. Camera motion clamps before any text touches a frame edge, or text fades cleanly first.
3. **Brand-hero scope.** Product is always visible. Motionizer never hides the product. UGC pain-point / product-banned scenarios live in `animator`.

---

## EXECUTION LOCK — MANDATORY STEP SEQUENCE

Follow Steps 1 → 7 in order. After each step, work the next. Never skip. Never pre-fill from memory. Always read from the actual reference files.

Reference files motionizer reads (all under `references/`):
- `physics-rules.md` v1.3 — anatomy, brush / tube / floss physics, pixel-identity, lip-sync, Duchenne smile, Character ID System.
- `control-blocks.md` v1.1 — named prompt blocks (Hero Object, Character, Identity, Motion, Geometry, Material, Scene ID, Negative Prompt), camera policy §0.4, text-protection §0.6, audio §2, prompt assembly order §4, final realism check §6.
- `scenarios.md` v1.0 — 15 named scenarios across 7 families with scenario picker algorithm §8.
- `incoming-flows.md` v1.0 — three ingress branches + parsed_brief canonical structure + text-protection pre-check.
- `backend-router.md` v1.0 — Higgsfield engine catalog + scenario → engine decision matrix + premium / budget overrides + per-engine dispatch deltas.

---

## STEP 1 — INGRESS DETECTION & PARSED BRIEF

Determine which of the three branches this request came from per `references/incoming-flows.md`:

- **Branch 1 — Inter-skill gate.** Invoked via `[[GATE: motionizer]]` from upstream skill. Payload arrives with `image_path`, `source_skill`, `sku_class` (when product-bearing), and optional enrichment fields.
- **Branch 2 — Standalone uploaded image.** User attached a `.jpg` / `.png` / `.webp` / `.heic` with a motion-intent trigger word in the message.
- **Branch 3 — Image URL.** User pasted an HTTPS image URL with motion intent. Fetch per `incoming-flows.md` §3, then proceed as Branch 2.

For Branches 2 and 3, run the enrichment pipeline per `incoming-flows.md` §2.2: OCR pass (brand wordmarks, label copy, overlay text), composition classifier (single product / single character / product + character / infographic / split layout), SKU detection with confidence threshold, brand-asset provenance check.

Build the canonical `parsed_brief` YAML structure per `incoming-flows.md` §0. Fill every field. If a required field cannot be inferred, ask **one inline question** (no picker UI, plain prose) per `control-blocks.md` §3 Uncertainty Handling.

**Ingress-level text-protection pre-check** (mandatory before Step 2):
If `detected_text.brand_wordmarks[]` OR `label_copy_present` OR `overlay_text_present` is non-empty AND `motion_intent` is anything other than `static`, set `text_protection_active: true`. This restricts the scenario picker in Step 2.

---

## STEP 2 — SCENARIO PICK

Run the scenario picker algorithm per `references/scenarios.md` §8:
1. Inspect incoming flow source.
2. Inspect image content (single product / character / product + character / infographic / split layout).
3. Apply text-protection restriction from Step 1 if `text_protection_active: true`.
4. Detect user intent keywords (карточка → §2 scenarios; баннер → §1; macro / 360 → §3; stat / инфографика → §4; brushing → §5; testimonial / talking head → §6; до/после → §7).
5. Detect motion intent (static / slow-zoom / slow-rotate / parallax-drift / unclear).
6. **If user asks for forbidden motion** (cuts / handheld / whip / aggressive pan / multi-shot sequence) — **DO NOT bend motionizer's rules**. Surface to user:
   > This scenario needs `animator` (dynamic camera, multi-cut, hooks). I can hand off via `[[GATE: animator]]` — want me to?
7. **Fallback** when intent ambiguous: pick the closest `-static` variant. Static is always safe.

Write `picked_scenario` back into `parsed_brief`.

---

## STEP 3 — RULE INJECTION & PROMPT ASSEMBLY

Assemble the final prompt per `references/control-blocks.md` §4 Prompt Assembly Order. Stack blocks top-to-bottom (engine reads earlier blocks with higher priority):

1. **Scene anchor** (one line: who, where, what visible — from `parsed_brief.image`).
2. **Scene ID Lock** — verbatim string per `control-blocks.md` §1.7. If `parsed_brief.scene_id` is null, auto-generate from visible set dressing + lighting; surface in dispatch log for user review.
3. **Character ID** (FULL or CORE form per `physics-rules.md` §1.9). Required for every character. If `parsed_brief.character_id` is null and a character is in scene + dialogue is requested, ask one inline question per `incoming-flows.md` §2.3.
4. **Hero Object Definition** (`control-blocks.md` §1.1). For every locked product, inject the matching SKU-class physics from `physics-rules.md` §2 (brush) / §3 (tube) / §4 (floss).
5. **Character Definition** (`control-blocks.md` §1.2). Inject `physics-rules.md` §1.4 anatomical canon.
6. **Immutable Facial Identity Protocols** (`control-blocks.md` §1.3) with `physics-rules.md` §1.2 pixel-identity statement as override priority.
7. **Motion Constraint** (`control-blocks.md` §1.4) — Pose / Action / Facial / Silhouette Locks. Insert the explicit user action here (one sentence). If product action is in scene, inject `physics-rules.md` §2.8 (brushing kinematics) / §3.9 (tube grip + squeeze) / §4.3 (flossing) as applicable.
8. **Object Geometry Lock + Surface & Material Lock** (`control-blocks.md` §1.5 + §1.6). Combined block.
9. **Audio block** — Aud (ambient / diegetic per `control-blocks.md` §2.4) + Muz (music separate line per §2.4) + character audio per §2.2. Apply `§2.3 Mouth-Occupied Silence Override` if brushing / foam / paste scene.
10. **Camera block** — apply the scenario's camera policy from `scenarios.md` row + `control-blocks.md` §0.4 motionizer-permitted set (locked-static / parallax-micro-drift / slow-zoom-in / slow-zoom-out / slow-rotate-around-character / slow-rotate-around-product).
11. **Negative Prompt** — universal list per `control-blocks.md` §1.8 + product-specific negatives (e.g., **no bristle fan-out without contact**, **no foam without brushing motion**, **no paste extrusion without squeeze**).

All injected sections must be **inside** the named blocks, not appended as a free-text tail.

---

## STEP 4 — BACKEND PICK

Read `references/backend-router.md` §2 to map `parsed_brief.picked_scenario` → primary engine + fallback.

**Default decision tree:**
- Most scenarios → `seedance_2_0`.
- Talking-head with lip-sync / start+end keyframe scenarios (`talking-head-static`, `talking-head-rotate`, `ozon-card-zoom-in`, `tube-rotate-360`, `infographic-reveal-zoom`) → `kling3_0`.
- **PREMIUM override** (user says премиум / cinema / для лендинга / hero showcase) → `cinema_studio_video_3_0`.
- **BUDGET override** (user says дёшево / черновик / draft / batch) → `seedance_1_5_pro` for single-take, `minimax_hailuo` for physics-priority no-audio.

Veo 3 / 3.1 / 3.1 Lite are **disabled** — never route to them.
Atlas is **not in current Higgsfield catalog** — never route to it until Aram confirms what it is.

---

## STEP 5 — DISPATCH

Construct the CLI command per `backend-router.md` §6:

```bash
higgsfield generate create <model_id> \
  --prompt "<assembled prompt from Step 3>" \
  --start-image "<parsed_brief.image.path>" \
  [--end-image "..."]   # only for 360-rotate / start+end scenarios on Kling 3.0
  [--audio "..."]        # only for speech scenarios on Seedance 2.0
  --aspect_ratio "<parsed_brief.image.aspect_ratio>" \
  --resolution "<720p or 1080p per scenario>" \
  --duration "<scenarios.md row duration>" \
  --wait
```

If `higgsfield account status` returns expired / not authenticated, surface to user: `higgsfield auth login` is required — please run interactively and confirm.

If primary engine fails or times out, fall back per `backend-router.md` §5. **Never fall back to a disabled engine.** Cost-aware: if user did not request BUDGET, surface cost difference before silently downgrading.

---

## STEP 6 — FINAL REALISM CHECK

Per `references/control-blocks.md` §6, run the post-flight checklist **before** announcing success:

> Final Realism Check: contact / occlusion ✓; gravity / parallax ✓; fluid & friction behavior ✓; wet / dry continuity ✓; prop provenance / persistence ✓; pixel-identity preservation ✓; text-protection ✓; mouth-occupied silence ✓; Scene ID consistency ✓; Character ID consistency ✓; negative prompt completeness ✓.

If any item is ✗ — revise the prompt, re-dispatch, re-check. Only after all items pass, deliver to user.

---

## STEP 7 — DELIVER & OPTIONAL HANDOFFS

Deliver to user with:
- **MP4 URL** (from Higgsfield job output).
- **Scenario picked** (e.g., `tube-extrude-static`).
- **Engine used + reason** (e.g., `seedance_2_0` — primary default for §3 product macro scenarios).
- **Final Realism Check log** (all ✓ or specific ✗ + revision notes).
- **Duration + aspect ratio + resolution** of the rendered clip.

**Optional handoffs (offer, do not auto-fire):**
- **Virality scoring** → `[[GATE: virality-master?video_id=<higgsfield_job_id>]]` if user wants hook / attention / retention metrics.
- **Dynamic camera alternative** → `[[GATE: animator?image_path=<parsed_brief.image.path>]]` if user wants the same image rendered with cuts / handheld / aggressive camera as a comparison.

---

## GATE CONTRACTS

### Incoming (motionizer receives)
`[[GATE: motionizer?image=<path>&source=<upstream_skill>&sku=<sku_class>&intent=<free_text>&...]]`

Required payload keys: `image`, `source`. Optional keys per `incoming-flows.md` §1.1.

### Outgoing (motionizer dispatches)
- `[[GATE: virality-master?video_id=<job_id>]]` — post-render scoring.
- `[[GATE: animator?image_path=<path>&intent=<free_text>]]` — when user asks for forbidden motion or explicitly wants the dynamic-camera version.

Motionizer never calls `higgsfield-generate` skill via gate — it calls the Higgsfield CLI directly per `backend-router.md` §6, because motionizer owns its own prompt assembly and does not want `higgsfield-generate`'s model-selection layer interfering.

---

## HARD RULES (never violated)

1. **No pixel-identity drift.** §1.2 of `physics-rules.md` overrides any conflicting motion request.
2. **No text crop ever.** §0.6 of `control-blocks.md` overrides any camera policy.
3. **No speech with mouth occupied.** §1.5 of `physics-rules.md` forces silence regardless of speech instruction.
4. **No dynamic camera beyond motionizer-permitted set.** Cuts / handheld / whip / aggressive pan are kicked to `animator`. Never bent.
5. **No routing to disabled engines.** Veo 3 / 3.1 / 3.1 Lite are off limits.
6. **No fabricated SKU, model ID, or scenario name.** Every value is read from `references/` or asked from user.
7. **No prompt dispatch without Final Realism Check pass.** All ✓ or revision.
                                                                                                                                                                                                                                                                                                                                                                     