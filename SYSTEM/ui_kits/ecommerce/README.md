# E-commerce UI Kit

Product detail (PDP) + slide-out cart drawer + checkout window.

- Gallery (thumbs + main)
- Product info (options, subscription, qty, claims, ingredients accordion)
- How-it-works (3 steps)
- Reviews (3 columns)
- Cart drawer (slide-in from right, overlay, cart item rows, totals, checkout CTA)
- **Checkout window** (two-panel modal, 3 interactive steps, express social row)
- RU variant annotation (marketplace fallback strip below the reviews)

Click **Warenkorb · 2** or **In den Warenkorb** to open the cart, then **Zur Kasse →**
to open the checkout window.

## Checkout window

Design mockup of the live 3-step checkout (`dasexperten.com/site/com/assets/cart.js`),
restated on the design tokens. Spec: `dasexperten.com/BACKLOGS/Чекаут Одним Кликом.md` §4
(Aram's rules: two-panel ≥700px, express row of identical 44×44 squares, guest checkout,
one accent per view).

- **Layout:** form `1.55fr` + persistent order summary `1fr` on `--paper-sunk`; below
  700px a single-column bottom sheet, summary under the form.
- **Step 1 — Kontakt:** express social row (Google · Facebook · VK · Yandex · Mail.ru · OK,
  international order; `/ru/` shows only VK · Yandex · Mail.ru · OK — see the RU strip),
  "oder manuell" divider, email + address fields. In production these fields are Stripe
  Link Authentication + Address Element.
- **Step 2 — Versandart:** selectable rate rows (selection updates Versand/Gesamt in the
  summary and the pay CTA). In production rates come live from NextSmartShip.
- **Step 3 — Zahlung:** wallet chips (Apple Pay / Google Pay / Link) + card fields.
  In production this is the Stripe Payment Element.

### Decisions & substitutions

- Summary panel uses token `--paper-sunk` (#F3F0E8) instead of the spec's ad-hoc #F3F1EA —
  tokens-only rule wins.
- All customer-facing strings that exist in live `cart.js` `STR.de` are reused verbatim
  (Kasse, Weiter zum Versand →, Versandart, Bezahlen, ← Zurück, Zwischensumme, Versand,
  Gesamt, the Stripe security note). **Placeholder copy** (flagged for Roberta): step-rail
  label "Kontakt", express-row labels ("Express — Daten mit einem Klick", "oder manuell",
  "oder mit Karte"), field labels, the design-annotation captions, and the RU strip text.
- **Provider marks are placeholder letterforms** (brand-colored SVG text), not official
  logos — swap in official logo assets before any production use. Marketplace dots
  (Wildberries/Ozon) likewise placeholders.
- Prices/rates are illustrative mockup values (subtotal € 18,80 + three sample rates);
  live checkout computes them per address and currency zone.
