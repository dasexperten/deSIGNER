# Motionizer Skill — Physics & Identity Rule-Pack

**Version:** 1.3
**Status:** MANDATORY. Every motion-generation request routed through motionizer must inject the applicable sections of this file into the final prompt for Higgsfield (Seedance / Kling / Nano Banana).
**Scope:** Universal rules apply to ALL scenes. Product-specific rules apply only when the named product appears in the reference image or scene description.
**Ownership:** Property of `motionizer` skill. Self-contained. No cross-skill dependency.

**Changelog**
- **v1.3** — added Character ID System (§1.9, full form + abbreviated Core), accent rendering rule (§1.5).
- **v1.2** — added pixel-identity preservation (CRITICAL §1.2), anatomical canon (§1.4), FACS-based perioral & viseme dynamics (§1.5), Duchenne smile spec (§1.6), per-SKU hand grip specifications (§2.10, §3.9, §4), new Dental Floss Rule (§4).
- **v1.1** — bump.
- **v1.0** — initial universal + toothbrush + toothpaste tube rules.

---

## 1. UNIVERSAL RULES (apply to every motionizer output)

### 1.1 Camera & Framing
- Camera position and framing must remain **fixed**.
- **No** camera movement, **no** panning, **no** tilting, **no** change of viewpoint.
- The woman's face must remain **fully visible** in the frame at all times and must **never** leave or be cropped.

### 1.2 Pixel-Identity Preservation (CRITICAL — highest priority)
- The woman must remain **pixel-identical** to the original reference image.
- **Do NOT alter:** facial geometry, body proportions, cheekbone placement, nose base structure, hands, fingers, mouth shape, ear position, facial oval, skin tone.
- **Preserve EXACTLY from reference:** eye color, iris pattern, sclera tone, eyelid shape, crease structure, interpupillary distance.
- The gaze must feel **identical and recognizable** — same person, no doubt.
- **Only facial expression and outfit are free to change.** Everything else is locked to the reference frame.
- This rule **overrides** any conflicting motion or stylization request.

### 1.3 Temporal Consistency
- **Strict temporal consistency** across frames.
- **No identity drift** between any two frames.
- Any motion must remain **physically plausible** and must not alter identity, geometry, proportions, or materials.

### 1.4 Anatomical & Geometrical Canon
Strictly preserve and accurately maintain the correct anatomical, physiological, and geometrical proportions of the human body at all times.
- **Skeletal structure:** realistic bone placement, joint articulation, muscle insertion points.
- **Fat distribution:** patterns according to age/sex/body type, natural subcutaneous fat layering.
- **Spine:** natural cervical, thoracic, lumbar curvature.
- **Limb ratios:** arm span ≈ height; leg length ≈ half height + head; hand length ≈ face height; foot length ≈ forearm length.
- **Muscle:** physiologically plausible volume and definition, no exaggeration.
- **Shoulder-to-hip ratio:** realistic and sex-appropriate.
- **Head-to-body ratio:** adult ≈ 1:7.5–1:8.
- **Symmetry:** bilateral features symmetric unless intentionally asymmetric in reference.
- **Perspective:** proper foreshortening, mathematically coherent 3D geometry consistent with real human biomechanics and classical anatomical canon.

### 1.5 Lip-Sync & Perioral Dynamics
- **100% perfect lip-sync:** mouth movements must exactly match any spoken audio/text.
- When the mouth is occupied (toothbrush inside, brushing front teeth, lips parted with foam, etc.) — **no speech audio/text allowed, complete silence**.
- **No talking with full/occupied mouth.**
- **Zero** lip-sync errors or desync at any frame.

**Perioral musculature (must animate correctly):**
- Accurate function of **orbicularis oris, modiolus, zygomaticus, levator labii, depressor anguli oris, buccinator**.
- Correct lip shapes for **pull / pucker / round / purse** (FACS AUs 10–18, 20–25).
- Natural **philtrum, Cupid's bow, vermilion border, nasolabial folds** by emotion/age.

**Viseme mapping (jaw drop & mouth opening proportional):**
- **ah** — wide open
- **ee** — narrow horizontal
- **oo** — rounded forward
- **Tongue visible only on open vowels.**
- **Smooth viseme transitions**, believable co-articulation with cheeks/eyes/brows.
- Natural muscle overlap without distortion.
- Realistic symmetry/asymmetry in speech.

**Accent rendering:**
- The character's accent is specified inside the **Character ID** (see §1.9), not inside the spoken dialogue.
- Write all dialogue in **clean standard English** (or clean standard form of the chosen language).
- **Never phonetically misspell words to mimic accent** (no "wot" for "what", no "ze" for "the", no "vell" for "well"). The engine handles accent rendering from the Character ID specification.

### 1.6 Facial Physics & Smile Specification
- Facial tension **builds gradually**, lags motion 0.2–0.3 s.
- Forehead lines, eyebrow tension, cheek compression, lip tremble sync with intensity.

**Smile = always Duchenne. Core combo (mandatory):**
- **AU6** — Cheek Raiser
- **AU12** — Lip Corner Puller
- Often add **AU25** — Lips Part (open-mouth broad smile)

**Optional boosters (use when intensity demands):**
- **AU7** — Lid Tightener
- **AU10** — Upper Lip Raiser
- **AU26 / AU27** — Jaw Drop

Non-Duchenne smiles (AU12 alone, no AU6) are **forbidden** unless reference image explicitly shows a non-Duchenne expression.

### 1.7 Hand Gesture Physics (universal)
- Realistic finger curling speed.
- Joint tension/relaxation lag ~0.1–0.2 s.
- Subtle skin stretch and knuckle creasing.
- Palm/finger weight and inertia.
- **No** unnatural snapping or floating motion.
- Anatomically correct finger joint angles, opposition, friction ridge contact, natural muscle tension gradients.
- **No** unnatural finger hyperextension or strain.

### 1.8 Scope of Action
- Any action is allowed within realistic anatomical and physical limits.
- **No extraneous objects, items, products, or any elements appear in frame** unless explicitly present in reference image or clearly described in the current action.

### 1.9 Character ID System (identity lock — applies whenever a character appears)

A **Character ID** is a concise, fixed trait string that locks a character's identity across the clip. It is **declared on first appearance** and **repeated verbatim on every perceptible re-appearance** — including on-camera body, voice-over only, silhouette, hands-only, footsteps, off-screen call. It is **updated only after an on-screen change** is shown (coat torn, glasses removed, etc.); from that frame on, the new version repeats verbatim.

The Character ID **complements**, does not replace, §1.2 pixel-identity preservation. Pixel-identity locks visual likeness to the reference image; Character ID locks the **semantic trait set** the prompt asserts about that character. Both must be true.

**Two forms — pick by context:**

#### 1.9a Character ID — FULL FORM (≥ 10 traits, fixed field order)
Use when token budget allows and the brief involves dialogue, complex character work, or multi-character scenes. Fixed field order:

1. **Name**
2. **Age-band**
3. **Build / height**
4. **Hair color + style**
5. **Eye color**
6. **Ethnicity**
7. **Nation**
8. **Skin tone**
9. **Face shape + one signature feature** (all immutable)
10. **Headline outfit** (mutable only if on-screen action shows the change)
11. **Voice timbre**
12. **Accent**

**Example:**
> Donna Maria — 72 years; 158 cm slight build; warm olive skin; oval face; deep smile lines; arched brows; hazel-green eyes; silver hair in low bun; small gold hoop earrings; faded floral dress; dark shawl; worn leather shoes; very soft alto; Italian accent.

#### 1.9b Character ID — CORE / ABBREVIATED FORM (≥ 6 traits + abbreviation set)
Use when token budget is tight (shortform clips, multi-fragment scenes, dense scenarios). Required fields:

1. **Age-band**
2. **Build / height**
3. **Hair color + style**
4. **Eye color**
5. **One signature feature**
6. **Headline outfit**
7. **Voice**

**Allowed abbreviations:**

| Abbreviation | Meaning |
|---|---|
| `y` | years |
| `cm` | centimeters |
| `sm` / `med` / `lg` | build |
| `dk` / `lt` | dark / light |
| `L` / `R` | left / right |
| `L-part` / `center-part` | hair parting |
| `stubble` | facial hair |
| `VO` | voice |
| Voice descriptors | `v-soft`, `soft`, `warm`, `raspy`, `gravelly`, `bright`, `airy` |
| `ac` followed by language | accent (British, US, Indian, German, Aus, Mexican, French, Russian, Arabic, Turkish, Persian, Slavonic) |

**Example:**
> Dr. Lin Rivera — 37y; med build; chestnut ponytail; dk-brown eyes; silver frames; white lab coat; soft alto, US ac.

#### 1.9c Character ID Rules
- **No ellipses, no shortcuts, no "ID unchanged"** inside the string. Always write it out fully.
- **Choose features consistent with tone and context** (glasses, jewelry, hat style, hairstyle, clothing details).
- **No scars, tooth gaps, injuries, or other body features** unless clearly necessary for story logic.
- Narrator / voice-over character is `VO` — its own Character ID, off-screen, fixed voice traits.
- When a character speaks, **the Character ID and the quoted words appear together on the same line** — never split:
  > Dr. Lin Rivera — 37y; med build; chestnut ponytail; dk-brown eyes; silver frames; white lab coat; soft alto, US ac — says, "We whiten without scratches — enzymes, not abrasives."

---

## 2. TOOTHBRUSH RULE
**Applies whenever a toothbrush appears.**

### 2.1 Model Consistency
- One **fixed** model per sequence/scene.
- Color, bristle color, material appearance, lighting, shading, specular highlights, reflections, subsurface scattering — **100% identical and unchanging every frame**.
- **No** color shifts, **no** lighting variations, **no** flicker.

### 2.2 Geometry Consistency
- **100% identical geometry every frame:** handle, neck, head, bristles (type/diameter/pattern/layout), colors, proportions — no changes.
- **Total length: 18.5 cm** (use this exact dimension in all depictions).

### 2.3 Bristle Angulation (critical)
- Bristle tips **always face directly toward tooth surfaces at contact** — no sideways tilt, no floating, no pointing away from enamel/gingiva.
- During all strokes (buccal, lingual, occlusal): head axis **perpendicular or 45°** to gumline/tooth plane.
- Bristles compress radially inward on impact.
- Outer bristles curve inward first, inner ones follow — **visual proof of proper angulation**.
- No lazy or random angles; every frame shows bristles aimed at teeth, never at air or cheek.

### 2.4 Bristle Deformation
- Bristle deformation **only during tooth contact**: elastic nonlinear large-deflection bending + buckling + splaying (>1–2 N).
- Max curvature at base, outer bristles deform more, full elastic recovery.
- Strictly obeys deformable solid mechanics, geometry, contact mechanics — **no exceptions**.

### 2.5 Anatomy Compliance
- Cover all surfaces — **buccal, lingual, occlusal**.
- Respect enamel (hard outer), dentin (inner), gingiva (gums).
- **No gingival recession from excess force.**

### 2.6 Physics Model
- **Kinematic motion:** oscillatory, ~300 strokes/min.
- **Friction:** bristle-tooth μ ~0.1–0.3.
- **Fluid dynamics:** toothpaste foam shear-thinning.
- **Elastic deformation** per prior bristle physics.
- All actions obey biomechanics, tribology, and oral anatomy — **no improper techniques allowed**.

### 2.7 Bristle Physics Summary
- Slender cantilever beams, large geometric nonlinearity.
- Bending + buckling, splaying under load.
- Unilateral frictional contact, hyperelastic PBT/nylon.
- Governed by extended Euler-Bernoulli + Timoshenko + Hertz/friction.
- All elastic and **reversible**.

### 2.8 Brushing Motion Choreography
- During brushing: toothbrush head **stays fully or mostly inside mouth** with realistic circular/vertical scrubbing motions on teeth (cheek/tongue side hidden), bristles flex and splay naturally against surfaces.
- **Only when cleaning front teeth:** head partially exits mouth (visible 70–95%) and performs horizontal up-down strokes, then re-enters.
- Toothbrush **never fully removed** until final slow exit.
- All motions follow real human brushing kinematics: wrist/elbow micro-adjustments, gentle pressure variation, **no exaggerated or mechanical repetition**.

### 2.9 Saliva and Foam (toothbrush context)
- Minimal and barely noticeable.
- Thin transparent sheen on lips/teeth, no thick residue, no visible strings/drips/bubbles, no heavy buildup.
- Gradual faint wet gloss only from natural oral moisture during brushing.
- Disappears quickly and subtly after brush exit.
- **No prominent foam or excess saliva at any time.**

### 2.10 Hand Grip & Brushing Kinematics (toothbrush 18.5 cm)
**Grip style:** Modified power / pen grip.
- **Thumb + index** pinch handle near neck/head for precision.
- **Middle / ring / pinky** wrap lower handle for stability.
- **Light pressure** — no white knuckles.

**Brushing execution:**
- Position bristles at **45° to gumline**.
- **Short gentle circular** or **Bass-method** strokes.
- Brush systematically: outer → inner → chewing surfaces.
- Target duration: **2 minutes**.

---

## 3. TOOTHPASTE TUBE RULE
**Applies whenever a toothpaste tube appears.**

### 3.1 Model Consistency
- One **fixed** model per sequence/scene.

### 3.2 Geometry Consistency
- **100% identical geometry every frame:** tube shape (cylindrical/flexible plastic), cap (screw/flip-top, open or closed state fixed unless specified), colors, proportions — no changes.
- **Total length: 15.5 cm** (use this exact dimension in all depictions).
- Diameter range: 30–40 mm.
- Different models allowed **across** scenes; each model constant **within** itself.

### 3.3 Deformation
- Deformation **only during squeeze**: elastic nonlinear compression (plastic material, HDPE/LDPE), radial inward deflection + axial shortening.
- **Full recovery** to original shape after release (viscoelastic rebound).

### 3.4 Cap State
- Open or closed.
- If open and squeezed, paste/gel extrudes via **non-Newtonian fluid dynamics** (shear-thinning, viscosity 10³–10⁵ Pa·s, yield stress ~10–100 Pa).

### 3.5 Gel Distribution
- **Uniform ribbon extrusion** (Poiseuille flow in nozzle).
- Spreads on brush/teeth via contact mechanics + surface tension (contact angle ~30–60°).
- **No dripping unless overloaded.**
- Preserves geometric/anatomic features (even coating on enamel/gingiva).

### 3.6 Foam Transformation on Tooth Contact
- **Slow initial foaming** (same color gel-to-foam transition via aeration/saliva mixing).
- Then **rapid whitening** from mechanical brushing motions (shear-induced bubble formation, optical scattering).

### 3.7 Physics Model
- Oscillatory squeeze kinematics, frictional grip.
- **Fluid rheology:** Herschel-Bulkley model.
- Elastic recovery per hyperelastic material laws.
- Foam physics obeys multiphase flow, biomechanics, oral anatomy.
- All strictly obeys deformable solid/fluid mechanics, geometry, contact/rheology — **no exceptions or improper flows**.

### 3.8 Realistic Saliva and Foam (tube context)
- Thick foamy toothpaste residue clings to lips and bristles.
- Gradual thinning with slow drip formation.
- Viscous saliva strings stretch 1–3 cm before snapping with micro-vibration.
- Small bubbles pop visibly.
- Wet sheen on lower lip and chin builds gradually.
- **No instant clean disappearance.**
- Foam slowly reduces in volume and opacity over **2–4 seconds** after brush exit.

### 3.9 Hand Grip & Squeeze Kinematics (toothpaste tube 15.5 cm)
- **Thumb + index/middle** squeeze mid-body **near cap** for precise paste expulsion.
- **Palm cups and supports bottom** of tube.
- Fingers curl firmly around tube.
- **Gradual controlled pressure** to form neat ribbon — no collapse, no mess, no burst.
- **Slight wrist flexion** for accuracy of dispensing onto brush head.

---

## 4. DENTAL FLOSS RULE
**Applies whenever a dental floss box / floss appears.**

### 4.1 Model Consistency
- One **fixed** floss-box model per sequence/scene.
- **Box corpus length: 5.5 cm** (use this exact dimension in all depictions).

### 4.2 Floss Handling
- Cut a working length of **30–45 cm**.
- Wrap **2–4 loops** around each **middle finger**.
- Secure and tension the free ends with **thumbs + index fingers** of both hands.
- Maintain a **taut working segment of 2–3 cm** between hands.

### 4.3 Flossing Kinematics
- **Thumbs and index fingers** guide the floss.
- Slide gently between teeth using a **C-shape curve** that hugs each tooth surface.
- Move **up/down under the gumline** (no aggressive snapping into gingiva).
- **Unwind a fresh section** after each interdental space (prevents bacterial transfer).

### 4.4 Anatomy & Force
- Anatomically correct finger joint angles, opposition, friction-ridge contact.
- Natural muscle tension gradients across the working hands.
- **No** unnatural finger hyperextension or strain.

---

## 5. RULE INJECTION POLICY (motionizer runtime)

When motionizer builds the final prompt for Higgsfield, it must:

1. **Always inject Section 1 (Universal Rules) — every output, no exception.** §1.2 (pixel-identity) is the HIGHEST priority and overrides conflicting motion requests.
2. **Conditional inject Section 2 (Toothbrush Rule)** — if reference image or action description mentions any toothbrush.
3. **Conditional inject Section 3 (Toothpaste Tube Rule)** — if reference image or action description mentions any toothpaste tube.
4. **Conditional inject Section 4 (Dental Floss Rule)** — if reference image or action description mentions any floss or floss box.
5. **Stack rules** — if multiple products appear in scene, inject ALL applicable product sections in full.
6. **Pre-flight check** — before dispatch to higgsfield-generate gate, motionizer confirms which sections were injected and logs to step output.
7. **Conflict resolution priority** (top wins): §1.2 pixel-identity → §1.4 anatomical canon → §1.5 lip-sync silence on occupied mouth → product-specific physics → motion preset → user free-text intent.

---

## 6. PENDING CATEGORIES (to be added in v1.3+)

- Packaging / dieline animation rules
- Irrigator (water flosser) interaction rules
- Mouthwash / rinse interaction rules
- Tongue scraper interaction rules
- Multi-product scenes — explicit choreography for brush + tube + floss combinations beyond simple injection-stacking
- Children's products (smaller hand grip, lower dimensions, parent-assisted scenes)
- Electric toothbrush (oscillating-rotating, sonic) — different bristle physics and grip
