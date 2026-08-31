# Room visual asset architecture

Audit-then-build deliverable per CLAUDE.md §4. This document is the asset
counterpart to `docs/adding-interactive-objects.md`: that doc says how a room
object is *wired*; this one says what its *art* is, where it lives, and how
it's meant to move. No component was changed to consume the new files below —
that's the next task.

Primary visual reference: `docs/design-reference.png`.

## 1. What already existed

Before this task, `public/images/` was empty (`.gitkeep` only). Every object
in the room (`src/components/<Object>/index.tsx`) rendered a generic
`lucide-react` icon inside `ObjectMount`, a textured plaque — explicitly
labeled in `ObjectMount.tsx` as a placeholder to "swap for hand-illustrated
art later." Backgrounds (walls/desk/floor) were already CSS-only: flat
gradient "textures" in `src/styles/textures.css`, also explicitly commented
as a stand-in to swap later "without touching the components." The room's
sky, moon, and stars (`Background`, `Window`) and its dust/firefly/snow
particles (`AmbientLayer`) were already pure CSS/DOM, no images.

So the real gap wasn't "no architecture" — `Room`'s slot-based composition
(`OBJECT_SLOTS`) and `InteractiveObject`'s idle/hover system already satisfy
CLAUDE.md §3's "independent layers" principle at the *component* level. The
gap was purely visual: nothing looked like the reference. This task closes
that gap one level down, at the *asset* level.

## 2. Decisions by category

### Background (walls, desk/floor, general environment)

**Decision: keep CSS, don't add images.** `texture-wood`, `texture-wood-dark`,
`texture-paper`, `texture-cream` (gradients) and `Background`'s per-time-of-day
sky gradient already do this job at zero image weight and infinite
resolution. Reusable as-is. `public/images/background/` was created as a
placeholder directory for a **future, optional** enhancement — a small
tileable wood-grain/plaster noise texture (~128×128, multiply-blended over
the existing gradient at low opacity) — but none was added now: a full-room
background painting would violate "don't create huge images," and the
current gradients already read as intentionally stylized rather than
unfinished. Revisit only if the flat-gradient look feels too flat next to
illustrated objects.

### Interactive objects

Every object below moved from "reuse the lucide icon" to "replace it" —
none of the placeholder icons matched the storybook/painterly tone, so
none were reusable as final direction. What differs per object is *how many
layers* and *what animates*. All new art is SVG (see §3 for why) and lives
under `public/images/objects/<id>/`.

| Object | Layers created | Why split (or not) | Animation approach |
|---|---|---|---|
| **bookshelf** + **books** | `bookshelf-frame.svg`, `bookshelf-books.svg` | Books sit on a separate layer so the shelf's lantern glow can pulse without repainting the whole carcass. | Wrapper-level CSS idle (`breathe`, already wired) + future per-layer glow pulse on the books layer. |
| **plants** | `plants.svg` | Single layer — pot+leaves are cheap enough to move as one unit. | Wrapper-level CSS `sway`. |
| **cat** | `cat.svg` (sleeping pose) | Single layer for now. | Wrapper-level CSS `breathe`. Marked `state-swap` in the manifest — CLAUDE.md's "sometimes the cat wakes up" needs an *awake* pose swapped in by scene state, which is DOM/state work, not something one static image can do — flagged as a missing asset (§4). |
| **easel** + **paintings** (canvas) + **brushes** | `easel-frame.svg`, `easel-canvas.svg`, `easel-brushes.svg` | Three independent things a viewer's eye separates in the reference: the wooden structure, the in-progress painting, and the brush jar. Splitting them means the current painting can be swapped without touching the easel, and the brushes can get their own hover reaction. | Frame/canvas static; brushes marked hover-reactive. |
| **artGallery** (wall paintings) | `art-gallery/painting-1.svg` | **One** frame asset, reused 2–3× at different positions with a CSS `filter: hue-rotate()`/`brightness()` per instance for variety — deliberately *not* one file per painting, per "don't create dozens of expensive layers." | Static; ambient lamp-glow (already a Room-level radial gradient) falls across it, no per-object animation needed. |
| **laptop** + **laptop screen** | `laptop-base.svg`, `laptop-screen.svg` | The screen is the one part of the laptop that must change independently (glow brighter on hover, eventually different copy) — same reasoning as CLAUDE.md §3's "independent layers" principle, applied inside a single object. | Base static; screen `hover-reactive`. Screen *text* ("My Projects", "click to enter") is baked into the placeholder SVG for now — recommend moving it to real DOM/HTML in the final version so copy changes don't require re-exporting art. |
| **coffee cup** | `coffee-cup.svg` | Single layer. | Wrapper-level CSS `float`. No steam layer — see §4. |
| **journal** | `journal.svg` | Single layer. | Wrapper-level CSS `float`. |
| **rotary phone** | `phone.svg` | Single layer — it's one solid brass object in the reference, no part of it needs to move independently. | Wrapper-level CSS `flicker`/bob. |
| **photo frames** (memoryWall) | `memory-wall/photo-frame.svg` | Same reuse-over-duplication call as artGallery: one frame, instanced in a small grid. | Static. |
| **movie poster** | `movie-poster.svg` | Single layer. | Static; same ambient-glow-not-self-animation reasoning as artGallery. |

None of these are "huge" — every file above is a few KB of vector paths, no
raster exports, no per-object filter/blur stacks.

### Ambient elements

| Element | Status before | Decision |
|---|---|---|
| Moon, stars | Already implemented, pure CSS (circle + box-shadow / flickering dots) in `Window`. | Reuse, unchanged. No image. |
| Dust motes, fireflies | Already implemented, `AmbientLayer` (CSS-driven spans). | Reuse, unchanged. No image. |
| Snow | Already implemented (`AmbientLayer` variant="snow", plain dot). | Reuse. A dedicated snowflake shape would be cosmetic at particle size — not worth a new asset. |
| Rain | **Missing** — `AmbientEffects`'s own comment says weather `"rain"` has no dedicated variant and silently falls back. | No image needed: add a `"rain"` `AmbientVariant` to `AmbientLayer` using elongated fast-falling CSS gradient streaks, the same particle-span pattern as dust/snow. Flagged in §4, not built (that's implementation, out of scope here). |
| Light rays | **Missing.** | No image needed: a low-opacity `linear-gradient`/`conic-gradient` beam behind the window, blend-mode `screen`. CSS-only, flagged in §4. |
| Clouds | **Missing** — no cloud rendering existed at all. | Created `ambient/cloud.svg`, one asset, meant to be instanced 2–3× at different scale/opacity/drift-speed via CSS (same `room-drift` keyframe family already used for dust). |
| Curtains | **Missing** — no curtain component/art existed. | Created `ambient/curtain.svg`, one asset; the reference's second curtain panel is the same file mirrored with `scaleX(-1)`, not a second file. |
| Foliage movement | Covered by `Plants`' existing sway. | Reuse; no new asset. Window-frame ivy (visible in the reference, climbing the window) is a separate decorative flourish — deferred, see §4. |

## 3. Why SVG, and the size discipline

Every placeholder created is hand-authored SVG (flat shapes + a few
gradients), not PNG/WebP exports, because:

- **Resolution-independence** — objects scale with the room stage
  (`OBJECT_SLOTS`' `clamp()` boxes already resize per viewport); a raster
  asset would need multiple exports to stay sharp, a vector one doesn't.
- **Size** — every file here is under ~2 KB. A dozen of these together cost
  less than one JPEG hero image.
- **Themeable** — flat vector shapes can be re-tinted per time-of-day
  (`fill: currentColor` + CSS, or a `filter: hue-rotate()`) without
  re-exporting art, the same way `Background`'s sky already swaps CSS
  variables instead of swapping images.
- **Consistent with the codebase's existing bias** — `textures.css` and
  `AmbientLayer` already chose CSS/DOM over images wherever possible; SVG for
  the object layer is the same instinct applied one level down.

**If/when real illustrated (painted) art replaces a placeholder** and it's
too detailed to stay vector, switch that *specific* object to raster, but:
cap intrinsic dimensions at roughly 2× its largest rendered CSS size (read
the max off `OBJECT_SLOTS`' `clamp()` upper bound in `Room/index.tsx`), export
WebP, and suffix `@2x` only if a genuine retina variant is needed. Don't
raster the whole scene at once — objects stay independently swappable, per
CLAUDE.md §3.

## 4. Folder structure & naming convention

**Superseded by the §9 reorg below** — kept here for the historical record
of the original per-object layout. Current structure, grouped by where
things sit in the *scene* rather than one folder per object:

```
public/assets/scene/
├── background/   reserved, empty — see §2
├── window/       cloud.svg, curtain.svg
├── bookshelf/    bookshelf-frame.svg, bookshelf-books.svg, cat.svg, plants.svg
├── art/          easel-frame.svg, easel-canvas.svg, easel-brushes.svg, gallery-painting-1.svg
├── desk/         laptop-base.svg, laptop-screen.svg, coffee-cup.svg, journal.svg, phone.svg
├── decor/        lamp.svg, plushie.svg, movie-poster.svg, photo-frame.svg
└── ambient/      reserved, empty — see §2
```

See `docs/asset-inventory.md` for the full per-file audit (this is now the
canonical place to look up "where does a new asset go" and "what state is
each current file in") and its Directory structure section for the
category rationale. Original per-object convention, still true for
filenames within a category:

- Multi-layer objects prefix each file with the object name
  (`bookshelf-frame.svg`, `bookshelf-books.svg`) so files stay unambiguous
  even sitting alongside other objects' files in the same category folder.
- This mirrors the data layer's own naming: `src/data/sceneObjects.ts` is the
  content source of truth; `src/data/assets.ts` (see §5) is the visual
  source of truth, keyed by the same ids, now with a `category` field that
  matches the folder above.

## 5. Data layer: the asset manifest

Added `src/types/assets.ts` + `src/data/assets.ts`, mirroring the existing
`types/scene.ts` + `data/sceneObjects.ts` pattern. `objectAssets` lists, per
object, its layers in back-to-front order — each with its file path,
intrinsic size, and a `motion` hint (`static | idle-css | hover-reactive |
state-swap`) describing how that *specific layer* is meant to move,
independent of the object's overall idle animation (which stays owned by
`InteractiveObject`, per `docs/adding-interactive-objects.md`).

This file is **not imported anywhere yet** — it's a catalog for whoever
replaces `ObjectMount`'s icon-on-a-plaque body with real art next, so that
task is "look up the object in `objectAssets`, render its layers" instead of
re-deriving file paths and sizes from scratch.

## 6. Missing / deferred assets

Things the reference calls for that don't have art yet, in priority order:

1. **`lamp` and `plushie` aren't registered `SceneObjectId`s.** The design
   reference's callout cards and this task's brief both list them as
   objects with a story, but CLAUDE.md §2's click-mapping table never
   assigns either one a panel — lamp is only mentioned under "Living
   environment" (on/off by time of day), and plushie isn't mentioned there
   at all. Placeholder art was still created for both
   (`objects/lamp/lamp.svg`, `objects/plushie/plushie.svg`) so it's ready,
   but **this is a data-layer decision for the user/next task**, not
   something to resolve silently: either (a) lamp stays a non-clickable
   light source (extend `Background`/`Window`'s time-of-day pattern instead
   of `InteractiveObject`) and plushie gets a panel (likely folds into
   "writings" alongside the bookshelf's anime/manga content, per the
   reference caption "Anime, mangas & comfort characters"), or (b) both get
   promoted to full `SceneObjectId`s with their own panels. Either way,
   update `SceneObjectId`, `sceneObjects.ts`, and `OBJECT_SLOTS` together
   per `docs/adding-interactive-objects.md`.
   - Note: the reference image's plushie resembles a specific
     copyrighted/trademarked anime character. The placeholder created here
     (`plushie.svg`) is a deliberately original round-eared design, not a
     likeness of that character — keep any future replacement art original
     too.
2. **Cat awake/asleep state swap** — needs a second pose asset plus scene
   state to trigger it (CLAUDE.md: "occasionally the cat wakes up"). Not
   buildable from a single static layer.
3. **Rain particle variant** — `AmbientLayer` needs a `"rain"` variant (CSS
   streaks, no image asset required).
4. **Light rays** — CSS gradient beam through the window, no image asset
   required.
5. **Coffee steam** — a DOM/CSS wisp (small blurred shape, opacity+rise
   loop), not a static image; the current `coffee-cup.svg` has no steam
   baked in on purpose.
6. **Window-frame ivy** — decorative vine climbing the window frame, visible
   in the reference. Lower priority than the core object set; no asset
   created yet.
7. **Background texture image** (wood-grain/plaster overlay) — optional,
   see §2; current CSS gradients are sufficient for now.

## 7. Build/lint status

`npm run build` and `npm run lint` both pass with the new files in place —
nothing here changed any component's imports or rendering, only added new
files under `public/images/`, `src/types/assets.ts`, and `src/data/assets.ts`
(both currently unimported, so they add zero runtime weight).

## 8. Update: art is now wired in

The section below described this task's original scope, when no component
yet rendered any of this art. A follow-up task ("build the first complete
visual version of the room") has since wired all of it in — every object
component renders its real art (via `LayeredArt` for multi-layer objects,
a plain `<img>` otherwise), `Room/index.tsx`'s `OBJECT_SLOTS` were
repositioned into the CENTER/LEFT/LOWER-LEFT/RIGHT composition, and `Lamp`
and `Curtain` (non-interactive, decorative — same open question on `lamp`
as a `SceneObjectId` from §6) were added. `ObjectMount` is no longer used
by any object but remains available as a primitive. `objectAssets` in
`src/data/assets.ts` is still accurate as a reference, just no longer
purely aspirational.

Still not done, unchanged from the original scope:

- No new `AmbientVariant`s (rain) or CSS keyframes were added.
- Cat awake/asleep state swap, light rays, coffee steam, window-frame ivy —
  all still deferred per §6.

*(Correction, made during the §9 reorg below: the bullet that used to be
here claiming "plushie isn't in the room yet" was stale — a later task did
add it as a real `SceneObjectId` with a panel and a `Room` slot. Removed
rather than left wrong.)*

## 9. 2026 reorg: `public/images/objects/<id>/` → `public/assets/scene/<category>/`

A later visual-quality/architecture audit (this task) moved every asset
file from the per-object layout in §4 into the category layout shown at the
top of §4 now. Nothing in §1–§8 above is wrong about *why* the original
decisions were made (SVG over raster, reuse-over-duplication, the
static/idle-css/hover-reactive/state-swap motion vocabulary) — only the
directory layout and file paths changed:

- **Why:** a fresh art-direction audit (prompted by comparing the room
  against `docs/design-reference.png` again) asked for asset folders
  grouped by where things sit in the scene (`bookshelf/`, `art/`, `desk/`,
  `decor/`, `window/`, plus reserved `background/`/`ambient/`), matching
  how a future artist would actually think about the room, rather than one
  folder per interactive component.
- **What moved:** every file, 1:1, no re-drawing — see
  `docs/asset-inventory.md` for the full before/after mapping and a
  per-asset audit (acceptable vs. placeholder vs. needs replacement).
  `objects/art-gallery/painting-1.svg` was renamed to
  `art/gallery-painting-1.svg` in the move (still unused/orphaned, see
  inventory).
- **What didn't change:** every component still holds its own `src`
  literal rather than reading from `src/data/assets.ts`'s manifest — same
  "catalog, not wiring" status as before, just now with an added
  `category` field on each manifest entry so it cross-references the new
  folders. Centralizing components to read from the manifest was
  considered and deliberately deferred (out of scope for an audit-only
  task; see CLAUDE.md §4's "land it incrementally").
- **Verification:** `npm run build` and `npm run lint` both pass; the room
  was checked in-browser to confirm every object still renders and click
  interactions (opening a panel) still work post-move.
- **New docs added alongside this reorg:** `docs/art-direction.md` (color/
  material/lighting/texture/style guide derived from the reference) and
  `docs/asset-inventory.md` (the per-asset audit + missing-assets table) —
  this file's job stays "why the architecture looks like this," not the
  audit itself.
