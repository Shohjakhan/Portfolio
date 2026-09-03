# Adding a new interactive object to the room

The room is built from independent, self-contained object components (see
`CLAUDE.md` §3). This is the checklist for adding one — e.g. a "record
player" or "typewriter" that isn't in the room yet.

## 1. Register it in the data layer

Add an entry to `sceneObjects` in `src/data/sceneObjects.ts`:

```ts
{
  id: "recordPlayer",              // add this to SceneObjectId in src/types/scene.ts first
  label: "What I'm listening to",  // accessible name + hover callout title
  description: "Music I'm into right now.",
  panel: "notes",                  // an existing PanelId, or add a new one to both
},                                 // SceneObjectDefinition's `panel` union and `panels`
```

`SceneObjectId` and `PanelId` are closed unions on purpose — extending them
is what makes a new object type-check everywhere it's used (Room's slot map,
the object component itself).

**`label` should read like a handwritten callout, not a literal object
name** — "About Me", not "Coffee"; "My Work", not "Laptop". It's doing two
jobs (accessible name *and* the hover card's title, see `HoverLabel`), so
picture what a screen reader announces: "*My Library*, button — *My
writings, fantasy novel, favorite books, and more*" reads better than
"*Bookshelf*, button — …". Avoid generic labels ("Click here", "Projects",
"About") unless they genuinely fit — describe the destination/feeling, not
the object.

## 2. Build the component

One file per object, under `src/components/<ObjectName>/index.tsx`. Every
object follows the same shape — pair `InteractiveObject` with its art. For a
single-image object, that's a plain decorative `<img>`:

```tsx
"use client";

import { getSceneObject } from "@/data/sceneObjects";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { sceneActions } from "@/state/sceneStore";

const definition = getSceneObject("recordPlayer")!;

export function RecordPlayer() {
  return (
    <InteractiveObject
      id={definition.id}
      label={definition.label}
      description={definition.description}
      onActivate={() => sceneActions.openPanel(definition.panel)}
      idleAnimation="sway"
      idleDelayMs={2200} // stagger against other objects sharing "sway" — see step 4
      hoverEffect="wiggle"
      className="h-full w-full"
    >
      <img
        src="/assets/scene/decor/record-player.svg"
        alt=""
        aria-hidden
        className="h-full w-full object-contain drop-shadow-[var(--shadow-warm-sm)]"
      />
    </InteractiveObject>
  );
}
```

If the object is more than one independently-movable piece (a lid that
should glow separately from its base, say), use
`@/components/shared/LayeredArt` instead of a single `<img>` — see
`Bookshelf`, `Easel`, or `Laptop` for worked examples. Either way: add the
new SVG under the right category folder in `public/assets/scene/` (see
`docs/asset-inventory.md` for the category list and what belongs where)
before wiring it in.

**Do not draw another flat-vector placeholder for a new object.** Per
`docs/asset-inventory.md`'s art direction, every current object SVG is a
known placeholder, not a style to match — a new one in the same style just
adds another asset that needs replacing later. If real illustrated art
isn't available for this object yet, reuse the closest existing placeholder
temporarily (or a plain neutral shape) and add a row to
`docs/asset-inventory.md`'s missing-assets table instead of hand-drawing a
new "finished-looking" placeholder.

Don't hand-roll hover/focus state, keyboard handling, or the callout card —
`InteractiveObject` + `HoverLabel` already give you all of that, and give it
to every object identically.

**Every object needs a non-`"none"` `idleAnimation`** — per the design
vision, nothing in the room sits perfectly still. Pick from `sway | float |
flicker | breathe` (see `room-*` keyframes in `src/styles/animations.css`).
`hoverEffect` (`glow | tilt | wiggle | lift`) can vary for visual rhythm;
`InteractiveObject` already downgrades `wiggle` to `lift` under reduced
motion, and idle animation is dropped entirely.

**Also set `idleDelayMs`** (and `idleDurationMs` if you want a genuinely
different pace, not just a different phase) to a value distinct from
nearby objects. Every object shares the same `room-*` keyframes at the same
`--duration-ambient`, so without a stagger, several objects using the same
idle animation will drift into visible lock-step — which reads as robotic,
not alive. `Room/index.tsx`'s existing slots each use a different delay
(0ms–4200ms); pick something that doesn't collide with whatever's nearby in
the scene.

## 3. Place it in the room

`src/components/Room/index.tsx` owns layout — objects don't know their own
position. Add a slot to `OBJECT_SLOTS`:

```ts
{
  key: "recordPlayer",
  depth: 0.4,   // parallax travel; 0 = static, ~0.6 = foreground-ish
  box: { left: "58%", top: "60%", width: "clamp(56px, 10%, 100px)", height: "clamp(56px, 10%, 100px)" },
  Component: RecordPlayer,
},
```

`left`/`top`/`width`/`height` are percentages of the room stage, so they
scale with it at any viewport — but wrap the pixel dimension in `clamp(minPx,
preferred%, maxPx)` so the hit target never shrinks below a touch-friendly
~44px on small screens (WCAG 2.5.5) or blows up absurdly large on very wide
ones.

## 4. Accessibility, for free

If you followed steps 1–3, you already have:

- A real `<button>` — reachable by Tab, activatable with Enter/Space, no
  hover-only interaction.
- `aria-label` (the object's name) and `aria-describedby` (its description)
  from `InteractiveObject`.
- Idle/hover motion that's automatically dropped under
  `prefers-reduced-motion` (via `sceneStore.reducedMotion`, synced once by
  `usePrefersReducedMotion` in `Room`).
- Focus and hover treated identically (`onFocus`/`onBlur` mirror
  `onPointerEnter`/`onPointerLeave`), so keyboard users see the same hover
  callout as pointer users.

You don't need to add any of this yourself — if you find yourself writing a
`useState` for hover or an `onKeyDown` handler on an object, that's a sign
to go through `InteractiveObject` instead.

## 5. Sound

Every sound in the room goes through `lib/audio/manager.ts`'s `audioManager`
— never a bare `new Audio()` in a component. It's the one place that knows
about on/off state, per-cue cooldowns (so a rapid hover/click spree can't
turn into overlapping noise), a global concurrency cap, and — for ambient
loops — crossfading instead of hard-cutting. `lib/audio/cues.ts` is the
catalog: every cue's file path, volume, and (for interaction cues) cooldown
live there, keyed by a typed cue id, the same "one place that says what
backs a thing" pattern `data/assets.ts` uses for visual layers.

**No audio files exist under `public/sounds/` yet.** Every cue already
resolves to a 404 — by design, this is silent, never a thrown error
(`AudioManager.playInteraction` swallows the rejection) — so wiring a new
object's sound ahead of the real file landing is expected, not a bug to
avoid.

Two ways to trigger a cue, pick whichever matches how your object already
knows something happened:

- **You already have a direct event handler** (a click, a `useEffect` on
  mount) — call the manager straight from it:

  ```tsx
  onActivate={() => {
    audioManager.playInteraction("recordScratch");
    sceneActions.openPanel(definition.panel);
  }}
  ```

- **You only have a value that changes** (an index, a counter something
  else already tracks) — use `SoundTrigger`, which plays a cue whenever its
  `trigger` prop changes and skips the component's own first mount:

  ```tsx
  <SoundTrigger cue="recordScratch" trigger={clickCount} />
  ```

  Only reach for `SoundTrigger` when the component holding the sound is
  **long-lived** (mounted once, its trigger value changes over time — e.g.
  `Modal`, `Phone`'s ring count). If the component itself gets a fresh
  mount every time the meaningful moment happens (a book opening, keyed
  fresh per book in `BookshelfLibrary`), `SoundTrigger`'s "skip first
  mount" behavior would skip the *only* mount that ever happens — call
  `audioManager.playInteraction(...)` directly from a plain
  `useEffect(() => {...}, [])` instead (see `BookFrame`).

Every hoverable object already gets a hover cue for free via
`InteractiveObject`'s `hoverSound` prop (defaults to `"hoverSparkle"`) — only
override it if an object's hover reads as something more specific than
generic magic (see `Journal`'s `hoverSound="paperRustle"`).

A brand-new cue needs an entry in `lib/audio/cues.ts`'s `INTERACTION_CUES`
(or `AMBIENT_CUES` for a looping bed) before either pattern above will
type-check — that's the point: nothing plays a raw path a component made up
on the spot.

## What the panel shows

Clicking any object calls `sceneActions.openPanel(panel)`. `NavigationLayer`
(mounted once, in `Room`) is the only place that reads `activePanel` and
renders it through the `Modal` primitive — object components never render a
modal themselves. Right now every panel shows a placeholder line; wiring
real content in (from the existing `About`/`Projects`/etc. section
components and `src/data/*.ts`) is tracked separately and is not something
adding a new object needs to touch.
