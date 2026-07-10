# Animator Skill — Scenario Library (TikTok / Reels / Shorts / UGC)

**Version:** 1.0
**Status:** ACTIVE. Each scenario is a named preset bundling **camera policy + text policy + subject motion class + audio default + product visibility + duration window + backend hint + hook archetype**. The animator router picks one scenario per request based on incoming-flow context, user intent, and platform.
**Ownership:** Property of `animator` skill. Self-contained.
**Constraints inherited from `control-blocks.md`:**
- §0.4 Camera policy is **dynamic by default**; full policy set available (micro-drift / slow-zoom / slow-rotate / cut-sequence / pan-tilt / handheld / whip-snap / locked-static fallback).
- §0.6 Text-Protection HARD RULE — no text crops ever, regardless of scenario camera policy.
- §7 Hook Archetypes — 7 categories (Negative/Pain, List, Shock, Relatable Pain-Point, Secret, Contrarian, Identity) drive the opening 0–2 s of any hook-led scenario.

---

## 0. SCENARIO RECORD STRUCTURE

Each scenario below uses this fixed structure:

| Field | Meaning |
|---|---|
| **Camera** | One of: `micro-drift` / `slow-zoom-in` / `slow-zoom-out` / `slow-rotate-around-character` / `cut-sequence` / `pan-tilt` / `handheld-natural` / `whip-snap` / `locked-static` |
| **Text policy** | `no-text` / `text-protected-static` / `text-fades-on-motion` / `text-overlay-hook` (animated TO overlay at hook moment) |
| **Subject motion** | What moves inside the frame |
| **Audio default** | `silence` / `ambient` / `speech` / `muz` / `ambient+speech` / `ambient+muz` / `speech+muz` / `full` (ambient + speech + muz) |
| **Product visibility** | `hero` (visible throughout) / `implied` (props or context suggests product without showing it) / `reveal` (hidden then revealed at payoff) / `absent` (no product on screen) |
| **Duration** | Target clip length window |
| **Backend hint** | Recommended Higgsfield engine |
| **Hook archetype** | One of 7 from control-blocks §7 (only for hook-led scenarios) |
| **Source** | Typical input — direct upload, URL, upstream skill |
| **Use case** | Distribution platform / campaign type |

---

## 1. HOOK-DRIVEN SCENARIOS (one per archetype)

### 1.1 `hook-pain-driven`
| Field | Value |
|---|---|
| Camera | `cut-sequence` (3–5 cuts) opening + `slow-zoom-in` on payoff |
| Text policy | `text-overlay-hook` (TO: NEVER DO THIS appears 0–1.5 s) |
| Subject motion | Character winces / shows visible problem (bleeding gums close-up, yellow teeth) then transitions to clean / better state |
| Audio default | `speech+muz` (urgent voice + dramatic music with sound-design hits at cuts) |
| Product visibility | `reveal` (problem shown 0–6 s, product implied 6–10 s, brief reveal at payoff) |
| Duration | 8–12 s |
| Backend hint | Kling 3.0 (lip-sync + cuts) |
| Hook archetype | Negative / Pain-Driven |
| Source | Direct upload / staged UGC photo |
| Use case | TikTok, Reels, paid social pain-point ads |

### 1.2 `hook-list-superlative`
| Field | Value |
|---|---|
| Camera | `cut-sequence` (one cut per list item) + `whip-snap` between items |
| Text policy | `text-overlay-hook` (TO: TOP 3 HACKS, then per-item TO: #1, #2, #3) |
| Subject motion | Character demonstrates each item; product appears in item 3 (payoff) |
| Audio default | `speech+muz` (energetic voice + upbeat trap or pop beat) |
| Product visibility | `reveal` (items 1–2 are setup, item 3 reveals product) |
| Duration | 12–20 s |
| Backend hint | Kling 3.0 |
| Hook archetype | List & Superlatives |
| Source | Direct upload or character pose set |
| Use case | TikTok educational, Reels how-to |

### 1.3 `hook-shock-pattern-break`
| Field | Value |
|---|---|
| Camera | `whip-snap` opener + `handheld-natural` body |
| Text policy | `text-overlay-hook` (TO: YOU WON'T BELIEVE THIS) |
| Subject motion | Surprised face → confessional reveal → cut to demonstration |
| Audio default | `speech+muz` (conspiratorial voice + suspenseful strings rising into beat) |
| Product visibility | `implied` (product context suggested, never directly hero) |
| Duration | 10–15 s |
| Backend hint | Kling 3.0 |
| Hook archetype | Shock / Pattern-Break |
| Source | Direct upload |
| Use case | TikTok viral organic, Reels |

### 1.4 `hook-relatable-pain`
| Field | Value |
|---|---|
| Camera | `slow-zoom-in` on character face → `cut-sequence` to problem scenes → `pan-tilt` to result |
| Text policy | `text-overlay-hook` (TO: TIRED OF WASTING MONEY ON X?) |
| Subject motion | Character empathetic micro-expressions, then montage of pain scenarios, then transformation |
| Audio default | `speech+muz` (empathetic voice + warm acoustic transitioning to upbeat resolution) |
| Product visibility | `reveal` at payoff |
| Duration | 12–18 s |
| Backend hint | Kling 3.0 |
| Hook archetype | Relatable Pain-Point |
| Source | Direct upload |
| Use case | Paid social retargeting, organic TikTok |

### 1.5 `hook-secret-insider`
| Field | Value |
|---|---|
| Camera | `slow-zoom-in` close-up on character lean-in → `cut-sequence` to demonstration |
| Text policy | `text-overlay-hook` (TO: NOBODY TALKS ABOUT THIS) |
| Subject motion | Character whispers / glances around → reveals technique → shows result |
| Audio default | `speech+muz` (whisper-direction voice + intimate piano + escalating beat) |
| Product visibility | `implied` then `reveal` |
| Duration | 10–15 s |
| Backend hint | Kling 3.0 |
| Hook archetype | Secret / Insider |
| Source | Direct upload |
| Use case | Organic TikTok, expert positioning content |

### 1.6 `hook-contrarian-challenge`
| Field | Value |
|---|---|
| Camera | `handheld-natural` with confrontational framing + `whip-snap` at each contrarian point |
| Text policy | `text-overlay-hook` (TO: YOU'VE BEEN DOING THIS WRONG) |
| Subject motion | Character demonstrates wrong way → cut to right way → close-up payoff |
| Audio default | `speech+muz` (confident assertive voice + driving bass + sound-design impact hits) |
| Product visibility | `reveal` (product appears as the right-way answer) |
| Duration | 10–15 s |
| Backend hint | Kling 3.0 |
| Hook archetype | Contrarian / Challenge |
| Source | Direct upload |
| Use case | TikTok thought-leadership, Reels expert content |

### 1.7 `hook-identity-self-targeting`
| Field | Value |
|---|---|
| Camera | `cut-sequence` (tribe identification shots) + `slow-zoom-in` on payoff |
| Text policy | `text-overlay-hook` (TO: IF YOU'RE A [TRIBE], WATCH THIS) |
| Subject motion | Quick montage of tribe markers (specific morning routine, specific habit) → reveal of solution |
| Audio default | `muz+speech` (tribe-anthem feel music + identity-affirming voice) |
| Product visibility | `implied` |
| Duration | 10–15 s |
| Backend hint | Kling 3.0 |
| Hook archetype | Identity / Self-Targeting |
| Source | Direct upload |
| Use case | Niche-targeted paid social, community TikTok |

---

## 2. PAIN-POINT UGC SCENARIOS

### 2.1 `ugc-morning-struggle`
| Field | Value |
|---|---|
| Camera | `handheld-natural` (selfie-style first-person feel) + `cut-sequence` (3–5 cuts) |
| Text policy | `text-overlay-hook` opening + `no-text` body |
| Subject motion | Character wakes, struggles with morning routine, shows oral-care problem, then transition |
| Audio default | `full` (ambient + character voice + lo-fi morning music) |
| Product visibility | `absent` (pure pain-point — product never shown) |
| Duration | 8–12 s |
| Backend hint | Kling 3.0 |
| Hook archetype | Relatable Pain-Point |
| Source | Direct upload (selfie or staged) |
| Use case | Top-of-funnel TikTok / Reels, awareness campaigns |

### 2.2 `ugc-confidence-pivot`
| Field | Value |
|---|---|
| Camera | `slow-zoom-in` on character face (shame → confident) + `cut-sequence` |
| Text policy | `text-overlay-hook` |
| Subject motion | Character hides smile / covers mouth → cut → character smiles openly with confidence |
| Audio default | `speech+muz` (vulnerable voice transitioning to assured + emotional music swell) |
| Product visibility | `implied` (mirror reflection or bathroom shelf hints at product) |
| Duration | 10–15 s |
| Backend hint | Kling 3.0 |
| Hook archetype | Relatable Pain-Point or Identity |
| Source | Direct upload |
| Use case | Confidence positioning, paid social emotional resonance |

---

## 3. TRANSFORMATION / BEFORE-AFTER (with cut transitions)

### 3.1 `transformation-cut-sequence`
| Field | Value |
|---|---|
| Camera | `cut-sequence` (4–6 hard cuts between before / process / after states) |
| Text policy | `text-overlay-hook` (TO: BEFORE / AFTER labels at appropriate cuts) |
| Subject motion | Character shows before state → cut to product use montage → cut to after state |
| Audio default | `full` |
| Product visibility | `reveal` (product appears during process cuts) |
| Duration | 12–18 s |
| Backend hint | Kling 3.0 |
| Hook archetype | Shock / Pattern-Break or Relatable Pain-Point |
| Source | Direct upload (before + after photos paired) or single staged shoot |
| Use case | Result-proof TikTok, paid social conversion |

### 3.2 `before-after-cinematic`
| Field | Value |
|---|---|
| Camera | `slow-zoom-in` on before → `pan-tilt` transition → `slow-zoom-out` revealing after |
| Text policy | `text-fades-on-motion` (BEFORE label fades before zoom completes; AFTER label fades in cleanly after settle) |
| Subject motion | Single character or single mouth close-up; transformation rendered through controlled camera move (not cut) |
| Audio default | `muz` (emotional swell, no dialogue) |
| Product visibility | `implied` (product not central; result is) |
| Duration | 8–12 s |
| Backend hint | Kling 3.0 (start+end image roles for clean before/after keyframing) |
| Hook archetype | none — atmospheric, not hook-led |
| Source | Direct upload (before + after as start_image + end_image) |
| Use case | Premium Reels, brand-elevated paid social |

---

## 4. TESTIMONIAL / TALKING-HEAD (dynamic camera)

### 4.1 `testimonial-handheld`
| Field | Value |
|---|---|
| Camera | `handheld-natural` (sub-perceptible operator breathing, no shake) + occasional `slow-zoom-in` at emphasis moments |
| Text policy | `text-protected-static` (lower-third or pull-quote stays in safe area, no zoom crop) |
| Subject motion | Character speaks direct-to-camera per `physics-rules.md` §1.5 lip-sync + Duchenne smile per §1.6 |
| Audio default | `speech+muz` (clean dialogue + subtle background score) |
| Product visibility | `hero` (character holds or gestures toward product) or `implied` (product just out of frame) |
| Duration | 15–30 s |
| Backend hint | Kling 3.0 (best lip-sync) |
| Hook archetype | Secret / Insider or Identity |
| Source | Direct upload (clean studio or natural-light portrait) |
| Use case | Customer testimonial, founder message, doctor recommendation |

### 4.2 `testimonial-confessional`
| Field | Value |
|---|---|
| Camera | `slow-zoom-in` (slow push from medium shot to medium close-up over duration) |
| Text policy | `text-fades-on-motion` |
| Subject motion | Character speaks intimate revelation, builds emotional intensity, ends with key statement |
| Audio default | `speech+muz` (intimate close-mic voice + sparse piano) |
| Product visibility | `implied` |
| Duration | 15–25 s |
| Backend hint | Kling 3.0 |
| Hook archetype | Shock / Pattern-Break or Secret |
| Source | Direct upload |
| Use case | High-engagement organic TikTok, story-driven Reels |

---

## 5. ASMR / SENSORY CLOSEUP

### 5.1 `asmr-brush-closeup`
| Field | Value |
|---|---|
| Camera | `micro-drift` (sub-2% drift) + occasional `slow-zoom-in` on bristle detail |
| Text policy | `no-text` |
| Subject motion | Brush slowly enters frame, bristles flex per `physics-rules.md` §2.4, paste extrudes onto bristles per §3.5 — all in extreme close-up |
| Audio default | `ambient` (sub-perceptible breath, faint brush-bristle texture, no music) — pure ASMR |
| Product visibility | `hero` (product is the subject — but treated sensorially, not commercially) |
| Duration | 15–30 s loop |
| Backend hint | Seedance 2.0 (motion-rich, high-detail bristle physics) |
| Hook archetype | none — atmospheric |
| Source | Studio brand-asset shoot or productcardmaker macro |
| Use case | TikTok ASMR niche, Reels sensory content, brand-elevated Pinterest video pin |

### 5.2 `asmr-tube-extrude`
| Field | Value |
|---|---|
| Camera | `micro-drift` + `slow-zoom-in` on extrusion moment |
| Text policy | `no-text` |
| Subject motion | Hand squeezes tube per `physics-rules.md` §3.9, paste ribbon extrudes per §3.5 onto brush head — slow, sensory |
| Audio default | `ambient` (squeeze sound, gel-flow audio) |
| Product visibility | `hero` |
| Duration | 12–20 s |
| Backend hint | Seedance 2.0 (non-Newtonian fluid physics) |
| Hook archetype | none |
| Source | Studio shoot or staged upload |
| Use case | TikTok ASMR, Reels sensory |

---

## 6. LIFESTYLE / ROUTINE (multi-shot)

### 6.1 `lifestyle-morning-routine`
| Field | Value |
|---|---|
| Camera | `cut-sequence` (5–8 cuts: wake, mirror, brush, smile, exit) + `pan-tilt` transitions |
| Text policy | `text-overlay-hook` opener + `no-text` body |
| Subject motion | Character moves through morning routine; product appears in brushing cut(s) |
| Audio default | `full` (ambient bathroom + soft narration + lo-fi morning music) |
| Product visibility | `hero` in brushing cuts; `implied` in others (product on shelf, in mirror) |
| Duration | 15–25 s |
| Backend hint | Kling 3.0 |
| Hook archetype | Identity / Self-Targeting |
| Source | Direct upload (selfie or staged) |
| Use case | Day-in-the-life TikTok, lifestyle Reels |

### 6.2 `lifestyle-evening-wind-down`
| Field | Value |
|---|---|
| Camera | `slow-zoom-in` on each routine moment + `pan-tilt` transitions, slower pace than morning |
| Text policy | `no-text` |
| Subject motion | Character winds down: dim light, calm pace, product appears as part of self-care |
| Audio default | `ambient+muz` (low-fi calm music, faint bathroom ambient) |
| Product visibility | `hero` |
| Duration | 15–25 s |
| Backend hint | Kling 3.0 |
| Hook archetype | none |
| Source | Direct upload |
| Use case | Self-care TikTok, wellness Reels |

---

## 7. DEMO / HOW-TO

### 7.1 `demo-quick-how-to`
| Field | Value |
|---|---|
| Camera | `cut-sequence` (one cut per step) + `slow-zoom-in` on critical step |
| Text policy | `text-overlay-hook` (TO: STEP 1, STEP 2, STEP 3 — step numbering throughout) |
| Subject motion | Character (or hands-only) demonstrates each step using product |
| Audio default | `speech+muz` (instructional voice + upbeat tutorial music) |
| Product visibility | `hero` (product central, demonstrated each step) |
| Duration | 12–20 s |
| Backend hint | Kling 3.0 |
| Hook archetype | List & Superlatives |
| Source | Direct upload |
| Use case | TikTok educational, Reels how-to |

### 7.2 `demo-hands-only-product`
| Field | Value |
|---|---|
| Camera | `slow-zoom-in` + `pan-tilt` follows the product through hand interaction |
| Text policy | `text-fades-on-motion` |
| Subject motion | Hands per `physics-rules.md` §1.7 + §2.10 / §3.9 / §4.2 grips, product per its physics rules — character body off-camera, focus on product + hands |
| Audio default | `ambient+speech` (close-mic ASMR-leaning + brief narrator VO) |
| Product visibility | `hero` |
| Duration | 10–18 s |
| Backend hint | Kling 3.0 |
| Hook archetype | Secret / Insider |
| Source | Direct upload or studio shoot |
| Use case | Product detail Reels, Pinterest video pin |

---

## 8. SCENARIO PICKING ALGORITHM (animator router uses this)

1. **Inspect incoming flow** — what source produced the input (direct upload, URL, upstream skill, video-master handoff).
2. **Inspect intent for platform signal** — TikTok / Reels / Shorts / paid social / organic / Pinterest / niche.
3. **Inspect intent for hook archetype keywords:**
   - **never do**, **stop doing**, **pain**, **проблема**, **боль** → §1.1 `hook-pain-driven`
   - **top 3**, **#1 reason**, **list**, **топ** → §1.2 `hook-list-superlative`
   - **won't believe**, **shock**, **wish I knew**, **lie** → §1.3 `hook-shock-pattern-break`
   - **tired of**, **struggle**, **hard part**, **устал**, **бесит** → §1.4 `hook-relatable-pain`
   - **nobody talks**, **secret**, **insider**, **trick**, **секрет** → §1.5 `hook-secret-insider`
   - **forget everything**, **wrong**, **better than**, **неправильно**, **забудь** → §1.6 `hook-contrarian-challenge`
   - **if you're**, **only true**, **for people who**, **только для** → §1.7 `hook-identity-self-targeting`
4. **Inspect intent for content-type keywords:**
   - **UGC**, **боль**, **pain-point** → §2 scenarios
   - **до/после**, **before after**, **трансформация** → §3 scenarios
   - **testimonial**, **отзыв**, **doctor**, **founder**, **talking head**, **говорящая голова** → §4 scenarios
   - **ASMR**, **macro**, **close-up**, **сенсорное** → §5 scenarios
   - **morning routine**, **утренняя рутина**, **lifestyle**, **рутина** → §6 scenarios
   - **how-to**, **demo**, **step-by-step**, **инструкция**, **как пользоваться** → §7 scenarios
5. **Inspect product visibility intent:**
   - User wants product visible throughout → favor scenarios with `hero` visibility (§4, §5, §6, §7)
   - User wants pain-point / lifestyle without showing product → favor `absent` or `implied` (§1, §2)
   - User wants payoff reveal → favor `reveal` scenarios (§1.1, §1.2, §1.4, §3.1)
6. **Detect text in image** — if any text present and camera will move, force `text-fades-on-motion` policy and pick compatible scenarios (most §3, §4, §7 variants support this).
7. **If user asks for static brand-hero output** (карточка / banner / product hero / static / без движения камеры) — **hand off to `motionizer`** via `[[GATE: motionizer]]`. Animator should not bend toward static brand work — that is motionizer's territory.
8. **Fallback** when intent is ambiguous: pick `hook-relatable-pain` as the highest-converting default for paid social, or `lifestyle-morning-routine` for organic content.

---

## 9. PENDING SCENARIOS (v1.1+)

- **Duet / response scenarios** for TikTok duet formats (split-screen with another creator's content).
- **Stitch scenarios** for TikTok stitch (3–5 s clip continuing another creator's video).
- **Live shopping scenarios** for TikTok Shop / Reels Shop video product pages.
- **Polylanguage scenarios** with subtitle layer integration (Russian VO + English text overlay or vice versa).
- **Multi-character scenarios** (interview format with reporter + expert, ad with multiple personas).
- **Children scenarios** (smaller hand, parent-assisted, age-appropriate energy).
- **Educational long-form** (45–90 s for educational TikTok / YouTube Shorts longform).
- **Holiday / seasonal hook variants** for campaign-driven content.
- **Product line comparison** (3 SKU side-by-side, hand demonstrates differences).
