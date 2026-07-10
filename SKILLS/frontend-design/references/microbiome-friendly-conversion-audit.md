# Microbiome Friendly conversion and segment audit notes

Use when auditing or improving microbiomefriendly.me, its landing pages, quiz, product pages, pre-launch funnel, or Claude Design/web prompts for Microbiome Friendly.

## Current funnel lesson

The site can look premium and scientifically credible while still under-converting. For Microbiome Friendly, always separate **brand explanation** from **conversion path**. The default funnel should be:

Hero → segment choice → quiz → personalized formula result → email capture → launch list / early access → science proof → preorder/shop when ready.

The site should not merely explain the ecosystem; it must pull the visitor into a measurable next step.

## Conversion gate for pre-launch state

If checkout is not live, do not label the main CTA as Shop unless it actually enables purchase. Prefer:

- Join launch
- Select formulas
- Save my formula plan
- Get early access

Pre-launch offer should state what the user receives after leaving email:

- launch notification
- early access
- launch price
- saved formula plan
- simple routine guide
- science notes for the selected formula

The highest-value capture point is **after quiz result**, not before. The user has already invested attention and received a personalized match.

## Microbiome quiz conversion standard

For Microbiome Friendly, a quiz must not feel like a questionnaire or static intake form. Aram explicitly rejected a simple quiz as too primitive and asked for intrigue, know-how, fact-of-the-day moments and conversion pull. The quiz should feel like a short diagnostic detective story: each answer reveals a hidden clue, one useful aha fact and a reason why the next question matters.

Use this structure:

- Hero promise: decode the repeating body signal, not answer a survey.
- Question copy: ask in vivid human patterns, e.g. energy is rarely just energy, the most honest metabolic clue is not weight, if skin reported on your gut.
- Per-answer feedback: immediately show **What this reveals** and **Aha fact** before the next step. This creates reward loops and keeps the user moving.
- Scientific intrigue: use Akkermansia, GLP-1 pathway, gut-skin axis, gut-brain rhythm, post-meal response and compliance as know-how hooks, while staying in supplement-safe support language.
- CTA wording: prefer **Next clue**, **Reveal my pattern**, **Save this formula plan** over generic Next / Submit.
- Result logic: the formula should land as the final layer of a repeated body pattern, not as a product recommendation dropped from a scoring table.

Pitfall: adding more questions alone does not make the quiz stronger. More primitive questions make it feel more like an анкета. Strength comes from micro-revelations, tension, self-recognition and a payoff after every click.

Recommended result-page capture block:

**Save your formula plan**
Get your primary formula, secondary support, launch price and routine guide.
CTA: **Save my plan**

On a static pre-launch site with no mailing backend yet, the form may store a temporary plan object in browser localStorage and add the recommended formulas to the selection drawer, but the UI copy must not imply a production email flow is live until it is connected. Treat this as an MVP placeholder, not real CRM capture.

## CTA hierarchy

For DTC conversion, keep one dominant path on the homepage:

Primary: Take the Quiz
Secondary: Explore AkkerMagic / Learn the Science
Tertiary: Add to selection / Notify me

Avoid presenting Take the Quiz, Explore AkkerMagic, Shop, Add to selection and Notify me as equal choices. Too many active CTAs create decision friction.

## Segment check framework

Always evaluate Microbiome Friendly against these segments:

- Metabolic / weight-management: strongest launch segment. Use Akkermansia AH39, GLP-1 pathway, body composition, cravings, glucose/lipid metabolism support. Avoid disease or drug-like claims.
- Skeptical science reader: needs strain-level transparency, evidence level labels, human pilot/RCT/mechanistic distinction, clear limitations.
- Wellness consumer: needs everyday scenarios, not only axes and strains. Use bloating after meals, steady energy, sleep rhythm, stress, cravings, skin clarity.
- Beauty / skin-gut axis: underused commercial segment. Build Skinbiotic around skin clarity, barrier support, gut-skin axis, inflammation balance, inner glow.
- Mood / sleep / stress: use calm routine, stress-response balance, sleep-rhythm support, gut-brain axis. Avoid anxiety/depression/treatment claims.
- Energy / focus: position Enerbiotic as no-stimulant energy, no spike/no crash, focus without overdrive.
- B2B / partners: if Microbiome Friendly is also a standard or platform, add For partners path: formulation standard, ingredient sourcing, co-branded formulas, certification logic, retail/clinic/wellness collaborations.
- Russian-speaking audience: RU homepage is not enough if RU traffic matters; localize AkkerMagic, Science, Quiz and product depth.

## UX additions that repeatedly matter

Add segment cards near the top: Metabolism & weight, Mood & sleep, Energy & focus, Skin from within, Digestion & bloating, Healthy aging. Each card should route to the quiz with the goal preselected or to the relevant formula.

For a static MVP, implement those segment cards as query-driven quiz entry points: links like `quiz.html?goal=skin`, then the quiz reads `new URLSearchParams(location.search).get('goal')`, pre-fills `ans.goal`, and starts at the next question. This keeps the homepage human and outcome-led while preserving the existing quiz logic.

### Quiz engagement upgrade pattern

If Aram says the quiz feels primitive, simple, questionnaire-like, not engaging, or like an анкета, do not merely add more questions. Reframe the quiz as a **diagnostic experience**: a live system read, not a form.

The better pattern for Microbiome Friendly is:

Hero promise → living signal map → scenario-based questions → weighted axes → personalized ecosystem profile → primary formula + secondary support → routine fit → save formula plan.

Use human inner-dialogue questions instead of administrative survey prompts. Prefer: what are you tired of negotiating with your body, when does the gut make itself impossible to ignore, what energy pattern feels familiar, what happens when the nervous system should wind down. Avoid flat prompts like choose your goal or select your concern unless they are hidden behind richer framing.

Show progress as meaning, not only percentage. A side map with axes such as Metabolism, Gut–brain, Energy, Skin, Digestion makes the user feel their answers are changing the diagnosis. Update the map live from weighted answers.

Result should name a **pattern**, not only a product. Examples: Metabolic microbiome pattern, Gut–brain recovery pattern, No-stimulant energy pattern, Gut–skin signal pattern, After-meal comfort pattern, Vitality & resilience pattern. Then let the product arrive as the logical conclusion: primary formula, secondary support, mechanism note, routine recommendation, email capture.

For bilingual static pages, update EN and RU quiz pages together, bump asset cache version, deploy, then verify both language flows on the live domain through a full run to result and email-save block.

Add first-batch status when launch is pending: formulas selected, science reviewed, packaging in development, launch list open, pricing announced before release. This turns incompleteness into a controlled launch narrative.

Add product comparison on Products: formula, human goal, core strain/mechanism, who it is for, CTA.

Add trust strip on Science/AkkerMagic: Akkermansia AH39, 2019 human pilot or human evidence, P9/GLP-1 mechanism, VPro encapsulation, cGMP/ISO/HACCP, dietary supplement disclaimer.

Journal should not be empty at launch. Minimum starter topics: Akkermansia, GLP-1, gut barrier, gut-brain axis, gut-skin axis, how to choose a probiotic.

## Link/legal checks

During audits, verify legal and footer links. Terms and Privacy must not point to `#`. Shipping & returns can live in FAQ for MVP, but should have a real anchor or page.

If legal pages are missing, create minimal live Terms and Privacy pages rather than leaving dead footer links. For pre-launch supplement MVPs, the minimum safe content is: educational-only disclaimer, dietary supplement disclaimer, pre-launch pricing/availability caveat, localStorage/email-interest note, and contact email. These placeholders are better than `#` links but should be reviewed before paid traffic.

Email links should be checked as the browser sees them. Cloudflare email protection may expose technical URLs to scrapers; if clean crawlability matters, use a plain `mailto:` link.

## Typography note for Aram

Microbiome Friendly should avoid thin/light typography. Bricolage Grotesque 500–800 and Hanken Grotesk 400–800 are acceptable, but for Aram’s preference raise small body, quiz options, cards and footer text toward 500 where possible. Friendly means approachable, not weak.
