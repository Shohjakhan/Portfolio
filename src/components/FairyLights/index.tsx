"use client";

import { useLampLit } from "@/state/sceneStore";

/**
 * Purely environmental — the string of fairy lights swagged across the top of the wall
 * (CLAUDE.md §2's "warm magical lighting"). Two pixel-matched paintings
 * (art-source/06-landing-objects/): the string itself, and its bulbs' glow, painted on
 * black and converted to a PNG whose transparency is its brightness, so it only adds
 * light. The bulbs light up and go dark with the table lamp (`useLampLit`): press the
 * lamp and the whole string glows.
 */
export function FairyLights() {
  const lit = useLampLit();

  return (
    <div aria-hidden className="pointer-events-none relative h-full w-full">
      <img src="/assets/scene/decor/fairy-lights.png" alt="" className="absolute inset-0 h-full w-full" />
      <div data-idle={lit ? "flicker" : undefined} style={{ animationDuration: "5200ms" }} className="absolute inset-0">
        <img
          src="/assets/scene/decor/fairy-glow.png"
          alt=""
          className="h-full w-full"
          style={{
            opacity: lit ? 1 : 0,
            filter: "brightness(1.7) saturate(1.25)",
            transition: "opacity 700ms var(--ease-soft)",
          }}
        />
      </div>
      {/* a second, softly blurred copy: the bloom around each bulb when the lamp is on */}
      <img
        src="/assets/scene/decor/fairy-glow.png"
        alt=""
        className="absolute inset-0 h-full w-full"
        style={{ opacity: lit ? 0.9 : 0, filter: "blur(7px) brightness(1.8)", transition: "opacity 700ms var(--ease-soft)" }}
      />
    </div>
  );
}
