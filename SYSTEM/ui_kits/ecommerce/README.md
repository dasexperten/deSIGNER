# E-commerce UI Kit

Product detail (PDP) + slide-out cart drawer + checkout window.

- Gallery (thumbs + main)
- Product info (options, subscription, qty, claims, ingredients accordion)
- How-it-works (3 steps)
- Reviews (3 columns)
- Cart drawer (slide-in from right, overlay, cart item rows, totals, checkout CTA)
- **Checkout window** (one page, payment-first, interactive card + ETA clock)
- RU variant annotation (marketplace fallback strip below the reviews)

Click **Warenkorb · 2** or **In den Warenkorb** to open the cart, then **Zur Kasse →**
to open the checkout window.

## Checkout window — one page, payment first (Owner direction 2026-07-16)

Everything on a single page so the window immediately reads as "this is where you pay".
No steps, no rail. Two-panel shell kept: form `1.55fr` + persistent order summary `1fr`
on `--paper-sunk`; below 700px a single-column bottom sheet, summary under the form.

1. **Zahlung (top):** four method tiles — Apple Pay · Google Pay · PayPal · Kreditkarte
   (radio behavior, rot ring on selection, Kreditkarte pre-selected).
2. **The card:** choosing Kreditkarte shows a rendered credit card. Name, number and
   expiry are typed **directly on the card** (embossed transparent inputs, gold chip
   from `--brand-gold`). Live BIN detection while typing the number: leading `4` →
   **VISA** wordmark fades in top-right; `51–55` / `2221–2720` → **MasterCard** circles.
   CVC is a small separate field beside the card ("Rückseite der Karte").
3. **Lieferung (same page):** Email, then Adresse with a **classifier autocomplete** —
   typing ≥3 characters opens structured suggestions (canned list: Torstraße 140/14
   Berlin, Torfstraße 3 Berlin, Tornquiststraße 21 Hamburg, Torgauer Straße 12 München);
   selecting fills PLZ/Stadt and reveals the delivery widget. In production the
   suggestions come from the address classifier (Address Element / Places).
4. **Delivery ETA clock widget:** an analog clock whose hands animate (360ms
   `--ease-standard`) to the delivery ETA of the selected rate, plus a Fraunces date
   chip („Mi · 22. Juli · bis 18:00"). Selecting another rate re-animates the clock and
   updates Versand/Gesamt in the summary and the single **Bezahlen € X** CTA.

### Decisions & substitutions

- Summary panel uses token `--paper-sunk` (#F3F0E8) instead of the earlier spec's
  ad-hoc #F3F1EA — tokens-only rule wins.
- Strings that exist in live `cart.js` `STR.de` are reused verbatim (Kasse, Bezahlen,
  Zwischensumme, Versand, Gesamt, the Stripe security note). **Placeholder copy**
  (flagged for Roberta): section eyebrows, field labels, captions, suggestion
  placeholder text, ETA chip wording, RU strip text.
- **Scheme/provider marks are placeholders**: VISA italic letterform, MasterCard
  two-circle geometry, G/PayPal letterforms — swap official logo assets before any
  production use. Marketplace dots (Wildberries/Ozon) likewise.
- Prices, rates and delivery times are illustrative mockup values; live checkout
  computes them per address and currency zone (NextSmartShip + zonal pricing).
- The express social-login row was **removed from the mockup** by Owner decision
  2026-07-16 (it remains a live-site feature; see the /ru/ annotation strip).
