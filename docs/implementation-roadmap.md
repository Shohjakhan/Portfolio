# Implementation roadmap — My Little Universe

The recommended order for finishing the portfolio, based on the audit of
2026-10-14 (see `docs/project-map.md` for the architecture). Each phase
should leave `npm run lint` and `npm run build` green.

---

## 0. Decisions needed from the owner (blocking)

These involve **uncommitted work that was already in the tree** at audit
time, so they were left untouched.

| # | Item | Evidence | Recommendation |
|---|---|---|---|
| D1 | ✅ **Resolved 2026-10-14.** `next.config.ts` had been reset to the create-next-app default, which crashed Cinema and Anime detail views on `next/image`. | The committed config is restored, and `app.notion.com/images/**` (Notion gallery covers) and `images.unsplash.com` (cover picker) are added. **Second cause found:** the posters are 1–1.4 MB animated GIFs, and Next's optimizer timed out (about 7s) fetching them from S3 and returned 500s. `ArtworkImage` now passes `unoptimized` for remote URLs, so the browser loads them directly. It also had a race that left cached images at opacity 0, now fixed. Verified in the browser: Corpse Bride and The Summer Hikaru Died display. | — |
| D2 | ✅ **Resolved 2026-10-14.** The watermarked `bookshelf-frame.png` was deleted at the owner's request, and `Bookshelf` uses `bookshelf-frame.svg` again. | — | — |
| D3 | `docs/asset-inventory.md` (rewritten) and `docs/visual-art-direction.md` (new) are uncommitted. | They read as intentional art-direction work. One factual error: the inventory calls `window/cloud.svg` "unused". It is wired into `Window`, but only renders when weather is cloudy or rain, which never happens (see 1.3). | Review and commit. Correct the cloud note. |

## 1. Critical technical problems

### Fixed in this audit (verified in a browser + lint/tsc/build)

- **A panel crash blanked the entire site.** Added
  `NavigationLayer/PanelErrorBoundary.tsx`, keyed per panel. The room
  stays mounted and the panel shows a "back to the room" fallback.
- **Stale `#panel` hash after closing.** After closing with X, Escape, or
  the backdrop, the URL kept `#about`, so a refresh or shared link
  reopened a panel the visitor had dismissed. `usePanelHistorySync` now
  strips the hash in place. Back-button close and deep links (`/#contact`)
  still work.
- **Edge hover labels clipped, and the room could scroll sideways.**
  Labels for the bookshelf, movie poster, and plushie overflowed the
  viewport. At 1440px the plushie label was clipped by 15px; at 820px
  three labels were clipped. Even while hidden, they widened the stage's
  scroll area (874px in an 820px viewport), so keyboard focus could shove
  the whole room 51px sideways with no way back. `HoverLabel` now clamps
  itself to a 12px gutter on mount, reveal, and resize.
- **Ambient audio fade race.** Toggling sound off and back on within
  1.4s let the stale fade-out finish last and `pause()` the bed that
  should be playing. `AudioManager.fadeTo` now cancels superseded fades.

### Still open (in priority order)

1.1 ~~Resolve **D1** and **D2** above.~~ Done 2026-10-14.
1.2 **Root error boundary.** Add `src/app/error.tsx` (and possibly
    `global-error.tsx`) so an error in the room canvas itself shows a
    styled recovery screen instead of a blank page.
1.3 **Weather is dead code in practice.** Nothing calls `setWeather`.
    Decide whether to (a) drive it (a random or seasonal roll per visit, or
    a hidden toggle) or (b) accept it as future hooks. Until then, rain,
    snow, and clouds are untestable without devtools.
1.4 **Sound files.** Either add the 16 cue files under `public/sounds/`
    (paths in `src/lib/audio/cues.ts`) or hide `AudioControls` until they
    exist. Right now the toggle turns on silence and fires 404s.
1.5 **Mobile first paint.** `useViewportTier` defaults to `desktop`, so
    phones mount the full canvas (and all its effects) and then swap to
    `MobileRoom`. Consider a CSS-only first-paint gate, or render a neutral
    shell until the tier is known.
1.6 Small cleanups: `sceneActions.setActiveObject` lacks the
    unchanged-value guard its siblings have. The site metadata (title and
    description) is generic. `AGENTS.md` cites docs that don't exist.

## 2. Visual asset quality

The biggest gap between the site and `docs/design-reference.png`. Every
object is a flat-vector placeholder (`docs/asset-inventory.md`).

2.1 Choose the generation or illustration pipeline and **lock a style
    sample first**. Paint one hero object (the easel canvas or the
    bookshelf), approve it in-scene, then batch the rest against it.
2.2 Asset requirements per object come from `docs/visual-art-direction.md`:
    a transparent background, sized for 2× the largest `clamp()` slot, and
    **split into the same layers the component animates** (shelf frame vs.
    book rows, phone base/cord/handset, journal pages/pen, coffee cup/steam,
    easel frame/canvas/brushes/palette).
2.3 **Reject watermarked or blurred output** (see D2). Check every new
    file at 100% zoom on a dark background before wiring it in.
2.4 Prefer WebP or AVIF for raster art. Keep SVG only where the art is
    genuinely vector.

## 3. Integrating new artwork into the scene

3.1 Swap one object at a time. For each one: replace the file(s), update
    `LayeredArt`'s `aspect` and each layer `box` to match the new art, then
    re-check the hover label placement and the slot box in
    `Room/OBJECT_SLOTS` and `MobileRoom`.
3.2 Fix known composition problems while doing this. At tablet portrait
    (around 820px wide), `ArtWall` overlaps the bookshelf's book rows, and
    the lower half of the screen is mostly empty desk. In `MobileRoom`,
    `Window` reuses its desktop-stage percentages and renders as a squashed
    oval about 107px tall.
3.3 Consider replacing the CSS wall and desk textures with a painted
    backdrop layer (`public/assets/scene/background/` is reserved for
    this). Keep objects as separate layers on top.
3.4 Add `onError` fallbacks to `LayeredArt` and other scene `<img>`s (hide
    the broken layer) once real art makes files heavier and more likely to
    fail.

## 4. Ambient animation and polish

4.1 Revisit idle motion against the new art. Painterly objects may want
    gentler amplitudes than the current `room-*` keyframes.
4.2 Missing pieces from `CLAUDE.md` §2: fairy lights, an actually waking
    or moving cat (it only "stirs" now), clouds outside the weather path,
    and an evening ember or candle variant (`AmbientLayer` already
    supports `ember`).
4.3 Retune the hover reactions and callout card to match the reference's
    callout style once the art lands.

## 5. Responsive testing and final performance

5.1 Build a manual test matrix: 375, 390, 768, 820, 1024, 1280, 1440, and
    1920 wide, in portrait and landscape, with and without reduced motion,
    and with touch vs. mouse. Check label bounds, overlaps, and tap targets
    (all ≥44px today).
5.2 Consider adding Playwright smoke tests: open every panel, Back-closes,
    deep-link restore, no horizontal overflow. These are the checks run by
    hand in this audit.
5.3 **Notion GIF weight:** every Movies/Anime cover is a 1–1.4 MB animated GIF, re-downloaded on each visit because the presigned URLs change on every fetch. On a slow connection, a poster can take 30s or more. Consider static cover images (or MP4/WebP) in Notion for these collections, or a server-side proxy that caches by Notion file id.
5.4 Performance pass after the new art: total image weight, LCP on the
    room, preloading the hero objects, and lazy-loading panel-only imagery.
    Also reconsider the 20 `no-img-element` warnings at that point.
5.5 Production hardening: the security headers are back (D1); consider a
    CSP, and set real metadata and OG images.
