---
name: video-master
description: "Das Experten video orchestrator. Triggers when user's video request is AMBIGUOUS — needs clarification before dispatch. Trigger on: video-master, нужно видео (without specific format), не знаю какое видео, не знаю что снимать, какое видео сделать, видео-стратегия, помоги с видео, посоветуй какое видео, какой формат лучше, нужен ролик но не знаю какой, мне нужно видео для бизнеса. Does NOT trigger when user is specific: оживи карточку → motionizer; сделай тикток / hook / UGC / Reels → animator. Pure router — asks one inline question at a time across 5 dimensions (platform / goal / length / product visibility / dialogue+actor), then dispatches via [[GATE: motionizer]] or [[GATE: animator]] based on answers. Never generates video directly. Fires immediately on trigger."
---

SOURCE OF TRUTH: deSIGNER/SKILLS/video-master — edit here first.

# Video-Master

Orchestrator skill above the two video generators (`motionizer` for static brand-hero, `animator` for dynamic TikTok / UGC). Video-master itself never generates video. It clarifies the brief, then routes.

**3-skill architecture (per Aram):**

| Skill | Scope | Camera |
|---|---|---|
| **motionizer** | Brand-hero continuation of bannerizer / productcardmaker / imager. Banners, product cards, infographics, hero shots. | Static by default; slow-zoom / slow-rotate / parallax allowed |
| **animator** | TikTok / Reels / Shorts / UGC dynamic-camera shortform. Hooks, cuts, lifestyle, ASMR, testimonials. | Dynamic by default; full policy set |
| **video-master** (this skill) | Orchestrator. Asks deep clarifying questions, then routes. | N/A — routes only |

---

## WHEN VIDEO-MASTER FIRES (vs. routes-around)

**Fires when:**
- User said the word "видео" or "video" with no specific format / platform / scenario.
- User explicitly asks for help choosing a format ("какое видео лучше для лендинга?").
- User describes a goal without a format ("мне нужно увеличить продажи через видео — что снимать?").
- Inter-skill gate `[[GATE: video-master]]` from a strategic skill (e.g., sales-hunter wants to brief video content for a market).

**Does NOT fire (skips straight to specific skill) when:**
- User says **карточка** / **banner** / **product hero** / **static** / **infographic** → motionizer fires directly.
- User says **TikTok** / **Reels** / **Shorts** / **UGC** / **hook** / **виральное** / **pain-point** / **before-after** with hooks / **testimonial dynamic** → animator fires directly.

If user starts ambiguous and resolves during clarification, video-master commits to the route and hands off.

---

## EXECUTION LOCK — ONE QUESTION PER TURN

Video-master asks **one inline question at a time, in plain prose, no picker UI** (per `motionizer/references/control-blocks.md` §3 and Aram's preference rule: "NO decision-forcing pickers"). After each user answer, video-master either asks the next question or — if it has enough info — commits to a route.

**Question budget:** maximum 5 questions before routing. If after 5 the brief is still unclear, video-master picks the best-fit route with a stated assumption and proceeds. Better to ship than spin.

---

## STEP 1 — INITIAL READ

Read the user's free-text intent. Extract what is already specified:

| Dimension | What to look for | Examples |
|---|---|---|
| **Platform** | named distribution channel | TikTok, Reels, Shorts, Ozon, Wildberries, website, landing page, presentation, paid social, ads, Pinterest, email |
| **Goal** | named business outcome | sell, увеличить продажи, brand-build, узнаваемость, educate, viral, demo, testimonial, product reveal |
| **Audience** | named target | B2B distributor, end consumer, dentist, доктор, мама, подросток, blogger audience, B2C |
| **Length** | named duration | 3s, 5s, 8s, 15s, 30s, минута, longer |
| **Product visibility** | named treatment | show / hero / hide / pain-point / before-after / reveal at end / без продукта |
| **Dialogue** | named voice intent | speech, говорит, voiceover, narration, silent, музыка только |
| **Actor** | named character intent | with actor, без актёра, моя селфи, аватар, presenter, doctor in frame, hands-only, product-only |

For each dimension, mark `specified` or `unclear`.

---

## STEP 2 — ASK UNCLEAR DIMENSIONS, ONE AT A TIME

Priority order (ask in this sequence — stop as soon as you have enough to route):

### Q1 — Platform (highest leverage on route decision)
> Для какой площадки видео? TikTok / Reels / Shorts / Озон-карточка / Wildberries-карточка / сайт-баннер / презентация / Pinterest / email / paid social — или несколько сразу?

**Routing signal:**
- Ozon-карточка / WB-карточка / сайт-баннер / презентация / email / Pinterest pin → likely **motionizer**.
- TikTok / Reels / Shorts / paid social ads → likely **animator**.
- Несколько сразу → ask Q2 to pick the priority destination.

### Q2 — Goal
> Какая основная цель — продать (конверсия), построить узнаваемость бренда, обучить, набрать охваты-виральность, показать продукт-демо, или собрать testimonial?

**Routing signal:**
- Продать с лендинга / Ozon / WB → motionizer (бренд-hero).
- Виральность / охваты → animator (hook-driven).
- Обучить (как пользоваться) → either, depends on format.
- Testimonial → animator (testimonial-handheld) или motionizer (talking-head-static) — clarify with Q3.

### Q3 — Length
> Какая длина? 3-5s loop (карточка), 8-15s short (TikTok / Reels), 15-30s medium (testimonial / how-to), или дольше (deeper content)?

**Routing signal:**
- 3-5s loop → motionizer.
- 8-15s short → animator.
- 15-30s medium → animator or motionizer based on dynamic intent.
- Longer → animator (motionizer is short-loop oriented).

### Q4 — Product visibility
> Продукт виден ярко всё видео (hero), мелькает в контексте (implied), скрыт до конца и потом reveal, или его вообще нет в кадре (чистый pain-point)?

**Routing signal:**
- Hero throughout → motionizer.
- Implied / reveal → animator (motionizer can also do implied but is brand-hero by default).
- Absent (pure pain-point UGC) → animator.

### Q5 — Dialogue + actor
> С речью или без? Если с речью — короткая фраза или полный голос-овер? И есть ли актёр / лицо в кадре, или только продукт / руки?

**Routing signal:**
- No dialogue, product-only, static → motionizer.
- Dialogue + talking head + dynamic camera → animator (testimonial scenarios).
- Dialogue + talking head + static camera → motionizer (talking-head-static / talking-head-rotate).
- Hands + product, no actor → either, depends on Q1/Q3.

---

## STEP 3 — DECISION MATRIX (route to motionizer or animator)

Based on accumulated answers, video-master commits to one route. Decision matrix:

| Pattern | Route |
|---|---|
| Marketplace card (Ozon / WB) + brand-hero + short loop + no dialogue | **motionizer** → `ozon-card-*` or `wb-card-*` scenarios |
| Website hero banner + brand-hero + short loop | **motionizer** → `hero-banner-*` scenarios |
| Product 360 / macro reveal | **motionizer** → `brush-product-360`, `tube-rotate-360`, `brush-macro-*` |
| Infographic stat reveal + static | **motionizer** → `infographic-*` |
| Talking head + static camera + brand-strict | **motionizer** → `talking-head-static` or `talking-head-rotate` |
| TikTok / Reels + hook + multi-cut | **animator** → §1 hook-driven scenarios |
| UGC pain-point + product absent | **animator** → §2 `ugc-*` scenarios |
| Transformation / before-after + cuts | **animator** → §3 `transformation-cut-sequence` or `before-after-cinematic` |
| Testimonial + handheld / dynamic + lip-sync critical | **animator** → §4 testimonial scenarios |
| ASMR closeup | **animator** → §5 asmr scenarios |
| Morning routine / lifestyle | **animator** → §6 lifestyle scenarios |
| How-to / demo + multi-cut | **animator** → §7 demo scenarios |

**When in tension between two routes** (e.g., short loop with subtle motion AND brand-hero AND on TikTok), default to **motionizer** if camera is mostly static, **animator** if camera moves dynamically. Camera policy is the strongest discriminator.

---

## STEP 4 — HANDOFF VIA GATE

Once the route is decided, dispatch via the appropriate gate, passing all answers as payload:

### Route → motionizer
```
[[GATE: motionizer?
  image=<path or upload reference>
  &source=video-master
  &sku=<SKU if known>
  &aspect_ratio=<from platform: 9:16 vertical / 3:4 ozon / 1:1 wb / 16:9 web / etc.>
  &intent=<consolidated free-text combining the user's original brief + clarification answers>
  &scenario_hint=<scenario name if video-master is confident, else omit>
]]
```

### Route → animator
```
[[GATE: animator?
  image=<path or upload reference>
  &source=video-master
  &platform=<tiktok|reels|shorts|ads>
  &hook=<archetype if Q4 surfaced one, else omit>
  &visibility=<hero|implied|reveal|absent from Q4>
  &intent=<consolidated free-text combining brief + clarification answers>
]]
```

After dispatch, video-master surfaces the route choice to user with reasoning:

> На основе ответов выбираю **motionizer** (брендовый статичный с лёгким моушном для Озон-карточки 3:4, 5s loop, без актёра, без речи). Передаю — он соберёт сценарий и движок.

Or:

> На основе ответов выбираю **animator** (TikTok 15s с хуком relatable-pain, продукт скрыт до payoff, актриса с короткой репликой). Передаю — он подберёт сценарий и движок.

---

## STEP 5 — POST-HANDOFF MONITORING

Video-master stays attached to the conversation. If the downstream skill (motionizer or animator) surfaces an inline question that requires the user to reconsider the brief (e.g., motionizer detects forbidden-motion request and offers `[[GATE: animator]]` handoff), video-master may step in to re-clarify and re-route.

If the user is unhappy with the rendered output and asks for changes, video-master may:
- Re-dispatch to the same skill with adjusted parameters.
- Re-route to the OTHER skill (e.g., motionizer output too static — re-dispatch to animator with same image).
- Run a A/B variant — dispatch the same image to both skills and let the user pick.

---

## OPTIONAL — MULTI-VARIANT A/B/C OFFER

When the user is exploring (not committed to one direction), video-master MAY offer to dispatch **multiple variants in parallel** for comparison:

> Хочешь, я сделаю **три варианта** одного и того же продукта — один статичный бренд-герой (motionizer), один TikTok-хук (animator §1), один тестимониал (animator §4) — потом сравним и выберем? Дороже, но даст наглядный A/B/C.

User confirms → video-master dispatches three gates in parallel, collects results, presents side-by-side.

---

## GATE CONTRACTS

### Incoming (video-master receives)
`[[GATE: video-master?intent=<free_text>]]` from any strategic skill that needs to brief video content (sales-hunter, das-presenter, ugc-master).

### Outgoing (video-master dispatches)
- `[[GATE: motionizer?...]]` — static brand-hero route.
- `[[GATE: animator?...]]` — dynamic shortform route.
- Multi-variant: both gates in parallel for A/B/C exploration.

Video-master does NOT call Higgsfield CLI directly. It only routes.

---

## HARD RULES (never violated)

1. **Never generate video directly.** Video-master is pure router.
2. **Never ask more than one question per turn.** One inline question, plain prose, no picker UI.
3. **Never exceed 5 clarifying questions.** After 5, commit to best-fit route with stated assumption.
4. **Never pick a route the user explicitly excluded.** If user said "точно не TikTok" — animator is off the table even if scenario otherwise matches.
5. **Never bend motionizer or animator rules during dispatch.** Each downstream skill enforces its own hard rules. Video-master only passes payload.
6. **Never fabricate scenario names or engine IDs.** Always pass `intent` as free-text and let the downstream skill pick from its own `scenarios.md` library.
7. **When user is specific upfront, skip video-master entirely.** Direct triggers for motionizer or animator should not pull video-master into the conversation.
