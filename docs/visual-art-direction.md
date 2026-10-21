# Visual art direction — My Little Universe

The rulebook for producing the room's final artwork. Every generated or
painted asset must follow it, so that thirty separately made images read
as **one painted place**.

- Target mood and composition: `docs/design-reference.png`
- Per-asset specs and status: `docs/asset-inventory.md`
- Copy-paste generation prompts: `docs/art-generation-prompts.md`
- Token-level palette and materials: `docs/art-direction.md`
- How the room code is built: `docs/project-map.md`

> Revision 2026-10-14 (Prompt 02 visual audit). This replaces the earlier
> draft written for an "Antigravity `generate_image`" tool. That draft
> listed SVG viewBox units (e.g. "150×320") as generation sizes, which is
> far too small. It also assumed generators output real transparency
> (they don't), and it described the key light as both "from the right"
> and "at 50% x". Those points are corrected below.

---

## 1. The vision in one paragraph

Stepping into an old-world artist's private study at dusk, brought slightly
to life. A deep wooden desk runs across the foreground, and a tall arched
window opens onto a dark-blue sky. An overflowing bookshelf leans in from the
left with a cat asleep on top among trailing plants. Paintings, pinned
photographs and a framed poster crowd the walls, and a stained-glass lamp
pours amber light across a rotary phone, a journal, a cup of coffee and a
laptop. It is painted, not rendered: visible brushwork, aged wood, worn
paper, soft fabric, and warm light falling off into deep green-brown
shadow. It is whimsical but grown-up, a quiet dark-academia mood rather
than a children's book.

**Is it right?** Every object looks like it was painted by the same
hand, under the same lamp, in the same room, and nothing looks like a UI
icon, a stock illustration or a 3D render.

---

## 2. What's wrong today (the visual audit)

Inspected live at 1440×900, 820×1180 and 375×812 against the reference.

### Scene-level problems (bigger than any single asset)

1. **No physical room.** The walls are a flat CSS wood texture, and the
   "desk" is just a lighter band with no front edge, thickness or
   perspective. The window is a CSS gradient arch with no frame, sill or
   view. Objects float on wallpaper instead of standing on surfaces.
2. **No ground contact.** Nothing casts a shadow onto anything. The
   bookshelf hangs mid-wall, the easel stands in the middle of the desk
   band, and the lamp hovers. On mobile, every object floats alone on bare
   wall.
3. **Scale is arbitrary.** At 1440px the laptop is 130px wide: narrower
   than the movie poster and as wide as the sleeping cat. The phone (75px)
   is smaller than the coffee cup (86px). The reference gives the laptop
   about 15% of frame width; ours gets 9%.
4. **The frame is sparse.** In the reference, objects fill and overlap the
   frame; ours leave a large empty band across the middle and bottom.
   This is a layout issue as much as an art issue (see §9).
5. **Mixed vocabularies.** Flat vector shapes sit beside a photographic
   gradient wallpaper (the laptop panel) and CSS-gradient sky, with no
   unifying texture or light.

### Asset-level problems

All 28 scene SVGs are flat-vector placeholders: solid fills, at most a
two-stop gradient, no light direction and no material. The worst offenders,
in order of how much they hurt the scene:

| Asset | Problem |
|---|---|
| Bookshelf (frame + books) | Largest object on screen. A single book-row SVG is reused 3× with a `hue-rotate` filter, so the rows are visibly identical. The books are flat colored bars. |
| Window (CSS) | The focal point of the reference, rendered as a plain gradient arch with no frame, glazing bars, sill, city or depth. |
| Desk / room surfaces (CSS) | There is no desk, so nothing grounds the objects. |
| Lamp | Meant to be the scene's key light (a Tiffany shade); it's a small peach blob. |
| Easel canvas | The "painting inside the painting", currently a flat triangle landscape. It's the clearest test of painterly quality. |
| Laptop | Center of the desk and the main click target; it's a flat grey wedge, too small. |
| Rotary phone | It's a dark circle with dots. It needs brass, a dial and a curly cord. |
| Cat, plushie | Cartoon blobs with dot faces. Childish, against the brief. |
| Memory wall, movie poster, art wall | Generic "mountain + sun" icon art. The memory wall repeats one photo-frame SVG 4×. |
| Curtains | Flat maroon strips with no drape. |
| Laptop panel wallpaper (`laptop-wallpaper.jpg`) | A generic gradient-blob image, the "generic AI website artwork" look we're avoiding. Panel only, so lower priority. |

Full per-file table: `docs/asset-inventory.md`.

---

## 3. Camera and perspective

All art must share one camera. Without that, objects look pasted in.

- **View:** straight-on and frontal. The viewer sits at the desk, eye
  level about 25 cm above the desktop, looking slightly down at the desk
  (about 15°) and straight ahead at the wall.
- **Desk objects** (laptop, coffee, journal, phone, lamp base, plushie):
  seen from about 15° above. Their tops are slightly visible: a coffee
  rim is a shallow ellipse, not a circle, and the open journal's pages
  foreshorten slightly. **Never a top-down or isometric view.**
- **Wall objects** (paintings, photos, poster, window, bookshelf face):
  dead frontal, with no keystone or side angle. Frames are rectangles.
- **Single vanishing point** at the window's center. Anything that shows a
  side face shows the face toward the center: objects left of center
  show a sliver of their right side, and objects right of center show
  their left side. Keep this subtle, because most assets are reused at
  different positions.
- **Lens:** natural, about a 50 mm equivalent. No wide-angle distortion,
  no tilt-shift, no fisheye.

---

## 4. Scale

Objects must be sized in proportion to each other, as in a real room.
Use the **laptop's width as 1.0** and keep these ratios in the art and,
later, in the layout slots:

| Object | Real size (approx.) | Width relative to laptop |
|---|---|---|
| Laptop, open | 32 cm wide | **1.0** |
| Journal, open with pen | 30 cm | 0.95 |
| Rotary phone | 22 cm | 0.7 |
| Coffee cup with saucer | 14 cm | 0.45 |
| Stained-glass lamp | 40 cm shade, 55 cm tall | 1.25 wide × 1.7 tall |
| Plushie | 25 cm | 0.75 |
| Tabletop easel with canvas | 35 cm wide, 60 cm tall | 1.1 × 1.9 |
| Bookshelf (set back from the desk) | 90 × 180 cm | about 2.0 × 4.0 after depth reduction |
| Sleeping cat (on the shelf, farther back) | 45 cm | about 1.1 |
| Framed movie poster (wall) | 40 × 60 cm | about 0.9 × 1.35 |
| Window (wall) | 110 × 150 cm | about 2.8 × 3.6 |

Today's layout breaks these ratios (laptop too small, phone smaller than
cup, plushie as big as the phone). The art must be painted to these
ratios. Resizing the slots to match is an integration-task change (§9).

---

## 5. Lighting

One lighting setup, baked identically into every asset:

1. **Key light: the stained-glass lamp, upper right**, warm amber about
   2700 K (`#ffb870`). Every object is lit from its **upper right**. The
   right-facing planes are warm and bright, and the left side falls into
   warm-brown shadow. Brass, glass and glaze pick up small amber
   specular highlights on the right.
2. **Fill: the window, back center**, cool moonlight (`#7c8fc9`) at low
   intensity. It gives a faint cool **rim on top and back edges** only and
   never fights the key.
3. **Local: the laptop screen**, a soft cool-white glow on the desk in
   front of the laptop. Only the laptop and desk plate carry it.
4. **Bounce:** warm and low from the desk surface onto object undersides.

Rules:

- **Paint objects at "evening interior" exposure**, the mid-point of the
  room's day cycle. Day/night shifts are done in CSS: the sky stays CSS,
  and a scene-wide tint and the `--room-glow` overlay already crossfade by
  time of day. Don't paint night-only features (moon reflections, deep
  blackness) into objects.
- **No cast shadows onto the ground in object images.** Objects carry
  only their own form shadows. The contact shadow under each object
  comes from the desk plate or CSS (`drop-shadow`), so the object still
  sits correctly wherever its slot puts it.
- **Light-emitting effects are separate layers painted on pure black:**
  the lamp-shade glow, coffee steam, fairy-light bloom, moon halo. They
  are composited with `mix-blend-mode: screen`, so black disappears and
  only light remains. This needs no alpha channel and is how the lamp can
  dim and brighten with time of day.
- Shadows are soft with a long falloff, like a practical lamp. There are
  no hard sticker drop-shadows and no rim-light halos.

---

## 6. Color

Warm amber light against deep forest greens, muted blues, parchment and
antique gold. The room is about 70% warm darks, 20% warm lights and 10%
cool accents.

| Role | Hex | Token | Where |
|---|---|---|---|
| Deepest shadow / wall | `#2a2018` | `--room-wall-dark` | corners, deep shelf, under-desk |
| Wall mid-tone | `#3c2c1e` | `--room-wall-warm` | plaster/paneling |
| Dark wood | `#2f2015` | `--color-wood-dark` | shelf carcass, desk edge shadow |
| Wood | `#4a3423` | `--color-wood` | desk top, easel, frames |
| Forest green | `#214b3e` | `--color-accent` | foliage, book cloth, journal leather |
| Deep forest (art only) | `#16302a` | — | plant shadows, green spines in shade |
| Antique gold (art only) | `#b08d57` | — | frame gilding, brass, book-spine lettering blocks |
| Lamp amber | `#ffb870` | `--room-lamp-glow` | key light, highlights, glow |
| Parchment | `#ede3cd` | `--color-paper` | pages, photo borders |
| Cream (max highlight) | `#f6ecd9` | `--color-cream` | brightest non-specular value |
| Moonlight blue | `#7c8fc9` | `--room-moonlight` | cool rims, window glass |
| Night-sky blue (art only) | `#1c2650` | `--sky-night-bottom` | laptop screen idle, poster skies |
| Ink | `#33291d` | `--color-paper-ink` | line accents, deepest paper shadow |

Rules: **no pure white, no pure black in objects** (except black
backgrounds for screen-blend layers). There are no saturated primaries
and no neon. Blue appears only as moonlight or night sky. Reds are
oxblood or rust (`#6e2a22`), never bright red.

---

## 7. Texture and rendering

- **Painterly, not photographic.** Visible brushwork and soft edges where
  form turns away from the light, with crisp edges only where light hits
  hard (brass rims, page edges). Think gouache or oil on board, the way a
  Studio Ghibli background, Spiritfarer or Kiki's bakery interior is
  painted.
- **Materials must read** (detail in `docs/art-direction.md`):
  - wood: grain plus worn, lighter edges
  - paper: uneven tone and deckled edges
  - brass: warm specular light and patina in crevices
  - stained glass: individual leaded panes that transmit light
  - fabric: folds and soft shadow between them
  - ceramic: soft round highlight
  - leather: worn sheen
  - fur: directional strokes
- **Subtle imperfection:** book spines differ in height, lean and wear,
  nothing is perfectly symmetrical, and lines have a slight hand wobble.
- **Readable at small size.** Most objects display at 75–240 px, so each
  needs a clear silhouette and value structure first and detail second.
  Squint test: the object must still read when blurred.
- **No text anywhere in the art.** Generators garble text. Book spines get
  abstract gilt bands, the poster gets imagery only, and the laptop screen
  is left blank (the HTML overlay draws it).

### Never

Flat vector or clip art; outlines of even weight; cartoon faces with dot
eyes; chibi proportions; glossy 3D/CGI renders; plastic sheen; neon,
cyberpunk or sci-fi elements; lens flares; heavy gradients; glassmorphism;
stock-photo realism; watermarks, signatures or artist logos;
checkerboard "transparency"; random decorative clutter that isn't on the
asset list.

---

## 8. What is background vs. what is an independent layer

The rule: **anything that animates, reacts to hover or click, changes with
time of day, or needs to move between desktop and mobile layouts is its
own image. Everything static and structural is painted into background
plates.**

### Background plates (painted, not interactive)

| Plate | Contents | Notes |
|---|---|---|
| `room-wall` | Back wall: aged plaster with dark wood wainscot, ceiling beam shadow, a few nails and paper scraps, faint ivy creeping from the window | Wide with extra bleed (§9). No window glass, no furniture. |
| `window-frame` | Arched wooden window frame, glazing bars, deep sill | **Separate layer, glass fully knocked out**, so the existing CSS sky, moon, stars, birds and clouds keep animating behind it. |
| `desk-surface` | Long worn wooden desktop seen from 15° above, with front edge thickness, scratches, a ring stain, and the soft dark under-desk below | Empty: no objects. Objects sit on it via their slots. |

Small static details (a pinned note, ivy sprigs, a hanging star ornament)
belong in the wall plate, not as extra layers.

### Independent layers (one image per row; several where noted)

**Interactive objects** (hover and click; must stay separate):
- bookshelf: frame + 3 distinct book rows
- easel: frame, canvas, brush jar, palette
- laptop: body; the screen stays HTML/CSS
- coffee: cup, plus a steam fx layer
- journal: pages, pen
- phone: base, handset, cord
- memory wall
- movie poster
- plushie

**Ambient animated pieces** (idle motion, time-of-day, or mobile reuse):
- cat: sleeping and awake states
- plants
- curtains: one panel, mirrored
- lamp: body, plus a glow fx layer
- art wall
- fairy-light string, plus a twinkle fx layer
- clouds: low priority, since weather never triggers yet

**Effect layers** (painted on black, composited with `screen`, no alpha):
- `lamp-glow`
- `coffee-steam`
- `fairy-glow`
- `moon-halo` (optional)

### Transparency and alternate states

- **Need real alpha:** every independent object layer, plus
  `window-frame` (the glass hole must be clean).
- **No alpha needed:** the `room-wall` and `desk-surface` plates (opaque)
  and every fx layer (black background, screen blend).
- **Alternate states:**
  - cat: sleeping (default) and awake/stretching (swapped on its
    occasional "stir")
  - lamp: the body is painted unlit or dim; brightness comes from the
    `lamp-glow` layer, whose opacity is driven by `--lamp-intensity-*`
  - phone handset: one image; the lift is a CSS transform
  - bookshelf book rows: one image per row; the tilt is CSS
- **Multi-layer objects must be pixel-aligned.** Every layer of one object
  shares the same canvas size and framing. See §10 for how to produce
  them.

---

## 9. Fitting new art into the existing layout without breaking interactions

### What stays exactly as it is

`InteractiveObject` (button, hover, focus, keyboard, labels, sounds),
`sceneObjects.ts`, panels, `sceneStore`, idle and hover CSS
(`data-idle`, `data-hover`, `.phone-handset-layer`,
`.bookshelf-books-layer`, `.journal-pen-layer`, `.easel-canvas-layer`,
`.coffee-steam`), parallax and time-of-day. **New art changes `src` paths
and layer geometry, never behavior.**

### Per-object swap (safe, incremental)

1. Export the final image to `public/assets/scene/<category>/<name>.webp`
   (keep the old `.svg` beside it until verified, per `CLAUDE.md` §4).
2. Change the `src` in the object component.
3. If the aspect ratio changed, update `LayeredArt`'s `aspect` and each
   layer's `box` percentages to the new art. Measure them from the
   exported image; don't guess.
4. Object-specific geometry to re-measure:
   - the laptop's `SCREEN_BOX` (the HTML screen overlay must sit exactly
     in the painted bezel)
   - the bookshelf row boxes; also remove the `hue-rotate` filters, since
     the rows are distinct art now
   - the journal pen box
   - the easel canvas, brush and palette boxes
5. Check in the browser at 1440, 820 and 375 wide:
   - hover reaction and label position
   - click opens the right panel
   - idle animation pivots look natural (e.g. the curtain sways from the
     top, the handset lifts off the cradle)
   - reduced-motion still works

### Scene-level changes needed to get the reference's look (later task)

These are **code changes**, intentionally not made in this task:

1. **Fixed-aspect stage for the canvas.** Painted plates only line up with
   objects if both use one coordinate system. Today slots are percentages
   of a fluid viewport, so a painted desk edge would drift away from the
   objects on different screen shapes. Recommended approach:
   - render the desktop/tablet canvas in a stage locked to the plate's
     aspect (16:9), scaled to cover the viewport
   - paint the plates with about 15% extra bleed on each side so cropping
     never cuts into content
   - keep every interactive object inside a central 4:3 safe area
   - position slots in plate coordinates
2. **Resize slots to the §4 scale table.** In particular, enlarge the
   laptop (to about 15–17% stage width), the journal and the phone. Move
   the bookshelf so it stands on the floor line behind the desk. Move
   the easel and lamp so they stand on the desk.
3. **Compose clusters as single images.** The memory wall becomes one
   painted cluster of 4–5 distinct photos (today it's one frame SVG ×4).
   The art wall becomes one painted cluster of 3 paintings. Each keeps
   one idle animation on the whole cluster.
4. **Mobile:** each `MobileRoom` vignette gets a strip of `desk-surface`
   or a shelf edge underneath, so objects stand on something. The window
   gets its own mobile box at the frame's true aspect (today it renders
   as a squashed oval).
5. Add `onError` hiding to scene `<img>` layers once art is heavier.

---

## 10. Production workflow

### Tools

No image-generation tool is available inside this Claude Code session. Use
Google AI Studio (or an equivalent) with the prompts in
`docs/art-generation-prompts.md`:

- **Gemini image model** (the one that accepts reference images and does
  edits): the workhorse. Attach the approved style plate as a reference
  to every object prompt, and use edit mode to derive aligned layers.
- **Imagen** (text-to-image only, higher fidelity): good for the first
  style plate, when there's nothing to reference yet.

Model names and limits change; pick the image model that **accepts image
inputs** for everything after the first plate.

### The style-lock sequence (do not skip)

1. Generate the **style plate**: the full room at 16:9 with every object
   in place, the reference composition, no text or UI. Iterate until it's
   right; it becomes the style bible.
2. Using the style plate as a reference image, generate the **empty room
   plates** (wall, window frame, desk) and the **first hero object**.
   Place them in the site (one object swap) and check them in the real
   scene before continuing.
3. Only then batch the remaining objects, **always attaching the style
   plate**, plus the hero object for material match.

### Getting transparency and aligned layers

- **Never prompt "transparent background".** Generators paint a fake
  grey-and-white checkerboard. Instead prompt for a **flat, uniform,
  seamless background in a color absent from the object**: mid-grey
  `#808080` for most objects, flat dark green for cream/paper objects.
  There should be no floor, horizon or shadow on the background.
- Remove the background afterwards with any of these:
  - remove.bg or Photoshop "Remove Background"
  - macOS Preview / Photos "lift subject" (fast, no install)
  - `rembg` (Python; not installed here)

  Then clean the edges at 200% zoom, especially fur, plant leaves and
  the phone cord.
- **Multi-layer objects: generate whole, then derive layers by editing.**
  Generate the complete object first (e.g. the phone with its handset
  on). Then, with that image attached, ask the edit model for "the same
  image with the handset removed, empty cradle visible, nothing else
  changed" to get the base layer. Cut the handset from the original.
  Both layers then share exact framing. The same approach works for:
  - bookshelf: full → empty shelves
  - easel: full → no canvas
  - journal: with pen → without pen
  - cat: sleeping → awake, same position
- **FX layers:** prompt for the effect alone on pure black (e.g. "soft
  amber stained-glass lamp glow emission, pure black background"). Use
  them as-is with `screen` blend.

### Export spec

| Item | Spec |
|---|---|
| Format | **WebP** with alpha for objects, quality 85–90 (lossless if edges band); WebP without alpha for plates and fx |
| Size | **2× the largest on-screen size** (per-asset numbers in the inventory). Don't ship 4K for a 100 px object. |
| Budget | Each object layer ≤ 120 KB, each plate ≤ 450 KB, each fx ≤ 60 KB. Whole room under 3 MB. |
| Canvas | Tight crop around the object with about 4% padding; every layer of one object on the identical canvas |
| Color | sRGB, no embedded print profiles |

### File organization

```
art-source/                         ← raw generations; NOT shipped (gitignore or keep out of public/)
  00-style-plate/   v01.png v02.png … prompt.md   (prompt + model + date per version)
  01-room-plates/   …
  02-<object>/      raw.png  edit-base.png  notes.md
public/assets/scene/
  background/  room-wall.webp  desk-surface.webp
  window/      window-frame.webp  curtain.webp  cloud.webp  (moon-halo.webp)
  bookshelf/   bookshelf-frame.webp  bookshelf-books-1|2|3.webp  cat-sleeping.webp  cat-awake.webp  plants.webp
  art/         easel-frame.webp  easel-canvas.webp  easel-brushes.webp  palette.webp  art-wall.webp
  desk/        laptop-body.webp  coffee-cup.webp  coffee-steam.webp  journal-pages.webp  journal-pen.webp
               phone-base.webp  phone-handset.webp  phone-cord.webp
  decor/       lamp-body.webp  lamp-glow.webp  movie-poster.webp  memory-wall.webp  plushie.webp
               fairy-lights.webp  fairy-glow.webp
```

Naming: `<object>-<layer>[-<state>].webp`. Effect layers end in `-glow`
or `-steam` and are always screen-blended.

### QA checklist (every image, before it goes into `public/`)

- [ ] Viewed at 100% on a dark background: no watermark, signature, logo or
      checkerboard (see the deleted `bookshelf-frame.png` incident)
- [ ] No text, letters or numbers anywhere
- [ ] Camera matches §3, light comes from the upper right per §5, scale
      matches §4
- [ ] Palette sits inside §6; no pure white or neon
- [ ] No generator artifacts: melted geometry, extra or fused parts, warped
      frames, wrong dial-hole count, malformed paws
- [ ] Clean cut-out edges, no halo of the old background color
- [ ] Layers of one object align exactly when stacked
- [ ] Within the size budget
- [ ] Placed in the live room and checked at desktop and mobile before the
      next asset starts
