# Inter-Skill Gate Query Cheatsheet

How other skills call virality-master.

## Gate format

```
[[GATE: virality-master?source={SOURCE}&{IDENTIFIER}={VALUE}&{OPTIONAL}={VALUE}]]
```

## Source types

| source | identifier | example |
|---|---|---|
| `upload` | `path` | `path=/mnt/user-data/uploads/X.mp4` |
| `higgsfield` | `job_id` | `job_id=512387ce-3998-496e-946f-effe16e13520` |
| `r2` | `key` | `key=banners/2026-05/SCHWARZ-promo.mp4` |
| `external` | `url` | `url=https://www.tiktok.com/@user/video/123` |
| `batch` | `urls` | `urls=[url1,url2,url3]` (array) |

## Optional parameters

| param | values | default | purpose |
|---|---|---|---|
| `context` | `blogger_screen` / `competitor_analysis` / `self_benchmark` / `ad_qualification` | `direct` | helps interpretation |
| `trim_segment` | `start` / `middle` / `end` | `start` | which 14s to take |
| `log_to_r2` | `true` / `false` | `true` for branded, `false` for blogger | whether to save to benchmark library |
| `format` | `full` / `gate` | `gate` when called from skill | controls output verbosity |
| `country` | ISO code | none | for competitor context |
| `category` | toothpaste / brush / floss | none | for benchmark comparison |
| `min_score` | 0-100 | none | filter for batch — exclude below threshold |

## Response format (Mode B — gate)

```json
{
  "ok": true,
  "video_uuid": "{higgsfield media UUID}",
  "predictor_job_id": "{predictor job id for full dashboard}",
  "duration_analyzed": 14.0,
  "scores": {
    "hook_strength": 7,
    "attention_curve": 6,
    "audience_response": 7,
    "retention_risk": 4,
    "distraction_risk": 3,
    "creative_score": 78
  },
  "verdict": "ship",
  "top_fix": "Strengthen first 1.5s by adding subtle motion",
  "key_drop_off_seconds": 3.5,
  "logged_to_r2": "virality-log/dasexperten/2026-05-24-SCHWARZ-promo.json"
}
```

For batch mode:
```json
{
  "ok": true,
  "results": [
    {"url": "...", "scores": {...}, "verdict": "ship"},
    {"url": "...", "scores": {...}, "verdict": "iterate"},
    {"url": "...", "scores": {...}, "verdict": "reject"}
  ],
  "aggregate": {
    "avg_creative_score": 64,
    "best_url": "...",
    "worst_url": "..."
  }
}
```

## Error response

```json
{
  "ok": false,
  "error": "video_too_long | invalid_source | upload_failed | predictor_timeout",
  "details": "human-readable explanation"
}
```

## Common gate patterns

### From ugc-master (blogger pre-screen)
```
[[GATE: virality-master?source=batch&urls=[blogger.instagram_recent_3]&context=blogger_screen&log_to_r2=true]]
```
Decision: if `aggregate.avg_creative_score < 50` → reject blogger automatically.

### From sales-hunter (competitor analysis)
```
[[GATE: virality-master?source=external&url={competitor_tiktok_url}&context=competitor_analysis&country=RU&category=toothpaste]]
```
Use: insight about winning hook/setting in new market.

### From das-presenter (deck videos)
```
[[GATE: virality-master?source=r2&key={video_key}&context=self_benchmark&min_score=60]]
```
Filter: only videos scoring ≥60 enter the deck.

### From bannerizer (auto post-check)
```
[[GATE: virality-master?source=higgsfield&job_id={just_generated_video}&context=ad_qualification]]
```
Use: instant feedback after generation, before user even sees it.

## What virality-master will NOT do via gate

- Will not auto-regenerate failing videos (returns verdict, caller decides)
- Will not delete or modify the source video
- Will not auto-trigger downstream actions (publishing, sending, etc.)
- Will not score images via gate — use direct Vision call in caller skill
- Will not predict multiple platforms separately — single score, generic short-form

For caller skill workflows that need image scoring, embed Claude Vision call directly in caller skill (no gate needed).
