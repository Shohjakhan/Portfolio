"use client";

import { Background } from "@/components/Background";
import { useSceneValue } from "@/state/sceneStore";
import type { TimeOfDay } from "@/types/scene";

const STAR_POSITIONS = [
  { left: "14%", top: "18%" },
  { left: "26%", top: "34%" },
  { left: "40%", top: "12%" },
  { left: "58%", top: "28%" },
  { left: "72%", top: "16%" },
  { left: "82%", top: "40%" },
];

const CLOUD_LAYERS = [
  { top: "10%", left: "8%", width: "42%", duration: 70, delay: -8 },
  { top: "24%", left: "48%", width: "34%", duration: 90, delay: -40 },
];

/** Moon/stars stay mounted at all times and just fade — a conditional
 * mount would snap in/out instead of crossfading, which reads as abrupt
 * rather than "gradual and visually pleasing" (see the task brief). Faint
 * at sunset (stars gathering), full only at night. */
const NIGHT_SKY_OPACITY: Record<TimeOfDay, number> = {
  morning: 0,
  afternoon: 0,
  sunset: 0.3,
  evening: 0.75,
  night: 1,
};

/**
 * Purely environmental — not an InteractiveObject (no click mapping for the
 * window itself). Shows the living sky, a moon/stars that fade in toward
 * night, and clouds drifting through on cloudy/rainy weather.
 */
export function Window() {
  const timeOfDay = useSceneValue((state) => state.timeOfDay);
  const weather = useSceneValue((state) => state.weather);
  const reducedMotion = useSceneValue((state) => state.reducedMotion);
  const nightSkyOpacity = NIGHT_SKY_OPACITY[timeOfDay];
  const showClouds = weather === "cloudy" || weather === "rain";

  return (
    <div
      aria-hidden
      className="texture-wood-dark absolute left-1/2 top-[5%] h-[48%] w-[30%] min-w-72 -translate-x-1/2 overflow-hidden rounded-t-[42%] rounded-b-lg border-[6px] border-[var(--color-wood-dark)] shadow-[var(--shadow-warm-lg)]"
    >
      <Background className="absolute inset-0" />

      <div
        className="absolute inset-0"
        style={{ opacity: nightSkyOpacity, transition: `opacity var(--duration-scene) var(--ease-soft)` }}
      >
        <div
          data-idle="breathe"
          className="absolute right-[16%] top-[14%] h-7 w-7 rounded-full"
          style={{ background: "var(--room-moonlight)", boxShadow: "0 0 24px var(--room-moonlight)" }}
        />
        {STAR_POSITIONS.map((position, index) => (
          <span
            key={index}
            data-idle="flicker"
            className="absolute h-[3px] w-[3px] rounded-full bg-white/90"
            style={{ left: position.left, top: position.top, animationDelay: `${index * 0.4}s` }}
          />
        ))}
      </div>

      {showClouds && (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ opacity: 0.8, transition: `opacity var(--duration-scene) var(--ease-soft)` }}
        >
          {CLOUD_LAYERS.map((cloud, index) => (
            <img
              key={index}
              src="/assets/scene/window/cloud.svg"
              alt=""
              className={reducedMotion ? "absolute" : "window-cloud"}
              style={{
                top: cloud.top,
                left: cloud.left,
                width: cloud.width,
                animationDuration: reducedMotion ? undefined : `${cloud.duration}s`,
                animationDelay: reducedMotion ? undefined : `${cloud.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Window mullion */}
      <div className="pointer-events-none absolute inset-0 border-[3px] border-white/10" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-white/10" />
      <div className="pointer-events-none absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 bg-white/10" />
    </div>
  );
}
