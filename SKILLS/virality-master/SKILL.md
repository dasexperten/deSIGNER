---
name: virality-master
description: Das Experten video virality intelligence skill. Uses Higgsfield Virality Predictor (free, 0 credits) to score videos on hook strength, attention curve, audience response, retention risk, distraction risk, and creative score. ALWAYS trigger when user says any of "analyze video", "analyze animation", "evaluate video", "evaluate animation", "virality", "vir виральность", "вирусность", "вирусится", "предскажи виральность", "predict virality", "проверь видео", "оцени ролик", "сколько баллов у видео", "predict virality", "predictor", "virality predictor", or attaches a video file (.mp4 / .mov / .webm) with intent to assess. Also fires via inter-skill gate [[GATE: virality-master?video_id=X]] from ugc-master (blogger pre-screen), sales-hunter (competitor analysis), das-presenter (deck videos), bannerizer (motion banners). Auto-trims videos longer than 16 seconds, supports R2 sources, Higgsfield job IDs, local files, and competitor video URLs via apifier gate.
---

SOURCE OF TRUTH: deSIGNER/SKILLS/virality-master — edit here first.

# virality-master — Video Virality Intelligence Skill

The virality-master skill is the single entry point for predicting how a video will perform on TikTok, Reels, Shorts, marketplace listing videos, and any short-form social platform.

It routes calls to **Higgsfield's Virality Predictor** (model: `virality_predictor`), which is **FREE — 0 credits per analysis** (verified via transactions log).

---

## WHAT THE PREDICTOR MEASURES — 60-SECOND BRIEFING

Higgsfield Virality Predictor runs a computer-vision model trained on millions of social-media short videos. It analyzes a video frame-by-frame and returns 6 core metrics:

| Metric | What it measures | Why it matters |
|---|---|---|
| **Hook strength** | First 1.5s composition, face direction, motion energy | Decides whether viewer keeps watching or scrolls |
| **Attention curve** | Pixel-change rate, cuts, focal points across timeline | Where the eye locks in, where it drifts |
| **Audience response** | Predicted likes / saves / shares scaled to genre | Real engagement forecast, not vanity views |
| **Retention risk** | Scroll-away probability at each moment | The exact second where viewers leave |
| **Distraction risk** | Competing elements in frame, product loss | Whether your product reads or disappears |
| **Creative score** | Overall composite, 0-100 | Single number for A/B comparison |

### Hard constraints
- **Video duration ≤ 16 seconds.** Anything longer must be trimmed (skill handles this automatically).
- **Video roles only** — no images, no text prompts, no thumbnails. (For images use GPT-4 Vision or Claude Vision instead — see Section 8.)
- **Confirmed media UUID required** — videos must be uploaded to Higgsfield via `media_upload` → `media_confirm` chain before predictor accepts them.

### Cost
- **Predictor itself: 0 credits per run.** Verified May 2026 — zero entries in transactions log over 10+ runs.
- **Upload bandwidth: free** through Higgsfield CloudFront.
- **Only paid step** is optional pre-generation, when user wants to score a video Higgsfield generated (already paid for the generation itself).

---

## TWO MODES

### Mode A — Direct user mode
Fires when the user explicitly asks to analyze a video. Workflow:
1. Find the video (uploaded file, R2 key, Higgsfield job ID, or URL)
2. Check duration with ffprobe → trim to 14s if >16s
3. Upload to Higgsfield → media_confirm
4. Call `virality_predictor.create` with the confirmed media_id
5. Wait for dashboard, parse 6 metrics
6. Present scored dashboard + actionable fixes

### Mode B — Gate mode (inter-skill)
Fires from another skill via `[[GATE: virality-master?source=X&video_id=Y&context=Z]]`. Returns structured JSON for the caller skill to consume.

Callers:
- **ugc-master** — pre-screen blogger candidate videos before sending product
- **sales-hunter** — analyze competitor's ad video before pitching against them
- **das-presenter** — score video clips embedded in distributor decks
- **bannerizer** — evaluate motion banner before publishing

---

## TRIGGERS — EXACT PHRASES

Always fire immediately on ANY of:

**English:**
- "analyze video" / "analyze this video"
- "analyze animation"
- "evaluate video" / "evaluate animation"
- "predict virality" / "virality prediction"
- "score this video"
- "is this video viral"
- "how viral is this"
- "predictor" / "virality predictor"
- "rate this clip"

**Russian:**
- "виральность" / "виральный"
- "вирусность" / "вирусится"
- "оцени видео" / "оцени ролик"
- "проверь видео" / "проверь ролик"
- "предскажи виральность"
- "сколько баллов у видео"
- "проанализируй видео"
- "анализ видео"
- "анализ анимации"
- "разбери ролик"

**Implicit (no trigger words):**
- User uploads .mp4 / .mov / .webm / .mkv with question mark
- User mentions a Higgsfield video job_id with evaluative context
- Inter-skill `[[GATE: virality-master?...]]`

Do NOT fire on:
- "make a viral video" → that's video generation, route to generate_video
- "what makes videos viral" → general education, answer in prose, no tool call

---

## CORE WORKFLOW — STEP BY STEP

### Step 1 — Locate the video

The video can come from 5 sources. Detect which one:

| Source | Signal | What to do |
|---|---|---|
| Uploaded file in chat | Path `/mnt/user-data/uploads/*.mp4` | Read directly from disk |
| R2 bucket | User says "из R2 / R2 / тот ролик про X" | CF API download with CF Cloud Master token |
| Higgsfield generated | User gives job_id UUID | Use directly as `medias[].id` with role="video" |
| Higgsfield uploaded | User gives media UUID from prior session | Use directly |
| External URL | TikTok / Instagram / YouTube link | Apifier-bridge or yt-dlp → download → upload |

If source ambiguous, ask ONE inline question: "видео из чата, R2, Higgsfield или внешняя ссылка?"

### Step 2 — Duration check + auto-trim

ALWAYS run ffprobe first:

```bash
ffprobe -v quiet -print_format json -show_format /path/to/video.mp4 | python3 -c "import sys,json; print(float(json.load(sys.stdin)['format']['duration']))"
```

If duration > 16s, trim to **14 seconds** (safe margin — codec copy can add ~0.1s):

```bash
ffmpeg -y -i input.mp4 -t 14 -c copy output_14s.mp4
```

ALWAYS trim from the START (first 14s) by default — this is where TikTok/Reels attention windows actually matter. Only trim other segments if user explicitly says "оцени середину" / "с 0:20" / "the middle / the end".

### Step 3 — Upload to Higgsfield (skip if already a Higgsfield UUID)

```
HIggsfield:media_upload
  content_type: "video/mp4"
  filename: "{descriptive_name}.mp4"
→ returns presigned URL + media_id
```

PUT bytes via curl:
```bash
curl -sS -X PUT -H "Content-Type: video/mp4" \
  --data-binary @file.mp4 \
  '{presigned_url}' \
  -w "HTTP %{http_code}\n"
```

Then confirm:
```
HIggsfield:media_confirm
  media_id: "{uuid}"
  type: "video"
```

### Step 4 — Run Virality Predictor

```
HIggsfield:virality_predictor
  action: "create"
  params:
    model: "virality_predictor"
    medias:
      - id: "{confirmed_media_id}"
        role: "video"
→ returns job_id (e.g., 59f6dd26-2fbc-418b-814e-a5c77579f12b)
```

Widget polls automatically. Typical completion: 30-90 seconds.

### Step 5 — Parse + present results

When dashboard is ready, return structured response covering:
- **Bottom line** (1-sentence verdict)
- **6 metrics table** with scores
- **Top retention risk moment** (where viewers leave)
- **Top distraction risk** (what competes with product)
- **3-5 actionable fixes** specific to this video

### Step 6 — Optionally log to R2 benchmark library

For Das Experten branded videos, save the score to `r2://dasexperten-images/virality-log/{video_uuid}.json` so we build a benchmark over time. For competitor videos, save to `r2://dasexperten-images/virality-log/competitors/{name}-{date}.json`.

R2 path:
```bash
curl -sS -X PUT \
  -H "Authorization: Bearer ${CF_TOKEN}" \
  -H "Content-Type: application/json" \
  --data-binary @result.json \
  "https://api.cloudflare.com/client/v4/accounts/081ddb85cb399ad62a70210328d744fc/r2/buckets/dasexperten-images/objects/virality-log/{key}"
```

(CF Cloud Master token only — see secrets file)

---

## OUTPUT FORMAT (Mode A — direct user)

Render the result. **If `visualize:show_widget` is available** (Cowork desktop), use the interactive HTML widget per the default format below. **Otherwise** (Telegram, headless, Hermes Agent), render as markdown: the 6 metric cards become a 2-column markdown table; **Где зритель уходит**, **Что отвлекает от продукта**, and **Top fixes** become bold sub-headers with one-line items underneath. Same six metrics + same three diagnostic sections — only render mode differs. Default visual format:

**Metric cards row** — 6 small cards with scores
- Hook strength (0-10)
- Attention curve (0-10 average)
- Audience response (predicted likes/shares)
- Retention risk (0-10 inverse — higher = worse)
- Distraction risk (0-10 inverse)
- Creative score (0-100 total)

**Below cards:**
- "Где зритель уходит" — exact timestamp + what causes drop-off
- "Что отвлекает от продукта" — list of competing elements
- "Top fixes" — 3-5 specific changes for next iteration

If predictor returns frame-level data AND `visualize:show_widget` is available, render attention curve as a Chart.js line chart inside the widget. Otherwise render as inline markdown table with `timestamp | attention (0-10)` rows.

---

## OUTPUT FORMAT (Mode B — gate mode)

When called from another skill, return MINIMAL structured JSON:

```json
{
  "video_uuid": "...",
  "creative_score": 78,
  "verdict": "ship|iterate|reject",
  "top_fix": "single most important change",
  "full_dashboard_job_id": "for caller to display if needed"
}
```

`verdict` thresholds:
- ≥75 → **ship** (good enough to publish)
- 50-74 → **iterate** (worth fixing top issues, not throwing away)
- <50 → **reject** (don't publish, fundamental issues)

---

## INTEGRATION RECIPES

### Recipe 1 — Blogger pre-screen (ugc-master gate)

Before sending product to a barter blogger, analyze her 3 most recent videos:

```
ugc-master finds blogger candidate
  → [[GATE: virality-master?source=instagram&urls=[url1,url2,url3]&context=blogger_screen]]
→ For each URL:
   1. apifier-bridge download via instagram-scraper
   2. trim to 14s
   3. predictor
→ Return aggregate: avg creative_score across 3 videos
→ If avg < 50: ugc-master rejects blogger (saves SKU)
→ If avg ≥ 60: proceed with outreach
```

### Recipe 2 — Competitor analysis (sales-hunter gate)

Before entering a new market, score competitor's ad video:

```
sales-hunter finds competitor leader in {country} for {category}
  → [[GATE: virality-master?source=tiktok&competitor=Splat&country=RU]]
→ apifier-bridge downloads top 3 ads via tiktok-scraper
→ Predictor on each
→ Return: which hook/setting/audience archetype is currently winning the category
→ sales-hunter uses insight in pitch deck differentiation
```

### Recipe 3 — Self-benchmark (das-presenter gate)

For distributor presentations with Das Experten promo videos:

```
das-presenter assembling deck
  → For each embedded video clip: [[GATE: virality-master?source=r2&key=banners/X.mp4]]
→ Skip videos with creative_score < 60
→ Only highest-scoring clips end up in deck
```

### Recipe 4 — Marketing Studio post-check (auto, no user trigger needed)

After any successful `marketing_studio_video` generation in same session:

```
generate_video completes
  → AUTO trigger [[GATE: virality-master?job_id={video_job_id}]]
→ Show user the score alongside the video
→ If score < 60, automatically offer to regenerate with different hook/setting
```

---

## IMAGE FALLBACK (Section 8)

The predictor does NOT accept images. For static banners / packshots / marketplace cards:

### Option 1 — Claude Vision direct (FREE)

In current session, use `view` tool on the image and apply same 6-metric framework manually. Output structured JSON in same format. No API call needed.

### Option 2 — Image-to-motion-video → Predictor (~22 credits)

If user needs a NUMERICAL score (not just text analysis):

```bash
# 1. image-to-video via wan2_6 with subtle drift (4-5 seconds is enough)
HIggsfield:generate_video
  model: "wan2_6"
  prompt: "subtle camera pan across the marketing banner, no other motion"
  medias: [{id: "{image_uuid}", role: "image"}]
  duration: 5

# 2. wait for completion → take video_uuid
# 3. feed into virality_predictor as normal
```

This costs ~22 credits (one Wan 2.7 video) but gives a numerical predictor score.

### Option 3 — Mosaic grid (best for A/B testing 4-9 banners)

Pack 4-9 banner variants into a 2×2 or 3×3 grid (Pillow), turn into 5s pan video, score the whole grid in one shot. Cost-per-banner: ~2.5 credits. Useful for marketplace listing card A/B before going live.

---

## DURATION POLICY

| Original duration | Action |
|---|---|
| ≤16s | Upload as-is |
| 16-30s | Trim to 14s from start |
| 30s-2min | Trim to 14s from start, plus optionally a second 14s clip from the second half — score both |
| >2min | Likely not a TikTok/Reels asset — ask user "это полноценное видео или ad?" before proceeding |

Always tell the user when you trim: "Ролик 36 секунд — Predictor работает до 16. Беру первые 14 секунд (там, где TikTok принимает решение остаться или скроллить)."

Never silently truncate without disclosure.

---

## R2 BENCHMARK LIBRARY

Path: `r2://dasexperten-images/virality-log/`

Structure:
```
virality-log/
├── dasexperten/
│   ├── {date}-{sku}-{campaign}.json
│   └── ...
├── competitors/
│   ├── splat/
│   ├── rocs/
│   ├── lacalut/
│   └── ...
├── bloggers/
│   ├── {handle}-{date}.json
│   └── ...
└── index.json  (rolling aggregate)
```

Each JSON contains:
- video_uuid (Higgsfield)
- source (r2 / higgsfield_job / external_url + original)
- 6 metrics
- top_fixes
- created_at
- optional context (campaign, country, sku)

After 20+ scored videos, become a queryable benchmark — "show me my best-performing hooks in RU market" can be answered without re-running predictor.

---

## CRITICAL RULES

### MUST
- ALWAYS check duration before upload — never assume video is short enough
- ALWAYS disclose trimming to user (which seconds, why)
- ALWAYS use `confirmed` media_id (not raw upload UUID) for predictor input
- ALWAYS show 6 metrics + fixes, never just one number
- ALWAYS log Das Experten branded videos to R2 benchmark library
- ALWAYS recommend specific fixes — vague advice ("улучшить hook") is failure

### MUST NOT
- NEVER pass image to virality_predictor — it will return validation error
- NEVER skip ffprobe duration check — > 16s upload silently fails predictor
- NEVER reveal full Higgsfield URLs to user (they expire, confusing)
- NEVER promise viral guarantee — predictor is forecast, not certainty
- NEVER auto-trigger gate from a skill that hasn't loaded virality-master query block
- NEVER bill or estimate cost — predictor is free, communicate that clearly

---

## ERROR HANDLING

| Error | Cause | Fix |
|---|---|---|
| "Video must be 16 seconds or shorter" | Forgot to trim | Run ffmpeg trim to 14s, re-upload |
| "Invalid arguments: expected video" | Passed image | Reject and use Image Fallback section |
| Upload HTTP 403 | Presigned URL expired (24h) | Re-call media_upload for fresh URL |
| Predictor job stuck >5 min | Higgsfield queue backed up | Wait, do not re-submit (creates duplicate) |
| ffprobe / ffmpeg missing | Container without ffmpeg | `apt-get install -y ffmpeg` (need root) or fall back to Python `moviepy` |

---

## QUICK REFERENCE — FIRST 60 SECONDS

User: "проверь это видео" + uploaded file

```bash
# 1. Inspect
ffprobe -v quiet -print_format json -show_format /mnt/user-data/uploads/video.mp4

# 2. Trim if needed
ffmpeg -y -i input.mp4 -t 14 -c copy /home/claude/video_14s.mp4

# 3. Upload
HIggsfield:media_upload(content_type="video/mp4", filename="video_14s.mp4")
curl -X PUT --data-binary @video_14s.mp4 '{presigned_url}'
HIggsfield:media_confirm(media_id="...", type="video")

# 4. Score
HIggsfield:virality_predictor(action="create", params={
  model: "virality_predictor",
  medias: [{id: "...", role: "video"}]
})

# 5. Present
# (if visualize:show_widget available → widget with 6 metric cards + fixes; else → markdown 6-row metric table + bold-headered fixes section)

# 6. Log
# curl PUT to R2 virality-log/{...}.json
```

---

## DEPENDENCIES

| Tool / Resource | Source | Purpose |
|---|---|---|
| `HIggsfield:media_upload` | Higgsfield MCP | Get presigned URL for video upload |
| `HIggsfield:media_confirm` | Higgsfield MCP | Confirm uploaded video |
| `HIggsfield:virality_predictor` | Higgsfield MCP | Run the prediction |
| `ffmpeg` + `ffprobe` | OS / container | Duration check + trim |
| `curl` | OS | PUT bytes to presigned URL, R2 ops |
| CF Cloud Master token | secrets file | R2 read/write for benchmark log |
| `apifier-bridge` (optional) | inter-skill | Download competitor videos by URL |

---

## INTER-SKILL GATE CHEATSHEET

How other skills should call virality-master:

```
[[GATE: virality-master?source=upload&path=/mnt/user-data/uploads/X.mp4]]
[[GATE: virality-master?source=higgsfield&job_id=UUID]]
[[GATE: virality-master?source=r2&key=banners/X.mp4]]
[[GATE: virality-master?source=external&url=https://tiktok.com/.../X]]
[[GATE: virality-master?source=batch&urls=[url1,url2,url3]&context=blogger_screen]]
```

Required parameters: `source`, plus the appropriate identifier per source.
Optional parameters: `context` (blogger_screen, competitor_analysis, self_benchmark, ad_qualification), `trim_segment` (start|middle|end, default: start), `log_to_r2` (true|false, default: true for branded videos), `format` (full|gate, default: gate when called via [[GATE]]).

Returns minimal JSON (see Mode B above).

---

END OF SKILL
