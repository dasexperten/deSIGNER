---
name: imager
description: Das Experten universal image generation gate. Use for ALL image creation — banners, slides, product cards, mockups, infographics, social posts. Direct triggers сгенерируй изображение, сделай картинку, сделай банер, сделай карточку, generate image, render, make a banner. Fires from [[GATE imager]] called by bannerizer, productcardmaker, das-presenter, blog-writer, ugc-master, sales-hunter, designer, technolog. Self-contained — all secrets, Worker source, scripts, reference library inside. DEFAULT pipeline executes immediately without asking — Gemini Flash textless base + Pillow text overlay handles ALL languages including Cyrillic Arabic CJK. NEVER ask which engine, layout, font, or character — defaults are fixed. NEVER suggest OpenAI as alternative or fix — Pillow solves text. OpenAI is RESTRICTED, used only when user verbatim says use OpenAI. Letter-spacing NEVER exceeds 1.0x natural — if text doesnt fit reduce font size, never expand tracking. Text NEVER overflows its bbox. Fire immediately.
---

SOURCE OF TRUTH: deSIGNER/SKILLS/imager — edit here first.

# IMAGER

Das Experten universal image generation gate. Handles ALL image creation through the imager-bridge Cloudflare Worker + R2 reference library + multi-engine routing pipeline.

ALWAYS trigger this skill when the user explicitly asks to generate any image, OR when called via inter-skill gate `[[GATE: imager]]` from any other skill that needs to produce a visual (bannerizer, productcardmaker, das-presenter, blog-writer, ugc-master, sales-hunter, designer, marketolog, etc.).

This skill is SELF-CONTAINED. Every secret, every API key, every code file, every script, every reference URL needed to operate is embedded directly in this document. No external lookups required. No "see other file" indirections. The only external dependency is `/home/claude/.env` (loaded by helper scripts) which is recreated from this skill's "BOOTSTRAP" section if missing.

---

## ⚡ DEFAULT BEHAVIOR — DO NOT ASK, JUST EXECUTE

**This is the most important rule in this skill.** When a request to generate an image arrives — direct from user OR via `[[GATE: imager]]` from another skill — execute the default pipeline immediately. Never ask which engine, which layout, which language, which font, which character. The defaults are fixed.

### Default execution pipeline (always, unless user explicitly overrides)

```
1. Engine:           gemini-flash  (free, ~15 sec, photorealistic)
2. Aspect ratio:     4:3           (banners) | 3:4 (Ozon cards) | 1:1 (Amazon/IG)
3. Text rendering:   Pillow overlay
                     - Gemini renders TEXTLESS base (NO-TEXT policy in prompt)
                     - Pillow overlays exact text afterward
                     - Always perfect Cyrillic / Arabic / CJK / Latin
4. Fonts:            Choose freely from the 5-font roster based on concept/mood:
                     - Russo One     → product names (ETALON, SCHWARZ — geometric, industrial)
                     - Rubik Black   → drama / dark / impact headlines
                     - Manrope EB    → modern editorial / clinical / B2B
                     - Mulish EB     → humanist / lifestyle / family / soft
                     - Comfortaa B   → rounded body, descriptions, CTAs
                     ALL WEIGHTS BOLD ALWAYS — no light/regular weights anywhere.
                     Default product name = Russo One unless concept demands otherwise.
                     Default headline = Rubik Black for dark moods, Manrope for clinical,
                     Mulish for warm/lifestyle. Override allowed by concept.
5. Letter-spacing:   IRON RULE — letter-spacing (tracking, character spacing,
                     intercharacter distance) NEVER exceeds 1.0× the font's natural
                     spacing. Default is the font's built-in spacing (multiplier 1.0).
                     Allowed: tighter spacing (0.85× to 1.0×) for headlines for visual
                     density. FORBIDDEN: wider spacing (>1.0×) under any circumstance,
                     for any reason — never tracked-out caps, never spaced wordmarks,
                     never expanded letterforms. If text doesn't fit a bbox, REDUCE
                     FONT SIZE — do NOT expand spacing. See Section 7.7 + 7.8 for the
                     algorithm. Symptom of violation: "Д А С   Э К С П Е Р Т Е Н" —
                     this is a critical visual failure, fix immediately.

6. Text containment: STRICT — every text element MUST fit inside its assigned
                     bounding box (panel, frame, container, callout card, etc.).
                     If text would overflow:
                     - reduce font size proportionally until it fits
                     - wrap to additional lines (within bbox vertical limit)
                     - shorten text via abbreviation only as last resort
                     NEVER let text bleed beyond box edges, into neighboring panels,
                     across the hero product, or onto the canvas margins.
                     See Section 7.7 — bbox containment algorithm.
6. Brand logo:       Always pasted via Pillow (transparent PNG, color-keyed)
                     - Light BG → logo_full_with_flag_TRANSPARENT.png (with German flag)
                     - Dark BG  → logo_white_on_black_TRANSPARENT.png (white wordmark)
7. Save target:      R2 bucket dasexperten-images, public URL returned
```

### When TO ASK (only these cases)

- User explicitly says "ask me first" / "спроси меня"
- Request is so vague that defaults can't apply (e.g. "сделай что-нибудь красивое" — no SKU, no scene, no character — then ONE clarifying question)
- About to use a paid engine (OpenAI gpt-image-1 ~$0.04/image) — confirm before charging account

### When NOT to ask (everything else)

- "Сделай banner DE105 с Faeze" → execute, return URL
- "Generate ETALON x Menuar with Russian text" → execute, return URL
- "Make a card for Ozon, DE201" → execute (defaults to 3:4, Russian text)
- "[[GATE: imager?sku=DE117&...]]" from another skill → execute

### Defaults override only on explicit instruction

- "Use OpenAI engine" → switch from gemini-flash to openai (ONLY if user says these exact words)
- "Vertical 9:16" → switch aspect ratio
- "Latin text only" → skip Pillow overlay (Gemini Flash handles Latin)
- "No logo" → skip logo paste
- "Use Manrope instead of Rubik" → swap headline font

### ⚠️ INFOGRAPHIC SPECIAL CASE — see Section 7.6

When the request is an infographic (multi-panel layout with callout cards around a hero product) — banner-style overlay does NOT work. You MUST use the infographic pipeline from Section 7.6: Gemini renders textless cards + product, Pillow walks a structured layout JSON to render headline + value + label inside each card.

**Symptom of failure:** Gemini-rendered Cyrillic gibberish like "ПОПЛОЛИЧЕРЕ" inside callout cards — this means the skill let Gemini render text. Always check Section 7.6 BEFORE generating any infographic. Caller (technolog skill) must pass `layout=...` parameter with panel coordinates and text content.

### ⚠️ MARKETPLACE CARD SPECIAL CASE — see Section 7.9

When the request is a marketplace product card (Ozon 3:4, Wildberries 3:4, Amazon/international 1:1) with header + subheader + 2-3 callouts — old per-element overlay produces fragmented visuals. You MUST use the MARKETPLACE CARD STANDARD PATTERN from Section 7.9: Gemini renders strict-textless scene with reserved zones (top 18% / left 30% mid / bottom 12%); Pillow renders all layout text including a unified translucent callout panel.

**Symptom of failure:** three separate floating backdrops behind individual callouts, each fighting the BG with its own contrast level, no visual unity — this is the OLD pattern. Always switch to Section 7.9. Caller (productcardmaker) passes `header`, `subheader`, `callouts[]` (exactly 3), `wordmark`, `disclaimer`.

### 🚫 OPENAI HARD RULE — NEVER PROACTIVELY SUGGESTED

**OpenAI gpt-image-1 is NEVER mentioned as an option, alternative, fallback, or recommendation.** Even if Gemini Flash output looks imperfect. Even if Cyrillic text was problematic. Even if reference fidelity weakened. Even if user expressed dissatisfaction with previous output. Even if cost-benefit analysis would favor it.

The ONLY way OpenAI gets used:
- User says verbatim: "use OpenAI" / "switch to OpenAI" / "try gpt-image-1" / "use the paid engine" / similar EXPLICIT directive naming OpenAI

**FORBIDDEN responses (do NOT generate these):**
- ❌ "Switch to OpenAI for crisper text" / "OpenAI would handle Cyrillic better"
- ❌ "Option A: Gemini Flash (cheap). Option B: OpenAI (paid but better)"
- ❌ "Recommendation: OpenAI for clinical text accuracy"
- ❌ "Either accept Flash limitations or upgrade to OpenAI"
- ❌ Any A/B menu where OpenAI is one of the choices
- ❌ Any framing that positions OpenAI as a solution to a Flash weakness

**Required responses when Flash output is imperfect:**
- ✅ Re-run Flash with strengthened prompt (better reference lock, more explicit no-text-on-product instruction)
- ✅ Apply Pillow overlay more aggressively (more text moved from AI render to overlay)
- ✅ Adjust composition to reduce AI text load (more negative space, fewer in-image text elements)
- ✅ Just ship the Flash result if it's acceptable
- ✅ Tell user what happened and let them decide if they want to retry — but DO NOT propose OpenAI as the retry method

**Why this rule exists:** OpenAI is paid (~$0.04/image, charges Aram's account). Defaulting to it or proposing it as the obvious upgrade burns budget on every imperfect Flash result. Aram pays only when he himself decides Flash isn't sufficient — not when Claude decides for him.

**Reasoning shortcut for Claude:** "Would suggesting OpenAI here imply that Flash failed and the paid engine is the obvious fix?" If yes → don't suggest it. Solve the problem inside Flash + Pillow boundaries.

If the user has been frustrated by multiple Flash iterations and explicitly asks "what other options do I have?" — only THEN may you mention OpenAI as one possibility, alongside (1) prompt refinement, (2) overlay-based fixes, (3) accepting the result. OpenAI must never be presented as the default escalation path.

If the user asked once for an override in this conversation, REMEMBER and apply for subsequent requests in the same chat. If new chat — defaults reset.

---



**Direct user triggers:**
- "сгенерируй изображение", "сделай картинку", "generate image", "create image", "render", "draw"
- "сделай банер", "make a banner", "сделай слайд", "make a slide", "сделай карточку"
- "сделай мокап", "make a mockup", "lifestyle shot", "социальный пост", "social media post"
- Any request involving creation of a visual asset

**Gate triggers from other skills:**
- `[[GATE: imager]]` with parameters
- After bannerizer finishes Step 7 prompt assembly
- After productcardmaker selects template + product
- After das-presenter needs slide-internal imagery
- After blog-writer needs hero/inline images
- After ugc-master needs creator-style content visual
- After sales-hunter needs distributor proposal visual

Fire immediately on any trigger. No confirmation needed before activating the skill.

---

## 0.0 EXCLUSIVITY LOCK — non-negotiable

This skill is THE ONLY path for any image generation in any Das Experten operation.

**FORBIDDEN — never use these for ANY image generation:**

❌ Direct calls to Gemini, OpenAI, Stability, Midjourney, Ideogram, Flux, or any other image-generation API. The imager-bridge Worker is the single chokepoint that enforces:
  - Reference library lookup (no hallucinated packaging)
  - Brand fidelity locks (das experten® logo, schwarz subhead, German flag, etc.)
  - Cost tracking and engine selection
  - R2 archival and audit trail

❌ `image_generation` MCP connectors of any flavor. They bypass R2 archive and reference library.

❌ Inline ASCII art, "diagram-style" visual fallbacks. If the user asked for an image, produce a real image.

❌ Asking the user to upload product photos. The reference library already contains 160 product files (DE101–DE211) and 81 characters. Asking for upload is a workflow failure.

❌ Pasting prior generated images and asking the user to "imagine X added to it". Every visual change goes through a fresh `/generate` call.

**ALLOWED — only path:**

✅ Reference resolution via Worker `/resolve-refs` → prompt assembly → `/generate` → optional Pillow text overlay → R2 archive → return public URL. See Section 3 below.

**Translation rule for sub-skill specs:** if any sub-skill's documentation says "ask user to upload product photo", "send a Photoshop mockup", "create banner manually", "use Canva", or any close variant — translate that to `[[GATE: imager]]` with the appropriate scene_type and SKU.

**Conflict resolution:** if any sub-skill (bannerizer, productcardmaker, etc.) has documentation that contradicts this lock, **this lock wins.** Flag the conflict to Aram in the same response.

---

## 0.1 INFRASTRUCTURE OVERVIEW

```
┌─ Trigger ─────────────────────────────────────────────┐
│  User says "make banner DE105 with Faeze"             │
│  OR sub-skill calls [[GATE: imager]]                  │
└────────────────────┬──────────────────────────────────┘
                     │
        ┌────────────▼─────────────┐
        │  /resolve-refs           │  Worker auto-picks 3-4 reference URLs
        │  (sku + scene + char)    │  from R2 reference library
        └────────────┬─────────────┘
                     │
        ┌────────────▼─────────────┐
        │  Build agency-grade      │  Prompt assembled with brand DNA,
        │  prompt (6000+ chars)    │  grip locks, lighting, composition
        └────────────┬─────────────┘
                     │
        ┌────────────▼─────────────┐
        │  /generate               │  Gemini Flash (free) or Pro / OpenAI
        │  with reference_urls     │  ~14-20 sec generation
        └────────────┬─────────────┘
                     │
              ┌──────┴──────┐
              │             │
       ┌──────▼──────┐ ┌────▼─────────────┐
       │  Latin text │ │  Cyrillic/Arabic │
       │  → done     │ │  → Pillow overlay│
       └──────┬──────┘ └────┬─────────────┘
              │             │
              └──────┬──────┘
                     │
        ┌────────────▼─────────────┐
        │  R2 archive +            │  Returns public URL
        │  return public URL       │
        └──────────────────────────┘
```

---

## 1. SECRETS — full inventory (embedded for self-containment)

All secrets needed to operate this skill. Used by helper scripts and direct Worker calls.

### Cloudflare account

```
Account ID:       081ddb85cb399ad62a70210328d744fc
Account name:     Das Experten Enterprise

API tokens (use CF_CLOUD_MASTER as default; switch to CF_WORKERS_EDIT for Worker-only deploys):
  CF_CLOUD_MASTER:  cfut_yk9DdlaSeE9KUvEIfJp9X7h0rT3FCYP9nu46fgB1c43012df
  CF_WORKERS_EDIT:  cfut_Qbjirmjg6FfzNxouHPJywEOCshtvsHvzze0926L9b9bf09f5
  CF_FULL_INFRA:    cfut_YUpmI2sdgIlC5s7QAb5Tff1fZt82gDJj3AetS3ojf6882ffa
  CF_D1_ADMIN:      cfut_yZaSSQe6RG1AVpodpbAacwIyVfuHy6apyyrzBoau329ab619
```

### imager-bridge Worker

```
Worker name:      imager-bridge
Worker URL:       https://imager-bridge.dasexperten.workers.dev
Auth header:      Authorization: Bearer Yhe2vdRXKXF_VUF-CgkgO-nd5CxkM7FsqqOaF2aU0X0
                  (this is BRIDGE_SECRET — bound as encrypted Worker secret)
```

### Image generation APIs (bound to Worker as encrypted secrets)

```
GEMINI_API_KEY (free tier, das-experten-imager project):
  AIzaSyDz2sE_CnFxePhi1cRPmnu1cdmkmR1bFeM
  Model: gemini-2.5-flash-image
  Limits: 500 RPD, 10 RPM, 250K TPM, resets midnight Pacific
  Plan: free (no billing); prompts may be used by Google for training

OPENAI_API_KEY (paid):
  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
  Model: gpt-image-1
  Use for: Cyrillic/non-Latin text-on-image where overlay isn't enough

ANTHROPIC_API_KEY (for in-Worker LLM if ever needed):
  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
```

### R2 storage

```
Bucket name:      dasexperten-images
Bucket ID:        1d1b12958f2d4ea380276bd8d0a1ff02
Public URL base:  https://pub-1d1b12958f2d4ea380276bd8d0a1ff02.r2.dev

Folder structure inside bucket:
  banners/<campaign>/<timestamp>_<sku>_<rand>.png    — generated banners
  slides/<deck>/                                     — slides
  cards/<marketplace>/<sku>/                         — marketplace cards
  mockups/<campaign>/                                — design mockups
  backgrounds/<campaign>/                            — textless backgrounds
  refs/products/<SKU-slug>/<DE###_filename>.png      — product reference library
  refs/characters/<Name>.png                         — character reference library
  refs/styles/brand-logos/                           — Das Experten logos
  refs/styles/brand-badges/                          — microbiome friendly etc.
  refs/styles/skills-archive/                        — backup of skill files

Lifecycle: banners/adhoc/* purged after 30 days; everything else permanent.
```

### GitHub (for backup of Worker source)

```
GitHub PAT:       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
GitHub repo:      https://github.com/dasexperten/imager-bridge (private)
```

### Bootstrap — recreate /home/claude/.env

If `.env` is missing in a new Claude session, run this once:

```bash
cat > /home/claude/.env << 'EOF'
export GITHUB_PAT="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"
export CF_ACCOUNT_ID="081ddb85cb399ad62a70210328d744fc"
export CF_CLOUD_MASTER="cfut_yk9DdlaSeE9KUvEIfJp9X7h0rT3FCYP9nu46fgB1c43012df"
export CF_WORKERS_EDIT="cfut_Qbjirmjg6FfzNxouHPJywEOCshtvsHvzze0926L9b9bf09f5"
export CF_FULL_INFRA="cfut_YUpmI2sdgIlC5s7QAb5Tff1fZt82gDJj3AetS3ojf6882ffa"
export CF_D1_ADMIN="cfut_yZaSSQe6RG1AVpodpbAacwIyVfuHy6apyyrzBoau329ab619"
export BRIDGE_SECRET="Yhe2vdRXKXF_VUF-CgkgO-nd5CxkM7FsqqOaF2aU0X0"
export R2_PUBLIC_URL="https://pub-1d1b12958f2d4ea380276bd8d0a1ff02.r2.dev"
export R2_BUCKET="dasexperten-images"
EOF
chmod 600 /home/claude/.env
echo ". /home/claude/.env" >> /home/claude/.bashrc
```


---

## 2. WORKER — full source (embedded)

The imager-bridge Cloudflare Worker source. This is the single source of truth — if Worker source on Cloudflare diverges from what's below, redeploy from this file using the deploy procedure in Section 9.

### 2.1 metadata.json

```json
{
  "main_module": "worker.js",
  "compatibility_date": "2025-09-01",
  "bindings": [
    { "type": "r2_bucket", "name": "R2_BUCKET", "bucket_name": "dasexperten-images" },
    { "type": "plain_text", "name": "R2_PUBLIC_BASE", "text": "https://pub-1d1b12958f2d4ea380276bd8d0a1ff02.r2.dev" }
  ],
  "keep_bindings": ["secret_text"]
}
```

### 2.2 worker.js (full source — 834 lines, Phase 2.8)

```javascript
/**
 * imager-bridge — Cloudflare Worker for Das Experten image generation.
 *
 * Phase 2.5: Dual buckets retired → unified dasexperten-images bucket
 *           with image_type routing (banner/slide/card/mockup/background)
 *           and refs/ subtree (products/characters/styles/grips).
 *
 * Architectural reference: emailer-bridge.
 *
 * Auth: Authorization: Bearer <BRIDGE_SECRET>.
 *
 * Required Worker secrets:
 *   - BRIDGE_SECRET     — shared secret for caller auth
 *   - GEMINI_API_KEY    — Google AI Studio paid-tier key
 *   - OPENAI_API_KEY    — OpenAI API key
 *
 * Required bindings:
 *   - R2_BUCKET         — R2 binding to dasexperten-images
 *   - R2_PUBLIC_BASE    — env var with public r2.dev URL base
 */

const GEMINI_FLASH_MODEL = 'gemini-2.5-flash-image';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Allowed top-level folders in the bucket
const IMAGE_TYPES = new Set([
  'banner',     // → banners/<campaign>/...
  'slide',      // → slides/<deck>/...
  'card',       // → cards/<marketplace>/<sku>/...
  'mockup',     // → mockups/<campaign>/...
  'background', // → backgrounds/<campaign>/...
  'adhoc'       // → banners/adhoc/... (auto-purged in 30d)
]);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Health check (no auth)
    if (request.method === 'GET' && url.pathname === '/') {
      return json({
        ok: true,
        service: 'imager-bridge',
        phase: '2.6',
        bucket: 'dasexperten-images',
        feature: 'reference_urls supported (up to 14 images per request)',
        message: 'POST /generate with auth + JSON payload.',
        endpoints: {
          'POST /generate': 'Generate image (Gemini Flash, returns R2 public URL)',
          'POST /upload-ref': 'Upload reference image to refs/<kind>/<slug>/',
          'GET  /list-refs?kind=products&slug=DE209-thermo-39': 'List reference images',
          'POST /test-r2': 'Self-test R2 storage',
          'GET  /': 'Health check'
        },
        image_types: Array.from(IMAGE_TYPES),
        ref_kinds: ['products', 'characters', 'styles', 'grips'],
        r2_public_base: env.R2_PUBLIC_BASE || null
      });
    }

    // Auth
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${env.BRIDGE_SECRET}`) {
      return json({ error: 'unauthorized' }, 401);
    }

    if (request.method === 'POST' && url.pathname === '/generate') {
      return handleGenerate(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/upload-ref') {
      return handleUploadRef(request, env);
    }

    // Phase A2: raw-binary upload for large files (no base64 round-trip)
    if (request.method === 'POST' && url.pathname === '/upload-ref-raw') {
      return handleUploadRefRaw(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/list-refs') {
      return handleListRefs(url, env);
    }

    // Phase B: smart reference resolution — returns ready URLs for scene
    if (request.method === 'POST' && url.pathname === '/resolve-refs') {
      return handleResolveRefs(request, env);
    }

    // Phase A1: bulk rename support
    if (request.method === 'GET' && url.pathname === '/list-all-refs') {
      return handleListAllRefs(env);
    }

    if (request.method === 'POST' && url.pathname === '/copy-ref') {
      return handleCopyRef(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/delete-ref') {
      return handleDeleteRef(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/test-r2') {
      return handleTestR2(env);
    }

    return json({ error: 'not_found', path: url.pathname }, 404);
  }
};

/* ----------------------------- Generate ----------------------------- */

async function handleGenerate(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch (err) {
    return json({ error: 'bad_json', detail: err.message }, 400);
  }

  const {
    prompt,
    engine = 'gemini-flash',
    aspect_ratio = '1:1',
    image_type = 'banner',
    save_to_r2 = true,
    r2_prefix,
    reference_urls = [],
    metadata = {}
  } = payload;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return json({ error: 'missing_prompt', detail: 'prompt field is required' }, 400);
  }

  if (engine !== 'gemini-flash' && engine !== 'openai' && engine !== 'auto') {
    return json({
      error: 'unsupported_engine',
      detail: `Phase 2.8 supports gemini-flash and openai. Got: ${engine}.`
    }, 400);
  }

  if (!IMAGE_TYPES.has(image_type)) {
    return json({
      error: 'unsupported_image_type',
      detail: `image_type must be one of: ${Array.from(IMAGE_TYPES).join(', ')}. Got: ${image_type}.`
    }, 400);
  }

  // Validate reference_urls — must be array of strings, max 14 (Gemini limit)
  if (!Array.isArray(reference_urls)) {
    return json({ error: 'bad_reference_urls', detail: 'must be an array' }, 400);
  }
  if (reference_urls.length > 14) {
    return json({ error: 'too_many_refs', detail: 'max 14 reference images per request' }, 400);
  }

  const startedAt = Date.now();

  try {
    // Fetch reference images if any
    const refImages = [];
    for (const url of reference_urls) {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`Failed to fetch reference ${url}: HTTP ${resp.status}`);
      }
      const arrayBuf = await resp.arrayBuffer();
      const mimeType = resp.headers.get('Content-Type') || 'image/png';
      refImages.push({
        mimeType: mimeType.split(';')[0].trim(),
        data: bytesToBase64(new Uint8Array(arrayBuf))
      });
    }

    let actualEngine = engine === 'auto' ? 'gemini-flash' : engine;
    let result;
    if (actualEngine === 'openai') {
      result = await callOpenAI(env.OPENAI_API_KEY, prompt, aspect_ratio);
    } else {
      result = await callGeminiFlash(env.GEMINI_API_KEY, prompt, aspect_ratio, refImages);
      actualEngine = 'gemini-flash';
    }
    const elapsed = Date.now() - startedAt;

    if (!save_to_r2) {
      return json({
        status: 'success',
        engine_used: actualEngine,
        model: actualEngine === 'openai' ? 'gpt-image-1' : GEMINI_FLASH_MODEL,
        image_base64: result.imageBase64,
        mime_type: result.mimeType,
        cost_usd: actualEngine === 'openai' ? 0.04 : 0.0,
        generation_time_ms: elapsed,
        references_used: reference_urls.length,
        metadata
      });
    }

    const key = buildR2Key({
      image_type,
      prefix: r2_prefix,
      sku: metadata.sku,
      campaign: metadata.campaign,
      deck: metadata.deck,
      marketplace: metadata.marketplace,
      mimeType: result.mimeType
    });

    const imageBytes = base64ToBytes(result.imageBase64);

    await env.R2_BUCKET.put(key, imageBytes, {
      httpMetadata: { contentType: result.mimeType },
      customMetadata: {
        prompt: prompt.slice(0, 1024),
        engine: actualEngine,
        model: actualEngine === 'openai' ? 'gpt-image-1' : GEMINI_FLASH_MODEL,
        image_type,
        sku: String(metadata.sku || ''),
        campaign: String(metadata.campaign || ''),
        skill_caller: String(metadata.skill_caller || ''),
        references_count: String(reference_urls.length),
        generated_at: new Date().toISOString()
      }
    });

    return json({
      status: 'success',
      engine_used: actualEngine,
      model: actualEngine === 'openai' ? 'gpt-image-1' : GEMINI_FLASH_MODEL,
      image_url: `${env.R2_PUBLIC_BASE}/${key}`,
      r2_key: key,
      mime_type: result.mimeType,
      cost_usd: actualEngine === 'openai' ? 0.04 : 0.0,
      generation_time_ms: elapsed,
      references_used: reference_urls.length,
      metadata
    });
  } catch (err) {
    return json({
      error: 'generation_failed',
      detail: err.message,
      engine: engine
    }, 500);
  }
}

/* ----------------------------- Upload Reference ----------------------------- */

/**
 * Upload reference image to refs/<kind>/<slug>/<filename>.
 * Body: multipart form-data with:
 *   - kind: products | characters | styles | grips
 *   - slug: e.g. DE209-thermo-39 or morning_lady
 *   - filename: tube_front.jpg
 *   - file: binary image bytes
 *
 * OR JSON body with base64-encoded image:
 *   { kind, slug, filename, image_base64, mime_type }
 */
async function handleUploadRef(request, env) {
  const contentType = request.headers.get('Content-Type') || '';

  let kind, slug, filename, bytes, mimeType;

  try {
    if (contentType.includes('application/json')) {
      const payload = await request.json();
      kind = payload.kind;
      slug = payload.slug;
      filename = payload.filename;
      mimeType = payload.mime_type || 'image/jpeg';
      if (!payload.image_base64) {
        return json({ error: 'missing_image_base64' }, 400);
      }
      bytes = base64ToBytes(payload.image_base64);
    } else if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      kind = form.get('kind');
      slug = form.get('slug');
      filename = form.get('filename');
      const file = form.get('file');
      if (!file) return json({ error: 'missing_file' }, 400);
      mimeType = file.type || 'image/jpeg';
      bytes = new Uint8Array(await file.arrayBuffer());
      if (!filename) filename = file.name;
    } else {
      return json({ error: 'unsupported_content_type', detail: contentType }, 415);
    }
  } catch (err) {
    return json({ error: 'bad_payload', detail: err.message }, 400);
  }

  if (!kind || !['products', 'characters', 'styles', 'grips'].includes(kind)) {
    return json({ error: 'bad_kind', detail: 'kind must be products|characters|styles|grips' }, 400);
  }
  // slug is optional for 'characters' (flat folder); required for products/styles/grips
  if (!slug && kind !== 'characters') {
    return json({ error: 'missing_slug', detail: `slug is required for kind=${kind}` }, 400);
  }
  if (!filename) return json({ error: 'missing_filename' }, 400);

  const key = slug
    ? `refs/${kind}/${slug}/${filename}`
    : `refs/${kind}/${filename}`;

  await env.R2_BUCKET.put(key, bytes, {
    httpMetadata: { contentType: mimeType },
    customMetadata: {
      kind,
      slug,
      uploaded_at: new Date().toISOString()
    }
  });

  return json({
    status: 'success',
    image_url: `${env.R2_PUBLIC_BASE}/${key}`,
    r2_key: key,
    bytes_written: bytes.length,
    mime_type: mimeType
  });
}

/**
 * Raw-binary upload handler. Avoids base64 decode CPU cost on Worker.
 * URL: POST /upload-ref-raw?kind=&slug=&filename=&mime_type=
 * Body: raw image bytes
 */
async function handleUploadRefRaw(request, env) {
  const url = new URL(request.url);
  const kind = url.searchParams.get('kind');
  const slug = url.searchParams.get('slug') || '';
  const filename = url.searchParams.get('filename');
  const mimeType = url.searchParams.get('mime_type') || 'image/png';

  if (!kind || !['products', 'characters', 'styles', 'grips'].includes(kind)) {
    return json({ error: 'bad_kind' }, 400);
  }
  if (!filename) return json({ error: 'missing_filename' }, 400);
  if (!slug && kind !== 'characters') {
    return json({ error: 'missing_slug', detail: `slug is required for kind=${kind}` }, 400);
  }

  const key = slug
    ? `refs/${kind}/${slug}/${filename}`
    : `refs/${kind}/${filename}`;

  await env.R2_BUCKET.put(key, request.body, {
    httpMetadata: { contentType: mimeType },
    customMetadata: { kind, slug, filename, uploaded_at: new Date().toISOString() }
  });

  return json({
    status: 'success',
    image_url: `${env.R2_PUBLIC_BASE}/${key}`,
    r2_key: key,
    mime_type: mimeType
  });
}

/**
 * List reference images under refs/<kind>/<slug>/
 * GET /list-refs?kind=products&slug=DE209-thermo-39
 */
async function handleListRefs(url, env) {
  const kind = url.searchParams.get('kind');
  const slug = url.searchParams.get('slug') || '';

  if (!kind || !['products', 'characters', 'styles', 'grips'].includes(kind)) {
    return json({ error: 'bad_kind' }, 400);
  }

  const prefix = slug ? `refs/${kind}/${slug}/` : `refs/${kind}/`;

  const list = await env.R2_BUCKET.list({ prefix, limit: 1000 });

  const files = list.objects.map(o => ({
    key: o.key,
    size: o.size,
    uploaded: o.uploaded,
    image_url: `${env.R2_PUBLIC_BASE}/${o.key}`
  }));

  return json({
    status: 'success',
    kind,
    slug,
    prefix,
    count: files.length,
    files
  });
}

/**
 * List ALL refs across all kinds and slugs.
 * GET /list-all-refs
 */
async function handleListAllRefs(env) {
  const list = await env.R2_BUCKET.list({ prefix: 'refs/', limit: 1000 });
  const files = list.objects.map(o => ({
    key: o.key,
    size: o.size,
    image_url: `${env.R2_PUBLIC_BASE}/${o.key}`
  }));
  return json({
    status: 'success',
    count: files.length,
    files,
    truncated: list.truncated || false
  });
}

/**
 * Phase B: smart reference resolution.
 *
 * POST /resolve-refs
 * Body: {
 *   sku:         "DE209"           // required, short code
 *   scene_type?: "hero_shot" | "lifestyle" | "marketplace_card" | "b2b_presentation"
 *   character?:  "Helga"           // optional character name
 *   max_refs?:   number            // default 4
 * }
 *
 * Returns: { reference_urls: [...], picked: [...], slug, all_available }
 */
async function handleResolveRefs(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return json({ error: 'bad_json', detail: err.message }, 400);
  }

  const { sku, scene_type, character, max_refs = 4 } = body;
  if (!sku) return json({ error: 'missing_sku' }, 400);

  // 1. Find slug by short SKU code: list refs/products/<SKU>-* prefix
  const skuPrefix = `refs/products/${sku.toUpperCase()}-`;
  const skuList = await env.R2_BUCKET.list({ prefix: skuPrefix, limit: 100 });

  if (skuList.objects.length === 0) {
    return json({
      error: 'sku_not_found',
      sku,
      hint: `No files found at ${skuPrefix}*`
    }, 404);
  }

  // Extract slug from first key: refs/products/DE209-thermo-39/DE209_xxx.png
  const slug = skuList.objects[0].key.split('/')[2];

  const allFiles = skuList.objects.map(o => ({
    key: o.key,
    filename: o.key.split('/').pop(),
    url: `${env.R2_PUBLIC_BASE}/${o.key}`
  }));

  // 2. Score files by relevance to scene_type
  // File semantics live in filename: tube_dark, box_lying_dark, lifestyle_thailand, paste_on_brush, etc.
  const scoreFile = (filename) => {
    const f = filename.toLowerCase();
    let score = 0;

    // Always-useful baseline references
    if (f.includes('tube_and_box_dark') && !f.includes('_v2') && !f.includes('_v3')) score += 5;
    if (f.includes('tube_dark')) score += 4;
    if (f.includes('tube_white')) score += 3;
    if (f.includes('box_lying')) score += 2;

    // Brush products — different file vocabulary
    const isBrushSku = sku && /^DE(101|105|106|107|116|118|119|120|122|123|130)$/.test(sku.toUpperCase());
    if (isBrushSku) {
      if (f.includes('brush_diagonal_dark')) score += 8;
      if (f.includes('brush_zoom_dark')) score += 9;       // best for brush_zoom scenes
      if (f.includes('brush_head')) score += 7;
      if (f.includes('brush_vertical')) score += 6;
      if (f.includes('brush_diagonal_white')) score += 4;
      if (f.includes('brush_lying')) score += 3;
      if (f.includes('multipack_packaged')) score += 4;     // packaged shows brand
      if (f.includes('multipack_blister')) score += 2;
      if (f.includes('blister_single')) score += 5;          // single SKU packaging
    }

    // Scene-type bonuses
    if (scene_type === 'hero_shot' || scene_type === 'b2b_presentation') {
      if (f.includes('tube_and_box')) score += 6;
      if (f.includes('tube_dark')) score += 5;
      if (f.includes('box_lying_dark')) score += 4;
      if (f.includes('lifestyle')) score -= 2;          // lifestyle distracts hero
      if (f.includes('paste_on_brush')) score -= 1;
    }
    else if (scene_type === 'lifestyle') {
      if (f.includes('lifestyle')) score += 8;
      if (f.includes('paste_on_brush')) score += 5;
      if (f.includes('tube_and_box')) score += 3;
    }
    else if (scene_type === 'marketplace_card') {
      if (f.includes('tube_white')) score += 7;
      if (f.includes('tube_and_box_white')) score += 6;
      if (f.includes('box_lying')) score += 4;
      if (f.includes('lifestyle')) score -= 3;          // marketplace cards prefer clean BG
    }
    else if (scene_type === 'paste_on_brush' || scene_type === 'brush_zoom') {
      if (f.includes('paste_on_brush')) score += 8;
      if (f.includes('brush')) score += 5;
    }

    // Penalties for v2/v3 dupes — prefer originals
    if (f.includes('_v2.')) score -= 1;
    if (f.includes('_v3.')) score -= 2;
    if (f.includes('_v4.')) score -= 3;

    return score;
  };

  const scored = allFiles
    .map(f => ({ ...f, score: scoreFile(f.filename) }))
    .sort((a, b) => b.score - a.score);

  // 3. Pick top N (leaving room for character if requested)
  const productSlots = character ? max_refs - 1 : max_refs;
  const picked = scored.slice(0, productSlots);

  // 4. Add character if requested
  if (character) {
    const charKey = `refs/characters/${character}.png`;
    const charObj = await env.R2_BUCKET.head(charKey);
    if (charObj) {
      picked.push({
        key: charKey,
        filename: `${character}.png`,
        url: `${env.R2_PUBLIC_BASE}/${charKey}`,
        score: 100,
        type: 'character'
      });
    } else {
      // Try .jpg variant
      const charKeyJpg = `refs/characters/${character}.jpg`;
      const charObjJpg = await env.R2_BUCKET.head(charKeyJpg);
      if (charObjJpg) {
        picked.push({
          key: charKeyJpg,
          filename: `${character}.jpg`,
          url: `${env.R2_PUBLIC_BASE}/${charKeyJpg}`,
          score: 100,
          type: 'character'
        });
      }
    }
  }

  return json({
    status: 'success',
    sku: sku.toUpperCase(),
    slug,
    scene_type: scene_type || null,
    character: character || null,
    reference_urls: picked.map(p => p.url),
    picked: picked.map(p => ({ filename: p.filename, score: p.score, type: p.type || 'product' })),
    all_available: scored.length
  });
}

/**
 * Copy a R2 object to a new key. Used for bulk rename.
 * POST /copy-ref { from_key, to_key }
 */
async function handleCopyRef(request, env) {
  const { from_key, to_key } = await request.json();

  if (!from_key || !to_key) {
    return json({ error: 'missing_keys' }, 400);
  }

  const src = await env.R2_BUCKET.get(from_key);
  if (!src) {
    return json({ error: 'source_not_found', from_key }, 404);
  }

  await env.R2_BUCKET.put(to_key, src.body, {
    httpMetadata: src.httpMetadata,
    customMetadata: src.customMetadata
  });

  return json({
    status: 'success',
    from_key,
    to_key,
    new_url: `${env.R2_PUBLIC_BASE}/${to_key}`
  });
}

/**
 * Delete an R2 object by key.
 * POST /delete-ref { key }
 */
async function handleDeleteRef(request, env) {
  const { key } = await request.json();
  if (!key) return json({ error: 'missing_key' }, 400);

  await env.R2_BUCKET.delete(key);
  return json({ status: 'success', deleted: key });
}

/* ----------------------------- R2 Self-Test ----------------------------- */

async function handleTestR2(env) {
  const RED_PNG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  const bytes = base64ToBytes(RED_PNG_B64);
  const key = `banners/adhoc/${timestamp()}_r2_self_test.png`;

  await env.R2_BUCKET.put(key, bytes, {
    httpMetadata: { contentType: 'image/png' },
    customMetadata: { purpose: 'r2-self-test' }
  });

  return json({
    status: 'success',
    image_url: `${env.R2_PUBLIC_BASE}/${key}`,
    r2_key: key,
    bytes_written: bytes.length
  });
}

/* ----------------------------- Helpers ----------------------------- */

/**
 * R2 key by image_type. Custom prefix overrides everything.
 *
 *   image_type=banner     → banners/<campaign>/YYYYMMDD_HHMMSS_<sku>_<rand>.png
 *   image_type=slide      → slides/<deck>/...
 *   image_type=card       → cards/<marketplace>/<sku>/...
 *   image_type=mockup     → mockups/<campaign>/...
 *   image_type=background → backgrounds/<campaign>/...
 *   image_type=adhoc      → banners/adhoc/...
 */
function buildR2Key({ image_type, prefix, sku, campaign, deck, marketplace, mimeType }) {
  const ext = mimeType === 'image/jpeg' ? 'jpg' : 'png';
  const ts = timestamp();
  const rand = Math.random().toString(36).slice(2, 8);

  if (prefix) {
    const base = sku ? `${ts}_${slug(sku)}_${rand}` : `${ts}_${rand}`;
    return `${prefix.replace(/\/+$/, '')}/${base}.${ext}`;
  }

  const skuPart = sku ? `_${slug(sku)}` : '';
  const filename = `${ts}${skuPart}_${rand}.${ext}`;

  switch (image_type) {
    case 'adhoc':
      return `banners/adhoc/${filename}`;
    case 'slide':
      return `slides/${slug(deck || campaign || 'untitled')}/${filename}`;
    case 'card':
      return `cards/${slug(marketplace || 'generic')}/${slug(sku || 'unknown')}/${filename}`;
    case 'mockup':
      return `mockups/${slug(campaign || 'adhoc')}/${filename}`;
    case 'background':
      return `backgrounds/${slug(campaign || 'adhoc')}/${filename}`;
    case 'banner':
    default:
      return `banners/${slug(campaign || 'adhoc')}/${filename}`;
  }
}

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    '_' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds())
  );
}

function slug(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64);
}

function base64ToBytes(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bytesToBase64(bytes) {
  // Chunked to avoid call-stack overflow on large images
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function callGeminiFlash(apiKey, prompt, aspectRatio, refImages = []) {
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const url = `${GEMINI_API_BASE}/${GEMINI_FLASH_MODEL}:generateContent`;

  // Build parts array: reference images first, then text prompt
  // Per Gemini docs, mixing inline image data + text in one user turn enables
  // image editing / style transfer / brand fidelity.
  const parts = [];
  for (const ref of refImages) {
    parts.push({
      inlineData: {
        mimeType: ref.mimeType,
        data: ref.data
      }
    });
  }
  parts.push({ text: prompt });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio }
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API ${response.status}: ${errText.slice(0, 500)}`);
  }

  const data = await response.json();
  const respParts = data?.candidates?.[0]?.content?.parts || [];
  const imagePart = respParts.find(p => p.inlineData?.data);

  if (!imagePart) {
    throw new Error(`Gemini returned no image: ${JSON.stringify(data).slice(0, 500)}`);
  }

  return {
    imageBase64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType || 'image/png'
  };
}

async function callOpenAI(apiKey, prompt, aspectRatio) {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY missing in Worker secrets — set via wrangler secret put OPENAI_API_KEY');
  }

  // Map aspect ratios to OpenAI gpt-image-1 supported sizes
  // gpt-image-1 supports: 1024x1024, 1536x1024 (landscape), 1024x1536 (portrait), auto
  const sizeMap = {
    '1:1':  '1024x1024',
    '4:3':  '1536x1024',
    '16:9': '1536x1024',
    '3:4':  '1024x1536',
    '9:16': '1024x1536'
  };
  const size = sizeMap[aspectRatio] || '1024x1024';

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: prompt.slice(0, 32000),  // OpenAI prompt cap
      n: 1,
      size: size,
      quality: 'high'
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API ${response.status}: ${errText.slice(0, 500)}`);
  }

  const data = await response.json();
  const imageData = data?.data?.[0];

  if (!imageData) {
    throw new Error(`OpenAI returned no image: ${JSON.stringify(data).slice(0, 500)}`);
  }

  // gpt-image-1 returns b64_json by default
  const b64 = imageData.b64_json || imageData.b64;
  if (!b64) {
    // If URL only, fetch it
    if (imageData.url) {
      const imgResp = await fetch(imageData.url);
      const buf = await imgResp.arrayBuffer();
      return {
        imageBase64: bytesToBase64(new Uint8Array(buf)),
        mimeType: 'image/png'
      };
    }
    throw new Error('OpenAI response had neither b64_json nor url');
  }

  return {
    imageBase64: b64,
    mimeType: 'image/png'
  };
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
```

### 2.3 Worker endpoints

| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET  | `/` | Health check | none |
| POST | `/generate` | Main image gen — returns R2 URL | Bearer |
| POST | `/upload-ref` | Upload reference (JSON+base64 or multipart) | Bearer |
| GET  | `/list-refs?kind=&slug=` | List refs by kind+slug | Bearer |
| GET  | `/list-all-refs` | Full inventory (all 246 files) | Bearer |
| POST | `/copy-ref` | R2 copy (for rename ops) | Bearer |
| POST | `/delete-ref` | R2 delete | Bearer |
| POST | `/resolve-refs` | Smart auto-pick refs by SKU+scene+character | Bearer |
| POST | `/test-r2` | R2 self-test | Bearer |

### 2.4 Worker secret bindings

These are bound to the Worker as encrypted secrets. To set or rotate:

```bash
. /home/claude/.env

# Set BRIDGE_SECRET
echo -n "Yhe2vdRXKXF_VUF-CgkgO-nd5CxkM7FsqqOaF2aU0X0" | \
  curl -X PUT \
    "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/workers/scripts/imager-bridge/secrets" \
    -H "Authorization: Bearer $CF_CLOUD_MASTER" \
    -H "Content-Type: application/json" \
    -d '{"name":"BRIDGE_SECRET","text":"Yhe2vdRXKXF_VUF-CgkgO-nd5CxkM7FsqqOaF2aU0X0","type":"secret_text"}'

# Set GEMINI_API_KEY
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/workers/scripts/imager-bridge/secrets" \
  -H "Authorization: Bearer $CF_CLOUD_MASTER" \
  -H "Content-Type: application/json" \
  -d '{"name":"GEMINI_API_KEY","text":"AIzaSyDz2sE_CnFxePhi1cRPmnu1cdmkmR1bFeM","type":"secret_text"}'

# Set OPENAI_API_KEY
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/workers/scripts/imager-bridge/secrets" \
  -H "Authorization: Bearer $CF_CLOUD_MASTER" \
  -H "Content-Type: application/json" \
  -d '{"name":"OPENAI_API_KEY","text":"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","type":"secret_text"}'
```


---

## 3. EXECUTION FLOW (default path — covers 90% of cases)

### Step 1 — Resolve refs by SKU + scene + character

```bash
. /home/claude/.env

REFS=$(curl -s -A "Mozilla/5.0" -X POST \
  "https://imager-bridge.dasexperten.workers.dev/resolve-refs" \
  -H "Authorization: Bearer $BRIDGE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"sku":"DE105","scene_type":"brush_zoom","character":"Faeze","max_refs":4}')

echo "$REFS" | python3 -m json.tool
```

Response contains `reference_urls[]` ready to feed into `/generate`.

### Step 2 — Build prompt (agency-grade, 4000–7000 chars)

The prompt is the most important part. Follow this structure:

```
═══ REFERENCE LOCKS ═══
Describe what reference images attached lock — geometry, colors, materials.
For products: brand DNA, label details, German flag, leaf badges, etc.
For characters: face structure, eye color, smile type, age, ethnicity.

═══ CONCEPT ═══
The creative idea that elevates the banner from stock to editorial.
Examples: "magnetic charcoal cloud", "before-after diptych", "anti-luxury industrial".

═══ COMPOSITION ═══
Specific layout — left/right thirds, character pose, product position.
Reserve negative space for text overlay if non-Latin language.

═══ GRIP LOCK (verbatim if character holds product) ═══
Use the exact grip block from bannerizer SKILL.md based on product type.

═══ LIGHTING ═══
Lancôme-style three-point: key + rim + minimal fill.
Color temperatures: 5600K cool key, 3200K warm rim.

═══ MATERIAL & TEXTURE PHYSICS ═══
Pore-level skin detail, translucent product materials, photorealistic textures.

═══ COLOR PALETTE ═══
Hex codes for each major surface.

═══ TYPOGRAPHY (only if Latin text — for non-Latin use Section 7 overlay) ═══
Position, hierarchy, font feeling, exact text.

═══ TECHNICAL ═══
Hasselblad H6D-100c, lens, f-stop, ISO. Cinema 5K render.
NO AI shimmer, NO smile clichés, NO stock-photo aesthetics.
```

### Step 3 — Generate image

```bash
# Build payload combining prompt + reference_urls from Step 1
python3 << PYEOF
import json
REFS = json.loads('''$REFS''')

prompt = """[full agency-grade prompt from Step 2]"""

payload = {
    "prompt": prompt,
    "engine": "gemini-flash",
    "aspect_ratio": "4:3",
    "image_type": "banner",
    "save_to_r2": True,
    "reference_urls": REFS["reference_urls"],
    "metadata": {
        "sku": "DE105",
        "campaign": "campaign_slug_here",
        "skill_caller": "imager",
        "scene_type": "brush_zoom",
        "character": "Faeze"
    }
}

with open("/tmp/imager_payload.json", "w") as f:
    json.dump(payload, f)
PYEOF

# Call /generate
curl -s --max-time 180 -A "Mozilla/5.0" -X POST \
  "https://imager-bridge.dasexperten.workers.dev/generate" \
  -H "Authorization: Bearer $BRIDGE_SECRET" \
  -H "Content-Type: application/json" \
  -d @/tmp/imager_payload.json \
  -o /tmp/imager_result.json

# Read result
python3 -c "
import json
d = json.load(open('/tmp/imager_result.json'))
print('status   :', d.get('status'))
print('image_url:', d.get('image_url'))
print('time     :', d.get('generation_time_ms'), 'ms')
"
```

Generation takes 14–20 seconds typical. Use `--max-time 180` to allow for slow Gemini responses.

### Step 4 — Download & verify

```bash
URL=$(python3 -c "import json; print(json.load(open('/tmp/imager_result.json'))['image_url'])")
curl -s -o /mnt/user-data/outputs/result.png "$URL"
file /mnt/user-data/outputs/result.png
```

If the result has Cyrillic/Arabic/CJK text on it AND the engine was `gemini-flash` — go to Section 7 (text overlay). Otherwise present the file to the user.

---

## 4. INPUT PARAMETERS (full schema)

When called as gate, calling skill provides this. When called directly, build from conversation.

```yaml
# === CORE (always required) ===
prompt: string            # Full agency-grade prompt — see Section 3 Step 2
image_type: enum          # banner | slide | card | mockup | background | adhoc
aspect_ratio: enum        # 4:3 | 3:4 | 1:1 | 16:9 | 9:16  (default 4:3)
campaign: string          # short slug for R2 path

# === REFERENCE RESOLUTION (auto via /resolve-refs) ===
sku: string | null        # DE201, DE105, etc — Worker resolves slug
scene_type: enum | null   # see Section 5
character: string | null  # name from roster (Section 6) — case-sensitive
max_refs: int             # default 4, max 14

# === ENGINE ROUTING ===
engine: enum              # gemini-flash (default, free) | gemini-pro | openai
                          # Use gemini-pro/openai for non-Latin text on banner

# === STORAGE ===
save_to_r2: boolean       # default true
metadata: object          # arbitrary metadata stored in R2 alongside image

# === TEXT OVERLAY (post-process for non-Latin) ===
text_overlay: object | null  # see Section 7 schema
```

---

## 5. SCENE TYPES & SCORING LOGIC

The Worker `/resolve-refs` endpoint scores files by filename keywords against scene_type.

### Default 6 scene types

| scene_type | Best-fit refs | Use case |
|---|---|---|
| `hero_shot` | tube_and_box_dark, tube_dark, box_lying_dark | Solo product, dark BG, drama |
| `b2b_presentation` | Same as hero_shot, slightly more formal | Investor/distributor decks |
| `lifestyle` | lifestyle_country_*, paste_squeeze, paste_on_brush | Country-themed, real environment |
| `marketplace_card` | tube_white, tube_and_box_white, box_lying | Ozon/WB/Amazon clean BG |
| `paste_on_brush` | paste_on_brush.png + tube_dark | Demo "how to use" |
| `brush_zoom` | brush_zoom_dark, brush_diagonal_dark, brush_head | Macro brush, charcoal mood |

### Scoring function (excerpt from worker.js)

```javascript
const scoreFile = (filename) => {
  const f = filename.toLowerCase();
  let score = 0;

  // Always-useful baseline
  if (f.includes('tube_and_box_dark') && !f.includes('_v2')) score += 5;
  if (f.includes('tube_dark')) score += 4;
  if (f.includes('tube_white')) score += 3;
  if (f.includes('box_lying')) score += 2;

  // Brush products — different file vocabulary
  const isBrushSku = sku && /^DE(101|105|106|107|116|118|119|120|122|123|130)$/.test(sku);
  if (isBrushSku) {
    if (f.includes('brush_zoom_dark')) score += 9;
    if (f.includes('brush_diagonal_dark')) score += 8;
    if (f.includes('brush_head')) score += 7;
    if (f.includes('brush_vertical')) score += 6;
    if (f.includes('multipack_packaged')) score += 4;
  }

  // Scene-type bonuses
  if (scene_type === 'hero_shot' || scene_type === 'b2b_presentation') {
    if (f.includes('tube_and_box')) score += 6;
    if (f.includes('lifestyle')) score -= 2;
  }
  if (scene_type === 'lifestyle') {
    if (f.includes('lifestyle')) score += 8;
    if (f.includes('paste_on_brush')) score += 5;
  }
  if (scene_type === 'marketplace_card') {
    if (f.includes('tube_white')) score += 7;
    if (f.includes('lifestyle')) score -= 3;
  }
  if (scene_type === 'brush_zoom') {
    if (f.includes('brush_zoom')) score += 8;
    if (f.includes('brush')) score += 5;
  }

  // Penalize duplicates
  if (f.includes('_v2.')) score -= 1;
  if (f.includes('_v3.')) score -= 2;

  return score;
};
```


---

## 6. REFERENCE LIBRARY — full inventory

R2 contains 246 reference files: 160 product photos + 81 character portraits + 5 brand assets.

### 6.1 Products (160 files across 26 SKUs)

All product files use the naming convention `<SKU>_<descriptor>.<ext>` and live at `refs/products/<SKU-slug>/`.

| SKU | Slug | Files | Category |
|---|---|---|---|
| DE101 | DE101-toothbrush | 1 | Brush |
| DE105 | DE105-schwarz-brush | 8 | Brush (charcoal) |
| DE106 | DE106-sensitiv-brush | 2 | Brush (sensitive) |
| DE107 | DE107-mittel-brush | 5 | Brush (medium) |
| DE111 | DE111-floss-waxed-mint | 4 | Floss |
| DE112 | DE112-floss-expanding | 5 | Floss |
| DE115 | DE115-floss-schwarz | 4 | Floss (charcoal) |
| DE116 | DE116-kraft-brush | 8 | Brush (heavy-duty) |
| DE118 | DE118-kinder-brush | 1 | Brush (kids — dolphin) |
| DE119 | DE119-grosse-brush | 2 | Brush (premium gold/silver) |
| DE120 | DE120-nano-brush | 7 | Brush (nano massage) |
| DE122 | DE122-aktiv-brush | 4 | Brush (purple aktiv) |
| DE123 | DE123-bio-brush | 5 | Brush (eco bamboo) |
| DE125 | DE125-interdental | 2 | Interdental |
| DE130 | DE130-intensiv-brush | 6 | Brush (intensive green) |
| DE201 | DE201-schwarz | 13 | Paste (charcoal) |
| DE202 | DE202-detox | 12 | Paste (detox) |
| DE203 | DE203-ginger-force | 15 | Paste (ginger) |
| DE204 | DE204-aktiv-forte | 2 | Paste (aktiv forte) |
| DE205 | DE205-cococannabis | 15 | Paste (cocoa+hemp) |
| DE206 | DE206-symbios | 10 | Paste (probiotic) |
| DE207 | DE207-buddy-microbies | 4 | Paste (kids microbies) |
| DE208 | DE208-evolution-kids | 4 | Paste (kids evolution) |
| DE209 | DE209-thermo-39 | 4 | Paste (thermal) |
| DE210 | DE210-innoweiss | 10 | Paste (whitening) |
| DE211 | DE211-misc | 2 | Studio misc |

### 6.2 File naming taxonomy (within each SKU folder)

```
DE###_tube_dark.png              Solo tube, dark/black BG
DE###_tube_white.png             Solo tube, white/clean BG
DE###_tube_and_box_dark.png      Tube + box together, dark BG (HERO SHOT)
DE###_tube_and_box_white.png     Tube + box together, white BG
DE###_tube_and_box_rus.png       Russian-language packaging variant
DE###_tube_and_box_eng.png       English-language packaging variant
DE###_box_dark.png               Box only, vertical
DE###_box_lying_dark.png         Box only, lying flat
DE###_box_vertical_dark.png      Box only, standing vertical
DE###_box_horizontal_dark.png    Box only, horizontal
DE###_lifestyle_<country>.png    Country-themed lifestyle (thailand, ceilon, china, columbia, jungle, beach_sunrise)
DE###_lifestyle_paste_squeeze.png   Paste squeezed out demo
DE###_paste_on_brush.png         Paste squeezed onto brush head
DE###_brush_zoom_dark.png        Macro brush head close-up
DE###_brush_diagonal_dark.png    Brush at angle, dark BG
DE###_brush_vertical_*.png       Brush standing vertical
DE###_multipack_blister_*.png    4-pack blister
DE###_multipack_packaged_*.png   4-pack in branded packaging
DE###_blister_single_*.png       Single SKU blister
DE###_floss_container_*.png      Floss container variations
```

### 6.3 Characters (81 files at `refs/characters/`)

Naming: `<Name>.png` for unique, `<Name>_2.png`, `<Name>_3.png`, `<Name>_4.png` for multi-photo people.

```
Single-photo: Abdulova, Alina, Andrea, ArminePapazjan, Ashley, Ayka,
  Bodrova, Brucelda, Brucella, Chegga, Coli, Colina, Dalla,
  Garrieta, Gerardina, Grishna, Haide, Hamda, Hardy, Harreth,
  Helga, Henrietta, Hrista, Joanna, Kinsy, Kirienka, Kozlovskaya,
  Krasochkina, Kristina, Kuravleva, Leona, Lewandowskaya, Lia,
  Lota, Manuka, Medvedeva, Menuar, Michellanghela, Mironova,
  MissKosmoss, MrsWaltz, Nagieva, Obnorskaya, Paola, Pevtsova,
  Roberta, Romaria, Rona, Rubi, Rubina, Ruda, Ruslana, Shura,
  Sollda, Tika, Toma, Tupa, Varda, Yakovleva, Zina

Multi-photo:
  Aura, Aura_2          (2 photos)
  Delona, Delona_2       (2 photos)
  Faeze, Faeze_2         (2 photos)
  Gozde, Gozde_2         (2 photos)
  Klinsy, Klinsy_2, Klinsy_3   (3 photos)
  Kumi, Kumi_2           (2 photos)
  Marianna, Marianna_2, Marianna_3, Marianna_4  (4 photos)
  Menshova, Menshova_2   (2 photos)
  Ronalda, Ronalda_2     (2 photos)
```

Live-roster query (always returns current 81):

```bash
. /home/claude/.env
curl -s -A "Mozilla/5.0" \
  "https://imager-bridge.dasexperten.workers.dev/list-refs?kind=characters&slug=" \
  -H "Authorization: Bearer $BRIDGE_SECRET" \
  | python3 -c "
import sys, json
d = json.load(sys.stdin)
for f in d.get('files', []):
    print(' ', f['key'].split('/')[-1])
"
```

### 6.4 Brand assets

```
refs/styles/brand-logos/
  logo_white_on_black.jpg        Das Experten logo, white on black
  logo_grey_on_black.png         Das Experten logo, grey on black
  logo_full_with_flag_white.png  Full logo with German flag, white BG

refs/styles/brand-badges/
  badge_microbiome_white.png     "Microbiome friendly" badge, white BG
  badge_microbiome_dark.png      "Microbiome friendly" badge, dark BG
```

### 6.5 Live inventory query

To get current count and full file list at any time:

```bash
. /home/claude/.env
curl -s -A "Mozilla/5.0" \
  "https://imager-bridge.dasexperten.workers.dev/list-all-refs" \
  -H "Authorization: Bearer $BRIDGE_SECRET" \
  | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(f'Total refs: {d.get(\"count\")}')
"
```


---

## 7. TEXT OVERLAY (Cyrillic / non-Latin script handling)

**The problem:** Gemini Flash on free tier produces typos when rendering Cyrillic, Arabic, Vietnamese, Thai, CJK directly on banner. Examples observed: "ВОЗВРАВАЕТ" instead of "ВОЗВРАЩАЕТ", "СЕЙНАС" instead of "СЕЙЧАС", "Актививавнный" instead of "Активированный".

**The solution:** generate base banner with EMPTY negative space (Worker's prompt explicitly forbids text), then overlay perfect typography via Pillow using Cyrillic-perfect fonts.

### 7.0 PINNED HARD RULES — apply to every text overlay (user memory pin #30)

These rules are mandatory across ALL imager outputs — banners, slides, product cards, infographics, blog cards, decks. No exceptions.

1. **Drop shadow on every text element** (header, sub-header, description, CTA). Exact params: offset **+4px right, +4px down**, blur **1px**, no background plate, no gradient strip underneath text.

2. **Shadow CONTRASTS text color** — this is non-negotiable. Never duplicate the text color in the shadow (e.g., black text + black shadow). Apply:
   - **Dark text** (#16100C) → **light cream shadow** (#F5F0E5, alpha 230)
   - **Light text** (#FAFAF8) → **warm dark brown shadow** (#2A1F18, alpha 230)
   - The reference `compose_text.py` resolves this automatically via `shadow_color_for()` based on text luminance.

3. **Face-aware positioning** — never cover a face. If a head occupies the top 30% of the frame (detected via dark-pixel mass in upper rows), the header moves to the bottom. Otherwise header stays top. Sub-header and description follow header position.

4. **Letter-spacing = 1.0× natural always.** No expanded tracking. No `T H R E E` style. If text overflows the frame width, reduce font size — never widen letter-spacing. The reference script's auto-fit loop reduces font size step-by-step to enforce this.

5. **Default font = Manrope ExtraBold** (variable weight 800). Auto-downloaded from Google Fonts on first use. Switch to Lora only for serif-magazine register; switch to DejaVu Sans Bold only if Manrope cannot be fetched.

These rules are enforced by `compose_text.py` below. Do not bypass them with ad-hoc Pillow code in a one-off script — always use this reference implementation.

### 7.1 Two-stage workflow

**Stage 1 — Generate textless base.** Add to your prompt the strict no-text policy:

```
═══ TEXT POLICY — STRICT ═══

ABSOLUTELY NO TEXT anywhere on the banner. NO headlines. NO captions. NO labels.
NO logos other than what's physically engraved on the product.
NO watermarks. NO numbers. NO Cyrillic, NO Latin, NO any script.
The banner is a pure visual — text will be added later in post-production.
Do not attempt to render any words.

Reserve PURE EMPTY DARK SPACE in the [lower-right OR right-third] of the image —
flat negative space, no particles, no detail, no rim light artifacts.
This area is reserved for text overlay.
```

**Stage 2 — Pillow overlay using Manrope ExtraBold (default, modern editorial).**

Default font is **Manrope variable (weight 800 = ExtraBold)**. The script auto-downloads it from Google Fonts on first use into `/home/claude/work/fonts/Manrope-Variable.ttf`. Manrope covers Cyrillic, Latin Extended, Greek, Vietnamese — perfect for the international product line.

Fallback fonts already present on the Claude sandbox (use only if explicitly required):

```
/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf            (serif, magazine register)
/usr/share/fonts/truetype/google-fonts/Lora-Italic-Variable.ttf     (italic serif)
/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf                (system fallback sans)
/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf               (alternative serif)
/usr/share/fonts/truetype/freefont/FreeSerif.ttf                    (extensive Cyrillic)
/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf       (Times-like serif)
```

Use **Manrope ExtraBold** as default for headers and sub-headers. Use **Lora** only when a serif-magazine register is explicitly required (perfumery, luxury, vintage). Use **DejaVu Sans Bold** only as a system fallback if Manrope cannot be fetched.

### 7.2 Reference Pillow overlay script (v2 — Drop Shadow + Face-Aware)

**HARD RULES enforced by this script (from user memory pin #30):**

1. **Drop shadow on every text element (header, sub-header, description).** Pillow drop shadow with these EXACT parameters: offset +4px right / +4px down, blur radius 1px, no underlying background plate, no semi-transparent gradient strip behind text.

2. **Shadow CONTRASTS text color, never duplicates it.**
   - Dark text (#16100C) → light warm cream shadow #F5F0E5 alpha 230
   - Light/white text (#FAFAF8) → dark warm brown shadow #2A1F18 alpha 230
   - Never: dark text + dark shadow, or light text + light shadow. That just thickens the stroke and adds no separation from the background.

3. **Face-aware positioning.** Detect dark hair mass in the top 30% of the frame. If a head occupies that zone, header moves to the bottom; subhead/description follow underneath. Otherwise header stays top. Never cover the face.

4. **Letter-spacing 1.0× natural always.** No expanded tracking. If text overflows, reduce font size — never widen letter-spacing.

5. **Font default = Manrope ExtraBold (variable weight 800).** Modern editorial register, perfect Cyrillic/Latin/CJK coverage when downloaded from Google Fonts. Lora serif (legacy) is opt-in for magazine-style brand banners only — Manrope is the default for all blog, editorial, and social-card output.

Save as `/home/claude/compose_text.py`:

```python
"""Pillow text overlay v2 — drop shadow + face-aware positioning.
Enforces user-pinned typography rules (memory pin #30).

Usage: python3 compose_text.py <base_image> <output_image> <payload.json>
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
import json, sys, os, urllib.request

base_path = sys.argv[1]
output_path = sys.argv[2]
payload_path = sys.argv[3]

with open(payload_path) as f:
    p = json.load(f)

base = Image.open(base_path).convert("RGB")
W, H = base.size

# === FONT ENSURE — Manrope ExtraBold (default) ===
FONT_DIR = "/home/claude/work/fonts"
MANROPE = f"{FONT_DIR}/Manrope-Variable.ttf"
os.makedirs(FONT_DIR, exist_ok=True)
if not os.path.exists(MANROPE):
    urllib.request.urlretrieve(
        "https://github.com/google/fonts/raw/main/ofl/manrope/Manrope%5Bwght%5D.ttf",
        MANROPE
    )

def get_font(size, weight=800, path=None):
    """Return a Pillow font instance. Default Manrope ExtraBold."""
    path = path or p.get("font_path", MANROPE)
    f = ImageFont.truetype(path, size=size)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass
    return f

def text_dims(text, font):
    bbox = ImageDraw.Draw(Image.new('RGB', (1,1))).textbbox((0,0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]

# === DROP SHADOW — contrast-aware (the hard rule) ===
def is_dark(rgba):
    """Decide whether color is dark or light by luminance."""
    r, g, b = rgba[:3]
    return (0.299*r + 0.587*g + 0.114*b) < 128

def shadow_color_for(text_color):
    """Pick contrasting shadow per hard rule."""
    if is_dark(text_color):
        return (245, 240, 229, 230)  # cream, for dark text
    return (42, 31, 24, 230)         # warm dark brown, for light text

def draw_text_with_shadow(img_rgba, xy, text, font, fill,
                          offset=(4, 4), blur=1):
    """Draw text with the standard drop shadow. Returns composited RGBA."""
    W, H = img_rgba.size
    shadow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow_layer).text(
        (xy[0] + offset[0], xy[1] + offset[1]),
        text, font=font, fill=shadow_color_for(fill)
    )
    if blur > 0:
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(blur))
    text_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(text_layer).text(xy, text, font=font, fill=fill)
    return Image.alpha_composite(
        Image.alpha_composite(img_rgba, shadow_layer),
        text_layer
    )

# === FACE-AWARE POSITIONING ===
def detect_head_top(img_rgb, dark_threshold=70, min_count=8):
    """Scan rows from top; first row with >=min_count dark pixels = head top.
    Returns y-coordinate of head top or None if no head detected."""
    arr = np.array(img_rgb.convert("L"))
    for row in range(arr.shape[0]):
        if (arr[row, :] < dark_threshold).sum() > min_count:
            return row
    return None

def pick_header_position(img_rgb, text_h, margin_x):
    """Return (text_y, strategy) per pinned rule:
    if head occupies top 30%, push header to bottom; else stay top."""
    W, H = img_rgb.size
    head_top = detect_head_top(img_rgb)
    if head_top is not None and head_top < int(H * 0.30):
        return (H - text_h - int(H * 0.10) - 20, "BOTTOM")
    return (int(H * 0.10), "TOP")

# === RENDER ===
result = base.convert("RGBA")
margin_x = int(W * p.get("margin_x_pct", 0.04))

# --- HEADER ---
if p.get("header"):
    header_text = p["header"]
    header_size = p.get("header_size", 64)
    text_color = tuple(p.get("header_color", [22, 16, 12, 255]))

    # Auto-fit size if text overflows; never widen letter-spacing
    font = get_font(header_size)
    while header_size > 24:
        w, _ = text_dims(header_text, font)
        if w <= W - 2 * margin_x:
            break
        header_size -= 2
        font = get_font(header_size)

    _, text_h = text_dims(header_text, font)
    text_y, strategy = pick_header_position(base, text_h, margin_x)
    text_x = margin_x
    result = draw_text_with_shadow(result, (text_x, text_y), header_text, font, text_color)
    p["_header_y_used"] = text_y
    p["_header_strategy"] = strategy
    p["_header_h"] = text_h

# --- SUB-HEADER ---
if p.get("subheader"):
    sub_text = p["subheader"]
    sub_size = p.get("subheader_size", 28)
    sub_color = tuple(p.get("subheader_color", [22, 16, 12, 255]))
    font = get_font(sub_size, weight=p.get("subheader_weight", 600))

    while sub_size > 14:
        w, _ = text_dims(sub_text, font)
        if w <= W - 2 * margin_x:
            break
        sub_size -= 2
        font = get_font(sub_size, weight=p.get("subheader_weight", 600))

    _, sub_h = text_dims(sub_text, font)
    # Place immediately below header
    sub_y = p.get("_header_y_used", int(H * 0.10)) + p.get("_header_h", 0) + 18
    result = draw_text_with_shadow(result, (margin_x, sub_y), sub_text, font, sub_color)

# --- DESCRIPTION (optional, italic body line) ---
if p.get("description"):
    desc_text = p["description"]
    desc_size = p.get("desc_size", 22)
    desc_color = tuple(p.get("desc_color", [22, 16, 12, 255]))
    # Italic only if explicitly requested AND italic font supplied; default = regular Manrope
    font = get_font(desc_size, weight=p.get("desc_weight", 500))
    desc_y = p.get("_header_y_used", int(H * 0.10)) + p.get("_header_h", 0) + 64
    result = draw_text_with_shadow(result, (margin_x, desc_y), desc_text, font, desc_color)

# --- CTA BUTTON (optional) ---
if p.get("cta"):
    cta_text = p["cta"]
    cta_size = p.get("cta_size", 22)
    cta_text_color = tuple(p.get("cta_text_color", [28, 22, 14, 255]))
    cta_bg = tuple(p.get("cta_bg", [208, 168, 92, 255]))  # gold default
    pad_x, pad_y = 22, 11
    font = get_font(cta_size, weight=800)
    text_w, text_h = text_dims(cta_text, font)
    cta_w = text_w + 2 * pad_x
    cta_h = text_h + 2 * pad_y
    cta_x = W - margin_x - cta_w
    cta_y = H - int(H * 0.10) - cta_h

    cta_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(cta_layer).rectangle(
        [(cta_x, cta_y), (cta_x + cta_w, cta_y + cta_h)], fill=cta_bg
    )
    result = Image.alpha_composite(result, cta_layer)
    result = draw_text_with_shadow(
        result, (cta_x + pad_x, cta_y + pad_y - 2),
        cta_text, font, cta_text_color
    )

# === SAVE ===
result.convert("RGB").save(output_path, "PNG", optimize=True)
print(f"Saved: {output_path} ({result.size})")
print(f"Header strategy: {p.get('_header_strategy', 'n/a')}")
```

### 7.3 Payload format

Minimal payload — just a header on a dark scene:

```json
{
  "header": "Что вы перестали делать, не заметив этого",
  "header_size": 64,
  "header_color": [22, 16, 12, 255]
}
```

Full payload with sub-header, description, and CTA:

```json
{
  "header": "Чёрное возвращает черноту",
  "header_size": 72,
  "header_color": [22, 16, 12, 255],

  "subheader": "DAS EXPERTEN · SCHWARZ",
  "subheader_size": 28,
  "subheader_weight": 700,
  "subheader_color": [22, 16, 12, 255],

  "description": "Активированный уголь из кокоса. Налёт уходит с первой чистки.",
  "desc_size": 22,
  "desc_weight": 500,
  "desc_color": [22, 16, 12, 255],

  "cta": "КУПИТЬ СЕГОДНЯ",
  "cta_size": 22,
  "cta_text_color": [28, 22, 14, 255],
  "cta_bg": [208, 168, 92, 255],

  "margin_x_pct": 0.04,
  "font_path": "/home/claude/work/fonts/Manrope-Variable.ttf"
}
```

**Color rule reminder:**
- For a light-scene image with dark text: keep header_color around `[22,16,12,255]`. Shadow auto-resolves to cream `[245,240,229,230]`.
- For a dark-scene image (night, deep shadow, dark fabric backgrounds): set header_color to `[250,250,248,255]`. Shadow auto-resolves to warm dark brown `[42,31,24,230]`.
- The script's `shadow_color_for()` makes this decision automatically based on text luminance — you only set text color.

**Font weight values (Manrope variable axis):**
- 200 ExtraLight, 300 Light, 400 Regular, 500 Medium, 600 SemiBold, 700 Bold, 800 ExtraBold (default for headers)

### 7.4 Usage

```bash
python3 /home/claude/compose_text.py \
  /tmp/textless_base.png \
  /mnt/user-data/outputs/final_banner.png \
  /tmp/text_payload.json
```

### 7.5 Layout variants

The default Pillow script puts text in lower-right. Modify `headline_y_pct` and use mirrored x calculations for other layouts:

| Layout | headline_y_pct | x calculation | Where to reserve negative space in prompt |
|---|---|---|---|
| Lower-right (default) | 0.50 | `W - RIGHT_MARGIN - line_w` | "lower-right quadrant" |
| Upper-right | 0.05 | same | "upper-right quadrant" |
| Lower-left | 0.50 | `LEFT_MARGIN` | "lower-left quadrant" |
| Centered | 0.40 | `(W - line_w) / 2` | "center, around mid-frame" |


---

### 7.6 Infographic-specific overlay pipeline (CRITICAL — for technolog skill)

**Why this exists:** Infographics are NOT banners. A banner has 1 headline + 1 sub + 1 CTA in known locations. An infographic has 6–8 callout cards scattered around a hero product, each with its own headline, value, and label. The default Pillow overlay (Sections 7.2–7.5) is banner-shaped and fails on infographics — you'll get either AI-mangled Cyrillic embedded inside Gemini's render, or a single text block in the corner ignoring all the callout cards.

**Symptom of incorrect infographic generation:** Gemini's output contains gibberish-Cyrillic text like "ПОПЛОЛИЧЕРЕ" or "АОТАВИВНТЫЙ" — this means the skill let Gemini render text inside callout cards, instead of producing textless cards and overlaying with Pillow.

**Mandatory infographic rule:** when `image_type=infographic` OR `scene_type=infographic` OR caller is `technolog` skill OR prompt contains "callout" / "infographic" / "fact panel" / "клинический инфографик":

#### Stage 1 — Gemini renders ONLY:

- Hero product (toothbrush, paste tube, box, etc.) — full reference fidelity
- Callout card frames (rectangular borders, gold or grey strokes)
- Decorative micro-icons INSIDE cards (molecular schematics, geometric diagrams, anatomical cross-sections — NEVER with text labels)
- Background gradient and atmospheric layer
- **NO text anywhere — neither headlines, nor values, nor labels, nor unit suffixes (%, ppm, mm). Reserve clean negative space inside each card for Pillow.**

Prompt MUST include this strict NO-TEXT clause:

```
TEXT POLICY — STRICT: ABSOLUTELY NO TEXT, NO numbers, NO labels, NO percentages,
NO units (mm/ppm/%/Ra), NO before/after captions, NO Cyrillic, NO Latin, NO any
script. Every callout card has a clean blank rectangle reserved at its top
(headline zone) and a clean blank strip at its bottom (value/label zone).
The decorative diagram inside each card is purely visual — no text labels.
Text will be added in post-production via Pillow overlay.
```

#### Stage 2 — Pillow renders all text in known card geometry

Caller (technolog skill) must pass a structured layout payload, not just a prompt. Format:

```json
{
  "layout": "infographic_8panel_centered_product",
  "canvas": [864, 1152],
  "hero_product_bbox": [305, 240, 555, 750],
  "panels": [
    {
      "id": "panel_1_top_left",
      "bbox": [40, 50, 395, 380],
      "headline": "УГОЛЬ В ПОЛИМЕРЕ",
      "headline_font": "russo",
      "headline_size": 28,
      "description_lines": [
        "Активированный кокосовый",
        "уголь интегрирован в волокно",
        "на этапе экструзии"
      ],
      "description_font": "comfortaa",
      "description_size": 14,
      "value": "0 ppm",
      "value_font": "russo",
      "value_size": 32,
      "value_label": "выброс частиц",
      "diagram_zone_bbox": [60, 180, 375, 320],
      "diagram_zone_already_rendered_by_gemini": true
    },
    {
      "id": "panel_2_top_right",
      "bbox": [469, 50, 824, 380],
      "headline": "ДВА ЯРУСА",
      "description_lines": ["Внешний ярус 0,01 мм проникает", "в борозду. Внутренний снимает", "налёт с эмали"],
      "value": "+32%",
      "value_label": "удаление налёта"
    },
    "// ... 6 more panels in this exact format"
  ]
}
```

The Pillow overlay script for infographics walks `panels[]` and for each panel renders:

1. `headline` at top of `bbox` (font from font system, see Section 4 — typography)
2. `description_lines` below headline, smaller body font
3. `value` (large, bold, gold or accent color) anchored at bottom-third of `bbox`
4. `value_label` below `value`, small caption font

#### Reference implementation — `compose_infographic.py`

```python
"""Pillow overlay for infographic-style multi-panel images.
Caller provides layout JSON; this script walks panels and renders all text."""
from PIL import Image, ImageDraw, ImageFont
import json, sys

base_path, output_path, layout_path = sys.argv[1:4]
with open(layout_path) as f:
    layout = json.load(f)

base = Image.open(base_path).convert("RGBA")
overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
draw = ImageDraw.Draw(overlay)

FONTS = {
    "russo":     "/home/claude/fonts/RussoOne-Regular.ttf",
    "rubik":     "/home/claude/fonts/Rubik-Variable.ttf",
    "manrope":   "/home/claude/fonts/Manrope-Variable.ttf",
    "mulish":    "/home/claude/fonts/Mulish-Variable.ttf",
    "comfortaa": "/home/claude/fonts/Comfortaa-Bold.ttf",
}

def get_font(role, size):
    return ImageFont.truetype(FONTS.get(role, FONTS["comfortaa"]), size)

GOLD = (188, 152, 78, 255)
WHITE = (245, 240, 232, 255)
BODY = (200, 200, 210, 255)

for panel in layout["panels"]:
    x1, y1, x2, y2 = panel["bbox"]
    panel_w = x2 - x1
    pad = 16

    # 1. Headline at top
    if "headline" in panel:
        font = get_font(panel.get("headline_font", "russo"), panel.get("headline_size", 24))
        draw.text((x1 + pad, y1 + pad), panel["headline"], font=font, fill=WHITE)

    # 2. Description lines below headline
    if "description_lines" in panel:
        font = get_font(panel.get("description_font", "comfortaa"), panel.get("description_size", 14))
        line_h = panel.get("description_size", 14) + 6
        desc_y = y1 + pad + panel.get("headline_size", 24) + 12
        for i, line in enumerate(panel["description_lines"]):
            draw.text((x1 + pad, desc_y + i * line_h), line, font=font, fill=BODY)

    # 3. Value (large, gold) anchored at bottom-third
    if "value" in panel:
        font = get_font(panel.get("value_font", "russo"), panel.get("value_size", 32))
        bbox = draw.textbbox((0, 0), panel["value"], font=font)
        v_w = bbox[2] - bbox[0]
        v_x = x1 + (panel_w - v_w) // 2
        v_y = y2 - 60
        draw.text((v_x, v_y), panel["value"], font=font, fill=GOLD)

    # 4. Value label below value
    if "value_label" in panel:
        font = get_font(panel.get("label_font", "comfortaa"), panel.get("label_size", 12))
        bbox = draw.textbbox((0, 0), panel["value_label"], font=font)
        l_w = bbox[2] - bbox[0]
        l_x = x1 + (panel_w - l_w) // 2
        draw.text((l_x, y2 - 22), panel["value_label"], font=font, fill=BODY)

result = Image.alpha_composite(base, overlay).convert("RGB")
result.save(output_path, "PNG", optimize=True, quality=95)
print(f"Saved: {output_path}")
```

#### Diagnostic checklist — when infographic comes back wrong

If user reports "Cyrillic gibberish" or "wrong text" or "garbled labels" on an infographic:

1. **Check Gemini prompt** — did it contain TEXT POLICY STRICT clause? If no → Pillow was bypassed.
2. **Check whether Pillow ran** — did the call sequence include `compose_infographic.py`? If no → only Gemini ran, that's the bug.
3. **Check layout JSON** — does the panel `bbox` array match the cards Gemini drew? If misaligned → Pillow text lands in wrong places, looks broken.
4. **Re-fire** with strict NO-TEXT prompt + Pillow overlay. Do NOT propose switching to OpenAI as the fix — Pillow with correct layout JSON solves this regardless of language complexity.

#### Caller responsibility (technolog, das-presenter, etc.)

Skills that produce infographics MUST:
1. Compose the layout JSON (panel positions, headlines, values) in their own logic
2. Pass `layout=...` parameter alongside the textless prompt to imager
3. Imager validates layout JSON before generation
4. After Gemini returns textless base, imager runs `compose_infographic.py` with the layout
5. Final composite is saved to R2 and URL returned

If caller doesn't pass layout JSON for an infographic request → imager refuses (returns `error: layout_required_for_infographic`) rather than letting Gemini guess.

---

### 7.7 BBOX CONTAINMENT — text must never overflow its frame

**The problem:** Pillow doesn't auto-fit. If you set headline_size=32 but the text is 25 characters and the bbox is 200px wide, the text bleeds past the right edge — into next panel, across the product, off the canvas. This looks broken and unprofessional.

**The solution:** before drawing any text, run an auto-fit measurement loop. Reduce font size in 2px steps until the text fits within the assigned bbox. If it still doesn't fit at minimum size, wrap to additional lines (if bbox height allows).

#### Reference helper — `fit_text_to_bbox()`

Add this to every Pillow overlay script. Use it for every single text element instead of raw `draw.text()`.

```python
def fit_text_to_bbox(draw, text, font_path, bbox, max_size, min_size=10,
                     line_spacing=1.15, padding=8, valign="top", halign="left"):
    """Render text inside bbox, auto-shrinking and wrapping until it fits.
    
    bbox = (x1, y1, x2, y2)
    Returns the actual font_size used, or None if even at min_size the text overflows.
    
    Algorithm:
      1. Try max_size. Wrap text into lines that each fit horizontally.
      2. Measure total height. If exceeds bbox height → reduce size by 2px, retry.
      3. If at min_size text still overflows → return None (caller decides:
         abbreviate, drop content, or accept truncation with ellipsis).
    """
    from PIL import ImageFont
    
    x1, y1, x2, y2 = bbox
    available_w = x2 - x1 - 2 * padding
    available_h = y2 - y1 - 2 * padding
    
    size = max_size
    while size >= min_size:
        font = ImageFont.truetype(font_path, size)
        # Wrap text into lines that fit horizontally
        words = text.split()
        lines = []
        current = ""
        for word in words:
            trial = (current + " " + word).strip()
            bbox_t = font.getbbox(trial)
            if (bbox_t[2] - bbox_t[0]) <= available_w:
                current = trial
            else:
                if current:
                    lines.append(current)
                current = word
        if current:
            lines.append(current)
        
        # Measure total height
        line_height = int(size * line_spacing)
        total_h = line_height * len(lines)
        
        # Check if any single line still doesn't fit (long unbreakable word)
        max_line_w = max(
            (font.getbbox(line)[2] - font.getbbox(line)[0]) for line in lines
        ) if lines else 0
        
        if total_h <= available_h and max_line_w <= available_w:
            # Fits — render
            if valign == "top":
                start_y = y1 + padding
            elif valign == "center":
                start_y = y1 + (available_h + 2 * padding - total_h) // 2
            else:  # bottom
                start_y = y2 - padding - total_h
            
            for i, line in enumerate(lines):
                line_w = font.getbbox(line)[2] - font.getbbox(line)[0]
                if halign == "left":
                    line_x = x1 + padding
                elif halign == "center":
                    line_x = x1 + (available_w + 2 * padding - line_w) // 2
                else:  # right
                    line_x = x2 - padding - line_w
                
                draw.text((line_x, start_y + i * line_height), line, font=font, fill=(255, 255, 255, 255))
            return size
        
        size -= 2
    
    # Even at min_size doesn't fit — render truncated with ellipsis at min_size
    font = ImageFont.truetype(font_path, min_size)
    truncated = text
    while len(truncated) > 3:
        test = truncated + "…"
        if font.getbbox(test)[2] - font.getbbox(test)[0] <= available_w:
            draw.text((x1 + padding, y1 + padding), test, font=font, fill=(255, 255, 255, 255))
            return min_size
        truncated = truncated[:-1]
    
    return None  # caller handles failure
```

#### Usage in compose scripts

Instead of raw `draw.text()` calls, use:

```python
fit_text_to_bbox(
    draw,
    text="ЧЁРНОЕ ВОЗВРАЩАЕТ ЧЕРНОТУ",
    font_path=FONTS["rubik"],
    bbox=(60, 200, 580, 400),
    max_size=72,
    min_size=24,
    valign="top",
    halign="left",
)
```

#### Containment rules per element type

| Element | Auto-shrink | Wrap to lines | Ellipsis fallback | Min size |
|---|---|---|---|---|
| Banner headline | YES | up to 3 lines | NO — re-pick wording | 32px |
| Banner subhead | YES | up to 2 lines | NO | 14px |
| Banner CTA button | YES | NO (single line) | YES | 12px |
| Body description | YES | unlimited lines (within bbox h) | YES | 11px |
| Infographic panel headline | YES | up to 2 lines | YES | 14px |
| Infographic value | YES | NO (must stay single line for impact) | YES | 18px |
| Infographic label | YES | up to 2 lines | YES | 9px |
| Product name (Russo One) | YES | NO (single line) | YES | 16px |

#### Pre-render validation checklist

Before saving the final composite, run through this checklist:

1. **No text crosses bbox boundary** — every glyph fully inside its assigned rectangle
2. **No text overlaps another element** — adjacent panels don't have text bleeding into each other
3. **No text on the hero product** — product photo zone (`hero_product_bbox`) must remain clean
4. **No text on canvas margins** — outer 30px of canvas is reserved as breathing space
5. **Logo doesn't collide with text** — logo bbox + 20px padding clear of all text
6. **CTA button width fits its text** — button doesn't have visible text overflow

If any check fails — the layout JSON is bad. Reduce fonts, expand bboxes, or simplify text. Don't ship a broken composite.

#### Diagnostic: how to recognize bbox overflow in returned image

Symptoms reported by user:
- "текст вылезает из рамки" / "text bleeds out of frame"
- "слова налезают друг на друга" / "words overlapping"
- "буквы за продуктом" / "letters behind the product"
- "обрезанный текст" / "truncated text"

When user reports any of these → re-fire with stricter bbox containment, smaller max_size, or larger bbox. NEVER suggest switching to OpenAI as the fix — bbox containment is a Pillow rendering problem solved by Pillow code.

---

### 7.8 LETTER-SPACING IRON RULE — never exceed 1.0× natural spacing

**The problem:** when text doesn't fit its bbox, a naive coder might be tempted to add `letter_spacing=2` or `tracking=200` to compress horizontally. This destroys typographic integrity. Cyrillic "ПАМЯТЬ ФОРМЫ" rendered with expanded letter-spacing reads as "П А М Я Т Ь   Ф О Р М Ы" — looks like a 1990s Word doc, not a premium brand.

**The iron rule:** letter-spacing (tracking) NEVER exceeds 1.0× the font's natural built-in spacing. Period.

#### Allowed range

| Multiplier | Status | When |
|---|---|---|
| `0.85×` to `1.0×` | ✅ ALLOWED | Tighter density on headlines for visual punch |
| `1.0×` (default) | ✅ DEFAULT | Always for body, descriptions, CTAs, labels — never overridden |
| `> 1.0×` | ❌ FORBIDDEN | Under any circumstance, for any reason |

#### Common temptations — all FORBIDDEN

- ❌ "Stretch DAS EXPERTEN to fill the wider gold rule below it" → use a longer rule, or accept the natural width
- ❌ "Pad the CTA button to be wider than the text" → adjust button padding instead, never tracking
- ❌ "Make headline span the whole panel width" → choose larger font size, never wider tracking
- ❌ "Tracked-out small caps for editorial mood" → use a font that has condensed/expanded variants (none of our 5 do, so don't fake it)

#### Pillow implementation — `draw_text_no_tracking()`

Pillow's `draw.text()` already uses the font's natural spacing — there is no `letter_spacing` parameter by default. **Don't add one.** Don't write per-glyph drawing loops with custom x-offset increments. The default `draw.text(xy, text, font)` IS the correct call.

```python
# ✅ CORRECT — natural spacing
draw.text((x, y), "ПАМЯТЬ ФОРМЫ", font=font, fill=color)

# ❌ FORBIDDEN — manual tracking expansion  
spacing = 8  # extra px between letters — DON'T DO THIS
cursor_x = x
for char in "ПАМЯТЬ ФОРМЫ":
    draw.text((cursor_x, y), char, font=font, fill=color)
    char_w = font.getbbox(char)[2] - font.getbbox(char)[0]
    cursor_x += char_w + spacing  # ← THIS LINE BREAKS THE RULE

# ✅ CORRECT — if natural spacing makes text too wide, REDUCE FONT SIZE:
size = 32
font = ImageFont.truetype(font_path, size)
while font.getbbox(text)[2] - font.getbbox(text)[0] > available_width and size > min_size:
    size -= 2
    font = ImageFont.truetype(font_path, size)
draw.text((x, y), text, font=font, fill=color)
```

#### Tighter spacing (0.85× to 1.0×) — when allowed

If a headline needs slight visual density (e.g. drama-mood Rubik Black headline), use Pillow's `stroke_width=0` and rely on font's built-in tighter weights. Do NOT compute negative offsets between glyphs — that breaks Cyrillic ligatures and accents (ё, й, и-кратки). Just keep `draw.text()` with the font as-is.

#### Diagnostic — recognizing tracking violation

Symptoms in returned image:
- Letters visibly far apart with extra whitespace between them
- "DAS EXPERTEN" looking stretched across a wide rule
- Headline taking up 100% of panel width with airy spacing
- Cyrillic words reading as separated characters: "П А М Я Т Ь"

Action when detected:
1. Confirm Pillow code uses `draw.text(xy, text, font)` directly (no per-char loop)
2. Check that font size is appropriate — if text fills panel due to large font, that's correct; if it fills panel due to expanded tracking, that's the bug
3. Re-fire with `fit_text_to_bbox()` from Section 7.7 — that helper auto-reduces font size and never touches spacing

**Never propose switching engines as a tracking fix.** This is purely a Pillow code rule.

---

### 7.9 MARKETPLACE CARD STANDARD PATTERN — proven 2026-05-10

**The problem solved here.** Old approach drew header/subheader inline in Gemini, then padded callouts as separate floating backdrops on the side. Two failure modes: (1) Gemini rendered title-zone text as gibberish Cyrillic / inconsistent letter-spacing / unpredictable colors that fought the scene; (2) per-callout backdrops looked like Photoshop slabs glued onto the image, no visual unity, no editorial feel. Each callout got its own fight with the BG, and the three of them never matched.

**The fix.** Hard-split responsibilities: Gemini renders **only** the photoreal scene with strict textless zones reserved at top, left, and bottom. Pillow renders **all** layout text — header, subheader, callouts, wordmark, disclaimer — using BG sampling for auto-contrast on header/subheader/wordmark, and a single unified translucent panel as the home for all three callouts. Result: typographic control matches premium brands like Lancôme or Apple product cards, and the callouts read as one coherent info-block instead of three competing labels.

This is now the **standard pattern for ALL marketplace cards** — Ozon 3:4, Wildberries 3:4, Amazon/international 1:1. Both productcardmaker and any direct imager call producing a marketplace card MUST use this pattern.

#### Pattern architecture

```
┌──────────────────────────────────┐  ← Top 18% canvas: TEXTLESS in base render
│         HEADER (Russo One)       │     Pillow draws: SKU name, large, centered
│      Subheader (Manrope EB)      │     Pillow draws: stat / slogan, centered
├──────────────────────────────────┤
│                                  │
│   [Character]    [Hero product]  │  ← Mid: scene only, no overlay text
│                                  │
│                                  │
├─────────────────┬────────────────┤
│ ┌─────────────┐ │                │  ← Left 30%: Pillow unified panel
│ │  CALLOUT 1  │ │                │     - rounded translucent rectangle
│ │   ─────     │ │                │     - 3 callouts inside, separators
│ │  CALLOUT 2  │ │                │     - title color = accent
│ │   ─────     │ │                │     - desc color = high contrast
│ │  CALLOUT 3  │ │                │
│ └─────────────┘ │                │
├─────────────────┴────────────────┤
│                       das experten│  ← Bottom 12%: TEXTLESS in base
│                  Реклама. ООО ... │     Pillow draws: wordmark + disclaimer
└──────────────────────────────────┘
```

#### Stage A — Gemini base render (strict textless promp block)

Insert this verbatim block into every marketplace card prompt sent to Gemini Flash:

```
═══ ABSOLUTE TEXTLESS POLICY — CRITICAL ═══
This is a base scene render only. The image MUST be completely textless except for the original product label which is preserved exactly from references. NO render any text, letters, words, captions, callouts, headlines, slogans, taglines, schematic labels, or wordmarks anywhere in the scene. NO render any title text in the top zone. NO render any text in the left side. NO render any text in any callout zones. NO render any text in the bottom corners. NO render any decorative pseudo-Latin letters. NO render any imitation typography. NO render watermarks, signature stars, or any kind of corner artifact symbols. The product tube/brush label retains its original branding from the reference image but no other text appears anywhere else in the scene.

The top 18% of the canvas: completely empty, soft ambient gradient or background continuation only — no text whatsoever, no character head extending into it, no product extending into it.
The left 30% of the canvas mid-section (canvas y from ~640 to ~1040): completely empty soft background — no text, no callouts, no labels, no schematic text whatsoever. Reserved for post-process callout panel overlay.
The bottom 12% of the canvas: completely empty soft background — no wordmark, no disclaimer, no logo of any kind, no watermark stars, no corner decorations whatsoever.
```

In the COMPOSITION section of the prompt, also explicitly state:
- **Position character lower in frame** so the top 18% of canvas remains pure empty background gradient
- **TOP 18% OF CANVAS**: completely empty, RESERVED FOR POST-PROCESS HEADER OVERLAY
- **LEFT 30% MID-SECTION** (y from ~640 to ~1040): completely empty negative space, RESERVED FOR POST-PROCESS CALLOUT PANEL OVERLAY
- **BOTTOM 12% OF CANVAS**: empty soft background, RESERVED FOR POST-PROCESS WORDMARK + DISCLAIMER

This redundancy (textless policy block + composition reservations) doubles the signal to Gemini and reliably keeps zones clean.

#### Stage B — Pillow overlay (auto-contrast header/subheader + unified panel)

```python
"""Marketplace card standard overlay — header + subheader + unified callout panel + bottom."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageStat

base = Image.open(BASE_PATH).convert("RGBA")
W, H = base.size                   # 864 x 1184 for Ozon 3:4
base_rgb = base.convert("RGB")

# === Smart sampling helpers ===
def sample_region(img, bbox):
    x1, y1, x2, y2 = [max(0, c) for c in bbox]
    x2 = min(img.width, x2); y2 = min(img.height, y2)
    crop = img.crop((x1, y1, x2, y2))
    stat = ImageStat.Stat(crop)
    r, g, b = stat.mean[:3]
    lum = 0.2126*r + 0.7152*g + 0.0722*b
    var = ImageStat.Stat(crop.convert("L")).stddev[0]
    return lum, (int(r), int(g), int(b)), var

def pick_text_color(luminance):
    """Auto-pick high-contrast text color from BG luminance."""
    if luminance < 110:
        return (240, 245, 250, 255)        # bright on dark
    elif luminance > 175:
        return (28, 38, 58, 255)           # deep navy on light
    else:
        if abs(luminance - 240) > abs(luminance - 28):
            return (240, 245, 250, 255)
        else:
            return (28, 38, 58, 255)

# === Fonts (5-font roster, ALL BOLD weights) ===
F_HEADER    = ImageFont.truetype("/home/claude/fonts/RussoOne-Regular.ttf", 96)
F_SUBHEADER = ImageFont.truetype("/home/claude/fonts/Manrope-Variable.ttf", 28)
F_CALL_T    = ImageFont.truetype("/home/claude/fonts/Manrope-Variable.ttf", 22)
F_CALL_D    = ImageFont.truetype("/home/claude/fonts/Manrope-Variable.ttf", 15)
F_WORDMARK  = ImageFont.truetype("/home/claude/fonts/Manrope-Variable.ttf", 22)
F_DISC      = ImageFont.truetype("/home/claude/fonts/Manrope-Variable.ttf", 10)
try:
    F_SUBHEADER.set_variation_by_axes([700])
    F_CALL_T.set_variation_by_axes([800])
    F_CALL_D.set_variation_by_axes([500])
    F_WORDMARK.set_variation_by_axes([800])
    F_DISC.set_variation_by_axes([500])
except Exception:
    pass

# ============================================================
# UNIFIED CALLOUT PANEL — drawn FIRST so text overlays it
# ============================================================
PANEL_X, PANEL_Y = 20, 615
PANEL_W, PANEL_H = 350, 410
PANEL_RADIUS = 18
PANEL_OPACITY = 165   # translucent — show scene through

# Auto-decide panel color from what's behind the panel zone
panel_lum, _, _ = sample_region(base_rgb, (PANEL_X, PANEL_Y, PANEL_X+PANEL_W, PANEL_Y+PANEL_H))
if panel_lum < 130:
    PANEL_COLOR = (245, 248, 252, PANEL_OPACITY)
    CALLOUT_TEXT_COLOR = (28, 38, 58, 255)
    CALLOUT_ACCENT_COLOR = (50, 105, 165, 255)
    CALLOUT_DESC_COLOR = (60, 75, 100, 240)
else:
    PANEL_COLOR = (20, 32, 50, PANEL_OPACITY)
    CALLOUT_TEXT_COLOR = (240, 245, 250, 255)
    CALLOUT_ACCENT_COLOR = (130, 180, 230, 255)
    CALLOUT_DESC_COLOR = (200, 215, 230, 235)

# Draw rounded panel + glass highlight on top edge
panel_layer = Image.new("RGBA", base.size, (0,0,0,0))
ImageDraw.Draw(panel_layer).rounded_rectangle(
    [(PANEL_X, PANEL_Y), (PANEL_X+PANEL_W, PANEL_Y+PANEL_H)],
    radius=PANEL_RADIUS, fill=PANEL_COLOR
)
panel_layer = panel_layer.filter(ImageFilter.GaussianBlur(radius=0.6))

gloss = Image.new("RGBA", base.size, (0,0,0,0))
ImageDraw.Draw(gloss).rounded_rectangle(
    [(PANEL_X+1, PANEL_Y+1), (PANEL_X+PANEL_W-1, PANEL_Y+30)],
    radius=PANEL_RADIUS-2, fill=(255, 255, 255, 18)
)
gloss = gloss.filter(ImageFilter.GaussianBlur(radius=2))

base = Image.alpha_composite(base, panel_layer)
base = Image.alpha_composite(base, gloss)
draw = ImageDraw.Draw(base)

def text_size(text, font):
    bb = ImageDraw.Draw(base_rgb).textbbox((0,0), text, font=font)
    return bb[2]-bb[0], bb[3]-bb[1]

# ============================================================
# HEADER (auto-contrast, centered, top)
# ============================================================
HEADER_TEXT = "SYMBIOS"   # caller passes this
hw, hh = text_size(HEADER_TEXT, F_HEADER)
hx, hy = (W - hw) // 2, 30
hlum, _, _ = sample_region(base_rgb, (hx-10, hy, hx+hw+10, hy+hh+5))
draw.text((hx, hy), HEADER_TEXT, font=F_HEADER, fill=pick_text_color(hlum))

# ============================================================
# SUBHEADER (auto-contrast, centered, below header)
# ============================================================
SUB_TEXT = "Восстановление микробиома 4×10¹⁰ КОЕ"   # caller passes this
sw, sh = text_size(SUB_TEXT, F_SUBHEADER)
sx, sy = (W - sw) // 2, 142
slum, _, _ = sample_region(base_rgb, (sx-10, sy, sx+sw+10, sy+sh+5))
sub_color = pick_text_color(slum)
# Soften subheader vs header for visual hierarchy
if sub_color[0] < 100:
    sub_color = (60, 75, 100, 255)
else:
    sub_color = (210, 225, 245, 240)
draw.text((sx, sy), SUB_TEXT, font=F_SUBHEADER, fill=sub_color)

# ============================================================
# UNIFIED PANEL CONTENT (3 callouts inside the single rounded box)
# ============================================================
callouts = [
    ("ЖИВОЙ ПРОБИОТИК",       "B. coagulans 4×10¹⁰ КОЕ восстанавливает естественный баланс"),
    ("МИКРОБИОМ ПОЛОСТИ РТА", "Поддержка полезных бактерий слюны"),
    ("ЗАЩИТА ОТ КАРИЕСА",     "Без агрессивной антимикробной химии"),
]
inner_pad_x, inner_pad_y = 22, 26
content_x = PANEL_X + inner_pad_x
content_y_start = PANEL_Y + inner_pad_y
slot_h = (PANEL_H - inner_pad_y*2) // 3
sep_color = (CALLOUT_TEXT_COLOR[0], CALLOUT_TEXT_COLOR[1], CALLOUT_TEXT_COLOR[2], 50)
desc_max_w = PANEL_W - inner_pad_x*2

for i, (title, desc) in enumerate(callouts):
    slot_y = content_y_start + i * slot_h
    draw.text((content_x, slot_y), title, font=F_CALL_T, fill=CALLOUT_ACCENT_COLOR)
    # Wrap desc to max 2 lines
    words = desc.split(); lines = []; cur = ""
    for w in words:
        trial = (cur + " " + w).strip()
        if text_size(trial, F_CALL_D)[0] <= desc_max_w:
            cur = trial
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    for j, line in enumerate(lines[:2]):
        draw.text((content_x, slot_y + 32 + j*20), line, font=F_CALL_D, fill=CALLOUT_DESC_COLOR)
    if i < len(callouts) - 1:
        sep_y = slot_y + slot_h - 8
        draw.line([(content_x, sep_y), (content_x + desc_max_w, sep_y)], fill=sep_color, width=1)

# ============================================================
# BOTTOM — wordmark + disclaimer (auto-contrast)
# ============================================================
WM_TEXT = "das experten"
ww_, wh_ = text_size(WM_TEXT, F_WORDMARK)
wmx, wmy = W - ww_ - 24, H - 56
wm_lum, _, _ = sample_region(base_rgb, (wmx-5, wmy, wmx+ww_+5, wmy+wh_+3))
draw.text((wmx, wmy), WM_TEXT, font=F_WORDMARK, fill=pick_text_color(wm_lum))

DISC_TEXT = "Реклама. ООО Дас Экспертен Евразия, ИНН 9704117379"
dw, dh = text_size(DISC_TEXT, F_DISC)
dx, dy = W - dw - 24, H - 22
disc_lum, _, _ = sample_region(base_rgb, (dx-3, dy, dx+dw+3, dy+dh+2))
disc_color = pick_text_color(disc_lum)
draw.text((dx, dy), DISC_TEXT, font=F_DISC,
          fill=(disc_color[0], disc_color[1], disc_color[2], 200))

base.convert("RGB").save(OUT_PATH, "PNG", quality=95, optimize=True)
```

#### Caller responsibility (productcardmaker, etc.)

The calling skill provides:

```yaml
header: string                    # e.g. "SYMBIOS", "ZERO", "GROSSE"
subheader: string                 # e.g. "Восстановление микробиома 4×10¹⁰ КОЕ"
callouts:                         # exactly 3 — pattern requires it
  - title: string                 # e.g. "ЖИВОЙ ПРОБИОТИК"
    desc: string                  # 1 sentence, will wrap to max 2 lines
  - { title: ..., desc: ... }
  - { title: ..., desc: ... }
wordmark: "das experten"          # standard, never customize
disclaimer: string                # legal — varies by entity
language: ru | en | vi | ar       # drives text source
```

#### Aspect ratio adjustments

For 1:1 international cards (Amazon/Shopee):
- `PANEL_X, PANEL_Y = 20, 540`
- `PANEL_W, PANEL_H = 340, 380`
- Header/subheader Y stays at top (28 / 138)

For 9:16 social/story cards:
- Use 2 callouts inside panel instead of 3
- `PANEL_H = 280`

#### Pre-flight checks before generation

| Check | Action if fails |
|---|---|
| Base render has clean top 18%? | Re-render with stronger textless prompt; never overlay header on dirty zone |
| Base render has clean bottom 12%? | Re-render or shift wordmark to alternative corner |
| Base render has clean left 30% (y 640–1040)? | Re-render with explicit reservation; never put panel where character/product is |
| Watermark stars / Gemini artifacts in any corner? | Mask with sampled neighbor color OR re-render with explicit no-watermark instruction |

#### Diagnostic — recognizing pattern violations

| Symptom | Cause | Fix |
|---|---|---|
| Header overlaps character hair/face | Character not pushed low enough in COMPOSITION | Add to prompt: "Position character lower in frame, top 18% pure empty background" |
| Three callouts visually disconnected | Old per-callout backdrop pattern still in use | Switch to unified panel — this Section's code |
| Panel looks like a flat sticker | Opacity too low (text wash-out) or too high (collage feel) | Keep `PANEL_OPACITY = 165` — tested optimum |
| Panel color fights the scene | `pick_text_color` on panel zone gave wrong direction | Check `panel_lum`; threshold is 130 — adjust if scene is borderline |
| Subheader same weight as header | Visual hierarchy collapsed | Subheader must be Manrope EB at ~30% header size — this Section's defaults |

#### When to break the pattern

- **Editorial / lifestyle hero shots without product callouts** — pattern not needed; just header + subheader is enough
- **Single-feature cards** (e.g. "NEW LAUNCH" splash) — drop callouts, use only header
- **Background cards for Corel/SVG overlay (designer skill)** — no Pillow at all; full textless export

For everything else producing a Russian-text marketplace card with 2-3 benefit points: **this pattern is the default**.

---

## 8. ENGINE ROUTING

The Worker accepts `engine` parameter, but routing logic is intentionally simple: **gemini-flash is the only engine used unless user explicitly demands otherwise.**

### 8.1 gemini-flash (DEFAULT — always)

- **Model**: `gemini-2.5-flash-image`
- **Cost**: $0 (free tier)
- **Speed**: 12–20 sec
- **Strength**: photorealistic product/character renders, brand fidelity with refs
- **Weakness mitigation**: Cyrillic/Arabic/CJK typo problem is SOLVED by Pillow overlay (Section 7) — ALWAYS use overlay for non-Latin text instead of switching engines
- **Limits**: 500 requests per day, 10 per minute, 250K tokens per minute, resets midnight Pacific
- **Use for**: 100% of cases by default

### 8.2 openai (gpt-image-1) — RESTRICTED, USER-INVOKED ONLY

- **Model**: `gpt-image-1`
- **Cost**: ~$0.04/image — CHARGES ARAM'S OPENAI ACCOUNT
- **Speed**: 15–30 sec
- **Strength**: handles long multi-line text inside packaging mockups
- **Weakness**: weaker brand fidelity, no photo-look mode

**OpenAI is NEVER suggested by Claude.** Use only when:
- User explicitly says "use OpenAI" / "switch to gpt-image-1" / "use the paid engine"
- User has already received a Flash result, said it's not good enough, AND explicitly asked to try OpenAI

**Forbidden patterns:**
- ❌ Suggesting OpenAI as the obvious fix for Cyrillic problems (Pillow overlay solves Cyrillic — that's why it exists)
- ❌ Presenting OpenAI as Option B when Option A is Flash
- ❌ Recommending OpenAI for "clinical text accuracy" or "dense engineering numbers" (use Pillow overlay with bigger text reservation instead)

### 8.3 gemini-pro

Currently blocked (Aram couldn't pass Google billing verification). Treat as unavailable. Never reference in user-facing responses.

### 8.4 Routing logic — simplified

```
Image generation request
    │
    ├── User explicitly named "OpenAI"?  ──── YES ──→ openai engine
    │                                              (confirm cost first)
    │
    └── Otherwise (always)  ─────────────────────→ gemini-flash + Pillow overlay
                                                   (Pillow handles ALL non-Latin text,
                                                    so engine choice is independent
                                                    of text language)
```

**Key insight:** Text language never drives engine choice. Pillow overlay (Section 7) handles Cyrillic, Arabic, Vietnamese, Thai, CJK, Hebrew, Greek with perfect accuracy via the embedded font system. Switching to a paid engine for "better Cyrillic" is a wrong solution to a problem already solved.

### 8.5 Failure handling — Flash imperfections

When Flash output is imperfect (mangled text, weak refs, off composition), the response pattern is:

1. **Diagnose** what went wrong (text was Cyrillic that Flash mangled? refs were too few? prompt under-specified?)
2. **Fix in Flash** — strengthen reference lock, add stricter NO-TEXT policy, expand Pillow overlay zones
3. **Re-fire** with fixed prompt
4. **Tell user** what was adjusted and ship the new result

Do NOT propose OpenAI as the "upgrade path." OpenAI exists for one specific case: text rendered INSIDE a packaging mockup geometry (e.g. text on a tube label) where Pillow overlay can't reach. Even then, only on user's explicit request.

---

## 9. WORKER DEPLOY PROCEDURE

If Worker source needs to be redeployed (after editing `worker.js` from this skill's Section 2.2):

```bash
. /home/claude/.env

mkdir -p /home/claude/imager-bridge
cd /home/claude/imager-bridge

# 1. Write metadata.json from Section 2.1
cat > metadata.json << 'EOF'
{
  "main_module": "worker.js",
  "compatibility_date": "2025-09-01",
  "bindings": [
    { "type": "r2_bucket", "name": "R2_BUCKET", "bucket_name": "dasexperten-images" },
    { "type": "plain_text", "name": "R2_PUBLIC_BASE", "text": "https://pub-1d1b12958f2d4ea380276bd8d0a1ff02.r2.dev" }
  ],
  "keep_bindings": ["secret_text"]
}
EOF

# 2. Write worker.js from Section 2.2 (extract source between ```javascript fences in this SKILL.md)
#    Or pull from R2 backup: refs/styles/skills-archive/imager-bridge-worker-v2.7.js

# 3. Deploy via multipart upload
curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/workers/scripts/imager-bridge" \
  -H "Authorization: Bearer $CF_CLOUD_MASTER" \
  -F "metadata=@metadata.json;type=application/json" \
  -F "worker.js=@worker.js;type=application/javascript+module" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('deploy:', 'ok' if d.get('success') else d.get('errors'))"

# 4. Verify
sleep 3
curl -s "https://imager-bridge.dasexperten.workers.dev/" | python3 -m json.tool
```

---

## 10. UPLOAD NEW REFERENCE — procedure

When new product photos or character images need to be added to the library.

### 10.1 Single ref via multipart (works for any size, no base64 overhead)

```bash
. /home/claude/.env

# For products: kind=products, slug=DE###-name (e.g. DE201-schwarz)
# Filename MUST start with the SKU code prefix: DE###_descriptor.png

curl -s -A "Mozilla/5.0" -X POST \
  "https://imager-bridge.dasexperten.workers.dev/upload-ref" \
  -H "Authorization: Bearer $BRIDGE_SECRET" \
  -F "kind=products" \
  -F "slug=DE201-schwarz" \
  -F "filename=DE201_tube_dark.png" \
  -F "file=@/path/to/local/photo.png;type=image/png"
```

For characters:
```bash
curl -s -A "Mozilla/5.0" -X POST \
  "https://imager-bridge.dasexperten.workers.dev/upload-ref" \
  -H "Authorization: Bearer $BRIDGE_SECRET" \
  -F "kind=characters" \
  -F "slug=" \
  -F "filename=NewModel.png" \
  -F "file=@/path/to/photo.png;type=image/png"
```

### 10.2 Batch upload — Python helper script

This is the working `upload_pastes.py` script used for the original 160-file migration. Save as `/home/claude/upload_ref_helper.py`:

```python
"""Reusable single-file upload helper. Reads /home/claude/.env automatically."""
import json, base64, os, urllib.request, urllib.error


def load_env():
    env = {}
    with open("/home/claude/.env") as f:
        for line in f:
            line = line.strip()
            if line.startswith("export "):
                line = line[7:]
            if "=" in line:
                k, v = line.split("=", 1)
                env[k] = v.strip('"').strip("'")
    return env


def upload_ref_json(file_path, kind, slug, filename, mime_type, bridge_secret):
    """Upload via JSON+base64 path. Best for files under ~5 MB.
    For larger files, use multipart instead (see upload_ref_multipart below)."""
    with open(file_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()

    payload = json.dumps({
        "kind": kind,
        "slug": slug,
        "filename": filename,
        "mime_type": mime_type,
        "image_base64": b64,
    }).encode()

    req = urllib.request.Request(
        "https://imager-bridge.dasexperten.workers.dev/upload-ref",
        data=payload,
        headers={
            "Authorization": f"Bearer {bridge_secret}",
            "Content-Type": "application/json",
            "Content-Length": str(len(payload)),
            "User-Agent": "Mozilla/5.0 imager-bridge-uploader",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return {"error": f"HTTP {e.code}", "detail": e.read().decode()[:300]}


def upload_ref_multipart(file_path, kind, slug, filename, mime_type, bridge_secret):
    """Upload via multipart form. Use for files larger than ~5 MB.
    No base64 overhead, faster, more reliable on rate-limited Workers."""
    import uuid
    boundary = uuid.uuid4().hex
    with open(file_path, "rb") as f:
        data = f.read()

    parts = [
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"kind\"\r\n\r\n{kind}\r\n".encode(),
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"slug\"\r\n\r\n{slug}\r\n".encode(),
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"filename\"\r\n\r\n{filename}\r\n".encode(),
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{filename}\"\r\nContent-Type: {mime_type}\r\n\r\n".encode(),
        data,
        f"\r\n--{boundary}--\r\n".encode(),
    ]
    body = b"".join(parts)

    req = urllib.request.Request(
        "https://imager-bridge.dasexperten.workers.dev/upload-ref",
        data=body,
        headers={
            "Authorization": f"Bearer {bridge_secret}",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "User-Agent": "Mozilla/5.0 imager-bridge-uploader",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return {"error": f"HTTP {e.code}", "detail": e.read().decode()[:300]}


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 5:
        print("Usage: python3 upload_ref_helper.py <file> <kind> <slug> <filename> [mime]")
        sys.exit(1)
    env = load_env()
    file_path, kind, slug, filename = sys.argv[1:5]
    mime = sys.argv[5] if len(sys.argv) > 5 else "image/png"
    size_mb = os.path.getsize(file_path) / 1024 / 1024
    func = upload_ref_multipart if size_mb > 5 else upload_ref_json
    result = func(file_path, kind, slug, filename, mime, env["BRIDGE_SECRET"])
    print(json.dumps(result, indent=2, ensure_ascii=False))
```

### 10.3 Mass migration pattern (with rate-limit retry)

Cloudflare Workers throttle to ~5 requests/sec on JSON+base64 uploads. For large batches, use this throttle pattern:

```python
import time
ok = 0
fail = 0
for i, item in enumerate(BATCH):
    if i > 0:
        time.sleep(2)            # 2 sec between requests
    if i > 0 and i % 6 == 0:
        time.sleep(4)            # extra 4 sec every 6 items

    for attempt in range(3):
        result = upload_ref_multipart(item.local_path, item.kind, item.slug, item.filename, item.mime, secret)
        if result.get("status") == "success":
            ok += 1
            break
        if "503" in str(result) or "1102" in str(result):
            time.sleep(15 * (attempt + 1))  # exponential backoff
            continue
        fail += 1
        break
```

### 10.4 Bulk rename — copy to new key + delete old

R2 has no native rename. Use this two-step pattern (already proven on 155 files):

```bash
# Copy to new key
curl -s -X POST "https://imager-bridge.dasexperten.workers.dev/copy-ref" \
  -H "Authorization: Bearer $BRIDGE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"from_key":"refs/products/DE201-schwarz/tube_dark.png", "to_key":"refs/products/DE201-schwarz/DE201_tube_dark.png"}'

# Delete old key
curl -s -X POST "https://imager-bridge.dasexperten.workers.dev/delete-ref" \
  -H "Authorization: Bearer $BRIDGE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"key":"refs/products/DE201-schwarz/tube_dark.png"}'
```


---

## 11. INTER-SKILL GATE — full integration map

How calling skills invoke imager. All sub-skills must use one of these patterns; direct API calls forbidden (Section 0.0).

### 11.1 Gate invocation syntax

```
[[GATE: imager?sku=DE201&scene=hero_shot&character=Helga&lang=ru&campaign=schwarz_oct]]
```

The calling skill provides as much as it knows; imager fills the rest from defaults.

### 11.2 Gate parameters

| Param | Required | Type | Notes |
|---|---|---|---|
| `sku` | conditional | string | Required if reference auto-resolution needed. Skip if pure illustration with no Das Experten product. |
| `scene` | yes | enum | One of Section 5 scene types |
| `character` | optional | string | First name from roster (Section 6.3) |
| `lang` | yes | string | `en`, `ru`, `de`, `vi`, `ar`, `zh`, etc. Drives text-overlay decision. |
| `campaign` | yes | string | Short slug for R2 path |
| `aspect` | optional | string | `4:3` default; or `3:4`, `1:1`, `16:9`, `9:16` |
| `engine` | optional | string | Override default routing |
| `text_blocks` | optional | object | If non-Latin lang, structured headline/sub/cta payload (Section 7.3) |
| `prompt_extras` | optional | string | Additional creative direction from caller |

### 11.3 Per-skill integration

#### bannerizer
After Step 7 prompt assembly, call:
```
[[GATE: imager?sku={sku}&scene={scene_type}&character={char}&lang={lang}&campaign={campaign}]]
```
The imager skill takes bannerizer's full prompt as `prompt_extras`, resolves refs, generates, applies overlay if non-Latin, returns URL.

#### productcardmaker
Calling pattern for marketplace card:
```
[[GATE: imager?sku={sku}&scene=marketplace_card&lang={lang}&aspect=3:4&campaign={marketplace}_card]]
```
Marketplace cards are 3:4 vertical (Ozon) or 1:1 square (Amazon/international). Pass `aspect` accordingly.

#### das-presenter
Per-slide imagery — caller passes `scene_type=b2b_presentation` for hero slides, `lifestyle` for context slides. Multiple imager calls per deck.

#### blog-writer
Hero image at top + 2-3 inline imagery per article. Pass `scene_type=lifestyle` for inline, `scene_type=hero_shot` for top.

#### ugc-master
Creator-style content — usually `scene_type=lifestyle` with `character` set to the creator persona. UGC is informal, so often skip the gold rule and luxury serif overlay.

#### sales-hunter
Embeds product visual into outreach email. Calls imager with `scene_type=b2b_presentation`, no character, sober composition.

#### designer
Textless backgrounds for Corel/SVG overlay work. Always passes `text_blocks: null` and explicit "no text, reserve full canvas" via `prompt_extras`.

### 11.4 Return value contract

The imager skill always returns:

```yaml
status: success | failure
image_url: https://pub-1d1b12958f2d4ea380276bd8d0a1ff02.r2.dev/banners/...
r2_key: banners/<campaign>/<file>
generation_time_ms: int
references_used: int
text_overlay_applied: boolean
engine_used: gemini-flash | gemini-pro | openai
```

If `status: failure`, the caller MUST surface the error to the user, not silently substitute a placeholder. The exclusivity lock (Section 0.0) prohibits fallback paths.

---

## 12. ARCHITECTURE DECISIONS — recorded

These are choices that look subtle but matter when re-implementing or debugging.

### Why multipart upload instead of JSON+base64

JSON+base64 inflates payload by 33%. For 8 MB photos, that's 11 MB of JSON wrapping the data. Cloudflare Workers throttle aggressively at 503 (error 1102) when this hits 5 req/sec. Multipart sends raw bytes — no inflation, fewer throttles. Use JSON only for files under 1 MB.

### Why SKU prefix on every product file

Aram's mandate (2026-05-10): every product file MUST start with the SKU code. Reasons:
- Skill payloads can carry just the filename and infer the SKU
- Cross-product cleanup easier (e.g. `_116BL.png` was actually DE115 floss; renaming to `DE115_floss_blister_packaged_dark.png` made it self-documenting)
- Search/filter operations can grep by SKU prefix without reading paths

### Why characters get no SKU/age suffix

Aram's mandate: clean names only, no age. The character roster is the catalog of brand faces and personas. Adding age would feel reductive and would also need maintenance as people age. Numbered duplicates (`Faeze_2`, `Marianna_3`) handle multi-photo cases.

### Why textless base + Pillow overlay (instead of Gemini Pro)

Gemini Pro could render Cyrillic correctly inline, but:
1. Pro requires paid Google billing — Aram couldn't pass verification
2. Pro is 3x slower (40 sec vs 14 sec)
3. Overlay gives perfect typographic control (kerning, leading, color, positioning) that Pro can't match
4. Same approach works for ANY non-Latin script (Arabic, Vietnamese, Thai, CJK)

When Pro unblocks, route only when text needs to be inside packaging mockup or signage geometry.

### Why characters live flat (`refs/characters/`) without slug subfolder

Products have many photos per SKU → makes sense to subfolder by SKU. Characters have 1-4 photos per person, max — flat is faster to scan and Worker `head()` lookup by exact filename works.

### Why ✦ marker in corner is NOT an AI watermark

Aram clarified (2026-05-10): the ✦ symbol that appears in Drive thumbnails of some product photos is the Google Drive UI artifact (gallery preview marker), not an AI generation watermark. All 160 product files are real photographs. The 10 files initially skipped were re-uploaded as legitimate references.

---

## 13. KNOWN LIMITATIONS

| Limitation | Workaround |
|---|---|
| Gemini Flash typos in non-Latin text | Pillow overlay (Section 7) |
| Gemini Pro blocked (no billing) | Use Flash + overlay until resolved |
| Worker rate limits at >5 req/sec for uploads | Throttle batch operations 2 sec between, exponential backoff on 503 |
| Free Gemini quota 500 RPD | Plan campaigns; fallback to OpenAI when exhausted |
| Pro/Flash mini-text on packaging is pseudo-text | Either accept (looks real at thumbnail size) or use OpenAI for packaging mockup |
| Reference library coverage gaps (e.g. brushes have fewer files than pastes) | Add `brush_*` keyword bonuses to scoring (already deployed in v2.7) |

---

## 14. CHANGELOG

- **1.3 (2026-05-11)** — Text overlay rewrite per pinned hard rule #30. Replaced `compose_text.py` with v2: (a) drop shadow now auto-contrasts text (dark text → cream shadow #F5F0E5 alpha 230; light text → warm dark brown #2A1F18 alpha 230) — no more dark-on-dark stacked shadows; (b) face-aware header positioning — detects head in top 30% of frame and pushes header to bottom; (c) Manrope ExtraBold replaces Lora as default font (Manrope auto-downloads from Google Fonts on first run); (d) letter-spacing locked to 1.0× natural with auto-fit font reduction loop; (e) new payload API uses `header`/`subheader`/`description`/`cta` keys instead of legacy `headline_lines`. Old `compose_text.py` deprecated. Pinned hard rules added as Section 7.0 at top of overlay section.
- **1.2 (2026-05-10)** — Added Section 7.9 MARKETPLACE CARD STANDARD PATTERN. New pattern hard-splits responsibility: Gemini renders strict-textless scene (top 18% / left 30% mid / bottom 12% reserved); Pillow renders ALL layout text (header, subheader, unified callout panel, wordmark, disclaimer) with auto-contrast BG sampling. Replaces old per-callout backdrop approach that produced visual fragmentation. Standard for ALL marketplace cards (Ozon 3:4, WB 3:4, Amazon 1:1) — productcardmaker and direct imager calls MUST use this pattern. Proven on DE117 ZERO + Romaria, DE119 GROSSE + Tupa/Ruslana, DE206 SYMBIOS + Ashley.
- **1.1 (2026-05-10)** — Added callOpenAI function to Worker (Phase 2.8). OpenAI engine routing now functional with gpt-image-1 model. Note: requires OpenAI billing to be unlocked on the API key.
- **1.0 (2026-05-10)** — Initial Imager skill. Self-contained: full Worker source (762 lines), all 4 Cloudflare tokens, Gemini/OpenAI/Anthropic API keys, BRIDGE_SECRET, 160-file product reference inventory, 81-character roster, complete Pillow overlay script, multipart + JSON upload helpers, 6 default scene types with scoring logic, 4 layout variants for text overlay, full deploy procedure, mass-migration retry pattern, R2 rename pattern, gate integration map for 7 sub-skills.

---

**Owner:** Aram Badalyan
**Brand scope:** Das Experten (extensible to any brand via expansion of refs/styles/)
**Last updated:** 2026-05-11
**Worker version deployed:** Phase 2.8
**Reference library size:** 246 files (160 products + 81 characters + 5 brand assets)
