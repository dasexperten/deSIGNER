# Microbiome Friendly quiz conversion pattern

Use when improving the Microbiome Friendly quiz, segment funnel, diagnostic UX, or pre-launch email capture.

## Core lesson

A strong Microbiome Friendly quiz should not feel like a form. It should feel like a **warm biotech diagnostic chamber**: the visitor reads repeating body signals, receives small scientific aha moments, then saves a formula plan.

Default frame:

Hero promise → segment/preselected goal → question as body-signal clue → answer cards → immediate reveal panel → live signal map → personalized pattern result → primary formula + secondary support → email capture.

## Copy pattern

Each question needs three layers:

- **Intrigue hook:** a line that makes the user feel there is hidden logic behind the symptom.
- **Aha fact:** short, useful, non-medical insight. Example themes: GLP-1 pathway, Akkermansia, gut–skin axis, gut–brain rhythm, post-meal response, compliance as hidden ingredient.
- **Reveal after choice:** explain what the selected answer changes in the recommendation.

Avoid dry phrasing like choose your goal or which benefit do you want. Prefer body-signal language:

- Your body leaves clues before it starts shouting.
- Energy is rarely just energy.
- The most honest metabolic clue is not weight. It is who makes the food decision.
- If your skin had to report on your gut, what would it say?
- Which plan would survive a bad week?

## UI pattern

Use a two-zone layout:

- Dark biotech header/hero with strong typography and an ecosystem/organism motif.
- Light diagnostic board below, with a dark left-side live map and a high-contrast question panel.

Answer cards should feel premium and tactile: large rounded cards, dense 600–800 typography, clear radio markers, hover and selected states. Avoid thin, pale, generic wellness UI.

The live map should visibly update across axes such as metabolism, gut–brain, energy, skin and digestion. Progress lines must have enough contrast on dark backgrounds.

After each answer, show a reveal block split into:

- What this reveals.
- Aha fact.

This creates the user reaction Aram asked for: **I did not know that / oh, interesting / fact of the day**.

## Result pattern

The result should not simply say recommended product. It should name the personal pattern:

- Your metabolic microbiome pattern is loudest.
- Your gut–brain recovery pattern is loudest.
- Your gut–skin signal is loudest.
- Your after-meal comfort pattern is loudest.

Then show:

- Primary formula.
- Secondary support.
- Signal map.
- Routine type.
- A personal know-how statement.
- Save formula plan email capture.

Good result insight:

The body rarely asks for a product. It shows a repeated pattern. The formula is only the final layer of that pattern.

## Claims discipline

Keep all claims educational and support-based. Do not use cure, treat, prevent disease, or medical promises. For gut–brain and sleep, speak about rhythm, recovery and stress-response balance. For skin, speak about visible balance and barrier support, not miracle beauty.

## Deployment/verification checklist

When changing the quiz:

- Update both EN and RU versions.
- Preserve segment URL entry points such as `?goal=skin` and `?goal=metabolism`.
- Preserve result email capture and localStorage save behavior.
- Bump CSS/JS query version so Cloudflare Pages users do not see stale styling.
- Verify a full path to result in EN and RU.
- Verify the live deployment URL and the canonical domain if cache is involved.
