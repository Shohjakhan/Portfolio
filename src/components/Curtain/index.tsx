"use client";

type CurtainSide = "left" | "right";

/**
 * Purely environmental, like `Window` — the two velvet panels flanking the
 * window. One painting of both panels on their rod, split at the gap
 * between them (art-source/06-landing-objects/), so each side keeps its own
 * painted folds and lighting instead of a mirrored copy. The sway lives on
 * the <img> and pivots at the rod, so the rings stay put and the fabric
 * swings.
 */
function Curtain({ side }: { side: CurtainSide }) {
  return (
    <div aria-hidden className="h-full w-full">
      <img
        src={`/assets/scene/window/curtain-${side}.png`}
        alt=""
        data-idle="sway"
        style={{ animationDelay: side === "right" ? "1400ms" : "300ms", transformOrigin: "50% 0%" }}
        className="h-full w-full object-contain object-top drop-shadow-[var(--shadow-warm-md)]"
      />
    </div>
  );
}

export function CurtainLeft() {
  return <Curtain side="left" />;
}

export function CurtainRight() {
  return <Curtain side="right" />;
}
