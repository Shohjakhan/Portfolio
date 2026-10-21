# Art generation prompts — My Little Universe

Production prompts for Google AI Studio (or any image model that accepts
reference images). Follow `docs/visual-art-direction.md` §10 for the
workflow and QA, and `docs/asset-inventory.md` for export sizes.

**How to use each prompt**

1. Paste **STYLE** first, then the asset prompt, then **AVOID**.
2. For every prompt after #0, **attach the approved style plate** as a
   reference image (and the approved hero object, where noted).
3. Set the aspect ratio in the tool to the one listed. Pick the nearest
   supported ratio and crop afterwards.
4. Generate 3–4 variants, pick one, and record the prompt, model and date
   in `art-source/<nn>-<asset>/prompt.md`.
5. **EDIT** steps run in the image model's edit mode, with the parent
   image attached.

---

## Shared blocks

**STYLE** (prepend to every prompt):

> Painterly storybook illustration in the style of a hand-painted
> background from an animated film. Gouache-and-oil look with visible,
> confident brushwork and soft painted edges. Cozy old-world artist's
> study, whimsical with an understated dark-academia mood. Lighting: one
> warm amber key light (#ffb870) from the upper right, from a
> stained-glass lamp out of frame. Faint cool moonlight (#7c8fc9) rims the
> top and back edges. Soft natural shadows with long falloff. Palette:
> warm dark browns (#2a2018, #4a3423), deep forest green (#214b3e,
> #16302a), parchment (#ede3cd), antique gold (#b08d57), muted night blue
> (#1c2650), oxblood (#6e2a22). Highlights never brighter than warm cream
> (#f6ecd9). Camera: frontal, natural 50 mm lens, eye level just above a
> desk, looking slightly down (about 15°). Believable proportions, subtle
> hand-made imperfections, rich material texture (aged wood grain, worn
> paper, brass patina, soft fabric). Must read clearly at small size.

**ISOLATED** (add to every single-object prompt):

> Show only this one object, centered, fully in frame with a small margin,
> on a perfectly flat, uniform, seamless solid {BG} background. No floor,
> no table, no horizon, no cast shadow on the background, no other
> objects. The object keeps its own form shadows and lighting.

`{BG}` = `mid-grey #808080` by default; `flat deep green #1f4d2b` for
cream or paper objects. Never write "transparent background", because
models paint a fake checkerboard.

**FX** (for light and steam layers, instead of ISOLATED):

> Only the light effect itself, on a pure black #000000 background. No
> object, no surfaces, nothing else.

**AVOID** (append to every prompt):

> Avoid: any text, letters, numbers, logos, watermarks or signatures;
> flat vector or clip-art style; outlines of uniform weight; cartoon or
> chibi faces; dot eyes; glossy 3D render or CGI plastic look;
> photorealistic stock-photo look; neon, cyberpunk or sci-fi elements;
> lens flare; heavy gradients; glassmorphism; checkerboard pattern; pure
> white; extra or fused parts; warped geometry.

---

## T1 — first art-quality test: bookshelf + sleeping cat + trailing plants

Requested in Prompt 03 as the first style test, ahead of the P0 style
plate. There's no reference image yet, so this one runs text-only. If
approved, **it becomes the style reference** attached to every later
prompt, alongside or instead of #0.

- **Tool:** Google AI Studio, Gemini image model (or Imagen). No reference
  image.
- **Aspect ratio setting:** **9:16** (portrait). The final crop is about
  0.42:1.
- **Variants:** generate 4 and pick the best silhouette and light.
- **Save raw to:** `art-source/01-bookshelf-test/raw-v01.png` (+ `prompt.md`).

**Full prompt (paste as-is):**

> A single tall, narrow antique bookshelf shown on its own, painted in a
> sophisticated painterly storybook style, like a hand-painted
> background from an animated film. Gouache-and-oil look with visible,
> confident brushwork, soft painted edges, and subtle hand-made
> imperfections that reward close inspection.
>
> The bookshelf is a treasured object from an old-world artist's private
> study:
> - Aged natural walnut, a softly carved cornice at the top, and three
>   deep shelves.
> - Rich wood grain, worn lighter edges where hands have touched it for
>   years, a small chip on one corner, faint dust in the joints.
>
> The shelves are lovingly overfilled with old books of carefully varied
> heights, thicknesses and angles:
> - Leather and cloth bindings in oxblood, deep forest green, ochre,
>   faded navy and warm brown.
> - Worn spines with abstract antique-gold bands and tooling, but no
>   lettering of any kind.
> - Some books lean against each other, one small horizontal stack, a
>   few aged parchment pages and a ribbon bookmark peeking out.
> - On the middle shelf, a small brass lantern holding a lit candle that
>   glows warmly.
>
> On top of the bookshelf, a ginger tabby cat is curled up peacefully
> asleep:
> - Its tail wraps around over its nose, its paws are tucked in, and its
>   body rises softly as if breathing.
> - Soft directional fur strokes, with warm light on its back.
> - Natural, elegant feline proportions, not cartoonish.
>
> Beside the cat, at the top left corner, sits a small terracotta pot of
> pothos. Its heart-shaped leaves in deep and lighter greens trail long
> vines down over the front of the top shelf and along the left side.
>
> Lighting: one warm amber key light (#ffb870) from the upper right, as if
> from a stained-glass lamp out of frame. Right-facing surfaces glow
> warmly, the left side falls into deep warm-brown shadow, and the shelf
> interiors recede into soft darkness. A faint cool moonlight rim
> (#7c8fc9) touches the top edges of the cat and the cornice. Soft,
> believable shadows with long falloff.
>
> Palette: deep forest greens (#214b3e, #16302a), muted browns (#4a3423,
> #2f2015), antique gold (#b08d57), aged parchment (#ede3cd), and warm
> amber light. Highlights never brighter than warm cream (#f6ecd9).
>
> Camera: frontal view at eye level with the middle shelf, natural 50 mm
> lens, no distortion, with a coherent single-point perspective so the
> inside of each shelf shows a little depth. The whole object has a
> clear, readable silhouette.
>
> Composition: the bookshelf, cat and plant are fully in frame and
> centered, occupying about 70% of the image width and 85% of its
> height, with generous empty margin all around. Place everything on a
> perfectly flat, uniform, seamless solid mid-grey (#808080) background.
> No floor, no wall, no horizon, no cast shadow on the background, no
> other objects.
>
> Avoid:
> - any text, letters, numbers, labels, logos, watermarks or signatures
> - interface elements
> - flat vector or clip-art style
> - heavy or uniform outlines
> - cartoon or chibi proportions, dot eyes
> - glossy 3D render or CGI plastic look
> - photorealistic stock-photo look
> - synthetic, repetitive or noisy textures
> - random tiny clutter
> - neon colors, lens flare, heavy gradients
> - checkerboard pattern, pure white, pure black
> - extra or fused limbs, warped or melted books

**Follow-up edits (only after the composite is approved for production;
each runs on the approved image, in edit mode):**

- **E1 — no cat:** "The exact same image with the cat removed; the flat
  top of the bookshelf is visible where it lay. Change nothing else."
  Gives the shelf without the cat. Cut the cat from the original.
- **E2 — no plant:** run on the E1 result. "Remove the terracotta pot and
  all pothos vines and leaves; show the wood and books that were behind
  them. Change nothing else." Gives the shelf without the plant. Cut the
  plant from the E1 result.
- **E3 — empty shelves:** run on the E2 result. "Remove every book and the
  lantern; show the empty shelves and the dark wood back panel. Change
  nothing else." Gives the frame. Cut the 3 book rows from the E2 result.
- **E4 — awake cat:** run on the original. "The same cat in the same
  position and size, head lifted slightly, eyes half-open and sleepy.
  Change nothing else."

### T1 v02 — revision after reviewing v01

v01 review: `art-source/01-bookshelf-test/review.md`. It has the right
content, palette, cat and plant. It has the wrong rendering (ink outlines,
cel shading), mostly frontal light, and a square 1:1 bookcase where the
scene needs a tall ≈1:2.1 one.

- **Aspect ratio:** **9:16 portrait.** In AI Studio, set it in the run
  settings panel. v01 came back 16:9, so check the output before judging
  the result.
- **Attach** `raw-v01.png` as a reference image, for the cat and plant
  only.

> Using the attached image only as a reference for the sleeping ginger
> cat and the trailing pothos plant, paint a new, different bookshelf
> illustration. It is portrait orientation, much taller than wide.
>
> A tall, narrow antique walnut bookcase, about twice as tall as it is
> wide, with a carved cornice and **four** deep shelves:
> - Old books of varied heights, thicknesses and lean, bound in oxblood,
>   deep forest green, ochre, faded navy and warm brown leather and
>   cloth, with abstract antique-gold bands and no lettering.
> - One small horizontal stack, and at most one loose parchment sheet in
>   the whole bookcase.
> - A small brass lantern with a lit candle on the second shelf from the
>   top.
> - On top of the bookcase, the same ginger tabby cat from the
>   reference, curled asleep with its tail over its nose.
> - At the top left, the same terracotta pot of pothos, its vines
>   trailing down the front and left side.
>
> Rendering: a traditional gouache-and-oil painting, not a digital
> illustration.
> - **No ink outlines and no line art.** Every form is defined only by
>   painted shifts in value and color, and edges dissolve softly into
>   the shadows.
> - Loose, visible bristle brushstrokes; dry-brush texture on the wood
>   grain; subtle paper and canvas grain; gentle color variation within
>   every surface.
> - It should look like a hand-painted background from an animated film,
>   rewarding close inspection.
>
> Lighting:
> - Strong warm amber light (#ffb870) rakes in from the upper right. The
>   right edges of the cornice, shelves and book spines catch bright
>   warm highlights, and the left third of the bookcase falls into deep
>   warm-brown shadow.
> - Inside each shelf, light falls off toward the back panel into soft
>   darkness, so the shelves feel deep.
> - The candle adds a small local glow only on its own shelf.
> - A faint cool moonlight rim (#7c8fc9) touches the top of the cat and
>   the cornice.
>
> Palette: deep forest greens (#214b3e, #16302a), muted browns (#4a3423,
> #2f2015), antique gold (#b08d57), aged parchment (#ede3cd), warm amber.
> Nothing brighter than warm cream (#f6ecd9).
>
> Camera: frontal, natural 50 mm lens, eye level with the second shelf.
> Single-point perspective, so the shelf interiors show slight depth.
>
> Composition: the bookcase, cat and plant are centered and fully in
> frame, filling about 85% of the image height, with empty margin all
> around. Place them on a perfectly flat, uniform, seamless solid
> mid-grey (#808080) background. No floor, no wall, no cast shadow, no
> other objects.
>
> Avoid:
> - ink outlines, line art, cel shading, flat fills, vector look
> - digital-illustration smoothness, synthetic textures
> - any text, letters, numbers, watermarks or signatures
> - cartoon proportions
> - glossy 3D render
> - repeated clutter
> - neon, pure white, pure black
> - checkerboard pattern

---

## P0 — style lock

### #0 Style plate (not shipped) — 16:9 — Imagen or Gemini, no reference yet

> STYLE + A wide painted interior of a cozy artist's study at dusk,
> seen from just behind a long wooden desk.
> - Center: a tall arched wooden window with glazing bars shows a deep
>   blue evening sky, a crescent moon, and distant spires with a few lit
>   town windows. Heavy oxblood velvet curtains hang on both sides.
> - Left: a tall dark-wood bookshelf overflowing with leather-bound
>   books, a ginger tabby cat asleep on top among trailing pothos vines.
>   In front of it on the desk, a small wooden easel holds an unfinished
>   oil landscape, with a jar of brushes and a paint palette.
> - Desk center: an open laptop with a dark screen, a ceramic coffee cup
>   on a saucer with a wisp of steam, an open journal with sketches and a
>   fountain pen.
> - Right: a black-and-brass rotary telephone, a glowing stained-glass
>   Tiffany lamp casting amber light, a stack of old books, and a small
>   soft forest-spirit plush toy.
> - Walls: pinned faded photographs, a framed vintage poster, small
>   framed paintings, and a string of warm fairy lights along the top.
>
> Rich, layered and lived-in, but every object clearly readable. Warm
> amber against deep green-brown shadows. + AVOID

*Accept when it matches the reference's mood without its UI callouts.
This image is the style bible: every later prompt attaches it.*

### #1 Room wall plate — 21:9 (crop to ≈2.1:1) — attach style plate

> STYLE + Using the attached image's exact painting style and lighting:
> - Show only the empty back wall of the study, frontal and flat-on:
>   aged warm plaster above dark wood wainscot paneling, the soft shadow
>   of a ceiling beam along the top, faint water stains, a few old nails,
>   one or two pinned paper scraps, thin ivy creeping across the upper
>   wall.
> - A plain area of wall in the center where a window will be placed.
>   Do not paint a window, curtains, furniture, a desk or objects.
> - Warm amber light pooling from the right, darker toward the left and
>   the corners.
>
> + AVOID

### #2 Desk surface plate — 21:9 (crop to ≈5:1 strip) — attach style plate

> STYLE + Using the attached image's style:
> - A long, empty, worn wooden desktop spanning the full width, seen from
>   about 15° above, with the front edge's thickness visible.
> - Rich walnut grain, scratches, a faint coffee ring, ink stains, worn
>   lighter edges.
> - Below the front edge, soft dark shadow under the desk.
> - Warm lamplight falling from the right, a faint cool sheen near the
>   back edge.
> - Nothing on the desk: no objects at all.
>
> + AVOID

### #2b Desk surface v2 (written for the current layout, 2026-10-15) — 21:9 — attach the approved bookshelf

Replaces #2. In code the desk is a full-width band that starts at the
wall line and runs to the bottom of the screen, stretched to cover
(`Room`: the desk plane, `DESK_TOP`). So the back edge must be at the very
top, the front edge near the bottom, and the surface empty and level.

> Generate an image with a 21:9 aspect ratio.
>
> Match the painting style, brushwork, lighting and palette of the attached
> image exactly: traditional gouache-and-oil painting, visible brushwork, no
> ink outlines, warm amber light from the upper right, palette of warm
> browns, deep forest green, antique gold, aged parchment and muted night
> blue, nothing brighter than warm cream.
>
> The top surface of a long, wide, completely EMPTY antique walnut writing
> desk, filling the entire width of the image edge to edge, seen from a
> seated viewpoint about 20 degrees above the desk. The far back edge of the
> desk runs straight across the very top of the image where it would meet a
> wall. The tabletop surface fills most of the image and comes toward the
> viewer, and the desk's thick rounded front edge runs straight across near
> the bottom (around 85% down), with deep soft shadow underneath it at the
> very bottom.
>
> Rich dark walnut grain running left to right, centuries of gentle wear:
> fine scratches, a few faint ink stains, one or two faded coffee-cup rings,
> softly worn lighter patches, a subtle polished sheen. Warm amber lamplight
> pools on the right side of the desk; the left side falls gently into warm
> shadow; a faint cool glow on the center of the desk as if from a laptop
> screen. Calm and even enough that objects placed on it later will stand
> out.
>
> Absolutely nothing on the desk: no objects, no papers, no books, no cups,
> no plants, no wall, no chair. The surface must be a straight, level band
> across the whole width, not angled or rotated. No text, letters, numbers,
> logos, signatures or watermarks.

### #3 Window frame — 3:4 — attach style plate

> STYLE + ISOLATED (BG = flat bright green #00c853) + Using the attached
> image's style:
> - A tall arched wooden window frame, seen dead frontal: weathered dark
>   wood with chipped paint edges, slim glazing bars dividing the glass
>   into panes, a deep wooden sill at the bottom with a little wear.
> - The glass areas are filled with the same flat bright green as the
>   background, so they can be removed. No sky, reflections or view.
> - Warm light catching the right side of the frame, cool moonlight
>   rimming the inner edges.
>
> + AVOID

*Post: remove the green from the background and all pane areas. Check the
pane edges at 200%.*

---

## P1 — hero objects (attach the style plate to each)

### #4 Stained-glass lamp — 3:4

> STYLE + ISOLATED + A Tiffany-style stained-glass table lamp: a domed
> shade of amber, honey, deep green and rust glass panes with dark lead
> lines, on a patinated bronze stem and round base. The shade is
> **switched off**, its glass richly colored but not emitting light, lit
> only by the room. 50 mm frontal view, slightly from above. + AVOID

**#4b Lamp glow (FX)** — EDIT on #4:
> FX + Using the attached lamp, paint only the light the shade would
> emit when switched on: warm amber light glowing through the stained
> glass panes and a soft halo around the shade, exactly aligned to the
> shade's position and shape. Everything else pure black. + AVOID

### #5 Bookshelf, filled — 1:2 (crop to ≈1:2.13)

> STYLE + ISOLATED + A tall, narrow dark-wood bookshelf, frontal, with a
> carved top cornice and three deep shelves.
> - The shelves overflow with old books: varied heights, leather and
>   cloth bindings in oxblood, forest green, ochre and brown, abstract
>   gilt bands on the spines (no lettering), some leaning, one small
>   horizontal stack.
> - One shelf also holds a small brass lantern with a candle; another
>   holds a tiny potted succulent.
> - The top of the shelf is clear and flat (a cat will sit there).
>
> + AVOID

**#5b Bookshelf, empty** — EDIT on #5:
> The exact same bookshelf, same position, size and lighting, with every
> book and item removed. Empty shelves showing the dark wood back panel
> and shelf shadows. Change nothing else.

*Cut the three book rows from #5 and the frame from #5b, all on the same
canvas.*

### #6 Tabletop easel with painting — 1:2

> STYLE + ISOLATED + A small wooden tabletop easel holding a stretched
> canvas.
> - The canvas has an unfinished oil painting: misty blue-violet
>   mountains and dark pines at dusk, a glowing lake, thick visible
>   strokes, the bottom-left corner still bare canvas.
> - Beside the easel's foot, a glass jar of well-used paintbrushes. In
>   front of it, a wooden paint palette with dabs of ochre, green, blue
>   and white.
>
> + AVOID

**#6b Easel without canvas, jar or palette** — EDIT on #6:
> The exact same easel, same position, with the canvas, brush jar and
> palette removed. Change nothing else.

*Cut the canvas, jar and palette from #6 as separate layers; take the
frame from #6b.*

### #7 Laptop — 5:4

> STYLE + ISOLATED + An open laptop seen from the front and slightly
> above.
> - Warm grey aluminium, gently worn, a couple of tiny stickers with no
>   text.
> - The screen is a perfectly plain, uniform near-black (#0b1024) with a
>   thin dark bezel. Nothing displayed, no reflections.
> - The keyboard is softly lit by the screen.
>
> Painted, not a glossy product render. + AVOID

*Post: measure the screen rectangle in % and update `SCREEN_BOX`.*

---

## P2 — desk set and wall set (attach the style plate + the approved laptop for material match)

### #8 Rotary phone — 1:1

> STYLE + ISOLATED + A 1930s black-and-brass rotary telephone: glossy
> black bakelite body with worn edges, a brass rotary dial with ten
> finger holes, the handset resting on its cradle, and a coiled cloth
> cord curling from the handset down behind the body. + AVOID

**#8b Phone base** — EDIT on #8:
> The exact same telephone, same position, with the handset removed: the
> empty cradle visible. Keep the cord end at the body. Change nothing
> else.

*Cut the handset and the cord from #8; take the base from #8b.*

### #9 Coffee cup — 1:1

> STYLE + ISOLATED + A handmade ceramic coffee cup on a matching saucer,
> deep forest-green glaze with a small gold crescent-moon motif.
> Seen from slightly above, so the dark coffee surface shows a soft warm
> highlight. No steam. + AVOID

**#9b Coffee steam (FX)** — 3:4:
> FX + Two or three soft, curling wisps of warm-white steam rising and
> fading upward, painterly, semi-translucent. + AVOID

### #10 Journal — 16:10

> STYLE + ISOLATED (BG = flat deep green #1f4d2b) + An open, well-used
> leather journal lying on its spine, seen from about 15° above.
> - Aged parchment pages covered with ink sketches (a castle, a moon
>   phase diagram, a pressed leaf taped in) and lines of handwriting
>   suggested only as **illegible ink scribbles**, never real letters.
> - A ribbon bookmark.
> - A black-and-gold fountain pen lying diagonally across the right
>   page.
>
> + AVOID

**#10b Journal without pen** — EDIT on #10:
> The exact same journal, same position, with the pen removed. Change
> nothing else.

### #11 Movie poster — 2:3

> STYLE + ISOLATED + A framed vintage fantasy film poster in a thin
> antique-gold frame. Painted illustration only:
> - A dark castle on a cliff under a large pale moon, a lone cloaked
>   figure on a winding path, deep blue and amber tones.
> - Aged, slightly creased paper, softly faded.
> - Absolutely no title, credits or lettering.
>
> + AVOID

### #12 Memory wall cluster — 6:5

> STYLE + ISOLATED + A loose cluster of five old photographs and
> postcards pinned to a wall, slightly overlapping at different angles,
> held by brass pins and strips of washi tape.
> - The photos are softly faded sepia and muted color: a seaside town, a
>   mountain road, a city skyline at dusk, a café table, a group
>   silhouette at a festival.
> - No faces in focus, no writing.
>
> + AVOID

### #13 Plush toy — 1:1

> STYLE + ISOLATED + A small, soft, original forest-spirit plush toy:
> - Round, grey-blue felt body with a lighter belly, small pointed ears,
>   gently stitched seams, slightly worn and much-loved.
> - Calm, simple embroidered eyes: tiny dark stitches, not cartoon dots.
>
> An original design, not any existing character. + AVOID

---

## P3 — companions and ambience (attach the style plate)

### #14 Sleeping cat — 16:9

> STYLE + ISOLATED + A ginger tabby cat curled up asleep, seen from the
> front and slightly above.
> - Its tail wraps over its nose, and its paws are tucked in.
> - Soft directional fur strokes, warm lamplight on its back, a flat
>   underside as if lying on a shelf top.
>
> Peaceful and natural, not cartoonish. + AVOID

**#14b Awake cat** — EDIT on #14:
> The exact same cat in the same position and size, but it has lifted
> its head slightly and its eyes are half-open and sleepy. Body and tail
> unchanged.

### #15 Plants — 4:5

> STYLE + ISOLATED + A small terracotta pot with a trailing pothos plant.
> Heart-shaped leaves in deep and lighter greens, with long vines spilling
> over the front and hanging down. A second tiny pot with a fern beside
> it. + AVOID

### #16 Curtain panel — 9:16 (crop to ≈1:4.5)

> STYLE + ISOLATED + A single tall panel of heavy, worn oxblood velvet
> curtain, hanging from a brass ring at the top, gathered at two-thirds
> height with a gold-tasseled tie-back, deep soft folds. Lit evenly from
> the front so it can be mirrored. + AVOID

### #17 Art wall cluster — 3:4

> STYLE + ISOLATED + Three small paintings hung close together in a loose
> arrangement:
> - A moonlit lake landscape in a gilt frame.
> - A lighthouse at dusk in a dark wooden frame.
> - A small still life of pears on an unframed canvas.
>
> Each is a believable painted miniature with visible brushwork. + AVOID

### #18 Fairy lights — 21:9 (crop to ≈8:1)

> STYLE + ISOLATED + A string of small vintage fairy-light bulbs on a thin
> dark wire, hanging in three gentle swags across the frame, with a few
> tiny brass star charms. The bulbs are warm glass, switched off. + AVOID

**#18b Fairy glow (FX)** — EDIT on #18:
> FX + Using the attached string of lights, paint only the warm amber
> glow of each bulb switched on, a small soft bloom per bulb, exactly
> aligned to each bulb. Everything else pure black. + AVOID

---

## After each generation

Run the QA checklist in `docs/visual-art-direction.md` §10, export to the
size in `docs/asset-inventory.md`, and do **one asset at a time**: place
it in the live room, check it at 1440, 820 and 375 px, then move on.
