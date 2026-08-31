/**
 * Vocabulary for the room's *visual* asset layer — separate from
 * `types/scene.ts`, which is about interaction/content wiring. This file
 * only describes what image layers exist per object and how they're meant
 * to move; it intentionally knows nothing about panels or click behavior.
 *
 * See docs/asset-architecture.md for the full strategy this operationalizes.
 */

import type { SceneObjectId } from "@/types/scene";

/**
 * `lamp` isn't a registered `SceneObjectId` — CLAUDE.md §2's click-mapping
 * table never assigns it a panel, only "on/off by time of day" under Living
 * environment. Its art is prepared here so it's ready if that data-layer
 * decision changes; until then it stays environmental/decorative, not
 * clickable, same as `Window`. `plushie` was in this same boat until it was
 * registered as a real `SceneObjectId` (see `sceneObjects.ts`, panel
 * "writings"). See docs/asset-architecture.md § Missing assets.
 */
export type PendingObjectId = "lamp";

export type AssetObjectId = SceneObjectId | PendingObjectId;

/** How a layer is expected to move. Mirrors `IdleAnimation`/`HoverEffect` in
 * `primitives/InteractiveObject`, but this is a *suggestion* for whoever
 * wires the layer up — it doesn't drive anything on its own. */
export type LayerMotion =
  | "static" // background-ish, never animates on its own
  | "idle-css" // whole layer gets a data-idle transform (sway/float/breathe/flicker)
  | "hover-reactive" // meant to change on hover/click, independent of the object's other layers (e.g. a screen glow)
  | "state-swap"; // future: multiple art variants swapped by scene state (e.g. cat awake/asleep)

/**
 * The seven buckets under `public/assets/scene/` (see docs/asset-inventory.md
 * and docs/asset-architecture.md). Matches the room's own visual groupings,
 * not necessarily one category per component — e.g. `cat`/`plants` live in
 * `bookshelf/` because that's where they sit in the scene, not their own
 * folder.
 */
export type AssetCategory = "background" | "window" | "bookshelf" | "art" | "desk" | "decor" | "ambient";

export interface AssetLayer {
  /** File under public/assets/scene/<category>/, root-relative (usable directly as a src). */
  src: string;
  /** Intrinsic SVG dimensions in px — matches the file's width/height/viewBox. */
  width: number;
  height: number;
  motion: LayerMotion;
  /** One line: what this layer is and why it's separate from its siblings. */
  note: string;
}

export interface ObjectAssetEntry {
  id: AssetObjectId;
  category: AssetCategory;
  /** Ordered back-to-front; render in this order if compositing layers. */
  layers: AssetLayer[];
}
