"use client";

import { useSceneValue } from "@/state/sceneStore";
import type { TimeOfDay } from "@/types/scene";

/** Maps to the --lamp-intensity-* tokens in variables.css (0 = off, 1 = full
 * warm glow) — "gradual lamp activation" at sunset, fully lit by night. */
const LAMP_INTENSITY_VAR: Record<TimeOfDay, string> = {
  morning: "--lamp-intensity-morning",
  afternoon: "--lamp-intensity-afternoon",
  sunset: "--lamp-intensity-sunset",
  evening: "--lamp-intensity-evening",
  night: "--lamp-intensity-night",
};

/**
 * Purely environmental — like `Window`, not an `InteractiveObject`. The
 * design reference shows a lamp but CLAUDE.md §2's click-mapping never
 * assigns it a panel (only "on/off by time of day" under Living
 * environment), so it stays a non-clickable light source for now. See
 * docs/asset-inventory.md for the open question of whether it should
 * become a real SceneObjectId later.
 */
export function Lamp() {
  const timeOfDay = useSceneValue((state) => state.timeOfDay);
  const intensityVar = LAMP_INTENSITY_VAR[timeOfDay];

  return (
    <div aria-hidden className="relative h-full w-full">
      <img
        src="/assets/scene/decor/lamp.svg"
        alt=""
        className="h-full w-full object-contain object-bottom drop-shadow-[var(--shadow-warm-md)]"
      />
      <div
        data-idle="flicker"
        style={{ animationDelay: "600ms" }}
        className="pointer-events-none absolute left-1/2 top-[42%] h-[55%] w-[85%] -translate-x-1/2"
      >
        <div
          className="h-full w-full"
          style={{
            background: "radial-gradient(45% 45% at 50% 45%, var(--room-lamp-glow), transparent 72%)",
            opacity: `calc(0.6 * var(${intensityVar}))`,
            transition: `opacity var(--duration-scene) var(--ease-soft)`,
          }}
        />
      </div>
    </div>
  );
}
