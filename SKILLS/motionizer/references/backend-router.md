# Motionizer Skill — Backend Router

**Version:** 1.0
**Status:** ACTIVE. Decision matrix for picking the Higgsfield video engine per motionizer scenario. Every motionizer dispatch reads this file to set the `--model` flag.
**Ownership:** Property of `motionizer` skill. Self-contained.
**Source of truth:** Higgsfield catalog at `~/.claude/skills/higgsfield-generate/references/model-catalog.md` (last validated 2026-05-24).

**Engines DISABLED per Aram (2026-05-24):**
- ~~Google Veo 3~~
- ~~Google Veo 3.1~~
- ~~Veo 3.1 Lite~~
Reason: better engines exist; Veo family not a target backend for motionizer.

**Engine UNDER EVALUATION:**
- **Atlas** — not present in current Higgsfield catalog as of 2026-05-24. Either renamed / not yet released / lives outside Higgsfield. Pending: confirm with Aram what Atlas refers to. Until confirmed, no routing to Atlas.

---

## 1. ENGINE CATALOG (motionizer-relevant only)

| Engine | `--model` ID | Sweet spot | Pixel-identity | Motion strength | Audio | Max duration | Cost tier |
|---|---|---|---|---|---|---|---|
| **Seedance 2.0** | `seedance_2_0` | SOTA all-purpose serious video, multi-shot, image-to-video, 4–15s. **Default for most motionizer scenarios.** | High | High | Via `audio` role | 12 s validated | Medium |
| **Kling 3.0** | `kling3_0` | Single-plane scenes, cheaper, image-to-video with explicit start+end frames. **Default for talking-head with lip-sync.** | High | Medium | Yes | ~10 s | Medium-low |
| **Kling 2.6** | `kling2_6` | Earlier Kling, cinematic motion with advanced physics. Fallback to 3.0 unless explicitly preferred. | High | Medium-High | Yes | ~10 s | Medium-low |
| **Seedance 1.5 Pro** | `seedance_1_5_pro` | Budget single-take clean shot. Use only when user asks for cheaper output. | Medium-High | Medium | No | ~5–10 s | Low |
| **Cinema Studio Video 3.0** | `cinema_studio_video_3_0` | Top-tier cinema-grade fidelity, film-look. Pick for premium hero or testimonial. | High | High | Yes | ~10 s | High |
| **Minimax Hailuo** | `minimax_hailuo` | Cheap with strong physics, no audio. Niche fit. | Medium | Medium-High (physics-correct) | No | ~6 s | Low |
| **Wan 2.7** | `wan_2_7` | Synchronized audio + character consistency. Newer Wan. Niche fit when stylized output matches brief. | High | Medium | Yes | ~5 s | Medium |
| ~~Veo 3~~ / ~~Veo 3.1~~ / ~~Veo 3.1 Lite~~ | — | **Disabled — not a target backend.** | — | — | — | — | — |
| ~~Atlas~~ | — | **Not present in current Higgsfield catalog. Pending clarification.** | — | — | — | — | — |

**Image-only models (NOT used by motionizer — motionizer outputs video):**
~~Nano Banana 2 / Pro~~, ~~GPT Image 2~~, ~~Soul V2 / Cinema / Cast / Location~~, ~~Seedream 4.5 / 5.0 Lite~~, ~~Z Image~~, ~~Flux 2.0 / Kontext Max~~, ~~Kling O1 Image~~, ~~Grok Imagine~~, ~~Cinema Studio Image 2.5~~, ~~Marketing Studio Image~~. These appear in upstream skills (productcardmaker, designer, bannerizer, imager) but motionizer's output is always video, so they are out of scope here.

**Marketing Studio (video) — out of motionizer scope:**
`marketing_studio_video` is for branded advertising (UGC, unboxing, TV spot, product showcase). Lives in `animator` skill territory, not motionizer. If user wants Marketing Studio output, motionizer hands off to `animator` via `[[GATE: animator]]`.

---

## 2. DECISION MATRIX — SCENARIO → ENGINE

Maps every scenario in `scenarios.md` to its primary engine + fallback. **Default for almost everything is Seedance 2.0**; deviate only when scenario characteristics demand it (lip-sync → Kling 3.0; premium cinema → Cinema Studio 3.0; budget → Seedance 1.5 Pro / Minimax Hailuo).

### 2.1 §1 Hero banner & web-header
| Scenario | Primary | Fallback | Why |
|---|---|---|---|
| `hero-banner-static` | `seedance_2_0` | `kling3_0` | SOTA all-purpose, handles static camera + subject micro-motion cleanly |
| `hero-banner-parallax` | `seedance_2_0` | `kling3_0` | Parallax is sub-perceptual, Seedance reads it as subtle drift well |

### 2.2 §2 Marketplace product cards
| Scenario | Primary | Fallback | Why |
|---|---|---|---|
| `ozon-card-3x4-static` | `seedance_2_0` | `kling3_0` | Vertical 3:4 supported; product micro-motion + text-protected static frame |
| `ozon-card-zoom-in` | `kling3_0` | `seedance_2_0` | Slow zoom on single-plane product = exact Kling 3.0 sweet spot, cheaper |
| `wb-card-1x1-static` | `seedance_2_0` | `kling3_0` | Square 1:1, static subject motion |

### 2.3 §3 Product macro & rotation
| Scenario | Primary | Fallback | Why |
|---|---|---|---|
| `brush-macro-static` | `seedance_2_0` | `kling3_0` | High-detail bristle physics (§2.4 of physics-rules) needs SOTA motion model |
| `brush-product-360` | `seedance_2_0` | `kling3_0` | 360° orbit benefits from start-image + end-image (Kling 3.0 also supports both roles for explicit start/end keyframing) |
| `tube-hero-static` | `seedance_2_0` | `kling3_0` | Specular shimmer on tube surface, micro-motion only |
| `tube-extrude-static` | `seedance_2_0` | `kling3_0` | Non-Newtonian paste extrusion physics — Seedance handles fluid mechanics best in motionizer-allowed catalog |
| `tube-rotate-360` | `kling3_0` (start+end roles) | `seedance_2_0` | Kling 3.0's start+end image roles make controlled 360° cleanest |

### 2.4 §4 Infographic & stat reveal
| Scenario | Primary | Fallback | Why |
|---|---|---|---|
| `infographic-stat-static` | `seedance_2_0` | `kling3_0` | Number/icon micro-motion on static frame, text-protected |
| `infographic-reveal-zoom` | `kling3_0` | `seedance_2_0` | Slow zoom on graphic plane = Kling 3.0 sweet spot, lower cost |

### 2.5 §5 Lifestyle & in-use
| Scenario | Primary | Fallback | Why |
|---|---|---|---|
| `lifestyle-brushing-static` | `seedance_2_0` | `kling3_0` | Complex action (brushing kinematics §2.8 of physics-rules); SOTA needed |
| `lifestyle-tube-squeeze-static` | `seedance_2_0` | `kling3_0` | Hand grip + fluid extrusion physics |

### 2.6 §6 Talking-head
| Scenario | Primary | Fallback | Why |
|---|---|---|---|
| `talking-head-static` | `kling3_0` | `seedance_2_0` | Kling 3.0 has native audio sync; if Seedance, must pass `--audio <ref>` |
| `talking-head-rotate` | `kling3_0` (start+end) | `seedance_2_0` | Slow rotate needs precise start+end keyframing + audio sync |

### 2.7 §7 Before-after
| Scenario | Primary | Fallback | Why |
|---|---|---|---|
| `before-after-static-split` | `seedance_2_0` | `kling3_0` | Static split frame, both halves micro-motion |

---

## 3. PREMIUM & BUDGET OVERRIDES

Two off-default routes for explicit user intent:

### 3.1 PREMIUM (user asks for top-tier / hero / showcase quality)
Route the scenario to **`cinema_studio_video_3_0`** regardless of default. Use cases:
- Hero banner for the website landing page that needs to read as cinema-grade.
- Founder testimonial talking-head where production value must be unmissable.
- Award-submission / portfolio piece.

Trigger words: премиум, cinema, top-tier, для лендинга, для основной презентации, hero showcase, награды.

### 3.2 BUDGET (user asks for cheaper / quick draft / batch)
Route the scenario to **`seedance_1_5_pro`** for single-shot work, or **`minimax_hailuo`** when budget is paramount and audio is not needed. Use cases:
- Quick draft to validate composition before committing to Seedance 2.0 finals.
- Batch render of multiple variants where SOTA isn't economical.
- Internal review materials.

Trigger words: дёшево, быстро, черновик, draft, бюджетно, batch, для теста.

---

## 4. PROMPT ASSEMBLY DELTAS PER ENGINE

The `control-blocks.md` §4 assembly order is universal, but each engine reads slightly differently. Motionizer applies these per-engine adjustments **after** the canonical assembly:

### Seedance 2.0
- Pass `--start-image` for image-to-video (CLI auto-remaps `--image` to `start_image`).
- If audio reference needed: `--audio <path-or-id>` with role `audio`. **Do not use `--generate-audio`**.
- Duration: `--duration 4` to `12` (validated). Pick per scenario.
- Aspect ratio: `--aspect_ratio` from `auto | 21:9 | 16:9 | 4:3 | 1:1 | 3:4 | 9:16`.
- Resolution: `--resolution 720p` or `--resolution 1080p`.

### Kling 3.0
- Pass `--start-image` (first frame) and optionally `--end-image` (last frame) for explicit start→end interpolation. Critical for `tube-rotate-360`, `brush-product-360`, `talking-head-rotate`.
- Native audio support: `--generate-audio true` is supported (unlike Seedance 2.0).
- Duration: typically 5 s or 10 s.
- Aspect ratio: similar set to Seedance.

### Cinema Studio Video 3.0
- Higher cost, longer render time — set `--wait-timeout 30m`.
- Aspect ratio: verify supported set with `higgsfield model get cinema_studio_video_3_0`.
- Use for `PREMIUM` override only.

### Seedance 1.5 Pro
- Used for BUDGET override only. Lower motion fidelity than 2.0.
- No audio role.

### Minimax Hailuo
- Used for BUDGET + physics-priority override.
- ~6 s max duration.
- No audio.

---

## 5. FAILURE HANDLING

When primary engine returns an error or timeout, motionizer **automatically falls back** per this ladder:

1. **Primary engine** (from §2 decision matrix).
2. **Fallback engine** (from §2 decision matrix, column "Fallback").
3. **If fallback also fails** — surface error to user with: which engines were tried, error from each, suggested next action (try BUDGET override / verify image input / wait and retry).

**Never silently fall back to a disabled engine** (Veo family). Disabled engines stay disabled regardless of failure cascade.

**Cost-aware fallback rule:** if user did NOT explicitly request BUDGET, motionizer does not auto-fall back to `seedance_1_5_pro` or `minimax_hailuo` without surfacing the cost difference and asking for confirmation. Better to surface failure than silently downgrade quality.

---

## 6. DISPATCH CONTRACT (what motionizer's SKILL.md uses)

Once the engine is picked, motionizer constructs the CLI command per `higgsfield-generate` skill conventions:

```bash
higgsfield generate create <model_id> \
  --prompt "<assembled prompt per control-blocks.md §4>" \
  --start-image "<absolute path from parsed_brief.image.path>" \
  [--end-image "..."]   # only if scenario needs it (e.g., 360 rotate)
  [--audio "..."]        # only if speech scenario and Seedance 2.0
  --aspect_ratio "<parsed_brief.image.aspect_ratio>" \
  --resolution "<720p or 1080p per scenario>" \
  --duration "<scenarios.md duration>" \
  --wait
```

Output: MP4 URL, which motionizer surfaces to user along with:
- Scenario picked (`scenarios.md` reference).
- Engine used + reason (default / premium override / budget override / fallback).
- Final Realism Check log per `control-blocks.md` §6.
- Optional handoff to virality-master via `[[GATE: virality-master]]` if user wants scoring.

---

## 7. PENDING (v1.1+)

- **Atlas** — when Aram clarifies what Atlas refers to (Higgsfield internal beta? a different vendor? Higgsfield Soul Atlas?), add row to §1 catalog and routes to §2 matrix.
- **Wan 2.7** routing — currently listed but not assigned to scenarios. If stylized output is wanted as a deliberate creative choice, assign to a new `-stylized` scenario family.
- **Cost-per-second telemetry** — log actual cost per dispatch so a future round can build accurate cost-aware fallback rules.
- **Live `higgsfield model list --json`** pre-check at dispatch time to confirm engine availability — currently we assume the catalog snapshot is accurate.
- **Caching layer** — if the same image + scenario combo is dispatched twice, return cached MP4 instead of re-rendering.
