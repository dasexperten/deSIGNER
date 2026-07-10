# Motionizer Skill — Scenario Library

**Version:** 1.0
**Status:** ACTIVE. Each scenario is a named preset bundling **camera policy + text policy + subject motion class + audio default + product visibility + duration window + backend hint**. The motionizer router picks one scenario per request based on incoming-flow context (`incoming-flows.md`) and user intent.
**Ownership:** Property of `motionizer` skill. Self-contained.
**Constraints inherited from `control-blocks.md`:**
- §0.4 Camera policy is **static by default**; only `slow-zoom-in/out`, `slow-rotate-around-character`, `parallax-micro-drift` are allowed beyond static. Cuts / handheld / aggressive pan / whip-snap are forbidden inside motionizer (handed off to `animator`).
- §0.6 Text-Protection is a HARD RULE — no text crops ever, regardless of scenario camera policy.

---

## 0. SCENARIO RECORD STRUCTURE

Each scenario below uses this fixed structure:

| Field | Meaning |
|---|---|
| **Camera** | One of: `locked-static` / `parallax-micro-drift` / `slow-zoom-in` / `slow-zoom-out` / `slow-rotate-around-character` / `slow-rotate-around-product` |
| **Text policy** | `no-text` / `text-protected-static` (text exists, camera locked so no crop risk) / `text-fades-on-motion` (text exists + camera moves, fade per §0.6 Option B) |
| **Subject motion** | What moves inside the frame (paste extrudes, brush head spins, character speaks, micro-breathe only, etc.) |
| **Audio default** | `silence` / `ambient` / `speech` / `ambient+speech` |
| **Product visibility** | `hero` (always for motionizer — never hidden) |
| **Duration** | Target clip length window |
| **Backend hint** | Recommended Higgsfield engine for this scenario |
| **Source** | Which upstream skill typically feeds this scenario |
| **Use case** | Where this output is deployed |

---

## 1. HERO BANNER & WEB-HEADER SCENARIOS

### 1.1 `hero-banner-static`
| Field | Value |
|---|---|
| Camera | `locked-static` |
| Text policy | `text-protected-static` |
| Subject motion | Label glints (sub-perceptible), character micro-breathes if present, liquid surface settles |
| Audio default | `silence` (web banners autoplay muted) |
| Product visibility | hero |
| Duration | 3–5 s loop |
| Backend hint | Seedance 2.0 |
| Source | `bannerizer` |
| Use case | Website hero header, landing-page top fold, email-campaign hero |

### 1.2 `hero-banner-parallax`
| Field | Value |
|---|---|
| Camera | `parallax-micro-drift` (sub-2% drift, smooth loop) |
| Text policy | `text-protected-static` (drift is too small to crop text — verified at clamp distance) |
| Subject motion | Label glints, character micro-breathes |
| Audio default | `silence` |
| Product visibility | hero |
| Duration | 5–8 s loop |
| Backend hint | Seedance 2.0 |
| Source | `bannerizer` |
| Use case | Website hero header where a fully-static frame reads as a JPEG; the drift creates living-photo feel |

---

## 2. MARKETPLACE PRODUCT-CARD SCENARIOS

### 2.1 `ozon-card-3x4-static`
| Field | Value |
|---|---|
| Camera | `locked-static` |
| Text policy | `text-protected-static` (Ozon vertical card has heavy text overlays — must stay whole) |
| Subject motion | Paste extrudes / brush head twitches / packaging label glints |
| Audio default | `silence` (Ozon autoplay muted) |
| Product visibility | hero |
| Duration | 3 s loop |
| Backend hint | Seedance 2.0 (Nano Banana is image-only, not video — corrected per backend-router.md) |
| Source | `productcardmaker` (Ozon variant) |
| Use case | Ozon main listing card, secondary product images |

### 2.2 `ozon-card-zoom-in`
| Field | Value |
|---|---|
| Camera | `slow-zoom-in` (zoom factor 1.0× → 1.15× over duration) |
| Text policy | `text-fades-on-motion` (overlay text fades by 0.13 s before zoom would crop it; brand wordmark on package clamps zoom if it would slice) |
| Subject motion | Paste ribbon forms during zoom, then settles |
| Audio default | `silence` |
| Product visibility | hero |
| Duration | 5 s |
| Backend hint | Kling 3.0 |
| Source | `productcardmaker` (Ozon variant) |
| Use case | Ozon secondary card emphasizing texture / ingredient / detail |

### 2.3 `wb-card-1x1-static`
| Field | Value |
|---|---|
| Camera | `locked-static` |
| Text policy | `text-protected-static` |
| Subject motion | Subtle highlight on packaging, brush bristle flex if applicable |
| Audio default | `silence` |
| Product visibility | hero |
| Duration | 3 s loop |
| Backend hint | Seedance 2.0 (Nano Banana is image-only, not video — corrected per backend-router.md) |
| Source | `productcardmaker` (Wildberries variant) |
| Use case | Wildberries main listing card |

---

## 3. PRODUCT-MACRO & ROTATION SCENARIOS

### 3.1 `brush-macro-static`
| Field | Value |
|---|---|
| Camera | `locked-static` |
| Text policy | `no-text` |
| Subject motion | Bristle flex (per `physics-rules.md` §2.4), specular shimmer on handle |
| Audio default | `silence` |
| Product visibility | hero |
| Duration | 3–5 s loop |
| Backend hint | Seedance 2.0 |
| Source | `bannerizer` (with `brush-zoom` composition) |
| Use case | Brush feature spotlight, ingredient-page hero, presentation slide |

### 3.2 `brush-product-360`
| Field | Value |
|---|---|
| Camera | `slow-rotate-around-product` (full 360° orbit at constant radius and height) |
| Text policy | `text-fades-on-motion` (any brand wordmark on handle that would face away from camera fades out as it rotates past 90° from front, fades back in as it re-approaches) |
| Subject motion | Brush is the rotating subject; no other motion |
| Audio default | `silence` |
| Product visibility | hero |
| Duration | 8 s (one full revolution) |
| Backend hint | Kling 3.0 |
| Source | `bannerizer` or `productcardmaker` |
| Use case | Ozon secondary card showing full product geometry, presentation product reveal |

### 3.3 `tube-hero-static`
| Field | Value |
|---|---|
| Camera | `locked-static` |
| Text policy | `text-protected-static` (label copy stays sharp) |
| Subject motion | Subtle specular on tube surface, cap stays sealed |
| Audio default | `silence` |
| Product visibility | hero |
| Duration | 3 s loop |
| Backend hint | Seedance 2.0 (Nano Banana is image-only, not video — corrected per backend-router.md) |
| Source | `bannerizer` / `productcardmaker` |
| Use case | Toothpaste product card, ingredient-page hero |

### 3.4 `tube-extrude-static`
| Field | Value |
|---|---|
| Camera | `locked-static` |
| Text policy | `text-protected-static` |
| Subject motion | Tube squeeze per `physics-rules.md` §3.3, paste ribbon extrudes per §3.5, lands on brush head |
| Audio default | `silence` (or `ambient`: faint squeeze sound, optional) |
| Product visibility | hero |
| Duration | 5–8 s |
| Backend hint | Kling 3.0 (handles non-Newtonian fluid extrusion most cleanly) |
| Source | `bannerizer` / `productcardmaker` |
| Use case | Ingredient-page demonstration, marketplace secondary card showing in-use moment |

### 3.5 `tube-rotate-360`
| Field | Value |
|---|---|
| Camera | `slow-rotate-around-product` |
| Text policy | `text-fades-on-motion` (label faces fade as they rotate away, re-appear on return) |
| Subject motion | Tube is the rotating subject; cap stays closed |
| Audio default | `silence` |
| Product visibility | hero |
| Duration | 8 s |
| Backend hint | Kling 3.0 |
| Source | `bannerizer` / `productcardmaker` |
| Use case | Full geometry reveal, presentation product slide |

---

## 4. INFOGRAPHIC & STAT-REVEAL SCENARIOS

### 4.1 `infographic-stat-static`
| Field | Value |
|---|---|
| Camera | `locked-static` |
| Text policy | `text-protected-static` (numbers, percentages, ingredient names — all whole, never sliced) |
| Subject motion | Number rolls in (mechanical counter feel), icon pulses subtly, bar graphic fills smoothly |
| Audio default | `silence` |
| Product visibility | hero |
| Duration | 5 s |
| Backend hint | Seedance 2.0 |
| Source | `bannerizer` (infographic composition) / `technolog` |
| Use case | Clinical-trial result slide, ingredient-page stat callout, sales-deck data point |

### 4.2 `infographic-reveal-zoom`
| Field | Value |
|---|---|
| Camera | `slow-zoom-in` (1.0× → 1.10×) |
| Text policy | `text-fades-on-motion` (primary stat stays whole at all zoom levels per clamp; secondary captions fade before clip would slice them) |
| Subject motion | Stat number scales up, icon pulses |
| Audio default | `silence` |
| Product visibility | hero |
| Duration | 5 s |
| Backend hint | Seedance 2.0 |
| Source | `bannerizer` / `technolog` |
| Use case | Presentation key-metric slide where camera draws attention to one number |

---

## 5. LIFESTYLE & IN-USE SCENARIOS (still brand-strict)

### 5.1 `lifestyle-brushing-static`
| Field | Value |
|---|---|
| Camera | `locked-static` (medium shot of person brushing teeth, mirror or bathroom context) |
| Text policy | `no-text` (or `text-protected-static` if a brand wordmark visible on tube/brush in frame) |
| Subject motion | Character brushes per `physics-rules.md` §2.8 brushing kinematics; brush head goes in mouth, hand grip per §2.10; bristle flex per §2.4; foam per §2.9 |
| Audio default | `ambient` (faint water sound, brush stroke audio) |
| Product visibility | hero (brush + tube + character — all visible) |
| Duration | 5–8 s |
| Backend hint | Kling 3.0 (lip-sync — character may close mouth around brush, no speech allowed when mouth occupied per `physics-rules.md` §1.5) |
| Source | Direct user upload / `bannerizer` |
| Use case | Brand demonstration shot, web hero, ingredient-page in-use moment |

### 5.2 `lifestyle-tube-squeeze-static`
| Field | Value |
|---|---|
| Camera | `locked-static` (close-up of hands squeezing tube onto brush) |
| Text policy | `text-protected-static` (tube label fully visible and locked) |
| Subject motion | Hand grip on tube per `physics-rules.md` §3.9; paste extrudes per §3.5 |
| Audio default | `silence` or faint `ambient` |
| Product visibility | hero |
| Duration | 5 s |
| Backend hint | Kling 3.0 |
| Source | Direct user upload / `bannerizer` |
| Use case | How-to slide, ingredient-page application moment |

---

## 6. TALKING-HEAD SCENARIOS (brand-strict, controlled)

### 6.1 `talking-head-static`
| Field | Value |
|---|---|
| Camera | `locked-static` (medium close-up of speaking character) |
| Text policy | `text-protected-static` (lower-third overlay if present stays in safe area, never sliced) |
| Subject motion | Lip-sync per `physics-rules.md` §1.5, perioral dynamics, Duchenne smile per §1.6, micro head adjustments |
| Audio default | `speech` (clean dialogue, character voice traits per Character ID Core when defined) |
| Product visibility | hero (if character holds product) or implied (product on table in shot) |
| Duration | 8–15 s |
| Backend hint | Kling 3.0 (best lip-sync) |
| Source | Direct user upload (actor selfie / studio photo) |
| Use case | Brand testimonial, founder message, ingredient explainer, doctor recommendation |

### 6.2 `talking-head-rotate`
| Field | Value |
|---|---|
| Camera | `slow-rotate-around-character` (orbit 30–60°, smooth, constant radius, constant eye-level) |
| Text policy | `text-fades-on-motion` (lower-third fades out before rotation would crop it, fades back when camera settles at end position if it still fits) |
| Subject motion | Lip-sync, perioral dynamics, Duchenne smile, micro head adjustments — character keeps facing original front during orbit (head turn tracks camera within natural limit) |
| Audio default | `speech` |
| Product visibility | hero or implied |
| Duration | 8–10 s |
| Backend hint | Kling 3.0 |
| Source | Direct user upload |
| Use case | Cinematic testimonial, dynamic founder message, product story slide |

---

## 7. BEFORE-AFTER SCENARIOS (static-only inside motionizer)

### 7.1 `before-after-static-split`
| Field | Value |
|---|---|
| Camera | `locked-static` (split-screen frame, left half = before, right half = after) |
| Text policy | `text-protected-static` (BEFORE / AFTER labels + any stat captions locked) |
| Subject motion | Subtle ambient micro-motion in both halves (character micro-breathes, light shimmer) — no cross-fade, no swipe |
| Audio default | `silence` |
| Product visibility | hero (product visible in after half, or implied) |
| Duration | 5 s loop |
| Backend hint | Seedance 2.0 |
| Source | `bannerizer` (split composition) |
| Use case | Result-proof banner, ingredient-page outcome callout |

> Note: cross-fade / swipe between before and after is a **cut** and forbidden in motionizer. If user wants animated before→after transition, hand off via `[[GATE: animator]]`.

---

## 8. SCENARIO PICKING ALGORITHM (motionizer router uses this)

1. **Inspect incoming flow** (`incoming-flows.md`) — what source produced the image (bannerizer / productcardmaker / imager / direct upload / URL).
2. **Inspect image content** — single product / single character / product + character / infographic / split layout.
3. **Detect text in image** (brand wordmarks, label copy, overlays) — if any text present and camera will move, force `text-fades-on-motion` policy and pick scenario that supports it.
4. **Detect user intent keywords:**
   - **карточка**, **listing**, **озон**, **wb** → §2 scenarios
   - **баннер**, **hero**, **header** → §1 scenarios
   - **щётка крупно**, **brush macro**, **360** → §3 scenarios
   - **тюбик**, **паста**, **extrude**, **squeeze** → §3 / §5 scenarios
   - **stat**, **цифра**, **инфографика**, **результат** → §4 scenarios
   - **лайфстайл**, **чистит зубы**, **brushing** → §5 scenarios
   - **говорит**, **testimonial**, **доктор**, **основатель**, **talking head** → §6 scenarios
   - **до/после**, **before after** → §7 scenarios
5. **Detect motion intent:**
   - No motion words / **статика** / **static** → pick `-static` variant
   - **slow zoom**, **приблизься**, **наезд** → pick `-zoom-in` variant
   - **поверни**, **rotate**, **360**, **orbit** → pick `-rotate-` variant
   - **parallax**, **живая фотография** → pick `-parallax` variant
6. **If user asks for forbidden motion** (cuts, handheld, whip, aggressive pan, multi-shot sequence) — **do not bend motionizer's rules**. Respond: this scenario requires `animator`, would you like me to hand off via `[[GATE: animator]]`?
7. **Fallback** when intent is ambiguous: pick the `-static` variant of the closest scenario family. Static is always safe.

---

## 9. PENDING SCENARIOS (v1.1+)

- Multi-product layouts (brush + tube + floss group shot) — adapt §3 scenarios
- Packaging dieline animation (box unfolds / cap flips) — needs new §3.6 scenario
- Children's product scenarios (smaller hand, parent-assisted) — adapt §5 scenarios
- Electric toothbrush scenarios (oscillating-rotating motion) — adapt §3 scenarios
- ASMR-leaning brush-bristle close-up (still static; needs sound design layer for asmr feel)
