---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

SOURCE OF TRUTH: deSIGNER/SKILLS/frontend-design — edit here first.

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

## Das Experten UX inspiration / site audit discipline

When Aram asks for inspiration sites, beautiful websites, UX references, or competitive visual research, treat it as a design-audit task, not a generic link list. Deliver a ranked shortlist with clickable links, the specific UX pattern each site demonstrates, what to borrow, what not to copy, and a concrete counter-proposal for Das Experten.

For biotech, microbiome, macrobiome, bacteria, biofilm-adjacent, precision nutrition, CRISPR-bacteria, synthetic biology, or scientific-health references, prefer sites that show one of these reusable patterns: macro narrative, diagnostic quiz/funnel, scientific storytelling, platform/pipeline explanation, ingredient-brand system, premium daily ritual, practitioner/patient split, or AI/data health interface. See `references/biotech-microbiome-ux-audit.md` for a seed bank of reference sites and reusable observations.

Typography is part of the audit. Aram dislikes thin fonts: explicitly flag `100`, `200`, `300`, `light`, and overly delicate display/body type as legibility/brand-confidence risks. Prefer examples using dense display/sans weights around `500–800`, or typefaces whose shape stays optically strong even at `400`. When possible, verify fonts from CSS/computed styles rather than guessing from screenshots.

## Project independence and non-Das brand briefs

When Aram names a new project and clarifies that it is **not Das Experten**, do not import Das Experten aesthetics, SKU assumptions, oral-care logic, marketplace conventions, or brand tone unless he explicitly asks for a bridge. Treat the new project as an independent brand and build its own visual language, UX hierarchy, typography, and product architecture.

For Microbiome Friendly design-system, packaging, UX, quiz conversion, or Claude Design brief work, use `references/microbiome-friendly-brand.md` before drafting. For Microbiome Friendly funnels and quizzes, also use `references/microbiome-friendly-conversion-audit.md` and `references/microbiome-friendly-quiz-conversion-pattern.md`; the required quiz standard is a warm biotech diagnostic chamber, not an анкета: body-signal intrigue, per-answer aha facts, know-how hooks, immediate reveal panels, live signal map, personalized pattern result and formula-plan email capture. Key defaults: independent premium warm-biotech ecosystem brand; no Das Experten linkage; dense typography only because Aram dislikes thin fonts; solve master-brand vs formula hierarchy explicitly.

## Das Experten site contact CTA pattern

When the user asks to connect WhatsApp, Telegram, email, or another messenger to a Das Experten website, treat it as a frontend conversion component first and a deep platform integration second.

Default recommendation for WhatsApp on public brand sites:
- **Phase 1 — branded click-to-chat CTA:** add a lightweight `wa.me` link with a prefilled message, language-aware text, and a floating or footer CTA. No third-party widget script unless the user explicitly asks for one. This is fast, privacy-safe, cache-friendly, and does not slow the landing page.
- **Phase 2 — branded micro-widget:** replace generic green WhatsApp bubble styling with a Das Experten-native card: refined typography, brand colors, short advisory copy, and localized EN/DE/RU message presets.
- **Phase 3 — WhatsApp Business API:** only recommend when the user needs CRM history, AI support, routing, templates, or Das Operator integration. Requires Meta Business verification, a dedicated phone number not already used in ordinary WhatsApp, webhook/backend, and escalation rules.

Pitfalls:
- Do not present WhatsApp Business API as the first step for a simple website connection; it is overkill before lead volume is proven.
- Do not add heavy chat widgets by default. Prefer a plain `https://wa.me/<number>?text=<encoded-message>` link unless there is a concrete need for live-chat features.
- Always ask for or look up the final international-format WhatsApp number before implementation; never invent the number.
- For multilingual Das Experten pages, localize the prefilled WhatsApp message per route instead of using one generic English prompt everywhere.

Support file: `templates/whatsapp-cta.html` contains a copy-ready branded CTA starter.
