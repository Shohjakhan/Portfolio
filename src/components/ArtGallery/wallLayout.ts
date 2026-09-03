/**
 * Placement engine for the salon wall — reference: a real reference photo
 * the user supplied of ornate frames scattered on a wall (see the
 * `art_gallery.md` memory for the exact feedback, across several rounds
 * of "no, more like this"). That reference reads as hand-hung, not
 * gridded: frames of wildly different sizes, mostly portrait, sitting at
 * irregular heights — some floating well above others, some low, gaps
 * that are tight but never touching, one wide landscape piece and a
 * couple of near-squares as the exceptions rather than the rule — and
 * it's a *tall* composition, not a thin strip: the plants and the
 * classical bust sit on the floor in the lower portion of the same
 * image, in gaps under specific frames, not in a separate caption strip
 * underneath everything.
 *
 * A row/band system (an earlier version of this file) can't produce that
 * — every piece in a row shares the same top and the same height, which
 * reads as shelved, not hung. So this uses a small fixed **canvas**: a
 * design-space rectangle (`CANVAS_WIDTH` × `CANVAS_HEIGHT`) with each
 * frame's exact `{ leftPx, topPx, widthPx, heightPx }` hand-placed once
 * and never touching another slot's rectangle — verified by construction
 * (see the lane comments below), not by a runtime packing algorithm. The
 * decorative plants/bust (`DECOR_SLOTS`) live in the *same* coordinate
 * space, positioned in the floor gap under specific lanes, which is what
 * makes them read as part of the wall rather than a footer glued on
 * after it.
 *
 * `GalleryWall` renders the canvas as a `position:relative` box with
 * `aspect-ratio: CANVAS_WIDTH / CANVAS_HEIGHT` and each slot (frame or
 * decor) as a `position:absolute` child using *percentages* of that
 * canvas — a CSS aspect-ratio box scales both axes together from 100%
 * width alone, so the whole composition (proportions, gaps, orientation)
 * stays identical at any dialog width, and the total wall height is
 * always exactly `containerWidth × (CANVAS_HEIGHT / CANVAS_WIDTH)` — a
 * closed-form number, not something a packing algorithm produces, which
 * is what makes "never scrolls" a guarantee.
 */
export const CANVAS_WIDTH = 1266;
export const CANVAS_HEIGHT = 465;

export type FrameStyle = "gold" | "black" | "wood" | "slim";

export interface FrameSlot {
  leftPx: number;
  topPx: number;
  widthPx: number;
  heightPx: number;
}

/**
 * Nine horizontal "lanes" left to right (12px gaps between lanes, never
 * overlapping by construction — each lane owns a distinct `leftPx`
 * range). Most lanes hold one tall portrait frame; two lanes stack two
 * shorter frames (15px gap between them) for size variety without going
 * wider; one lane (the 8th) is deliberately wide and short — the
 * reference photo's one big landscape piece. Every frame bottom edge
 * stops at or under 300px on purpose, well short of `CANVAS_HEIGHT`'s
 * 465px — that gap is the floor strip `DECOR_SLOTS` stands in, the same
 * way the reference's frames don't reach all the way down to where its
 * plants/bust sit either.
 */
export const WALL_SLOTS: FrameSlot[] = [
  // lane 1 — tall portrait, flush to the top
  { leftPx: 0, topPx: 20, widthPx: 110, heightPx: 280 },
  // lane 2 — two small frames stacked
  { leftPx: 122, topPx: 20, widthPx: 90, heightPx: 100 },
  { leftPx: 122, topPx: 135, widthPx: 90, heightPx: 110 },
  // lane 3 — big feature portrait
  { leftPx: 224, topPx: 20, widthPx: 150, heightPx: 280 },
  // lane 4 — smaller portrait, floats lower (like the reference's oval)
  { leftPx: 386, topPx: 70, widthPx: 100, heightPx: 190 },
  // lane 5 — the tallest feature piece, floor decor (the bust) stands under it
  { leftPx: 498, topPx: 20, widthPx: 160, heightPx: 280 },
  // lane 6 — two small frames stacked
  { leftPx: 670, topPx: 20, widthPx: 95, heightPx: 110 },
  { leftPx: 670, topPx: 145, widthPx: 95, heightPx: 130 },
  // lane 7 — near-square, floats mid-height
  { leftPx: 777, topPx: 100, widthPx: 140, heightPx: 170 },
  // lane 8 — wide landscape accent, sits low
  { leftPx: 929, topPx: 160, widthPx: 230, heightPx: 140 },
  // lane 9 — small square, sits low, floor decor (a plant) stands under it
  { leftPx: 1171, topPx: 190, widthPx: 95, heightPx: 110 },
];

export const WALL_SIZE = WALL_SLOTS.length;

export type DecorKind = "plant" | "bust";

export interface DecorSlot {
  kind: DecorKind;
  leftPx: number;
  topPx: number;
  widthPx: number;
  heightPx: number;
  /** Mirror the plant art horizontally so the two don't look identical. */
  flip?: boolean;
}

/**
 * The room's plants + classical bust, standing in the floor gap under
 * lanes 1, 5 and 9 — same coordinate space as `WALL_SLOTS`, not a
 * separate row rendered after the canvas ("they are within the frames
 * not below them separately"). Purely decorative, never clickable, same
 * as the room's own `ArtWall`.
 */
export const DECOR_SLOTS: DecorSlot[] = [
  { kind: "plant", leftPx: 13, topPx: 320, widthPx: 85, heightPx: 130 },
  { kind: "bust", leftPx: 523, topPx: 310, widthPx: 110, heightPx: 140 },
  { kind: "plant", leftPx: 1179, topPx: 320, widthPx: 80, heightPx: 130, flip: true },
];

const STYLE_PATTERN: FrameStyle[] = ["gold", "gold", "black", "gold", "wood", "gold", "gold", "black", "gold", "wood", "gold"];

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function getFrameStyle(wallIndex: number, slotIndex: number): FrameStyle {
  const offset = Math.floor(seededRandom(wallIndex * 11 + 3) * STYLE_PATTERN.length);
  return STYLE_PATTERN[(slotIndex + offset) % STYLE_PATTERN.length];
}
