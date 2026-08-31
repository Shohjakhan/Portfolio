import type { ObjectAssetEntry } from "@/types/assets";

/**
 * Manifest of the room's visual asset layers — one entry per object, in
 * back-to-front paint order. This is a *catalog*, not wiring: components
 * still hold their own `src` literals (see docs/asset-architecture.md for
 * why that stayed a deliberate choice in this pass). It exists so anyone
 * replacing a placeholder with real art has one place that says what file
 * backs an object, at what size, in which category, and how it's meant to
 * move — without having to grep every component first.
 *
 * All current files are temporary placeholders (see docs/asset-inventory.md)
 * — same path/slot, swap the file in place when real illustrated art lands.
 */
export const objectAssets: ObjectAssetEntry[] = [
  {
    id: "bookshelf",
    category: "bookshelf",
    layers: [
      {
        src: "/assets/scene/bookshelf/bookshelf-frame.svg",
        width: 150,
        height: 320,
        motion: "static",
        note: "Shelf carcass — heaviest/most detailed layer, never moves.",
      },
      {
        src: "/assets/scene/bookshelf/bookshelf-books.svg",
        width: 150,
        height: 90,
        motion: "idle-css",
        note: "Book spines, reused 3x at different shelves via hue-rotate/mirroring in Bookshelf/index.tsx — a compensating technique flagged in docs/asset-inventory.md, not a pattern to repeat for new objects.",
      },
    ],
  },
  {
    id: "cat",
    category: "bookshelf",
    layers: [
      {
        src: "/assets/scene/bookshelf/cat.svg",
        width: 110,
        height: 80,
        motion: "state-swap",
        note: "Sleeping pose now; CLAUDE.md's 'occasionally wakes' calls for an awake-pose variant swapped in by scene state later.",
      },
    ],
  },
  {
    id: "plants",
    category: "bookshelf",
    layers: [
      {
        src: "/assets/scene/bookshelf/plants.svg",
        width: 80,
        height: 80,
        motion: "idle-css",
        note: "Whole pot+leaves sway together — leaves aren't split out, the motion is cheap enough on one layer.",
      },
    ],
  },
  {
    id: "easel",
    category: "art",
    layers: [
      {
        src: "/assets/scene/art/easel-frame.svg",
        width: 120,
        height: 240,
        motion: "static",
        note: "Tripod structure, background of the group.",
      },
      {
        src: "/assets/scene/art/easel-canvas.svg",
        width: 76,
        height: 96,
        motion: "static",
        note: "The in-progress painting; swap this file alone to change what's 'currently being painted' without touching the frame.",
      },
      {
        src: "/assets/scene/art/easel-brushes.svg",
        width: 40,
        height: 76,
        motion: "hover-reactive",
        note: "Brush jar in front — candidate for a hover wiggle distinct from the frame/canvas.",
      },
    ],
  },
  {
    id: "laptop",
    category: "desk",
    layers: [
      {
        src: "/assets/scene/desk/laptop-base.svg",
        width: 110,
        height: 90,
        motion: "static",
        note: "Chassis + keyboard deck; screen area is a cutout so the screen layer composites into it.",
      },
      {
        src: "/assets/scene/desk/laptop-screen.svg",
        width: 82,
        height: 50,
        motion: "hover-reactive",
        note: "Constellation/glow background — brightens on hover/focus (.laptop-screen in animations.css). The 'My Work' copy is a real DOM overlay now, not baked into this SVG (see Laptop/index.tsx) — edit the copy there, not by re-exporting art.",
      },
    ],
  },
  {
    id: "coffee",
    category: "desk",
    layers: [
      {
        src: "/assets/scene/desk/coffee-cup.svg",
        width: 70,
        height: 70,
        motion: "idle-css",
        note: "Cup + saucer + handle only — steam lives on its own layer below so it can react to hover independently.",
      },
      {
        src: "/assets/scene/desk/coffee-steam.svg",
        width: 70,
        height: 70,
        motion: "hover-reactive",
        note: "Same viewBox as the cup, overlays exactly. Opacity 0.55→0.85 on hover/focus (.coffee-steam in animations.css) — 'slightly more visible', not a full fade-in.",
      },
    ],
  },
  {
    id: "journal",
    category: "desk",
    layers: [
      {
        src: "/assets/scene/desk/journal.svg",
        width: 80,
        height: 70,
        motion: "idle-css",
        note: "Single layer; page-flutter would be a future state-swap variant, not required now.",
      },
    ],
  },
  {
    id: "phone",
    category: "desk",
    layers: [
      {
        src: "/assets/scene/desk/phone.svg",
        width: 90,
        height: 90,
        motion: "idle-css",
        note: "Solid brass object — motion is a subtle bob, not multi-part.",
      },
    ],
  },
  {
    id: "memoryWall",
    category: "decor",
    layers: [
      {
        src: "/assets/scene/decor/photo-frame.svg",
        width: 60,
        height: 60,
        motion: "static",
        note: "One frame asset reused 4x in a loose grid — reuse over shipping a separate file per photo.",
      },
    ],
  },
  {
    id: "moviePoster",
    category: "decor",
    layers: [
      {
        src: "/assets/scene/decor/movie-poster.svg",
        width: 90,
        height: 150,
        motion: "static",
        note: "Flat poster; the design reference's idle motion here is just ambient lamp-glow falling across it, not the poster itself moving.",
      },
    ],
  },
  {
    id: "lamp",
    category: "decor",
    layers: [
      {
        src: "/assets/scene/decor/lamp.svg",
        width: 90,
        height: 170,
        motion: "hover-reactive",
        note: "Pending SceneObjectId decision (see docs/asset-inventory.md). Primary light source — glow should intensify at night, independent of any click behavior.",
      },
    ],
  },
  {
    id: "plushie",
    category: "decor",
    layers: [
      {
        src: "/assets/scene/decor/plushie.svg",
        width: 90,
        height: 90,
        motion: "idle-css",
        note: "Original design, not a likeness of any copyrighted character — keep it that way if this gets replaced with final art.",
      },
    ],
  },
];

/** Environmental art that dresses the window rather than belonging to any
 * one `SceneObjectId` — reused many times via CSS transform rather than one
 * file per instance (mirrored curtain, cloned/offset clouds). */
export const windowAssets = {
  cloud: {
    src: "/assets/scene/window/cloud.svg",
    width: 220,
    height: 90,
    note: "Prepared, not wired into any component yet — no cloud-drift feature exists in Room/Window today.",
  },
  curtain: {
    src: "/assets/scene/window/curtain.svg",
    width: 70,
    height: 300,
    note: "Mirror with CSS transform: scaleX(-1) for the curtain on the opposite side of the window — see Curtain/index.tsx.",
  },
};

export function getObjectAssets(id: string): ObjectAssetEntry | undefined {
  return objectAssets.find((entry) => entry.id === id);
}
