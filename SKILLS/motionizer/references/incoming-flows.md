# Motionizer Skill — Incoming Flows

**Version:** 1.0
**Status:** ACTIVE. Defines the **three ingress branches** through which motionizer receives work, the **payload contract** for each, and the **enrichment pipeline** that produces the parsed brief the scenario picker (`scenarios.md` §8) consumes.
**Ownership:** Property of `motionizer` skill. Self-contained.

---

## 0. CANONICAL PARSED BRIEF (what every branch must produce)

Regardless of ingress branch, the parser ends with one normalized structure that the scenario picker and SKILL.md router consume:

```yaml
parsed_brief:
  source_branch: upstream_skill | uploaded_image | url
  source_skill:  bannerizer | productcardmaker | imager | das-presenter | technolog | null
  image:
    path:        <absolute path in workspace>
    aspect_ratio: 1:1 | 3:4 | 4:5 | 9:16 | 16:9 | other
    resolution:  WxH
    detected_text:
      brand_wordmarks:      [SCHWARZ, DETOX, ...]    # protected per control-blocks §0.6
      label_copy_present:   true | false
      overlay_text_present: true | false
    detected_subjects:
      products:   [brush | tube | floss | packaging | infographic_element]
      characters: count + bounding boxes if multiple
      composition: single_product | single_character | product_and_character | infographic | split_layout
    sku_class: SCHWARZ | DETOX | SYMBIOS | INNOWEISS | ETALON | GROSSE | ZERO | THERMO_39 | GINGER_FORCE | unknown
  intent:
    free_text:       <verbatim user words>
    motion_intent:   static | slow_zoom | slow_rotate | parallax_drift | unclear
    action_intent:   none | brushing | squeezing | speaking | rotating | unclear
    duration_hint:   3s | 5s | 8s | 10s | unclear
    audio_hint:      silence | ambient | speech | unclear
    target_platform: ozon | wildberries | web | presentation | ads | reels | unclear
  character_id:      <Character ID string from upstream or null>
  scene_id:          <Scene ID string from upstream or null>
  picked_scenario:   <name from scenarios.md after picker runs, e.g., hero-banner-parallax>
  forbidden_motion_request: true | false   # set true if user asked for cuts/handheld/aggressive → hand off to animator
```

The router uses this exact structure to call the scenario picker, run the rule injector, build the prompt per `control-blocks.md` §4 assembly order, and dispatch to the backend per `backend-router.md`.

---

## 1. BRANCH 1 — INTER-SKILL GATE (upstream Das Experten skill)

**Trigger:** invocation via `[[GATE: motionizer]]` from inside another Das Experten skill's workflow.
**Upstream skills that call motionizer:**

| Upstream | Typical context | Payload they hand over |
|---|---|---|
| `bannerizer` | After banner image generated, user asks to animate it | `image_path`, `composition_type`, `sku_class`, `brand_wordmarks[]`, `composition_notes` |
| `productcardmaker` | After Ozon / Wildberries card rendered | `image_path`, `marketplace` (`ozon` / `wb`), `aspect_ratio`, `sku_class`, `card_position` (main / secondary) |
| `imager` | After generic image gen, user wants motion on top | `image_path`, `engine_used`, `resolution`, optional `prompt_used` |
| `das-presenter` | When a slide needs a motion asset embedded | `image_path`, `slide_context`, `audience` (B2B distributor / retail / dentist), `language` |
| `technolog` | Clinical-trial infographic needs animated stat reveal | `image_path`, `stat_type`, `stat_value`, `confidence_level`, `unit` |

### 1.1 Payload contract (REQUIRED fields from upstream)
- `image_path` — absolute path in workspace (must exist and be readable).
- `source_skill` — name of upstream skill, lowercase.
- `sku_class` if product-bearing — used to fire the right physics-rules §2/§3/§4 injection.

### 1.2 Payload contract (OPTIONAL fields, used if provided)
- `composition_type`, `aspect_ratio`, `brand_wordmarks[]`, `audience`, `language`, `marketplace`.
- If upstream already produced a `Character ID` (e.g., das-presenter with a defined presenter persona), pass it through verbatim.
- If upstream defined a `Scene ID` (e.g., bannerizer placed the product in a specific bathroom set), pass it through verbatim.

### 1.3 Fill-in pipeline (when optional fields missing)
For each missing optional field, motionizer infers from the image directly:
- **`aspect_ratio`, `resolution`** — read from image metadata.
- **`brand_wordmarks[]`, `label_copy_present`, `overlay_text_present`** — OCR pass on the image.
- **`detected_subjects.products`** — vision pass: brush / tube / floss / packaging classifier.
- **`detected_subjects.characters`** — face/body detection count.
- **`sku_class`** — if not provided, inferred from packaging color + wordmark detection; if still ambiguous, set `unknown` and continue (physics-rules §2–§4 fire generically for the detected product class).

### 1.4 Intent capture
Upstream skill should pass the user's verbatim instruction in `intent.free_text`. Motionizer parses keywords for `motion_intent` and `action_intent` per `scenarios.md` §8.

### 1.5 Handoff back to upstream
After dispatch, motionizer returns the MP4 path + scenario picked + final realism check log to the upstream skill's continuation handler. Upstream decides if it wants to embed the result (das-presenter inserts into slide), forward to another skill (productcardmaker to virality-master), or surface to the user directly.

---

## 2. BRANCH 2 — STANDALONE UPLOADED IMAGE

**Trigger:** user uploads a file (`.jpg` / `.jpeg` / `.png` / `.webp` / `.heic`) in chat with a motion-intent message.

**Trigger words** (motion-intent + image attachment):
оживи, animate, motion, video из картинки, image-to-video, видео-баннер, motion banner, parallax, продуктовое видео, оживи это, сделай видео из этого, motionize, motionize this, animate this card, animate this banner.

### 2.1 Payload contract (REQUIRED)
- **Image file** — present in workspace `uploads/` after upload.
- **Intent text** — at minimum one motion-intent trigger word in the message. If only the image is uploaded with no message, ask **one inline question**: what should move in this — paste extrudes / brush rotates / character speaks / micro-only / something else?

### 2.2 Image enrichment pipeline (mandatory before scenario picker)
Same OCR + vision passes as Branch 1 §1.3, plus:
- **Composition classifier:** single_product / single_character / product_and_character / infographic / split_layout.
- **SKU detection:** match brand wordmark + packaging color to known SKU class. If detection confidence < 0.7, ask **one inline question:** which SKU is this — SCHWARZ / DETOX / SYMBIOS / other?
- **Brand-asset check:** confirm the image came from a Das Experten brand pipeline (bannerizer / productcardmaker output style). If the image looks like a raw third-party photo, surface a warning: this image was not generated by a Das Experten brand skill — pixel-identity preservation will still apply, but brand-strict composition rules may not match upstream intent.

### 2.3 Character ID capture
If a character is in the image and the user wants speech / talking-head scenario, ask one inline question:
> What's the character's brief — name (or alias), age, voice tone, accent, one signature trait? Write it in any order; I'll format it into the Character ID per §1.9.

Then format the answer into either FULL or CORE form per `physics-rules.md` §1.9.

### 2.4 Scene ID capture
If the image clearly shows a location (bathroom, kitchen, studio, etc.) and the user requests a multi-shot or looped scenario, motionizer **auto-generates** a Scene ID from the visible set dressing + lighting (no question needed; surface it in the dispatch log for user review).

### 2.5 Format / platform inference
- Aspect 3:4 vertical → likely Ozon card.
- Aspect 1:1 → likely Wildberries card or web square.
- Aspect 16:9 → likely web hero, presentation, or YouTube.
- Aspect 9:16 → ask whether motionizer or animator owns this; vertical short-form often wants animator's dynamic camera. If user confirms static brand-hero vertical, motionizer proceeds.

### 2.6 Fallback when intent ambiguous
Default scenario: pick the `-static` variant of the closest scenario family from `scenarios.md` and surface it in the dispatch log for user override.

---

## 3. BRANCH 3 — IMAGE URL

**Trigger:** user pastes an image URL (https://... ending in `.jpg`/`.png`/`.webp` or a CDN URL that returns image content) with a motion-intent message.

### 3.1 Payload contract (REQUIRED)
- **URL** — valid HTTPS URL returning an image content-type.
- **Intent text** — at minimum one motion-intent trigger word in the message.

### 3.2 Fetch pipeline
1. **Validate URL** — must be HTTPS, must respond with `image/*` content-type, must be < 25 MB.
2. **Download to workspace** — save to a working path under the session's outputs folder.
3. **Run Branch 2 §2.2 enrichment pipeline** on the downloaded file.

### 3.3 Source provenance
- If URL is from a known Das Experten domain or R2 bucket (dasexperten.ru, dds-library, etc.), tag `source_skill: known_brand_cdn` and proceed as brand-asset.
- If URL is third-party (Pinterest, random web), tag as `external_reference` and surface a warning: this image is from an external source — pixel-identity preservation applies but brand-strict composition rules may not match Das Experten standards.

### 3.4 Failure handling
- Fetch timeout > 30s → abort, ask user to upload directly instead.
- URL returns non-image content-type → abort, ask user to confirm URL.
- File exceeds 25 MB → abort, ask user to provide a smaller version (most engines cap input size around 20–25 MB).

---

## 4. SCENARIO PICKER HANDOFF

Once `parsed_brief` is fully populated:

1. **Call scenario picker** per `scenarios.md` §8 algorithm.
2. **Returned `picked_scenario`** is written back into `parsed_brief.picked_scenario`.
3. **If `forbidden_motion_request: true`** (user asked for cuts / handheld / aggressive pan / whip-snap) — motionizer does **NOT bend its rules**. It surfaces:
   > This scenario needs `animator` (dynamic camera, multi-cut). I can hand off via `[[GATE: animator]]` — want me to?
4. **If picker returns no match** — fall back to the closest `-static` scenario family and surface in dispatch log.
5. **Hand off `parsed_brief` to SKILL.md router** for prompt assembly and dispatch.

---

## 5. INGRESS-LEVEL TEXT-PROTECTION PRE-CHECK

Before scenario picker runs, if **any** of `detected_text.brand_wordmarks[]`, `label_copy_present`, or `overlay_text_present` is non-empty AND `motion_intent` is anything other than `static`:

1. Mark the brief with flag `text_protection_active: true`.
2. Scenario picker is restricted to scenarios whose Text policy is `text-protected-static` or `text-fades-on-motion`.
3. Motion intent is downgraded if no compatible scenario exists (e.g., `slow_zoom` requested but no zoom scenario supports the detected text → fall back to `static`).
4. Log the downgrade in the dispatch output so the user can override explicitly.

This pre-check enforces `control-blocks.md` §0.6 at the ingress layer, before the scenario picker has a chance to violate it.

---

## 6. PENDING (v1.1+)

- Branch 4: live camera (user shoots a photo on phone, sends directly — same as Branch 2 but with EXIF metadata richer for Scene ID inference).
- Branch 5: video-master orchestrator handoff — when video-master routes to motionizer after deep clarification, payload format differs from inter-skill gate (more verbose, includes all clarification answers).
- Batch ingress — multiple images at once (e.g., a full Ozon card set), motionizer iterates and uses the same Scene ID + Character ID across all of them for continuity.
