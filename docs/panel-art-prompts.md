# Panel art prompts — the insides of every object

Companion to `docs/art-generation-prompts.md` (the room) and
`docs/visual-art-direction.md` (the rules). These are the assets **inside**
the nine panels that open when an object is clicked.

## Rules specific to panels

1. **No content in the art.** Every title, paragraph, project, ticket name,
   link and Notion entry stays live HTML. Art is surfaces, frames, props and
   small illustrations only. Any area where content sits must be **plain and
   low-contrast**: text has to stay readable on it.
2. **Holes for real images are flat green `#00c853`.** Picture frames, film
   frames and charms hold your real photos and artwork; their openings are
   generated green and keyed out.
3. **Textures that repeat must say "seamless tileable".** Generators often
   leave a seam anyway; I'll check and fix seams during integration.
4. **No brand logos** (Instagram, Telegram, GitHub, LinkedIn): they stay
   as code icons placed on painted stamps or plaques.
5. Attach the **approved bookshelf** as the style reference for every prompt.

## Panel → assets

| Panel (object) | Assets | Priority |
|---|---|---|
| Shared by 7 panels | P1 parchment paper texture | ★ first |
| About Me (coffee) | A1 your painted portrait · A2 coffee-and-notebook header vignette · A3 margin doodle sheet | ★ |
| My Work (laptop) | L1 desktop wallpaper · L2 four folder icons | ★ |
| My Library (bookshelf) | B1 two-tier bookcase backdrop · B2 "My Writings" cover · B3 "Warkinless" cover · B4 open-book spread | ★ |
| My Art (easel) | G1 gallery wall backdrop · G2 four empty frames · G3 bust + plant decor | ★ |
| Find me elsewhere (journal) | J1 diary page · J2 blank postage stamp | |
| Memories (photo wall) | M1 film-reel canister · M2 reel shelf plank · M3 filmstrip | |
| Cinema (poster) | C1 blank ticket stub · C2 velvet backdrop | |
| Anime & Manga (plushie) | F1 charm rail · F2 blank acrylic charm | |
| Let's talk (phone) | K1 open address book · K2 envelope with wax seal | |


## The prompts
Every prompt begins with the aspect-ratio line and assumes the approved bookshelf image is attached as the style reference (unless noted).

### P1 — Parchment paper texture (shared)

```text
Generate an image with a 1:1 aspect ratio.

A seamless tileable texture of aged parchment paper, seen flat and straight-on, filling the whole image edge to edge. Warm cream-to-honey tones (#ede3cd), subtle paper fibers, a few faint foxing spots, very soft uneven tone, low contrast so dark text stays readable on it. No folds, no edges, no objects, no writing. Seamless: the left edge continues into the right edge and the top into the bottom. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### A1 — About: your painted portrait

_Attach a clear photo of yourself AND the bookshelf image._

```text
Generate an image with a 1:1 aspect ratio.

Using the first attached photo only for the person's likeness, and the second attached painting only for the art style: a painted head-and-shoulders portrait of this person, three-quarter view, natural and warm, softly smiling. Traditional gouache-and-oil painting with visible brushwork and no ink outlines, warm amber lamplight from the upper right, a deep warm-brown background that fades softly. The face sits in the center so the image can be cropped into a circle. No text or watermarks.
```

### A2 — About: coffee-and-notebook header vignette

```text
Generate an image with a 16:9 aspect ratio.

A small still-life vignette seen from slightly above: a steaming ceramic coffee cup with a deep forest-green glaze on its saucer, beside an open notebook with small sketches and a fountain pen, a few scattered coffee beans. Just the objects, centered with wide empty margin. On a perfectly flat, uniform, solid mid-grey (#808080) background, no shadow on the background. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### A3 — About: margin doodle sheet

```text
Generate an image with a 1:1 aspect ratio.

A sheet of six small, separate sketches arranged in a loose 3 by 2 grid with wide empty space between them: a compass, a quill with an ink bottle, a mountain range, a crescent moon with stars, a paper airplane, a small sprouting seedling. Drawn in delicate sepia-brown ink with soft watercolor wash, like margin doodles in a sketchbook (ink lines are fine here, these are drawings). On a plain, flat, uniform parchment-colored (#ede3cd) background. No text, letters, numbers or watermarks.
```

### L1 — My Work: laptop desktop wallpaper

```text
Generate an image with a 16:10 aspect ratio.

A calm painted night landscape for a computer desktop wallpaper: rolling dark hills, a distant old town with warm lit windows and slender spires, a large crescent moon and soft stars in a deep blue sky (#1c2650, #201a3f), faint mist lying in the valleys. Keep the top edge and the center calm, dark and simple so small icons and windows stay readable on top of it. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### L2 — My Work: four folder icons

```text
Generate an image with a 1:1 aspect ratio.

Four separate small painted objects used as desktop icons, arranged in a 2 by 2 grid with wide empty space between them, all the same size, each seen straight on: (1) a leather document folder with rolled blueprints sticking out, (2) a worn brown leather satchel, (3) a small antique brass trophy cup, (4) a little desk calendar with a ribbon bookmark and completely blank pages. Each must read clearly at a small size. On a perfectly flat, uniform, solid mid-grey (#808080) background, no shadow on the background. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### B1 — My Library: two-tier bookcase backdrop

```text
Generate an image with a 16:9 aspect ratio.

The inside of a wide, low dark-walnut bookcase seen dead frontal, filling the frame: a carved cornice along the top, side panels, a base trim along the bottom, and exactly two long horizontal shelves, an upper and a lower one, both completely EMPTY. Warm dark wood back panel with soft lamplight falling from the upper right; the shelves recede slightly into shadow. Nothing on the shelves. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### B2 — My Library: "My Writings" book cover

```text
Generate an image with a 2:3 aspect ratio.

The front cover of a handmade writer's journal, seen dead frontal and flat, filling the frame: worn brown leather (#6b4a3a) with a blind-tooled border ornament, a small embossed quill-and-inkwell motif in antique gold at the center, softly rounded worn corners, a ribbon bookmark peeking out at the bottom. No title and no lettering anywhere. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### B3 — My Library: "Ruining of Warkinless" cover

_Replace the bracketed part with a scene from your novel._

```text
Generate an image with a 2:3 aspect ratio.

The front cover of a fantasy novel, seen dead frontal and flat, filling the frame: deep blue cloth binding (#3f4a6b) with an inset painted illustration of [DESCRIBE ONE KEY SCENE OF YOUR NOVEL, e.g. a ruined castle above a dark forest under a pale moon], framed by an ornamental antique-gold border. No title, no author name, no lettering anywhere. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### B4 — My Library: open-book spread

```text
Generate an image with a 16:10 aspect ratio.

An open hardcover book seen straight from above, filling the frame: two blank aged parchment pages with a soft shadow in the center gutter, gently curved pages, faintly deckled edges, a thin dark leather cover edge visible around the pages. The pages are completely blank, smooth and evenly lit so text can be printed on them. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### G1 — My Art: gallery wall backdrop

```text
Generate an image with a 21:9 aspect ratio.

The empty wall of a small, dim private art gallery seen dead frontal: deep muted green-black painted plaster (#16302a fading toward near-black) above dark wood wainscot, and a thin strip of polished dark wooden floor along the bottom. Very soft warm light pooling gently from above. Mostly calm and dark. No pictures, frames, furniture or objects. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### G2 — My Art: empty picture frame (run 4 times, one per style)

_Run once for each style in the brackets._

```text
Generate an image with a 1:1 aspect ratio.

A single empty picture frame seen dead frontal, perfectly straight and symmetrical, with molding of exactly equal width on all four sides: [ornate antique-gold baroque molding / slim black lacquered molding / dark carved walnut molding / thin brushed-gold modern molding]. The opening inside the frame is filled with flat, solid bright green (#00c853). On a perfectly flat, uniform, solid mid-grey (#808080) background, no shadow on the background. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### G3 — My Art: bust + plant decor

```text
Generate an image with a 1:1 aspect ratio.

Two separate gallery decor objects standing side by side with wide empty space between them: a small classical marble bust on a dark wooden plinth, and a tall potted fiddle-leaf fig in a terracotta pot. Dim, muted gallery lighting from the upper right. On a perfectly flat, uniform, solid mid-grey (#808080) background, no shadow on the background. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### J1 — Find me elsewhere: diary page

```text
Generate an image with a 3:4 aspect ratio.

A single page of an old diary seen flat and straight-on, filling the frame: aged parchment with very faint ruled lines, a soft coffee-cup ring stain near the top-right corner, a small pressed flower taped in the bottom-left corner, slightly worn deckled edges. The middle of the page is clean, smooth and evenly lit so handwriting can be placed on it. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### J2 — Find me elsewhere: blank postage stamp

```text
Generate an image with a 1:1 aspect ratio.

A single blank vintage postage stamp seen dead frontal: scalloped perforated edges, an ornamental antique-gold and forest-green border, and the center area filled with flat, solid bright green (#00c853). On a perfectly flat, uniform, solid mid-grey (#808080) background, no shadow on the background. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### M1 — Memories: film-reel canister

```text
Generate an image with a 1:1 aspect ratio.

A single vintage 35mm film-reel canister seen straight on from the front: round, worn tin with a warm brass tint, small dents and scratches, three spoke holes, and a small plain cream paper label strip across the middle with no writing. On a perfectly flat, uniform, solid mid-grey (#808080) background, no shadow on the background. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### M2 — Memories: reel shelf plank

```text
Generate an image with a 21:9 aspect ratio.

A single long wooden wall shelf seen dead frontal at eye level: one worn walnut plank with its top surface just visible and two small dark iron brackets underneath. Nothing on the shelf. On a perfectly flat, uniform, solid mid-grey (#808080) background, no shadow on the background. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### M3 — Memories: filmstrip

```text
Generate an image with a 21:9 aspect ratio.

A straight horizontal strip of old 35mm film seen flat and dead frontal across the full width: dark brown-black film base with evenly spaced sprocket holes along the top and bottom edges, and five equal rectangular frames in a row. Every frame window is filled with flat, solid bright green (#00c853). Faint warm scratches and dust on the film. The background above and below the strip is flat mid-grey (#808080). Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### C1 — Cinema: blank ticket stub

```text
Generate an image with a 5:2 aspect ratio.

A single blank vintage cinema ticket seen dead frontal and flat: aged cream paper with an oxblood (#6e2a22) band, a decorative antique-gold border, a perforated tear line about four-fifths of the way across, slightly worn corners and a faint fold. Completely blank: no words, no numbers, no "admit one". On a perfectly flat, uniform, solid mid-grey (#808080) background, no shadow on the background. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### C2 — Cinema: velvet backdrop texture

```text
Generate an image with a 1:1 aspect ratio.

A seamless tileable texture of deep oxblood cinema velvet (#6e2a22 toward darker), soft plush fabric seen flat with a subtle sheen and no folds, low contrast, filling the whole image edge to edge. No objects. Seamless: left edge continues into right, top into bottom. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### F1 — Anime & Manga: charm rail

```text
Generate an image with a 21:9 aspect ratio.

A single horizontal aged-brass rail rod with two small decorative end finials and a row of small, evenly spaced empty hooks hanging below it, seen dead frontal, with warm highlights on the brass. On a perfectly flat, uniform, solid mid-grey (#808080) background, no shadow on the background. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### F2 — Anime & Manga: blank acrylic charm

```text
Generate an image with a 1:1 aspect ratio.

A single blank acrylic keychain charm seen dead frontal: a rounded-square clear acrylic tile with soft glossy edge highlights and a small silver ring loop at the top. The face of the tile is filled with flat, solid bright green (#00c853). On a perfectly flat, uniform, solid mid-grey (#808080) background, no shadow on the background. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### K1 — Let's talk: open address book

```text
Generate an image with a 16:10 aspect ratio.

An open, well-worn leather address book seen straight from above, filling the frame: two aged parchment pages with very faint ruled lines and a soft gutter shadow, and a column of small colored index tabs along the right page edge. The tabs are blank, with no letters. Dark brown leather cover edges around the pages. The page areas are clean and evenly lit so text can be placed on them. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```

### K2 — Let's talk: envelope with wax seal

```text
Generate an image with a 4:3 aspect ratio.

A single closed vintage paper envelope seen dead frontal: aged cream paper with a deep oxblood wax seal pressed with a small crescent moon at the center of the flap. Blank: no address, no postage stamp, no writing. On a perfectly flat, uniform, solid mid-grey (#808080) background, no shadow on the background. Match the painting style, brushwork, lighting and palette of the attached image exactly: traditional gouache-and-oil painting, visible brushwork, no ink outlines, warm amber light from the upper right, palette of warm browns, deep forest green, antique gold, aged parchment and muted night blue, nothing brighter than warm cream. No text, letters, numbers, logos, signatures or watermarks.
```
