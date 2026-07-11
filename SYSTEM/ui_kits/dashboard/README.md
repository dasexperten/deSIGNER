# Dashboard UI Kit

Reference build for any Das Experten **operational dashboard** — the
read-and-operate surfaces (analytics, monitoring, ops consoles), as opposed
to the read-top-to-bottom marketing pages. The worked example is the **AI
Visibility Overview** (how AI assistants + Google see dasexperten.com); the
same anatomy carries any dashboard.

This kit is the *reference* — the bar every dashboard should hit. The binding
rules are in `FOUNDATION/dashboard-rules.md`.

Anatomy (top → bottom):
- Board shell (paper board on `--paper-sunk` ground, three-ribbon rule at the top edge)
- Header (eyebrow ribbon + title + subtitle, right-aligned refresh stamp + `Full report` link-out)
- Summary row — a **hero KPI** (dark schwarz card, donut + headline number + `#1` badge + competitor line) beside a strip of **stat cards** (one per AI engine: name, status dot, Fraunces number, delta, crawl stamp)
- Detail row — a **sparkline panel** (Google Search: paired stats + area spark) beside a **ranked-bars panel** (Traffic from AI: hero conversion multiple + horizontal bars)
- Grounding strip (query chips tagged cited / missing with check-cross glyphs)

Every value is token-driven (`../../colors_and_type.css`) — no hardcoded hex.
Numbers are set in Fraunces (`--font-accent`) with `tabular-nums`; labels in
Archivo Narrow uppercase; status uses `--status-success` / `--status-warning`
/ `--brand-rot`, kept separate from the brand accent. Series colors follow the
entity, in fixed order (schwarz → rot → gold), never cycled.

Open `index.html`.
