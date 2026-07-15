# organizacia dashboard — design rules (stage 2026-07-15-backlog-v5)

## Intent

Owner-facing **agent board** for the Founding Ten + Julian.  
Dense but calm paper UI. Status first, learning second, competitiveness third — without looking like a “everyone failed” KPI wall.

---

## Layout hierarchy

1. **Top chrome** — DASORG brand · Team board / KPI tabs · schedule actions  
2. **Hero** — attention / confirmations strip (schwarz)  
3. **Org pulse** — work stack + dual org bars (knowledge + compete)  
4. **Status legend** — interactive filters  
5. **Card grid** — one card per agent (org chart order, CoS first)  
6. **Drawer** — agent detail · work · knowledge · compete · chat  

---

## Dual bars (mandatory this stage)

### Bar 1 — Knowledge (strict)

```
[ gold | green | blue | .......... empty .......... ]
```

| Segment | Meaning | Generosity |
|---------|---------|------------|
| Gold | Corporate (charter, skills, co-own) | Modest |
| Green | Self-learned (chat, TG, gossip, seminars) | Near-zero until activity |
| Blue | Research (web / sources / reach) | Near-zero without research signal |

**Rule:** overall fill for most agents **under ~30%**. Empty track = still to learn. Never fill the bar to look “healthy.”

### Bar 2 — Competitiveness (relative)

```
[#2] [ act | comp | res | rel | eng | know | .... ]
```

| Segment class | Driver |
|---------------|--------|
| `.seg-act` | Activity |
| `.seg-comp` | Completion |
| `.seg-res` | Results |
| `.seg-rel` | Reliability |
| `.seg-eng` | Engagement |
| `.seg-know` | Knowledge |

**Rule:** relative to company (mean ≈ mid). Can look **generous** for leaders when the roster is quiet.  
**Rank:** small left bubble **`#n` only** — never `#n/of`.

---

## Segment colors

| Class | Gradient |
|-------|----------|
| `.seg-gold` | `#C9A227` → `#FEF004` |
| `.seg-green` | `#1B7A3D` → `#3DDC84` |
| `.seg-blue` | `#0D199E` → `#3d4fd4` |
| `.seg-act` | `#E67E22` → `#F5A623` |
| `.seg-comp` | `#0D9488` → `#2DD4BF` |
| `.seg-res` | `#1B7A3D` → `#3DDC84` |
| `.seg-rel` | `#6D28D9` → `#A78BFA` |
| `.seg-eng` | `#BE185D` → `#F472B6` |
| `.seg-know` | `#C9A227` → `#FEF004` |

Rank bubble: text `#0D199E`, fill `rgba(13,25,158,.12)`, border `rgba(13,25,158,.28)`, pill, mono 900.

---

## Typography & chrome

- **Display / body:** Archivo  
- **Meta labels:** Archivo Narrow, uppercase, tracked  
- **Numbers:** Manrope tabular  
- **Ribbon:** Schwarz | Rot | Gold equal thirds (4px)  
- **Canvas:** paper `#FBFAF6`  
- **Cards:** raised paper, hairline border, soft shadow  

---

## Do / Don’t

| Do | Don’t |
|----|--------|
| One knowledge bar, three colors stacked | Three separate knowledge meters |
| One compete bar + left `#n` | Rank as `#2/11` or bottom-corner chip overlapping text |
| Leave knowledge empty space | Inflate corporate baselines so everyone looks “done” |
| Label compete as relative / PAS | Present compete as absolute performance % |
| Paper + rot CTAs (Brighter / deSIGNER) | Generic SaaS blue dashboard chrome |

---

## Related

- Live: https://org.dasexperten.com  
- Runtime: `organizacia/api/ui.html`  
- Compete engine: `organizacia/api/competitiveness.mjs`  
- Knowledge engine: `organizacia/api/knowledge-score.mjs`  
- Backlog: `organizacia/BACKLOGS/2026-07-15_COMPLETE-BOARD-MERGE-COMPETITIVENESS.md`
