# organizacia dashboard — UI kit

**Stage:** `2026-07-15-backlog-v5`  
**Live board:** https://org.dasexperten.com  
**Runtime SSOT (code):** [dasexperten/organizacia](https://github.com/dasexperten/organizacia) → `api/ui.html`  
**Design SSOT (this kit):** `deSIGNER/SYSTEM/ui_kits/organizacia/`

Frozen design record of the **DASORG agent board** at the dual-bar / competitiveness stage (after dual-session merge).

---

## Open these files

| File | Purpose |
|------|---------|
| **[index.html](./index.html)** | Offline design preview (mock cards + org pulse). Open in a browser. |
| **[board-ui.snapshot.html](./board-ui.snapshot.html)** | Full stage snapshot of live `api/ui.html` (API-bound; needs Worker to fully run). |
| **[DESIGN.md](./DESIGN.md)** | Design rules for knowledge + compete bars, rank bubble, tokens. |

---

## What this stage looks like

### 1. Knowledge bar (strict)

- **One** stacked track: **gold | green | blue**
- Gold = corporate · green = self-learned · blue = research  
- **Not generous** — most agents stay under ~**30%** overall (room still to learn)

### 2. Compete bar (relative)

- **One** multi-color stacked track: activity · completion · results · reliability · engagement · knowledge  
- Relative to company; top can show **80–90%** when peers are idle  
- Left **rank bubble**: `#2`, `#5` (not `#2/11`)

### 3. Card chrome

- Paper canvas, Schwarz–Rot–Gold ribbon  
- Avatar top-right · comic Owner-ask bubble  
- Status badges · foot = current work lines (not ask echo)  
- Drawer: drivers accordion, larger chat field  

---

## Tokens (locked for this stage)

From deSIGNER + Brighter board chrome:

| Token | Value |
|-------|--------|
| Paper | `#FBFAF6` |
| Schwarz | `#282229` / ink `#1A1519` |
| Rot | `#E5202C` |
| Gold | `#FEF004` |
| Compete blue | `#0D199E` |
| Display | Archivo |
| Meta | Archivo Narrow |
| Mono | Manrope |

Segment colors: see `DESIGN.md`.

---

## Runtime vs design

| Concern | Where |
|---------|--------|
| Live deploy / D1 / API | `organizacia` Worker + Cloudflare |
| Design freeze of this stage | **this kit** |
| Compete math | `organizacia/api/competitiveness.mjs` |
| Knowledge math | `organizacia/api/knowledge-score.mjs` |
| Session backlog | `organizacia/BACKLOGS/2026-07-15_COMPLETE-BOARD-MERGE-COMPETITIVENESS.md` |

When the board UI advances, either:

1. Refresh this kit with a new stage stamp, **or**  
2. Add `STAGE-YYYY-MM-DD/` under this folder and keep older freezes.

Do **not** edit the Worker by changing only this kit — push design decisions into `organizacia` and re-snapshot here.
