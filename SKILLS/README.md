# SKILLS — design-skill SOURCES (SSOT)

The 13 design skills' **source of truth** lives here. The skill hub
(`dasexperten/SKILLS`, mirrored from CoWork/SKILLS) remains the **runtime** —
Cowork keeps loading skills from the hub, nothing changed in how skills load.

**Edit flow:** change the skill here first → sync the change to the hub →
the hub distributes to working copies. Each copied `SKILL.md` carries a
sync-safe line in its body (not frontmatter):
`SOURCE OF TRUTH: deSIGNER/SKILLS/<name> — edit here first.`

## The 13 sources

| Skill | What it does |
| --- | --- |
| `bannerizer` | Brand banners |
| `brush-zoom` | Toothbrush close-up renders (pairs with bannerizer) |
| `cardmaker` | Product cards |
| `imager` | Image generation gate (imager-bridge Worker client) |
| `designer` | Packaging: dieline prompts, surgical SVG edits, textless backgrounds (modes A/B/C) |
| `motionizer` | Motion design |
| `animator` | Animation |
| `higgsfield-generate` | Higgsfield generation harness |
| `higgsfield-marketplace-cards` | Marketplace card generation via Higgsfield |
| `higgsfield-product-photoshoot` | Product photoshoot generation via Higgsfield |
| `video-master` | Video production |
| `virality-master` | Virality/creative performance |
| `frontend-design` | Frontend design discipline |

References inside each skill folder were copied intact. Skill gates
(`[[GATE: …]]`) keep pointing at their runtime targets — gate resolution
happens in the hub runtime, not here.
