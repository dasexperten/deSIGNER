# Web implementation — live `dasexperten.com` (as-built)

> **What this is:** the **as-built** implementation layer of the design system on
> the live `dasexperten.com` site (Cloudflare Pages; source in `dasexperten.com/site/com/`),
> reverse-engineered from the real codebase. Where `SYSTEM/` says *what the brand looks like*
> and `ui-ux-rules.md` says *how we design*, this file says **how it is actually wired in
> production** — the concrete CSS files, components, and the non-obvious gotchas that bite you
> when editing the live site.
>
> **deSIGNER wins:** this is the canonical record for `.com` web implementation. The same doc
> exists as a working copy at `dasexperten.com/Design/dasexperten-com-live-implementation.md`
> and `das-architektura/Design/`; on any conflict, this file is authoritative. Captured
> 2026-07-10 during the menu → category-guides overhaul (PRs #70 / #72).

---

## 1. CSS architecture

Two stylesheets, loaded in this order on every page:

| File (served path) | Role | Bust |
|---|---|---|
| `/colors_and_type.css?v=13` | Design tokens (mirrors `SYSTEM/colors_and_type.css`), type scale, small utilities | `?v=N` |
| `/styles.css?v=30` | Layout + all components | `?v=N` |

- **Cache policy** (`site/com/_headers`): `/*.css` and `/*.js` are `Cache-Control: public, max-age=0, must-revalidate` → they revalidate every load, so an in-place edit propagates without a `?v` bump. The `?v=N` bump is still the discipline for a hard bust. `/assets/*` is 1h-cached — bump `?v=N` on re-export.
- Some page CSS is inlined in a generated `<style>` (e.g. guide `.gd` styles). For anything site-wide, edit `/styles.css` (single source, no regen).

## 2. Tokens (see SYSTEM/colors_and_type.css for the canonical set)

- Palette: `--brand-schwarz` (ink), `--brand-rot` (`#E5202C`), `--brand-gold` (`#FEF004`), `--paper` (`#FBFAF6`, never pure white).
- Fonts (vars): `--font-display` (headings, 900), `--font-body`, `--font-narrow` (uppercase eyebrows), `--font-product` (lowercase product names), `--font-mono`.
- Idioms: display headings `font:900 clamp(38px,6vw,76px)/1.0 var(--font-display)`; `<em>` in a headline → red, not italic; product names render lowercase.

## 3. Signature component — the German-flag eyebrow

```html
<div class="eyebrow">
  <span class="dx-ribbon-rule"><i></i><i></i><i></i></span>
  <span class="dx-eyebrow">SECTION LABEL</span>
</div>
```

- `.dx-ribbon-rule` = 3-column grid; the three `<i>` are schwarz / rot / gold via `:nth-child`. `.dx-eyebrow` = small uppercase red label.

**GOTCHA (verified via headless render):** `.dx-ribbon-rule` has **`width:0` by default** and only got width inside `.hero`/`.page-hero`/`.quote`. In any other `.eyebrow` it collapsed to zero width → invisible flag (color correct, box 0-wide). In some contexts it even computed `display:flex` instead of its base `display:grid`, collapsing the empty `<i>` to `width:0`. **Fix, now global in `/styles.css`:**

```css
.eyebrow{display:flex;align-items:center;gap:12px}
.eyebrow .dx-ribbon-rule{width:48px;flex:0 0 48px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:3px;height:6px;overflow:hidden;border-radius:2px}
.eyebrow .dx-ribbon-rule>i{min-width:0;height:6px}
```

Reusing the flag outside a hero → always force `display:grid` + explicit columns.

## 4. Navigation (`nav.top`)

- Sticky flex bar: `[logo] [.links flex:1] [.right icons+cta]`. Mobile breakpoint **720px** → burger (`.links.open`).
- **Logo gotcha:** `nav.top .logo img` is `height:34px;width:auto`. A crowded menu shrinks `.logo`, and the global `max-width:100%` reset then **squashes the fixed-height wordmark horizontally**. Pin it: `.logo{flex:0 0 auto}` + `img{max-width:none;flex:0 0 auto}`.
- **Menu labels ≤ 2 lines (hard rule):** keep every nav item to max two lines. 3-word labels ("Build your system", "Become a Partner", localized equivalents) wrapped to 3 lines in the denser category nav — fixed by joining words with a non-breaking space (`&nbsp;` / U+00A0) leaving exactly one wrap point. Labels are localized from a single source so main-nav and sub-page-nav match byte-for-byte per locale.

## 5. Page hero & alignment

- `.page-hero` — interior-page hero: `max-width:1280px`, big `h1` (`clamp(38px,6vw,76px)`), eyebrow, `.lead`.
- **Left-align rule (owner, explicit):** the site sticks to the left. Do **not** center heroes — centered variants (inline `text-align:center` + `margin:auto`) are treated as a bug and removed. Consistency > per-page flourish.

## 6. Guide / category pages (`/best/*`)

"Best X" buying guides + the four category landing pages (Enzymes / Probiotics / Naturals / Superbrushes), GEO / AI-answer-engine oriented.

- Container `.gd` (max-width 860 reading column); `.gd-lead`, `.gd-intro`, `.gd-pick`, `.gd-faq`, `.gd-idx`. **`.gd h1` must inherit the `.page-hero` display type** (it was unstyled and fell back to the small base `h1`).
- Each guide emits `FAQPage` + `ItemList` + `BreadcrumbList` JSON-LD.
- **Per-category edge textures:** subtle semi-transparent SVG motifs pinned to the left/right viewport edges (`body::before/::after`, `opacity:.09`, mobile `.06`), same background colour, never centered — enzymes = hexagons, probiotics = bacilli, naturals = leaves. Superbrushes uses a lifestyle hero image + the brush-tech modal (§7) instead.

## 7. Reusable modal — brush technologies (`brush-tech.js`)

- `brush-tech.js` is a self-contained "THE BRUSHES · TECHNOLOGIES" modal (6 filament-tech fact sheets: charcoal PBT, gold-ion Au⁺, 360° spiral, NanoFlex™, DuPont Tynex®, Flexi-Nacken) with an animated bristle graphic. It self-injects and opens on click of **any `<a class="js-brush">`** (or a footer "Brushes" link). Internally localized (I18N by locale/path).
- To surface it on a page: load `/brush-tech.js?v=8` + add a `.js-brush` trigger. Used on the homepage brushes section and on `/best/superbrushes` (localized CTA button).

## 8. Internationalization (14 locales)

- **en (root) + de, ru, vn, ar, es, fr, ms, pl, th, tl, tr, uk, zh.**
- hreflang differs from the path segment in places: `vn → vi`; `tl → tl` (but `fil` for `Intl.NumberFormat`). **`ar` is RTL** (`[dir="rtl"]` flips eyebrow/kicker alignment).
- **Anti-simplicity (estate hard rule):** keep dense scientific terms/numbers verbatim across all translations — `Bacillus coagulans 4·10¹⁰ CFU`, `ICAM-2`, `IL-6`, `RDA 79`, `DuPont Tynex®`, `CPP-ACP (Recaldent™)`, `GH12`, `39 °C`, percentages, CFU counts. A gloss may *add*, never *replace*.

## 9. Zonal pricing / geo — the part that will trip you up

Prices are **display-only**, set by the visitor's **IP zone** (currency via `CF-IPCountry`); real charge is repriced server-side at checkout. Language switch never changes price.

- Client layer `window.DX_PRICING` (`assets/pricing.js`): fetches `/geo-price` once, then rewrites `.buy-btn[data-sku]`, `.pdp-buy[data-sku]`, `.pdp-price`, and `.dx-price[data-sku]` (guide price chips, added 2026-07-10).
- **`data-sku` MUST be the article code (e.g. `DE120`), NOT the slug.** `/geo-price` keys by article. In `product-data.js`, `p.sku` = article, `p.slug` = URL name. Wrong key → silent fallback to the base number.
- **CRITICAL:** `/pricing.js` **and** `/assets/pricing.js` are served by the **`dasexperten-inject` Worker** from an embedded base64 copy (`workers/dasexperten-inject/src/pricing.embedded.js`) — editing the static file alone changes nothing live. To ship a pricing.js change: `base64 -w0 site/com/assets/pricing.js` → replace `PRICING_JS_B64`; bump `PRICING_ASSET_VER` in the worker's `index.js`; `wrangler deploy` the worker.

## 10. Infra & deploy (as-built)

- **Pages project `dasexperten-com`** (its `.pages.dev` subdomain is `dasexperten-com-staging.pages.dev` — a subdomain, not a separate project). Serves live apex + `www`.
- **Direct-upload:** a `git push` does NOT auto-deploy. `wrangler pages deploy site/com --project-name=dasexperten-com --branch=main`.
- **`.github/workflows/deploy.yml`** is a manual (`workflow_dispatch`) Action that deploys `site/com` from **whatever ref it runs on — default `main`**. If it runs on `main` while your change is only on a branch, it **reverts the live site**. → land web changes in `main` (merge the PR), not just direct-deploy.
- **Worker `dasexperten-inject`** injects the pricing layer on `dasexperten.com/*` + `www` routes, byte-for-byte over the proxied Pages HTML.
- Guides are generated: `tools/build-usecases.mjs` (EN) + `tools/build-guides-locale.mjs` (13 locales, clones each locale's real chrome, idempotent). `product-data.js` = `window.DX_PRODUCTS` (`slug`, `name`, `sku` article, `price`, `img`, `cat`, …).
- **Never call the Cloudflare API for `dasexperten.ru`** — it's Reg.ru / Yandex KIT.

## 11. Product → category-menu taxonomy (as shipped)

| Category | Products (slugs) |
|---|---|
| **Probiotics** | `symbios` (adult), `buddy` (0+), `evolution` (3–14) |
| **Enzymes** | `termo`, `innoweiss` (INNOWEISS mouthwash `DE310` has no PDP yet — omitted) |
| **Naturals** | `detox`, `cococannabis`, `ginger`, `schwarz` |
| **Superbrushes** | `schwarz-brush`, `nano`, `grosse`, `zero`, `aktiv`, `intensiv` (+ `etalon`, `mittel`, `kraft`, `sensitiv`, `3d`) |

## 12. Debug technique

Local render without the agent proxy: `python3 -m http.server --directory site/com` + headless Chromium (`/opt/pw-browsers/chromium-*/chrome-linux/chrome --headless=new --screenshot`). Inject a `<script>` that writes `getComputedStyle(...)` into `document.title`, then `--dump-dom`, to reveal collapsed boxes (how the flag `display:flex`/`width:0` bug was pinned).

---

### One-line reminders
- Flag not showing → force `.dx-ribbon-rule` `display:grid` + explicit columns.
- Price stuck in USD/EUR → `data-sku` must be the article code, and pricing.js is **worker-embedded** (rebuild + bump + `wrangler deploy`).
- Logo squished → `flex:0 0 auto` + `max-width:none` on the nav logo.
- Menu item on 3 lines → NBSP-join to one wrap point (max 2 lines).
- Heading too small → it's missing the `.page-hero`/display type; site is left-aligned everywhere.
- Live site reverted → a `main` deploy (deploy.yml Action) overwrote a branch-only change; merge to `main`.
