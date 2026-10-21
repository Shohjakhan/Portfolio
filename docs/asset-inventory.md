# Asset inventory — painterly upgrade tracker

Every visual asset the room uses or needs, with its replacement spec.
Rules for *how* to make them: `docs/visual-art-direction.md`. Prompts:
`docs/art-generation-prompts.md`.

> Revision 2026-10-14 (Prompt 02). Usage was re-verified by searching
> `src/` for every file in `public/assets/`. The previous revision listed
> `gallery-painting-1/2/3.svg` and `palette.svg` as "orphaned". That was
> wrong: `ArtWall` and `Easel` render them. The previous revision's sizes
> were SVG viewBox units; the **Export px** column below is the real target
> (2× the largest on-screen size).

## Status key

| | Meaning |
|---|---|
| 🔴 | Flat-vector placeholder, needs a full painted replacement |
| 🟠 | Not an asset today (CSS-only), should become a painted plate or layer |
| 🟡 | Acceptable for now; upgrade later |
| ⚪ | Unused file (kept per `CLAUDE.md` §4, never shipped visibly) |
| ⬜ | Doesn't exist yet; called for by the reference |

## Priority key

| | Meaning |
|---|---|
| **P0** | Style lock: generate first, approve before anything else |
| **P1** | Hero objects: the biggest visual change; generate right after P0 |
| **P2** | Desk set and wall set: the remaining interactive objects |
| **P3** | Companions and ambience |
| **P4** | Nice-to-have / depends on features not built yet |

Transparency: **α** = real alpha, cut out after generation · **opaque** =
full-bleed plate · **screen** = painted on pure black, composited with
`mix-blend-mode: screen` (no alpha needed).

Aspect ratios are width:height of the final cropped asset. Where a ratio
differs from today's SVG, the integration note says what must be
re-measured.

---

## ✅ Integrated, round 4 (2026-10-16): batch 2 + desk

Raws in `art-source/07-panels/`, pipeline `art-source/_tools/panels2.py`.

| Where | Art in place |
|---|---|
| Room | **painted desk** (`scene/background/desk-surface.jpg`, from the perspective desk v2) replaces the CSS wood band |
| Library | **tall four-compartment bookcase** (`panels/library/bookcase-tall.jpg`); the case keeps its natural proportions and **scrolls inside the dialog** (48vh window). Top compartment: your two covers; lower three: painted spines, 14 per shelf |
| Art | painted gallery wall backdrop; **four decor pieces** (monstera, ballerina statue, marble bust, fiddle-leaf fig) |
| Cinema | painted blank ticket (`cinema/ticket.png`) with live text on it |
| Anime & Manga | painted acrylic charm; the cover shows through its transparent face (`fandom/charm.png`) |
| Memories | painted five-frame filmstrip, used for reels' frames (`memories/filmstrip.png`) |

**Not used:** M1 reel canister and M2 shelf plank (not on disk), A2 header (not on disk), F1 charm rail (still CSS), the phone-without-handset image (a base with no handset layer: the handset lift can't come back without a separate handset painting), and the earlier lower-res bust/plant sheet (superseded by the clean one).

**Known:** Notion covers (1.3 MB GIFs) download at ~30 KB/s from the dev machine, so charm/poster covers take a minute to appear; see roadmap 5.3.

## ✅ Integrated, round 3 (2026-10-15): the panels

Files are in `public/assets/panels/<panel>/` (about 3.3 MB), produced by
`art-source/_tools/panels.py` from the raws in `art-source/07-panels/`
(intake notes: `notes.md`).

| Panel | Art in place | Still missing / not used |
|---|---|---|
| All paper panels | `shared/parchment.jpg` as the dialog surface (`.texture-parchment`, stretched, not tiled: it isn't seamless) | — |
| About Me | painted portrait in the byline; six margin doodles (cut by darkness) | A2 header vignette (batch 2 not on disk) |
| My Work | wallpaper L1; four painted launcher icons (replace the Folder glyph) | — |
| My Library | painted two-tier bookcase; your two books face-out as covers | spines for "books read" (batch 2); B4 open-book **rotated 90° with a wavy gutter, not used** |
| My Art | painted gold / black / walnut frames as 9-slice borders (thin "slim" frame stays CSS); marble bust + monstera replace the SVG decor | G1 gallery wall backdrop; 4th (brushed-gold) frame |
| Journal | painted diary page; painted stamps with real icons | — |
| Contact | painted open address book (two pages = two columns on ≥640px); envelope as the email button | — |
| Cinema | oxblood velvet surface (new Modal variant `cinema`) | C1 ticket stub art; tickets are still CSS |
| Memories | — | M1 reel, M2 shelf, M3 filmstrip (batch 2) |
| Anime & Manga | — | F1 rail, F2 acrylic charm (batch 2) |

Also still missing: the landing-page desk v2 and the A2 header (both in batch 2).

## ✅ Integrated, round 2 (2026-10-15): every landing-page object

Raw sources are in `art-source/06-landing-objects/`; the cut-out scripts
(`process2.py`, `fix2-4.py`) are in `art-source/_tools/`. The landing room
now has **no flat placeholders left** except the CSS desk band.

| File (`public/assets/scene/…`) | Notes |
|---|---|
| `desk/laptop.png` | `SCREEN_BOX` re-measured to the painted bezel |
| `desk/phone.png` | One image: the handset isn't separable in this art, so the ring shakes the whole phone (the handset lift is gone) |
| `desk/coffee-cup.png` + `desk/coffee-steam.png` | Steam painted on black, converted to brightness-as-alpha (CSS blend modes can't cross a slot's stacking context) |
| `desk/journal-pages.png` + `desk/journal-pen.png` | Pen cut from the with-pen painting and laid over the pen-less one; the pen's pale nib was lost in the cut |
| `decor/lamp.png` + `decor/lamp-glow.png` | v2 lamp + its matching lit-shade painting (brightness-as-alpha), cropped to the same box |
| `decor/fairy-lights.png` + `decor/fairy-glow.png` | New `FairyLights` ambient component; glow follows time of day |
| `decor/movie-poster.png`, `decor/plushie.png` | Plushie closely resembles Studio Ghibli's Totoro (owner's choice; noted) |
| `decor/memory-wall.png` | Source had the design reference's UI strip and desk baked in; cut out as the union of the five photo shapes |
| `art/art-wall.png` | Three-painting cluster |
| `art/easel.png` + `art/easel-canvas.png` | Replaced with the painterly v2 easel |
| `window/curtain-left.png` / `curtain-right.png` | Split from one painting of both panels; no more mirroring |

Layout: the canvas is now composed in a centred **16:10 frame** (`Room`:
`FRAME_CLASS`, `u()`), with the wall and desk extending beyond it. That gives
the same composition on 16:9, 16:10 and portrait screens. Back-wall objects
are painted before the desk plane, desk objects after.

Hover: every object scales up (about 1.07×) and gets the `--hover-glow`
lamp-light halo. The hovered slot is raised to the front so its label is
never hidden.

**Weight:** the scene art is about 5.7 MB of PNG. **WebP conversion is now the
top performance task.** Still missing: the painted desk surface (prompt
#3), which would replace the CSS desk band.

## ✅ Integrated in the site (2026-10-14)

Cut out with `art-source/_tools/process.py` (pure-Python keying: flood-fill
from the border for grey backgrounds, a per-pixel key with despill for the
green-screen window). Raw sources are in `art-source/0x-*/`. The old SVGs are
still on disk, unreferenced. **PNG for now** (no WebP encoder available
locally); converting to WebP is a follow-up, since the scene is about 3.6 MB of art.

| File (`public/assets/scene/…`) | Size | Used by | Notes |
|---|---|---|---|
| `background/room-wall.jpg` | 2000×848, 247 KB | `Room` canvas background | Plaster + wainscot plate; dimmed with CSS `brightness(0.62)` to evening exposure. Desktop/tablet only. |
| `window/window-frame.png` | 640×879, 823 KB | `Window` | Glass transparent; the CSS sky/moon/stars sit behind it, clipped to the glass box. **Heaviest file: WebP first.** |
| `bookshelf/bookshelf-frame.png` | 488×827, 254 KB | `Bookshelf` | Painted carcass with darkened compartments (backing for the rows) |
| `bookshelf/bookshelf-books-1…5.png` | 386 wide, 95–162 KB each | `Bookshelf` | Five distinct rows; per-row hover nudge kept |
| `bookshelf/plants.png` | 220×364, 170 KB | `Plants` | Sways from the pot base |
| `bookshelf/cat-sleeping.png` / `cat-awake.png` | same canvas, ≈60 KB each | `Cat` | Crossfaded during the cat's occasional stir |
| `decor/lamp.png` | 300×467, 138 KB | `Lamp` | CSS glow kept (the generated glow is a different shade design) |
| `art/easel.png` + `art/easel-canvas.png` | 300×574 / 204×269 | `Easel` | Canvas overlay for the hover light; the brush-jar sway was dropped |

Behavior changes made to fit the art:
- The bookshelf no longer breathes or tilts (the cat and plant are separate
  layers on top); its hover is now a glow, plus the row nudge.
- The cat's wobble is replaced by an asleep/awake crossfade.
- Bookshelf, plant and cat share one box (`BookshelfCorner`), on both
  desktop and mobile.
- Slots moved: art wall, easel, lamp and curtains.
- The mobile window now renders at its real shape.

**Not yet replaced:** curtains, desk surface, laptop, coffee, journal,
phone, plushie, movie poster, memory wall, art wall, fairy lights.

## Test assets

| Asset | Purpose | Status | Generation | Final crop | Export px | Notes |
|---|---|---|---|---|---|---|
| **T1 Bookshelf + cat + plants (composite)** | First art-quality test (Prompt 03); becomes the style reference if approved | ✅ **Style approved by Claude review 2026-10-14, awaiting owner sign-off and integration.** v03 set in `art-source/01-bookshelf-test/`: **1342×2000 JPEG, no alpha**, 5 shelves, shelf body ≈0.64:1. Usable aligned layers: `v03-books-only-grey.jpg` (base) + `v03-full-cat-awake-navy.jpg` (plant and awake-cat source, aligned within 2 px). Sleeping cat: `v03-full-cat-asleep-navy-lowres.jpg` (848×1264; full-size download wanted). The empty-frame and no-cat files are misaligned and unused. History: v01 1024×572, v02 687×1024. Full QA: `review.md`. | 9:16 portrait on flat `#808080`; Gemini image model or Imagen in AI Studio | ≈ 0.42:1 (shelf ≈ 78% of height, cat and plant ≈ 22% above it) | 460×1100 (2× the 210×550 px max on-screen footprint of shelf + cat + plants) | **Test only, not integrated.** For production, split into the existing layers via edits E1–E4: frame, 3 book rows, plants, cat sleeping and awake. Those match today's separate `Bookshelf`, `Plants` and `Cat` components and their animations. Dimensions to be recorded here once a file exists. |

## P0 — style lock

| Asset | Purpose | Current file | Format | Transp. | Aspect | Export px | Integration notes |
|---|---|---|---|---|---|---|---|
| **Style plate** | The whole room in one painting, used as the style reference for every later prompt. **Not shipped.** | — (`docs/design-reference.png` is the mood target, but it has UI callouts baked in) | PNG (source) | — | 16:9 | max the tool allows | Lives in `art-source/00-style-plate/`. Iterate until approved. |
| **`room-wall`** | Back wall plate: plaster + wood wainscot, ceiling-beam shadow, faint ivy, a few static details | 🟠 CSS `texture-wood-dark` on the `Room` stage | WebP | opaque | 16:9 + 15% side bleed (≈ 2.1:1) | 3000×1440 | Needs the fixed-aspect stage (visual-art-direction §9). The wall must leave the window opening as plain wall; the frame is its own layer. |
| **`desk-surface`** | Long worn desktop seen from 15° above, front-edge thickness, dark under-desk | 🟠 CSS `texture-wood` band (`Room`, bottom 38%) | WebP | α on top edge only (or opaque bottom band) | ≈ 5:1 strip | 3000×600 | Replaces the CSS band. Its top edge sets the "desk line" that desk-object slots must sit on. Also reused as a strip under each mobile vignette. |
| **`window-frame`** | Arched wooden window, glazing bars, deep sill | 🟠 CSS arch in `Window/index.tsx` | WebP | **α, glass knocked out** | ≈ 3:4 | 1200×1600 | Layered *over* the existing CSS sky, moon, stars, birds and clouds (all keep working). The glass hole is geometric, so mask it precisely in post. Replaces the CSS border and mullions. |

## P1 — hero objects

| Asset | Purpose | Current file | Status | Format | Transp. | Aspect | Export px | Integration notes |
|---|---|---|---|---|---|---|---|---|
| **Bookshelf frame** | Shelf carcass (empty shelves) → opens "My Library" | `bookshelf/bookshelf-frame.svg` 150×320 | 🔴 | WebP | α | ≈ 1:2.13 (keep) | 440×940 | Derive by editing the filled shelf to empty. Re-measure the 3 row boxes in `Bookshelf/index.tsx`. Ideally the shelf stands on the floor line behind the desk (slot move, §9). |
| **Bookshelf books ×3** | Three *distinct* rows that tilt on hover (`.bookshelf-books-layer`) | `bookshelf/bookshelf-books.svg` ×3 + `hue-rotate` | 🔴 | WebP | α | ≈ 5:3 each | 380×230 each | Cut from the filled-shelf image so they align to the frame. Name them `bookshelf-books-1/2/3.webp`. **Remove the inline `filter: hue-rotate` styles.** Mixed heights, leaning books, a small stack, a lantern or candle in one row. Blank spines. |
| **Lamp body** | Stained-glass Tiffany lamp, the scene's key light (ambient, not clickable) | `decor/lamp.svg` 90×170 | 🔴 | WebP | α | ≈ 0.7:1 | 340×480 | Paint the shade unlit or dim with visible lead lines. Bottom-anchored (`object-bottom`). Should stand on the desk. |
| **Lamp glow** | Light emitted by the shade, dimmed by time of day | CSS radial gradient in `Lamp` | 🟠 | WebP | screen | same canvas as lamp body | 340×480 | Replaces the CSS gradient div. Opacity stays bound to `--lamp-intensity-*`; add `mix-blend-mode: screen`. Pixel-aligned to the body. |
| **Easel canvas** | The painting on the easel, the "painting inside the painting" quality test; brightens on hover | `art/easel-canvas.svg` 76×96 | 🔴 | WebP | α | ≈ 4:5 | 300×380 | A small in-progress oil landscape (misty mountains and pines at dusk), visible strokes, unfinished corner. Re-measure its box in `Easel`. |
| **Easel frame** | Wooden tabletop easel → opens "My Art" | `art/easel-frame.svg` 120×240 | 🔴 | WebP | α | ≈ 1:2 | 290×560 | Derive by editing the full easel to remove the canvas. Pivot for the `sway` idle sits at the base. |
| **Easel brushes** | Brush jar (glass or ceramic) with brushes; sways | `art/easel-brushes.svg` 40×76 | 🔴 | WebP | α | ≈ 1:1.6 | 160×260 | Separate layer, same canvas as the easel, or its own tight crop with re-measured box. |
| **Palette** | Paint palette with dabs of color, beside the easel | `art/palette.svg` 40×30 | 🔴 | WebP | α | ≈ 4:3 | 200×150 | Static layer of the easel composite. |
| **Laptop body** | Open laptop, the center of the desk → opens "My Work" | `desk/laptop-base.svg` 110×90 | 🔴 | WebP | α | ≈ 1.2:1 (keep) | 420×340 | **Screen area painted plain near-black** with a thin bezel. Re-measure `SCREEN_BOX` in `Laptop/index.tsx` so the HTML screen (constellation + "My Work" label) sits exactly in the bezel. Slightly worn, warm-grey aluminium; not a glossy new MacBook render. |
| **Laptop screen** | Idle screen image under the HTML label (`.laptop-screen` brightens on hover) | `desk/laptop-screen.svg` 82×50 | 🟡 | WebP | opaque | ≈ 1.6:1 | 300×190 | Optional: a painted constellation on night-blue (`#1c2650`), matching the reference. No text (the label is HTML). Low effort once the body exists. |

## P2 — desk set and wall set (remaining interactive objects)

| Asset | Purpose | Current file | Status | Format | Transp. | Aspect | Export px | Integration notes |
|---|---|---|---|---|---|---|---|---|
| **Phone base** | Brass-and-black rotary phone body + dial → opens "Let's talk" | `desk/phone-base.svg` 90×90 | 🔴 | WebP | α | ≈ 1.1:1 | 260×240 | Generate the full phone first; derive the base by editing out the handset (empty cradle visible). 10 finger holes. |
| **Phone handset** | Lifts on hover and on ring (`.phone-handset-layer`) | `desk/phone-handset.svg` | 🔴 | WebP | α | same canvas as base | 260×240 | Cut from the full phone, **same canvas and position** as the base, so the CSS lift starts from the cradle. |
| **Phone cord** | Curly cord, sways (`.phone-cord-layer`) | `desk/phone-cord.svg` | 🔴 | WebP | α | same canvas as base | 260×240 | Cut from the full phone. Optionally merge into the base if a clean cut is impossible; the sway is subtle. |
| **Coffee cup** | Cup and saucer with a crescent-moon motif → opens "About Me" | `desk/coffee-cup.svg` 70×70 | 🔴 | WebP | α | ≈ 1.15:1 | 200×175 | Ceramic, warm glaze, dark coffee visible from the 15° view. |
| **Coffee steam** | Rising steam (`.coffee-steam`, more visible on hover) | `desk/coffee-steam.svg` | 🔴 | WebP | screen | ≈ 1:1.4 | 140×200 | Soft wisps on black; add `mix-blend-mode: screen`. The existing sway animation stays. |
| **Journal pages** | Open journal: sketches, handwriting-like *marks* (not real text), pressed leaf → opens "Find me elsewhere" | `desk/journal-pages.svg` 80×70 | 🔴 | WebP | α | ≈ 1.6:1 (wider than today) | 440×280 | Today's 80:70 makes the journal too square; re-measure `aspect` and the pen box. Leather cover edges visible. |
| **Journal pen** | Fountain pen, lifts on hover (`.journal-pen-layer`) | `desk/journal-pen.svg` | 🔴 | WebP | α | same canvas as pages | 440×280 | Derive pages-without-pen by editing; cut the pen from the original. |
| **Movie poster** | Framed vintage-style fantasy film poster → opens "Cinema" | `decor/movie-poster.svg` 90×150 | 🔴 | WebP | α | ≈ 2:3 | 260×390 | **Imagery only, no title text** (the hover label carries the name). Painted dark castle under a moon, aged paper, thin gilt frame. |
| **Memory wall** | One painted cluster of 4–5 distinct pinned photos and postcards → opens "Memories" | `decor/photo-frame.svg` instanced ×4 | 🔴 | WebP | α | ≈ 6:5 | 480×400 | Replaces the 4 `<img>`s in `MemoryWall/index.tsx` with one image (small code change). Sepia and faded photos of places and moments, no faces in focus, washi tape and pins. |
| **Plushie** | Soft forest-spirit plush, totoro-*like* but original (no copyrighted character) → opens "Anime & Manga" | `decor/plushie.svg` 90×90 | 🔴 | WebP | α | ≈ 1:1.1 | 210×230 | Felt or fur texture, stitched seams, slightly worn. **No dot-eye cartoon face.** Must not be an identifiable trademarked character. |

## P3 — companions and ambience

| Asset | Purpose | Current file | Status | Format | Transp. | Aspect | Export px | Integration notes |
|---|---|---|---|---|---|---|---|---|
| **Cat — sleeping** | Ginger tabby curled asleep on top of the bookshelf (ambient; occasional stir via `data-stir`) | `bookshelf/cat.svg` 110×80 | 🔴 | WebP | α | ≈ 1.8:1 | 280×160 | Rename to `cat-sleeping.webp`. Fur strokes, tail over nose. Its bottom edge must sit flat on the shelf top. |
| **Cat — awake** | Same cat, head raised and eyes half-open, **same position and canvas** | ⬜ none | ⬜ | WebP | α | same as sleeping | 280×160 | Derive by editing the sleeping image. Integration: crossfade during "stir" or the bookshelf glance (small `Cat` change). |
| **Plants** | Trailing pothos and a small potted plant on top of the shelf; sways | `bookshelf/plants.svg` 80×80 | 🔴 | WebP | α | ≈ 1:1.2 | 190×230 | Trailing vines hang *down* over the shelf edge (the reference look). Terracotta pot. |
| **Curtain** | Heavy velvet curtain panel, gathered with a tie-back; mirrored for the right side; sways from the top | `window/curtain.svg` 70×300 | 🔴 | WebP | α | ≈ 1:4.5 | 200×920 | Must look right when flipped with `scaleX(-1)` (no asymmetric light baked in; light it nearly frontally). Deep oxblood or forest green, worn velvet. |
| **Art wall** | Cluster of 3 small framed paintings above the easel (ambient) | `art/gallery-painting-1/2/3.svg` | 🔴 | WebP | α | ≈ 0.7:1 | 330×470 | One composed cluster image replacing the 3 `<img>`s in `ArtWall` (small code change). Mixed frames: gilt, dark wood, unframed canvas. Moonlit landscape, a lighthouse, a still life. |
| **Fairy lights** | String of warm bulbs swagged across the top of the window and wall | ⬜ none | ⬜ | WebP | α | ≈ 8:1 | 2400×300 | New ambient layer (new slot). Bulbs painted unlit-warm. |
| **Fairy glow** | Bloom for the bulbs; twinkle via CSS opacity | ⬜ none | ⬜ | WebP | screen | same canvas as the string | 2400×300 | Animate opacity per segment, or the whole layer with `flicker` idle. |

## P4 — nice-to-have / depends on unbuilt features

| Asset | Purpose | Current file | Status | Format | Transp. | Aspect | Export px | Integration notes |
|---|---|---|---|---|---|---|---|---|
| Cloud | Drifting cloud in the window during cloudy or rain weather | `window/cloud.svg` 220×90 | 🔴 | WebP | screen (night) / α | ≈ 2.4:1 | 440×180 | **Weather never changes today** (nothing calls `setWeather`), so this is invisible. Do it after weather is wired. |
| Moon halo | Soft glow around the CSS moon | ⬜ (CSS box-shadow today) | ⬜ | WebP | screen | 1:1 | 200×200 | Optional polish. |
| Window view | Distant spires and lit town windows under the sky (the reference's view) | ⬜ | ⬜ | WebP | α (sky transparent) | matches the glass | 1100×800 | Sits between the CSS sky and the window frame. Needs day and night variants or a dim/brighten overlay. A decision for later. |
| Laptop panel wallpaper | Desktop background inside the "My Work" panel | `desk/laptop-wallpaper.jpg` 1920×1071 | 🟡 | WebP | opaque | 16:9 | 1920×1080 | Generic gradient blobs; replace with a painted night-sky or desk-view wallpaper in the scene's style. Referenced from `styles/textures.css`. |
| Gallery bust / plant | Decor inside the Art panel's gallery wall | `art/gallery-bust.svg`, `art/gallery-plant.svg` | 🔴 | WebP | α | ≈ 1:2 | 140×300 | Panel-only; repaint after the room. Used by `ArtGallery/GalleryWall.tsx`. |

## Unused files (do not ship; keep until a cleanup task)

| File | Note |
|---|---|
| `desk/journal.svg` ⚪ | Pre-split single journal, superseded by `journal-pages` + `journal-pen`. No references. |
| `desk/phone.svg` ⚪ | Pre-split single phone, superseded by the 3 phone layers. Referenced only by the `data/assets.ts` catalog, not rendered. |

---

## CSS systems (not image assets)

| System | Where | Verdict |
|---|---|---|
| Sky gradient per time of day | `Background`, `--sky-*` tokens | 🟡 Keep. It shows through the knocked-out window glass. |
| Moon, stars, birds | `Window`, `Birds` | 🟡 Keep; repositioned to sit behind the new frame. |
| Ambient particles (dust, fireflies, rain, snow) | `AmbientLayer` | 🟡 Keep; tune colors to the new art. |
| Wall and desk textures | `styles/textures.css` | 🟠 Replaced by the `room-wall` and `desk-surface` plates (kept as fallback while images load). |
| Room glow and vignette | `Room` overlays | 🟡 Keep; retune strength once painted lighting exists. |

## Asset count

28 SVG files plus 1 JPG today. P0–P3 add up to **32 painted
deliverables**: 3 plates, 12 hero layers, 10 desk/wall layers and 7
companion/ambience layers. Three of those are screen-blend fx layers (lamp
glow, coffee steam, fairy glow). There's also 1 unshipped style plate.
Many layers are derived by editing a parent image (§10 of the art
direction), so there are roughly **18 distinct generations**.
