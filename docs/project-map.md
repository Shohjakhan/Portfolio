# Project map — My Little Universe

A guide to how the room is put together: what each piece does and how the
pieces relate. Read this before structural changes. `CLAUDE.md` holds the
rules and the design vision. This file describes the code as it stands
(audited 2026-10-14).

Related docs: `docs/adding-interactive-objects.md` (checklist for new
objects), `docs/asset-architecture.md` (art layering strategy),
`docs/asset-inventory.md` + `docs/visual-art-direction.md` (art upgrade
tracker and generation guidance), `docs/art-generation-prompts.md` (prompt pack), `docs/art-direction.md` (palette/material
tokens), `docs/notion-integration.md` (CMS), `docs/implementation-roadmap.md`
(what to do next).

---

## 1. Stack and entry points

| Concern | Choice |
|---|---|
| Framework | Next.js 15.5 App Router (`src/app`), React 19.2, TypeScript strict |
| Styling | Tailwind v4, config-free; tokens via `@theme` in `src/styles/variables.css` |
| Package manager | npm (`package-lock.json` only) |
| Runtime deps | `clsx`, `tailwind-merge`, `lucide-react` (icons), `server-only` |
| State | Hand-rolled external store on `useSyncExternalStore`, no Redux/Zustand/Context |
| Animation | CSS keyframes keyed off `data-*` attributes, plus one rAF loop (cursor) |
| CMS | Notion REST API via `fetch`, server-only, behind `/api/content/*` |

**Request flow:** `src/app/layout.tsx` (fonts, `<CustomCursor/>`, global
CSS) → `src/app/page.tsx` (a `<main>` wrapper) → `src/components/Room`.
There is one page route (`/`). The only other routes are four JSON
endpoints: `src/app/api/content/{movies,anime,books,writings}/route.ts`.

`page.tsx` is a server component, but nearly everything under `Room` is a
client component (`"use client"`). The page is prerendered as static HTML,
and all scene logic hydrates on the client.

## 2. Directory guide

```
src/
├── app/                 layout, page, /api/content/* route handlers
├── components/
│   ├── Room/            composition root (index.tsx) + MobileRoom.tsx
│   ├── <SceneObject>/   one folder per room object: Bookshelf, Easel, Laptop, Coffee,
│   │                    Journal, Phone, MemoryWall, MoviePoster, Plushie (clickable)
│   │                    Cat, Plants, Lamp, Curtain, ArtWall, Window (ambient only)
│   ├── Background/ Birds/ AmbientEffects/   sky gradient, birds, particle picker
│   ├── NavigationLayer/ the single Modal host that maps activePanel → panel UI
│   ├── <Panel>/         one folder per destination: AboutExperience, LaptopInterface,
│   │                    BookshelfLibrary, ArtGallery, JournalDiary, MemoriesGallery,
│   │                    CinemaTickets, FandomCorner, ContactExperience
│   ├── AudioControls/ CustomCursor/
│   └── shared/          LayeredArt (multi-layer object art), BackLink, EmptyState,
│                        ObjectMount (unused)
├── primitives/          InteractiveObject, HoverLabel, Modal, ParallaxLayer,
│                        AmbientLayer, SceneTransition, SoundTrigger
├── state/               createStore.ts, sceneStore.ts, cursorStore.ts
├── hooks/               root-mounted environment hooks + small utilities
├── data/                content + scene definitions (static TS modules)
├── lib/audio/           cue catalog + AudioManager singleton
├── lib/notion/          server-only Notion client + per-database mappers
├── types/               scene.ts (scene vocabulary), content.ts, assets.ts
└── styles/              variables, typography, animations, textures, cursor CSS
public/
├── assets/scene/<category>/   object art (SVG placeholders + 1 jpg + 1 png)
└── cv/                        CV PDF
legacy-static/, CV/            old static site + CV source (kept on purpose, unused)
```

## 3. How the scene is assembled

`Room` (`src/components/Room/index.tsx`) is the composition root. It:

1. Mounts the **environment hooks** once: `usePrefersReducedMotion`,
   `useLocalTimeOfDay`, `useVisitProgress`, `useAudioPreference`,
   `useAmbientAudio`. Each one writes to `sceneStore`. None of them render.
2. Picks a **layout tree** with `useViewportTier()`. `mobile` (≤519px)
   renders `MobileRoom`; `tablet` and `desktop` share the canvas below.
3. **Canvas (tablet/desktop):** a `h-screen` stage, with objects
   positioned absolutely in percentages. Every object occupies one
   `ObjectSlot` in `OBJECT_SLOTS` or `CURTAIN_SLOTS`:
   `{ key, depth, box: {left, top, width, height}, Component }`. Width and
   height use `clamp()` so hit targets never shrink below a touch-friendly
   floor. Each slot is wrapped in a `ParallaxLayer` whose `depth` scales its
   pointer travel. Paint order, back to front: desk plane → glow overlay →
   `Window` → curtains → objects → `AmbientEffects` → edge vignette.
4. **MobileRoom:** normal document flow. Objects are grouped into
   "vignettes" (sky, shelf, art, wall, desk), each at a fixed comfortable
   size in a page you scroll. There is no parallax and no curtains.
5. Always renders `NavigationLayer` (panels) and `AudioControls`.

**Moving or resizing an object means editing its slot in `Room`** (and its
vignette in `MobileRoom`), not the object component.

### Object components

Each clickable object is a thin component that:

- reads its `label`/`description`/`panel` from `src/data/sceneObjects.ts`
  (`getSceneObject("coffee")`),
- wraps its art in `<InteractiveObject>` with an `idleAnimation`,
  `hoverEffect`, and `onActivate={() => sceneActions.openPanel(panel)}`,
- renders its art either as a single `<img>` or through `LayeredArt`. In
  `LayeredArt`, each layer is an absolutely positioned `<img>` inside an
  `aspect-ratio`-locked box, so individual layers can animate or react to
  hover separately (bookshelf rows, easel brushes, phone handset/cord).

Ambient-only objects (`Cat`, `Plants`, `Lamp`, `Curtain`, `ArtWall`,
`Window`) are plain `aria-hidden` divs with `data-idle` loops and no
button. The cat and plants were deliberately made non-clickable, as
recorded in `sceneObjects.ts`.

**Object → panel mapping** (source of truth: `src/data/sceneObjects.ts`):

| Object | Panel id | Panel component | Modal variant |
|---|---|---|---|
| Coffee | `about` | `AboutExperience` | memory |
| Laptop | `work` | `LaptopInterface` (mini desktop OS, 6 folders) | screen |
| Bookshelf | `writings` | `BookshelfLibrary` (two-tier bookcase, flip-book reader) | memory |
| Easel | `art` | `ArtGallery` | gallery |
| Journal | `notes` | `JournalDiary` (Instagram/Telegram) | memory |
| Memory wall | `memories` | `MemoriesGallery` (film reels) | memory |
| Movie poster | `movies` | `CinemaTickets` (Notion-backed) | memory |
| Plushie | `fandom` | `FandomCorner` (Notion-backed) | memory |
| Phone | `contact` | `ContactExperience` (rings ~700ms before opening) | memory |

## 4. State

`src/state/createStore.ts` is a roughly 40-line store with `getState`,
`setState`, and `subscribe`, plus `useStoreSelector`. Components subscribe
to **one slice** each (`useSceneValue(s => s.timeOfDay)`), so a change to
one field re-renders only the components that read it. Always select
primitives, never fresh object literals.

**`sceneStore`** holds `timeOfDay`, `weather`, `activeObject` (hovered or
focused), `activePanel`, `reducedMotion`, `audioEnabled`, and `visitStage`.
Mutate it only through `sceneActions.*`. Objects never talk to each other
directly; for example, `Cat` reads `activeObject === "bookshelf"` to glance
up occasionally.

**`cursorStore`** holds `supported`, `variant` (`default | interactive |
text`), `hoverSeq`, and `clickSeq`. It's written by `CustomCursor`'s global
pointer listeners, and `variant` is resolved from the DOM under the pointer
(`resolveCursorVariant`). Any real `<button>`/`<a>` gets the hover reaction
with no extra wiring.

## 5. Interactions, navigation, and animation

- **Hover/focus → `InteractiveObject`.** It renders a real `<button>`
  (keyboard, aria, and tap all work for free). Pointer-enter and focus are
  treated identically: they set local state for `HoverLabel`, set
  `sceneStore.activeObject`, and play the hover cue. The visual reaction is
  pure CSS: `[data-hover="tilt"]:is(:hover,:focus-visible)` in
  `animations.css`.
- **Idle motion** uses the `data-idle="sway|float|flicker|breathe"`
  attributes, keyed to `room-*` keyframes. Their amplitude scales by
  `--sway-scale`, which `Room` sets from `visitStage`. Motion is gated in
  two places: JS removes `data-idle` when `reducedMotion` is set, and a CSS
  `@media (prefers-reduced-motion)` block acts as a fallback.
- **Click → panel.** `sceneActions.openPanel(id)` → `NavigationLayer`
  reads `activePanel` → a single long-lived `Modal` (portal, focus trap,
  Escape/backdrop close, exit animation of 400–480ms before unmount)
  renders the matching panel inside `PanelErrorBoundary`.
- **History.** `usePanelHistorySync` pushes `#panelId` on open, so browser
  Back closes the panel. Any other close strips the hash in place. On first
  mount it restores a panel from `location.hash`, so deep links like
  `/#contact` work.
- **Parallax.** `Room` writes `--pointer-x`/`--pointer-y` CSS variables
  imperatively on pointermove, so there is no React re-render. Each
  `ParallaxLayer` translates by `var(--pointer-*) × depth`.
- **Custom cursor.** `CustomCursor` (mounted in `layout.tsx`) runs a rAF
  loop that mutates a ref's transform. The trail dots and click ripples are
  short-lived React state. It's disabled on coarse or no-hover pointers,
  where the native cursor is restored.
- **Living environment.** `useLocalTimeOfDay` buckets the visitor's clock
  into 5 phases and rechecks every 60s. `Background` (sky gradient tokens),
  `Window` (moon/star opacity), `Lamp` (glow intensity), `Room`
  (`--room-glow`), and `AmbientEffects` (dust vs. fireflies) all read it.
  Every change crossfades over `--duration-scene`. `useVisitProgress` steps
  `visitStage` at 45s, 150s, and 360s; this changes cat stir frequency,
  particle count, and sway amplitude.
- **Audio.** `lib/audio/cues.ts` catalogs every cue. The `audioManager`
  singleton gates everything on `audioEnabled` (off by default and
  remembered per tab in `sessionStorage`). It enforces per-cue cooldowns
  and a 3-voice cap, and crossfades ambient beds. **No sound files exist
  yet** (`public/sounds/` is missing): with sound on, every cue 404s and
  fails silently, which is by design.

## 6. Assets: loading and positioning

- All scene art lives in `public/assets/scene/<category>/` and is
  referenced by literal path strings inside object components. Layer
  geometry, such as the `box` percentages in `LayeredArt`, is tuned to each
  SVG's viewBox. **Replacing an asset with a different aspect ratio means
  re-tuning those boxes and the component's `aspect` prop.**
- Scene art uses plain `<img>`, not `next/image`. That's intentional: these
  are small local SVGs, and `next/image` refuses local SVGs without
  `dangerouslyAllowSVG`. This is the source of the 20 `no-img-element` lint
  warnings. It's also why there's no load-failure fallback, so a missing
  file shows as an empty box.
- `src/data/assets.ts` and `src/types/assets.ts` describe the asset
  catalog. Only the audio cues module actually imports `data/assets.ts`;
  components hardcode their paths.
- Panel imagery (gallery, film strip, movie and anime covers) goes through
  `ArtGallery/ArtworkImage.tsx`. SVGs use a plain `<img>`, and local raster
  images use `next/image`. **Remote Notion covers use `next/image` with
  `unoptimized`.** They are presigned S3 links (re-signed on every fetch)
  and are often 1 MB+ animated GIFs, which made the optimizer time out.
  Their hostnames must still be listed in `next.config.ts`
  `images.remotePatterns`, or `next/image` throws at render time. Book
  covers and anime charms use plain `<img>`.
- Walls, desk, and floor are CSS textures (`styles/textures.css`); there
  are no background images.

## 7. Responsive behavior

| Tier | Width | Layout |
|---|---|---|
| mobile | ≤519px | `MobileRoom`: scrollable vertical vignettes, half the particles, no parallax |
| tablet | 520–1199px | Desktop canvas (same slots, `clamp()`-scaled) |
| desktop | ≥1200px | Desktop canvas |

The tier is computed in JS (`useViewportTier`, matched to
`--breakpoint-sm/lg`). The SSR default is `desktop`, so phones briefly
mount the desktop canvas before switching. Hover vs. tap behavior depends
on the input device (`(pointer: fine) and (hover: hover)`), not the tier.
The canvas stage is `h-screen min-h-[560px] overflow-x-hidden
overflow-y-auto`.

## 8. Content and the Notion CMS

Static content lives in `src/data/*.ts`, typed by `src/types/content.ts`.
The four Notion-backed collections (movies, anime, books, writings) load
client-side through `useContentList(endpoint, initialItems)`, which renders
the static fallback immediately and swaps in the API result. Route handlers
always return 200 `{ items, source: "notion" | "fallback" }`. The Notion
fetch uses `next: { revalidate: 300 }`. Credentials are in `.env.local`
(gitignored), and `.env.example` documents the variable names. See
`docs/notion-integration.md`.

## 9. Scripts and verification

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on :3000 (`.claude/launch.json` → "dev" for the browser pane) |
| `npm run build` | Production build, including type-check and lint |
| `npm run lint` | ESLint flat config (`next/core-web-vitals` + `next/typescript`) |
| `npx tsc --noEmit` | Standalone type-check (no npm script for it) |
| `npm run start` | Serve the production build |

There is no test suite: no Jest, Vitest, or Playwright, and no `test`
script. **Don't run `npm run build` while `npm run dev` is running.** Both
write `.next/`, and the dev server breaks.

## 10. Known limitations and technical debt

The detailed list, with priorities, is in `docs/implementation-roadmap.md`
§0–1. Structural points:

- **All object art is placeholder flat-vector SVG** (see
  `docs/asset-inventory.md`). The layering architecture is ready for real
  art, but layer `box` geometry is hand-tuned per SVG.
- **Weather is unreachable.** Nothing calls `sceneActions.setWeather`, so
  the rain, snow, and cloud visuals (`Window` clouds, `Background`
  overcast, `AmbientLayer` rain/snow, wind/rain audio beds) never render
  in practice.
- **No sound assets.** The audio system is fully wired but silent.
- **No error boundary above `Room`.** `PanelErrorBoundary` contains panel
  crashes, but an error in the room canvas itself still blanks the page.
- **Dead code** (kept, not deleted, per `CLAUDE.md` §4):
  `components/shared/ObjectMount.tsx`, `src/primitives/index.ts` (barrel
  with no importers), `src/data/contact.ts` (no importers),
  `public/assets/scene/desk/journal.svg` (superseded by journal-pages/pen).
  Also `legacy-static/`.
- **`AGENTS.md`** points to `node_modules/next/dist/docs/`, which does not
  exist in this install. Treat it as unverifiable.
- **Metadata** is still the generic `"Portfolio — Founder & Software
  Developer"`, not "My Little Universe".
