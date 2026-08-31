# Visual asset inventory

Audit of every visual asset in the illustrated room, against
`docs/design-reference.png` (the art-direction target) and
`docs/art-direction.md` (the style guide derived from it).

**Headline finding: every object asset in the room today is a placeholder.**
All of them are hand-authored flat-vector SVGs — solid shapes, at most a
two-stop linear gradient, no painterly texture, no directional light
modeling. They are structurally fine (correctly split into independent,
transparent, appropriately-sized layers — see `docs/asset-architecture.md`)
but visually they read as generic vector/icon art, not the "illustrated
fantasy artist's study" the reference calls for. **None of them should be
treated as a style to match** when adding new objects — see the note added
to `docs/adding-interactive-objects.md`.

This document doesn't change that today — per this task's scope, existing
placeholders stay in place until real illustrated art replaces them. It
records, per asset: is it acceptable as final art, is it a placeholder, can
it stay independent, does it need transparency, what size/aspect ratio, and
whether it needs multiple animation layers — plus a table of assets the
reference calls for that don't exist yet at all.

## Directory structure

```
public/assets/scene/
├── background/   reserved, empty — walls/desk/floor are CSS (textures.css), not images
├── window/       cloud.svg, curtain.svg — sky dressing around the window
├── bookshelf/    bookshelf-frame.svg, bookshelf-books.svg, cat.svg, plants.svg
├── art/          easel-frame.svg, easel-canvas.svg, easel-brushes.svg, gallery-painting-1.svg
├── desk/         laptop-base.svg, laptop-screen.svg, coffee-cup.svg, coffee-steam.svg, journal.svg, phone.svg
├── decor/        lamp.svg, plushie.svg, movie-poster.svg, photo-frame.svg
└── ambient/      reserved, empty — dust/firefly/snow/ember particles are CSS (AmbientLayer), not images
```

Grouped by where things sit in the scene (matching this task's own worked
example), not strictly one folder per `SceneObjectId` — `cat`/`plants` live
under `bookshelf/` because that's where they sit on top of the shelf, not
because they're part of the bookshelf object itself.

Every file is referenced by exactly one component (see
`docs/asset-architecture.md` for why paths are still literals in each
component rather than read from `src/data/assets.ts`'s manifest) — the
manifest mirrors this structure and adds a `category` field for
cross-reference.

## Background

Not image assets — `texture-wood`, `texture-wood-dark`, `texture-paper`,
`texture-cream` (CSS gradients, `src/styles/textures.css`) and per-time-of-day
sky gradients (`Background`/`Window`, CSS custom properties in
`variables.css`). This is a deliberate choice, not a gap: flat CSS gradients
at zero image weight and infinite resolution read as intentionally
stylized, not unfinished, and match the "restrained dark tones" of the
reference's wall/floor areas reasonably well already.

| Question | Answer |
|---|---|
| Acceptable? | Acceptable as-is for now — not the priority replacement target. |
| Placeholder? | Semi — works, but a subtle tileable wood-grain/plaster texture image (multiply-blended over the gradient) would close some of the gap to the reference's tactile walls. |
| Needs replacement? | Low priority — see missing-assets table. |
| Independent? | Yes, pure CSS, already decoupled from every object. |
| Transparency? | N/A. |
| Dimensions | N/A (CSS). If a tileable texture is added: ~128×128–256×256, seamless tile. |
| Multi-layer? | No. |

## Window

| Asset | File | Acceptable? | Placeholder? | Independent? | Transparency? | Dimensions | Multi-layer? |
|---|---|---|---|---|---|---|---|
| Window frame, sky, moon, stars | *(CSS/DOM — `Window`, `Background`)* | Acceptable for now | Semi — flat gradient sky + CSS circle moon + box-shadow stars is stylized but not painterly | Yes | N/A | N/A | No — moon/stars are separate DOM nodes already, i.e. already layered |
| Clouds | `window/cloud.svg` | **No** | Yes | Yes | Yes (SVG, no bg rect) | 220×90 (viewBox) | No — single shape |
| Curtain | `window/curtain.svg` | **No** | Yes | Yes | Yes | 70×300 | No — one file, mirrored via `scaleX(-1)` for the second panel |
| Precipitation (rain) | *(none — missing)* | — | — | — | — | — | — |

Cloud is **prepared but unused** — no component currently renders it (no
cloud-drift feature exists in `Room`/`Window` yet). Curtain is wired in
(`Curtain/index.tsx`) and visible in the room.

## Bookshelf

| Asset | File | Acceptable? | Placeholder? | Independent? | Transparency? | Dimensions | Multi-layer? |
|---|---|---|---|---|---|---|---|
| Shelf carcass | `bookshelf/bookshelf-frame.svg` | **No** — flat rects + one linear gradient, no wood grain | Yes | Yes | Yes | 150×320 | Own layer (frame vs. books split already) |
| Books | `bookshelf/bookshelf-books.svg` | **No** | Yes | Yes, but see flag below | Yes | 150×90 | Own layer |
| Cat (sleeping) | `bookshelf/cat.svg` | **No** — flat blob shape, not fur/painterly | Yes | Yes | Yes | 110×80 | Single; needs a **second** awake-pose layer for the state-swap CLAUDE.md calls for |
| Plants | `bookshelf/plants.svg` | **No** | Yes | Yes | Yes | 80×80 | Single |

**Flag:** `Bookshelf/index.tsx` currently renders `bookshelf-books.svg`
**three times** at different shelves, using `hue-rotate()`/`brightness()`
CSS filters and a horizontal mirror to fake variety from one file. This is
exactly the "compensate with filters instead of real art" pattern this
task's brief warns against — it wasn't introduced by this task, it predates
it, but it's now tracked here so a real-art pass replaces it with either
three distinct book-spine illustrations or one wider illustrated shelf
image, not more filter tricks. Left unchanged for now — fixing it is a
component-level change out of this task's audit-only scope.

## Art (easel corner)

| Asset | File | Acceptable? | Placeholder? | Independent? | Transparency? | Dimensions | Multi-layer? |
|---|---|---|---|---|---|---|---|
| Easel frame | `art/easel-frame.svg` | **No** | Yes | Yes | Yes | 120×240 | Own layer |
| Canvas (in-progress painting) | `art/easel-canvas.svg` | **No** — needs to look like an actual painting (the reference shows a detailed mountain landscape); current version is a flat 3-shape placeholder | Yes | Yes — swappable alone, this is the highest-visual-impact single swap in the whole room | Yes | 76×96 | Own layer |
| Brushes | `art/easel-brushes.svg` | **No** | Yes | Yes | Yes | 40×76 | Own layer, hover-reactive |
| Wall gallery painting | `art/gallery-painting-1.svg` | **No** | Yes | Yes | Yes | 70×100 | — |
| Palette | *(none — missing)* | — | — | — | — | — | — |

`gallery-painting-1.svg` is **orphaned** — not imported by any component.
The `ArtGallery` object that used to render it was deliberately removed
(see memory: user judged the easel already covers "Art," a second wall
gallery was redundant). File kept on disk per the project's don't-delete
convention; not part of the live scene. If a real wall-gallery feature is
reconsidered later, this is where its art would go.

## Desk

| Asset | File | Acceptable? | Placeholder? | Independent? | Transparency? | Dimensions | Multi-layer? |
|---|---|---|---|---|---|---|---|
| Laptop chassis | `desk/laptop-base.svg` | **No** | Yes | Yes | Yes | 110×90 | Own layer |
| Laptop screen | `desk/laptop-screen.svg` | **No** — flat constellation graphic | Yes | Yes, hover-reactive (brightness on hover/focus) | Yes | 82×50 | Own layer. Text moved out to a real DOM overlay (2026-08-31, "My Work" laptop interface task) — the SVG itself no longer carries any copy |
| Coffee cup | `desk/coffee-cup.svg` | **No** | Yes | Yes | Yes | 70×70 | Own layer — steam split out below (2026-08-31, the "About Me" entrance task) |
| Coffee steam | `desk/coffee-steam.svg` | **No** — same flat-vector caveat as everything else | Yes | Yes, hover-reactive (opacity 0.55→0.85, `.coffee-steam` in animations.css) | Yes | 70×70, same viewBox as the cup so it overlays exactly | Own layer, idle `sway` |
| Journal | `desk/journal.svg` | **No** | Yes | Yes | Yes | 80×70 | Single |
| Phone (rotary) | `desk/phone.svg` | **No** — reference's phone is an ornate brass/bakelite object, current version is a flat circle+rect | Yes | Yes | Yes | 90×90 | Single |

## Decor

| Asset | File | Acceptable? | Placeholder? | Independent? | Transparency? | Dimensions | Multi-layer? |
|---|---|---|---|---|---|---|---|
| Lamp | `decor/lamp.svg` | **No** — reference's stained-glass Tiffany-style shade is a signature light source, current version is a flat cone | Yes | Yes, hover-reactive | Yes | 90×170 | Single art layer + separate CSS glow (already split — glow is a DOM div, not baked into the SVG) |
| Plushie | `decor/plushie.svg` | **No** | Yes | Yes | Yes | 90×90 | Single. Deliberately an original design, not a likeness of any copyrighted character — keep any replacement original too |
| Movie poster | `decor/movie-poster.svg` | **No** | Yes | Yes | Yes | 90×150 | Single |
| Photo frame | `decor/photo-frame.svg` | **No** | Yes | Yes | Yes | 60×60 | Single, reused 4× in a loose grid (`MemoryWall`) — reuse-over-duplication, not a filter hack, so not flagged like the bookshelf case |

## Ambient (particles)

No image assets exist or are needed here — dust motes, fireflies, and snow
are CSS spans (`AmbientLayer`, `src/styles/animations.css`'s `room-drift`
keyframe), which is the right call at particle size (a few px, often
blurred/glowing) where a raster/vector asset would add weight without a
visible quality gain. Reserved directory kept empty for a genuinely
image-shaped future particle (e.g. a detailed snowflake or ember sprite),
not populated speculatively.

## Animation compatibility (architecture audit, not new animation)

Per this task's scope, this is a check of whether the *architecture*
already has a hook for each animation type — not new animation work. For
every object, six kinds of motion/interaction are worth considering:

| Kind | Architecture status | Notes |
|---|---|---|
| Idle animation | ✅ Built, required | Every object already sets a non-`"none"` `IdleAnimation` via `InteractiveObject` (`sway\|float\|flicker\|breathe`, `src/styles/animations.css`). Adding an object without one is a checklist violation per `docs/adding-interactive-objects.md`, not a missing capability. |
| Hover animation | ✅ Built | `HoverEffect` (`glow\|tilt\|wiggle\|lift`) on every object, same primitive, auto-downgraded under reduced motion. |
| Click animation | ⚠️ Partial | Clicking opens a panel (`sceneActions.openPanel`) — that part's built and works. There's no dedicated "press" micro-animation on the object itself before the panel opens (no `:active` scale/squash on `InteractiveObject`'s button, unlike `Common/Button`'s `active:scale-[0.985]`). Would slot naturally into the same `data-hover`-style attribute pattern if added later — architecture supports it, just isn't there yet. |
| Parallax | ✅ Built, automatic | `ParallaxLayer` wraps every slot in `Room/index.tsx`'s `OBJECT_SLOTS` already, driven by one pointermove listener at the `Room` root (`--pointer-x`/`--pointer-y`). A new object gets parallax for free by being added to `OBJECT_SLOTS` — no per-object work. |
| Lighting interaction | ⚠️ Partial | `Room` sets a scene-wide `--room-glow` radial gradient per time-of-day, and `Lamp` has its own local glow div — both real, both working. But no object *reads* `--room-glow` to modulate its own brightness/tint (e.g. a book spine looking warmer when the lamp glow falls near it); each object's art is currently lit "flat," independent of the room's light state. Would need each object's art (once painterly) to either bake in a fixed light direction consistent with the lamp/window, or expose a brightness/tint hook keyed to `--room-glow` — an art + small CSS decision for a future task, not blocked by anything structural today. |
| Particle interaction | ❌ Not supported | `AmbientLayer` is scene-global (dust/firefly/snow), mounted once in `Room`, not per-object. There's no hook for an object to emit or attract particles (e.g. dust kicked up on click, a firefly landing on a plant). Would need a small new primitive (an `AmbientLayer` instance scoped to one object's box, or a shared particle-emit action objects can call) — not built, not currently blocking anything since no current object needs it. |

## Missing assets (referenced by the design brief, not built yet)

None of these need a new crude placeholder per this task's rule — build the
feature with CSS/DOM where noted, or leave unbuilt and pick from this list
when scoping the next visual task.

| Asset | Desired style | Dimensions | Transparency | Used where | Interaction requirements |
|---|---|---|---|---|---|
| Cat — awake pose | Painterly, matches sleeping pose's palette/line weight | ~110×80, same box as sleeping pose | Yes | `Cat` component, swapped in by scene state | State-swap, not hover — triggered by an idle timer or time-of-day per CLAUDE.md ("occasionally the cat wakes up"); needs a bit of scene-state design before it's just an asset problem |
| Rain particle variant | Not an image — elongated fast-falling CSS gradient streaks, same particle-span pattern as dust/snow | N/A | N/A | `AmbientLayer` (`variant="rain"`) | Weather-driven, matches `WeatherCondition` already in `types/scene.ts` |
| Light rays through window | Not an image — low-opacity conic/linear gradient beam, `blend-mode: screen` | N/A | N/A | `Window` or `Room` | Static or slow-drift, time-of-day gated (dawn/dusk only, per reference) |
| Window-frame ivy | Painterly vine/leaf illustration climbing the window frame | Tall, narrow — roughly matches window frame height | Yes | `Window`, decorative overlay | Idle sway, low priority |
| Palette (easel) | Small ceramic/wood paint palette with visible pigment daubs | ~40×30 | Yes | `Easel`, alongside brushes | Static or hover-reactive, matches brushes' treatment |
| Background wood/plaster texture | Subtle tileable grain/noise, multiply-blended | ~128×128–256×256, seamless tile | Yes (if layered over gradient) or N/A (if baked as a repeating pattern) | `textures.css`, behind all objects | None — ambient only |
| Fairy lights | String-light strand with warm glow bulbs, per CLAUDE.md's "warm magical lighting (fairy lights, a lamp)" | Long, thin — draped across a wall/window span | Yes | Not yet assigned a component | Idle twinkle, no click |

## Cross-references

- **Style target:** `docs/art-direction.md` — color, material, lighting,
  texture, and style guidance derived from `docs/design-reference.png`.
- **Why SVG, folder/naming rationale, per-layer motion manifest:**
  `docs/asset-architecture.md`.
- **How to add a new object without drawing another flat-vector placeholder:**
  `docs/adding-interactive-objects.md`.
