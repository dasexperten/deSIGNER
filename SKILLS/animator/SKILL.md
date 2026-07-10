---
name: animator
description: "Das Experten dynamic-camera video for TikTok / Reels / Shorts / UGC / paid social. Hook-driven, multi-cut, lifestyle, ASMR, testimonial, demo, transformation, pain-point from reference image. Trigger on: animator, TikTok, тикток, UGC, hook, хук, виральное, шортс, reels, рилс, оживи в TikTok, сделай ролик, сделай тикток, анимация, pain-point, before-after, до-после, transformation, testimonial, отзыв, talking head, ASMR, асмр, morning routine, lifestyle, demo, how-to, рекламный ролик. Fires via [[GATE: animator]] from sales-hunter, ugc-master, das-presenter, bannerizer, motionizer (forbidden-motion handoff). Camera DYNAMIC default — full set (cut-sequence / handheld / whip-snap / pan-tilt / etc.). Product visibility 4-tier: hero / implied / reveal / absent. Backend Higgsfield (Kling 3.0 default for lip-sync + cuts, Seedance 2.0 for high-motion). Fires immediately."
---

SOURCE OF TRUTH: deSIGNER/SKILLS/animator — edit here first.

## [[GATE — Das Experten Asset Catalog]] (HARD STOP before any image / video generation)

If the user request, parent-task body, or any input mentions a Das Experten SKU code (DExxx — DE101, DE201, DE206, DE209, etc.) or a product name (SCHWARZ, SYMBIOS, ETALON, GROSSE, ZERO, INNOWEISS, DETOX, THERMO 39, GINGER FORCE, NANO MASSAGE, KRAFT, AKTIV, BIO, COCOCANNABIS, MITTEL, SENSITIV, EVOLUTION, BUDDY, INTENSIV, INTERDENTAL, etc.):

1. Read `/root/das-experten-context/assets/product-references.md` **first**, before composing any prompt
2. Find the SKU's `element_id` in the Product Elements table
3. Pass `element_id` as **Higgsfield Reference Element** (Nano Banana 2/Pro, GPT Image 2, Seedream, Cinema Studio all support this — see CLI examples at the bottom of the catalog file)
4. For lifestyle / talent / model shots — also pick a Soul Character from the same file's Character Elements table and pass its `element_id` as a second reference

**NEVER invent a Das Experten tube, brush head, packaging, label, or logo.** No generic black tubes. No imagined geometry. No placeholder products.

If the SKU isn't in the catalog — STOP, post a `kanban_comment` on the current task explaining what's missing, and ask Aram. Do not generate a placeholder.


# Animator

Dynamic-camera video skill. TikTok / Reels / Shorts / UGC / paid social shortform. Generates hook-driven multi-cut video from a reference image.

**Three principles animator never bends:**
1. **Pixel-identity preservation** (`references/physics-rules.md` §1.2). Character / product stays pixel-identical to reference. No drift.
2. **Text protection** (`references/control-blocks.md` §0.6). No text crop ever, regardless of how dynamic the camera is. Text fades or camera clamps.
3. **Mouth-occupied silence** (`references/physics-rules.md` §1.5). No speech when mouth is full (brush inside, foam on lips). Always.

**Sibling skill split (per Aram architecture):**
- `motionizer` = brand-hero static-camera continuation of bannerizer / productcardmaker / imager. Product always visible, camera mostly static.
- `animator` (this skill) = dynamic-camera shortform. Product visibility variable. Hooks, cuts, lifestyle, UGC.
- `video-master` = orchestrator above both. Asks deep clarifying questions and routes.

---

## EXECUTION LOCK — MANDATORY STEP SEQUENCE

Follow Steps 1 → 8 in order. Never skip. Never pre-fill from memory. Always read from actual reference files.

Reference files animator reads (all under `references/`):
- `physics-rules.md` v1.3 — anatomy, brush / tube / floss physics, pixel-identity, lip-sync, Duchenne smile, Character ID System.
- `control-blocks.md` v1.1 — named prompt blocks, camera policy §0.4 (dynamic-default full set), text-protection §0.6, audio §2 (Aud / Muz split, non-diegetic default), prompt assembly order §4, Final Realism Check §6, Hook Archetypes §7.
- `scenarios.md` v1.0 — 15 dynamic-camera scenarios across 7 families (hook-driven / pain-point UGC / transformation / testimonial / ASMR / lifestyle / demo) with scenario picker algorithm §8.
- `shortform-tiktok-protocol.md` v1.1 — primary design source (modern post-image-to-video era).
- `moviemaker-protocol.md` — historical reference only (legacy era, do not activate workflow).

---

## STEP 1 — INGRESS DETECTION

Determine ingress branch:

- **Branch 1 — Inter-skill gate.** `[[GATE: animator]]` from sales-hunter / ugc-master / das-presenter / bannerizer / motionizer / video-master with payload (`image_path`, `source_skill`, optional fields).
- **Branch 2 — Standalone uploaded image.** User attaches `.jpg` / `.png` / `.webp` / `.heic` with TikTok/UGC trigger word in message.
- **Branch 3 — Image URL.** User pastes HTTPS image URL with motion-intent.

For Branches 2 and 3, run enrichment pipeline parallel to `motionizer/references/incoming-flows.md` §2.2 (OCR for text detection, composition classifier, SKU detection with confidence threshold, character count). Build the canonical `parsed_brief` structure (same shape as motionizer's, but animator allows much wider `motion_intent` set: `static / micro-drift / slow-zoom / slow-rotate / cut-sequence / pan-tilt / handheld / whip-snap / unclear`).

**CRITICAL PITFALL — reference image scope (2026-05-25):**
When user provides a reference image for a character-driven scenario, **default assumption is FACE-ONLY extraction** unless explicitly told otherwise. The reference image provides facial identity (per IMMUTABLE_FACIAL_IDENTITY protocol §1.2), NOT the clothing, setting, or action. The scenario brief dictates clothing, setting, and action. User saying "make a video of [person] doing [action] in [place]" + providing a photo means: take the FACE from photo, build [action] in [place] with appropriate clothing for that context. If user wants the entire composition from the photo preserved, they will say "animate this exact scene" or "keep everything from the photo". When in doubt, ASK before generating: "Беру только лицо из фото или всю композицию?"

**Ingress-level text-protection pre-check** (mandatory before Step 2):
If detected text is non-empty AND `motion_intent` is anything other than `locked-static`, set `text_protection_active: true`. Scenario picker is restricted to `text-fades-on-motion` or `text-overlay-hook` policies (animator allows the latter as well since shortform commonly uses animated overlays).

> ⚠ Pending v1.1: animator gets its own `incoming-flows.md` parallel to motionizer's. Current behavior inlines the logic per this section. Functionally equivalent.

---

## STEP 2 — INTENT CLARIFICATION (if ambiguous)

Unlike motionizer (which generally has clear input from upstream brand pipeline), animator often gets vague creative briefs. **If intent is ambiguous on any of the following, ask one inline question** (plain prose, no picker UI per `control-blocks.md` §3):

| Ambiguity | Inline question to user |
|---|---|
| Platform unclear | TikTok / Reels / Shorts / paid social ad / Pinterest — which platform is this for? |
| Hook archetype unclear | What's the hook angle — pain-driven (Never do THIS), list (Top 3), shock (won't believe), relatable (tired of), secret (nobody talks about), contrarian (you've been wrong), or identity (if you're a X)? |
| Product visibility unclear | Show the product as hero, imply it through context, hide it until payoff reveal, or keep it absent (pure pain-point)? |
| Audio unclear | Speech (with line + accent + tone), silent / music-only, or full (ambient + speech + music)? |
| Duration unclear | 8–15s (standard short), 15–30s (medium), or longer? |
| Character behavior unclear | What does the character do — demonstrate the problem, demonstrate the result, talk direct-to-camera, or routine action without acknowledging camera? |

**Modern-era 3-scenario pitch (from `shortform-tiktok-protocol.md` §1):** when the brief is creative-open ("сделай TikTok про щётку"), animator may **pitch 3 distinct scenario variants with different hooks** for user to pick before generation. Show story logic, dialogue, and product visibility per variant. Wait for explicit approval. Then build the chosen variant.

---

## STEP 3 — SCENARIO PICK

Run picker algorithm per `references/scenarios.md` §8:
1. Inspect incoming flow source and platform signal.
2. Detect hook archetype keywords from intent (7 categories per `control-blocks.md` §7).
3. Detect content-type keywords (UGC / before-after / testimonial / ASMR / lifestyle / demo).
4. Detect product visibility intent (hero / implied / reveal / absent).
5. Apply text-protection restriction from Step 1.
6. **If user asks for static brand-hero output** (карточка / banner / product hero / static / без камеры) — **HAND OFF to `motionizer`** via `[[GATE: motionizer]]`. Animator never bends toward static brand work.
7. **Fallback** when intent ambiguous: `hook-relatable-pain` (highest-converting paid-social default) or `lifestyle-morning-routine` (organic-content default).

Write `picked_scenario` back into `parsed_brief`.

---

## STEP 4 — RULE INJECTION & PROMPT ASSEMBLY

Assemble final prompt per `control-blocks.md` §4 Prompt Assembly Order. Stack blocks top-to-bottom:

1. **Scene anchor** — one line: who, where, what visible.
2. **Scene ID Lock** — per `control-blocks.md` §1.7. Auto-generate if upstream did not provide.
3. **Character ID** (FULL or CORE form per `physics-rules.md` §1.9). Required for every character. For shortform / multi-character / dense scenarios, prefer CORE abbreviated form to conserve token budget.
4. **Hero Object Definition** — only if product visibility is `hero`, `reveal`, or `implied`. Inject matching SKU-class physics from `physics-rules.md` §2 / §3 / §4. **If visibility is `absent`, skip this block entirely** (UGC pain-point scenarios).
5. **Character Definition** — with `physics-rules.md` §1.4 anatomical canon.
6. **Immutable Facial Identity Protocols** — with §1.2 pixel-identity as override.
7. **Motion Constraint** — Pose / Action / Facial / Silhouette Locks. Insert explicit user action. For brushing scenes inject §2.8 brushing kinematics; for tube use inject §3.9 grip + squeeze; for floss inject §4.3.
8. **Object Geometry Lock + Surface & Material Lock** — combined.
9. **Audio block** — Aud (ambient diegetic) + Muz (music, separate line, **non-diegetic is default for shortform** per `control-blocks.md` §2.5) + character audio with Character ID inline per §1.9c. Apply Mouth-Occupied Silence Override if applicable.
10. **Camera block** — scenario's camera policy from animator's full set (cut-sequence / handheld / whip-snap / etc. allowed). Specify cut timings (every 0.4–0.9s for cut-sequence) and pattern interrupt position (~70% per `shortform-tiktok-protocol.md` §3).
11. **Hook block** (animator-only) — if scenario is hook-led (§1 family), explicit Hook Archetype declaration: opener at 0–2s with motion / surprise / curiosity, text-overlay `TO:` syntax if used, payoff timing at 85–95% of runtime per `shortform-tiktok-protocol.md` §3.
12. **Negative Prompt** — universal list + scenario-specific (e.g., for `hook-pain-driven`: no exaggerated pain expressions, no medical-graphic content, no gore; for `asmr-brush-closeup`: no music, no voice).

---

## STEP 5 — BACKEND PICK

Animator backend routing (parallel to motionizer's `backend-router.md`, with different scenario→engine mapping):

| Scenario family | Primary | Fallback | Why |
|---|---|---|---|
| §1 Hook-driven | `kling3_0` | `seedance_2_0` | Lip-sync for spoken hooks + clean cuts |
| §2 Pain-point UGC | `kling3_0` | `seedance_2_0` | Character emotion + handheld feel |
| §3 Transformation cut-sequence | `kling3_0` | `seedance_2_0` | Multiple cuts + lip-sync if dialogue |
| §3 before-after-cinematic | `kling3_0` (start+end roles) | `seedance_2_0` | Clean before/after keyframing |
| §4 Testimonial | `kling3_0` | `seedance_2_0` | Best lip-sync in catalog |
| §5 ASMR | `seedance_2_0` | `kling3_0` | SOTA motion + fine physics for bristle/fluid detail |
| §6 Lifestyle | `kling3_0` | `seedance_2_0` | Multi-cut routine + dialogue |
| §7 Demo | `kling3_0` | `seedance_2_0` | Multi-step cuts + narration |

**Overrides:**
- **PREMIUM** (premium / cinema / для лендинга / ads campaign) → `cinema_studio_video_3_0`.
- **BUDGET** (дёшево / черновик / batch) → `seedance_1_5_pro` or `minimax_hailuo`.
- **Marketing Studio** (ads with brand avatar + product + hook + setting per Higgsfield Marketing Studio) → `marketing_studio_video` — animator's territory when user wants productized branded ad with avatar.

Veo 3 / 3.1 / 3.1 Lite are **disabled**. Atlas is **not in current catalog** — never route to it.

> ⚠ Pending v1.1: animator gets its own `backend-router.md` parallel to motionizer's, with deeper per-scenario engine reasoning and dispatch deltas. For now this section inlines the matrix.

---

## STEP 6 — DISPATCH

**UPLOAD PREREQUISITE:** All local image inputs must be uploaded first to get a media ID:

```bash
# Upload the reference image and capture the returned ID
IMAGE_ID=$(higgsfield upload create <parsed_brief.image.path>)
```

Construct CLI command per Higgsfield conventions. **CRITICAL:** Check model params with `higgsfield model get <model_id>` before dispatch — parameter schemas change between models.

**Kling 3.0 dispatch pattern (current as of May 2025):**

```bash
higgsfield generate create kling3_0 \
  --prompt "<assembled prompt from Step 4>" \
  --medias "[{\"role\": \"start_image\", \"data\": {\"id\": \"<IMAGE_ID>\", \"type\": \"media_input\"}}]" \
  --aspect_ratio "<9:16 | 16:9 | 1:1>" \
  --duration "<integer seconds, typically 5>" \
  --mode "<std | pro | 4k>" \
  --sound "<on | off>" \
  --wait
```

**Medias structure notes:**
- `role` must be `"start_image"` (for starting frame) or `"end_image"` (for transformation/before-after scenarios with end keyframe).
- `data.type` must be `"media_input"` for uploaded files (not `"image"` or other values — API will reject).
- Multiple medias: `--medias "[{...start_image...}, {...end_image...}]"` for before-after scenarios.

**Seedance 2.0 dispatch pattern:** (verify with `higgsfield model get seedance_2_0` — structure may differ from Kling)

**Marketing Studio dispatches:** Follow `higgsfield-generate` skill's Marketing Studio workflow — not direct `kling3_0` / `seedance_2_0` dispatch.

**Fallback:** If primary engine fails, fall back per the matrix. Never fall back to disabled engines. Cost-aware: surface cost difference before silently downgrading.

---

## STEP 7 — FINAL REALISM CHECK

Per `control-blocks.md` §6, run the post-flight checklist with animator-specific items added:

> **Final Realism Check:** contact / occlusion ✓; gravity / parallax ✓; fluid & friction behavior ✓; wet / dry continuity ✓; prop provenance / persistence ✓; **hook delivery (≤2s opener with motion/surprise/curiosity) ✓** (only if hook-led scenario); pixel-identity preservation ✓; text-protection ✓; mouth-occupied silence ✓; Scene ID consistency ✓; Character ID consistency ✓; **cut timing within 0.4–0.9s window ✓** (only if cut-sequence policy); **product visibility matches declared intent ✓**; negative prompt completeness ✓.

If any item ✗ → revise prompt, re-dispatch, re-check.

---

## STEP 8 — DELIVER & OPTIONAL HANDOFFS

Deliver to user with:
- **MP4 URL** from Higgsfield job output.
- **Scenario picked** (e.g., `hook-pain-driven`, `transformation-cut-sequence`).
- **Engine used + reason** (e.g., `kling3_0` — primary default for §1 hook-driven scenarios per backend matrix).
- **Final Realism Check log** (all ✓ or specific ✗ + revision notes).
- **Hook archetype** if hook-led + payoff timing actual.
- **Duration + aspect ratio + resolution** of rendered clip.

**Optional handoffs (offer, do not auto-fire):**
- **Virality scoring** → `[[GATE: virality-master?video_id=<higgsfield_job_id>]]` — strongly recommended for any shortform output; Virality Predictor scores hook / attention / retention / distraction risk.
- **Static brand-hero variant** → `[[GATE: motionizer?image_path=<parsed_brief.image.path>]]` — when user wants the same image rendered as a brand-strict static piece for comparison.
- **UGC blogger campaign** → `[[GATE: ugc-master]]` — when user wants to seed the video to bloggers via barter rather than paid distribution.
- **Multi-variant A/B test** — animator can offer to generate 2–3 hook-archetype variants of the same scenario for A/B testing on paid social.

---

## GATE CONTRACTS

### Incoming (animator receives)
`[[GATE: animator?image=<path>&source=<upstream_skill>&platform=<tiktok|reels|shorts|ads>&hook=<archetype>&visibility=<hero|implied|reveal|absent>&intent=<free_text>]]`

Required: `image`. Optional: all others (animator infers from intent or asks one inline question).

### Outgoing (animator dispatches)
- `[[GATE: virality-master?video_id=<job_id>]]` — post-render scoring.
- `[[GATE: motionizer?image_path=<path>]]` — when user wants static brand-hero alternative.
- `[[GATE: ugc-master]]` — when video should seed to blogger network.

Animator does NOT call `higgsfield-generate` skill via gate — it calls Higgsfield CLI directly per Step 6, because animator owns its own prompt assembly and scenario logic.

---

## HARD RULES (never violated)

1. **No pixel-identity drift.** §1.2 of `physics-rules.md` overrides any conflicting motion request.
2. **No text crop ever.** §0.6 of `control-blocks.md` overrides any camera policy, including aggressive cuts and whip-snap.
3. **No speech with mouth occupied.** §1.5 of `physics-rules.md`.
4. **No static brand-hero output bent through animator.** If user wants locked-static brand asset motion, hand off to `motionizer`. Animator stays in dynamic-camera territory.
5. **No routing to disabled engines** (Veo 3 / 3.1 / 3.1 Lite).
6. **No fabricated SKU, scenario name, or engine ID.** Always read from `references/` or ask user.
7. **No prompt dispatch without Final Realism Check pass.**
8. **No medical-graphic, gore, or harmful content** even for pain-point scenarios — pain is shown through expression and context, never graphic injury.
9. **No claims of clinical efficacy** in dialogue unless the underlying claim is verified by Das Experten clinical-trial data (cross-check with `technolog` skill if doubt).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      