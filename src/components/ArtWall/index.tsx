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
    <div aria-hidden className="h-full w-full">
      {/* One painted cluster (gilt moonlit lake, dark-wood lighthouse,
          unframed pears) — art-source/06-landing-objects/. */}
      <img
        src="/assets/scene/art/art-wall.png"
        alt=""
        data-idle="breathe"
        style={{ animationDelay: "600ms" }}
        className="h-full w-full object-contain drop-shadow-[var(--shadow-warm-sm)]"
      />
    </div>
  );
}
