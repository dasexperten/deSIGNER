# Das Operator — mobile UI chrome (canonical)

**Status:** Approved by owner 2026-07-13  
**SSOT copies:** this file + `SYSTEM/mobile-ui.md` + `SYSTEM/das-dashboard.md`  
**Live code:** `dasoperator` repo (`web/app/globals.css`, `web/components/layout/mobile-shell.tsx`)  
**Breakpoint:** `max-width: 767px` only — desktop unchanged.

## Intent

Every phone screen in **Das Operator ERP** uses the **das-dashboard / AI Crawlers** visual language:

- warm apothecary paper (`--paper` / `--paper-sunk` / `--paper-raised`);
- 4px hard-stop tricolor ribbon Schwarz → Rot → Gold;
- raised metric tiles with hairline + `--shadow-card`;
- one dark hero tile max per dashboard section.

Do **not** invent a second mobile language for the ERP.

## Shell anatomy

1. Header — `paper-raised`, brand mark + hamburger + clock  
2. Tricolor under header (`.dx-mobile-tricolor`)  
3. Main canvas — `--paper-sunk`  
4. Cards — paper-raised + hairline + shadow-card + radius-md  
5. Bottom nav — brand-schwarz, active rot, tricolor top edge  
6. List tables → stacked cards (same tile chrome)  

## Eyebrows

| Context | Mobile |
|---|---|
| Section titles inside panels | Show |
| Page-level eyebrow above `<h1>` | Hide |
| `h1 + p` list subtitles | Hide |

## App icon

- Three heritage waves on `#282229` with top tricolor strip  
- No wordmark on home-screen glyph  
- Masters: `SYSTEM/assets/app-icon-1024.png`, `ASSETS/logos/app-icon-*.png`  
- Theme color: `#282229`  

## Rules

1. Prefer global CSS / shell changes over per-page mobile hacks.  
2. Tokens only — never hard-code brand colours.  
3. One dark hero per dashboard section.  
4. Emailer keeps its own full-bleed chrome.  
5. On conflict with working copies in dasoperator / das-architektura, **deSIGNER wins** after merge.  

## Related foundation

- `FOUNDATION/mobile-first.md` — storefront/web touch rules (≤720 / ≤480)  
- `SYSTEM/das-dashboard.md` — command-center pattern  
- `SYSTEM/mobile-ui.md` — implementation map for Operator  
