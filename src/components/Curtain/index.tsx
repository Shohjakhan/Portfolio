"use client";

type CurtainSide = "left" | "right";

/**
 * Purely environmental, like `Window` — flanks the window frame. One SVG
 * asset (`window/curtain.svg`), mirrored via a wrapper's `scaleX(-1)` for
 * the right side rather than shipping a second file (see
 * docs/asset-architecture.md §2). The sway animation lives on the inner
 * <img>, not the mirrored wrapper, so the two transforms don't collide.
 */
function Curtain({ side }: { side: CurtainSide }) {
  return (
    <div aria-hidden className="h-full w-full" style={side === "right" ? { transform: "scaleX(-1)" } : undefined}>
      <img
        src="/assets/scene/window/curtain.svg"
        alt=""
        data-idle="sway"
        style={{ animationDelay: side === "right" ? "1400ms" : "300ms", transformOrigin: "50% 0%" }}
        className="h-full w-full object-contain object-top drop-shadow-[var(--shadow-warm-sm)]"
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
