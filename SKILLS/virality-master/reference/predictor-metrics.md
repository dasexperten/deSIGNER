# Predictor Metrics — Interpretation Guide

## Hook Strength (0-10)

What it measures: ability of first 1.5 seconds to keep the viewer.

| Score | Meaning | Action |
|---|---|---|
| 0-3 | Dead hook — viewer scrolls immediately | Redo opening shot entirely |
| 4-6 | Weak hook — some viewers stay | Add motion in first 0.5s, faster cut, brighter focal point |
| 7-8 | Strong hook — majority stays | Ship if other metrics ≥ 6 |
| 9-10 | Exceptional hook — rare | Use this opening as template across other videos |

Common hook failures:
- Static product shot with no motion in first 1.5s
- Face turned away from camera in first frame
- Logo or watermark in center (competing with subject)
- Slow zoom-in (too slow to register)
- Background more interesting than foreground

Common hook wins:
- Direct eye contact + brief gesture
- Mid-action freeze (object mid-fall, mid-pour, mid-bite)
- Unexpected motion direction (object enters from unusual angle)
- Pattern interrupt (color shift, lighting flash, scale change)
- Question in mouth movement (visible inhale before speaking)

## Attention Curve (0-10 average across timeline)

What it measures: where the eye locks vs drifts second-by-second.

Key signals from predictor:
- **Peak attention moment** — what's happening at second X (replicate this)
- **First drop-off** — second Y is where 20% of viewers leave (fix that moment)
- **Recovery moments** — second Z brings attention back (good cut, new info)

For TikTok/Reels, viewers leave in waves at:
- 1.5s (hook fail)
- 3-4s (hook held but no payoff promised)
- 6-7s (mid-video plateau)
- 10s+ (info dense enough but viewer satisfied, scrolls)

## Audience Response

Predicted likes, shares, saves scaled to genre. NOT view count.

Calibration: scores reflect the video's quality vs a genre-matched baseline. A high beauty-product score ≠ high gaming score. Compare within category.

For Das Experten (oral care DTC), good benchmarks are:
- Likes prediction ≥ 4% of views: above category average
- Shares ≥ 1.5%: very strong (people send to friends)
- Saves ≥ 3%: high purchase intent

## Retention Risk (0-10, INVERSE — higher = worse)

What it measures: scroll-away probability across timeline.

| Score | Reading |
|---|---|
| 0-2 | Very low — viewers watch through |
| 3-5 | Moderate — some leakage at known weak moments |
| 6-8 | High — significant drop-off in middle |
| 9-10 | Severe — viewers leave within 3-4 seconds |

When retention risk is high, predictor usually identifies the EXACT second where the drop happens. Fix THAT moment specifically, not the whole video.

## Distraction Risk (0-10, INVERSE)

What competes with the main subject/product:

- Background clutter
- Text overlays at wrong moment
- Logo/watermark stealing focus
- Secondary character upstaging primary
- Multiple products visible
- Bright unrelated objects in frame
- Sub-quality animation/effect

For Das Experten product videos: anything that prevents the SKU from being clearly recognized in the final frame = distraction risk.

## Creative Score (0-100 composite)

The single number for A/B testing. Use as primary comparison metric.

Thresholds:
- **75-100** — Ship as is, or with minor polish
- **60-74** — Iterate one or two top fixes, re-score
- **40-59** — Major redo needed
- **<40** — Reject, fundamental concept issue

For barter blogger qualification (ugc-master):
- Average across blogger's 3 videos ≥ 60 → safe to send product
- 50-59 → marginal, send small package
- <50 → reject, find another blogger

For Das Experten brand videos:
- Average score across last 5 videos = brand baseline
- Each new video aims to exceed baseline by at least 5 points
- If 3 consecutive scores drop below baseline → review production process
