"use client";

/**
 * Purely environmental, like `Curtain`/`Window` — quiet greenery on top
 * of the bookshelf, not a clickable object. No hover label, no
 * click-to-panel (it never had a real destination of its own; it was
 * piggybacking on the "about" panel, which read as a false affordance —
 * same fix applied to `Cat`). Idle sway stays; only the interactivity
 * is gone.
 */
export function Plants() {
  return (
    <div aria-hidden className="h-full w-full">
      <img
        src="/assets/scene/bookshelf/plants.svg"
        alt=""
        data-idle="sway"
        style={{ animationDelay: "900ms", animationDuration: "6500ms" }}
        className="h-full w-full object-contain drop-shadow-[var(--shadow-warm-sm)]"
      />
    </div>
  );
}
