# 3D Visual Block — Das Experten Packaging
## Prompt templates for assembled box renders + hero visuals

---

## 3D BOX RENDER — UNIVERSAL BASE PROMPT

```
Create an ultra-photorealistic 3D render of an assembled toothpaste carton box.
Product: das experten [SKU NAME]
Box dimensions: 170mm long × 40mm wide × 30mm deep (assembled).
Orientation: slight 3/4 angle — front panel and left side panel both visible.
Front panel faces viewer at approximately 30° angle.
Surface: matte finish. Slight edge shadow. No gloss unless noted per SKU.
Background: clean white studio OR product-themed (see per-SKU below).
Lighting: soft studio 3-point. Main light upper-left. Subtle shadow beneath box.
Style: premium pharmaceutical product photography. Sharp edges. No cartoon. No blur.
Resolution: 4K equivalent. Square 1:1 format.
```

---

## PER-SKU 3D RENDER SPECIFICATIONS

### SCHWARZ (DE201)
```
Front panel: deep black matte. "schwarz" in large white bold. 
             Coconut shell charcoal chunks image top-right (macro, jagged, dramatic).
             White typography on black throughout.
Side panel visible: dark charcoal grey. das experten logo vertical white.
Background option A: clean white studio — maximum contrast.
Background option B: dark smoke/charcoal atmospheric — dramatic mood.
Special finish: matte black — no reflections on main panels.
```

### SYMBIOS (DE206)
```
Front panel: white/off-white. "symbios" in large green bold.
             Green probiotic bacteria illustration top-right (organic flowing shapes).
             Green and white color palette.
Side panel visible: light green. das experten logo vertical dark green.
Background option A: clean white studio.
Background option B: soft green bokeh — microbiome/nature mood.
Special finish: soft matte white.
```

### INNOWEISS (DE210)
```
Front panel: white/silver. "innoWeiss" in large blue bold. "mit Enzymen" subtitle.
             Blue oxygen bubble visual top-right (translucent spheres, clean).
             Blue and white palette.
Side panel visible: light silver-blue. das experten logo vertical blue.
Background option A: clean white studio.
Background option B: soft blue gradient — clinical/science mood.
Special finish: semi-gloss white — clinical feel.
```

### DETOX (DE202)
```
Front panel: deep burgundy/purple. "detox" in large white bold.
             Cinnamon sticks + clove buds image top-right (warm earthy spices, macro).
             White typography on dark purple.
Side panel visible: rich purple. das experten logo vertical white.
Background option A: clean white studio.
Background option B: warm wooden surface — botanical/natural mood.
Special finish: matte deep purple.
RULE: NEVER use word "detox" in any prompt text beyond the product name itself.
```

### GINGER FORCE (DE203)
```
Front panel: bright yellow. "ginger force" in large brown/dark bold.
             Fresh ginger root image top-right (earthy, natural, macro texture).
             Yellow and brown palette.
Side panel visible: golden yellow. das experten logo vertical dark brown.
Background option A: clean white studio.
Background option B: warm earthy tones — natural/botanical mood.
Special finish: matte yellow — vibrant.
```

### THERMO 39° (DE209)
```
Front panel: white/orange-red gradient. "thermo 39°" in large orange bold.
             Thermometer + warm visual top-right.
             Orange, white, red palette.
Side panel visible: warm orange. das experten logo vertical white.
Background option A: clean white studio.
Background option B: warm gradient orange-red — energy/heat mood.
Special finish: matte white with orange accent zones.
```

---

## HERO VISUAL TEMPLATES — BY MOOD

### Clinical / Clean
```
Minimalist flat lay. Box centered on white marble surface. 
Single ingredient element beside box (charcoal chunk / ginger root / bacteria illustration).
Soft shadows. Neutral background. Laboratory aesthetic.
No props except ingredient. Maximum negative space.
```

### Dramatic / Dark
```
Box on dark textured surface (slate / black wood / charcoal stone).
Moody atmospheric lighting — single strong side light, deep shadows.
Ingredient scattered artfully around box.
Color-grade: high contrast, cinematic.
```

### Natural / Botanical
```
Box surrounded by fresh botanical elements — herbs, roots, leaves relevant to SKU.
Natural wood or linen surface. Warm daylight. Shallow depth of field.
Lifestyle-adjacent but product-focused. No people.
```

### Lifestyle
```
Box on bathroom shelf or vanity surface. 
Clean minimalist bathroom background — white tiles, soft light.
Tube and box together if requested. Morning light aesthetic.
Premium home feel — not clinical, not dramatic.
```

---

## BANNERIZER GATE CALL FORMAT

When calling bannerizer from designer skill:

```
[[GATE: bannerizer]]
Task: 3D box render / hero visual
SKU: [DE###] — [PRODUCT NAME]
Color scheme: [from table above]
Mood: [clean / dramatic / natural / lifestyle]
Background: [option A or B]
Format: 1:1 square, 4K
Special rules: [e.g. SCHWARZ — no word "detox"]
```
