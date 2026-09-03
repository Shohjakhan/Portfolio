"use client";

/**
 * Purely environmental, like `Curtain`/`Cat`/`Plants` — a small cluster of
 * framed paintings hanging above the easel, not a clickable object.
 * `Easel` is the room's one entry point into "My Art" per the task brief
 * ("the easel/brush area is the entry point"); this wall is atmosphere for
 * that corner, the way `Cat`/`Plants` are atmosphere for the bookshelf.
 * Three distinct placeholder pieces (not the same asset filtered three
 * ways, like the bookshelf's flagged anti-pattern — see
 * docs/asset-inventory.md) in a loose, slightly-tilted hang, echoing
 * `MemoryWall`'s loose-grid treatment.
 */
export function ArtWall() {
  return (
    <div aria-hidden className="relative h-full w-full">
      <img
        src="/assets/scene/art/gallery-painting-2.svg"
        alt=""
        data-idle="breathe"
        style={{ animationDelay: "600ms" }}
        className="absolute top-0 left-[6%] w-[52%] -rotate-2 drop-shadow-[var(--shadow-warm-sm)]"
      />
      <img
        src="/assets/scene/art/gallery-painting-1.svg"
        alt=""
        data-idle="breathe"
        style={{ animationDelay: "2200ms" }}
        className="absolute top-[6%] left-[46%] w-[48%] rotate-1 drop-shadow-[var(--shadow-warm-sm)]"
      />
      <img
        src="/assets/scene/art/gallery-painting-3.svg"
        alt=""
        data-idle="breathe"
        style={{ animationDelay: "3800ms" }}
        className="absolute top-[54%] left-[22%] w-[46%] -rotate-1 drop-shadow-[var(--shadow-warm-sm)]"
      />
    </div>
  );
}
