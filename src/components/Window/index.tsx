"use client";

import { Background } from "@/components/Background";
import { useSceneValue } from "@/state/sceneStore";
import type { TimeOfDay } from "@/types/scene";
import { cn } from "@/utils/cn";

/** Painted clouds (public/assets/scene/window/), drifting across the glass. In clear weather
 * only the first one passes, by day; cloudy and rainy weather bring all three. */
const CLOUD_LAYERS = [
  { src: "/assets/scene/window/cloud-1.png", top: "8%", left: "6%", width: "46%", duration: 80, delay: -10 },
  { src: "/assets/scene/window/cloud-2.png", top: "26%", left: "46%", width: "54%", duration: 100, delay: -55 },
  { src: "/assets/scene/window/cloud-3.png", top: "44%", left: "18%", width: "40%", duration: 90, delay: -30 },
];

/** Clouds are painted sunlit, so they're dimmed as the light goes. */
const CLOUD_BRIGHTNESS: Record<TimeOfDay, number> = {
  morning: 0.95,
  afternoon: 1,
  sunset: 0.85,
  evening: 0.5,
  night: 0.32,
};

/** Glass opening inside the painted frame (window-frame.png, 640×879),
 * padded ~1% so the sky's edges tuck under the opaque wood. */
const GLASS_BOX = { left: "19.2%", top: "8.6%", width: "61.6%", height: "77.6%" };

/**
 * Purely environmental — not an InteractiveObject (no click mapping for the
 * window itself). Shows the living sky, a moon/stars that fade in toward
 * night, and clouds drifting through on cloudy/rainy weather — all clipped
 * to the glass, behind the painted wooden frame (whose panes are
 * transparent).
 *
 * `className` positions/sizes the window; the default is the desktop
 * canvas placement. The box is aspect-locked to the painted frame.
 */
export function Window({ className }: { className?: string }) {
  const timeOfDay = useSceneValue((state) => state.timeOfDay);
  const weather = useSceneValue((state) => state.weather);
  const reducedMotion = useSceneValue((state) => state.reducedMotion);
  const overcast = weather === "cloudy" || weather === "rain";
  const isDay = timeOfDay === "morning" || timeOfDay === "afternoon";
  const visibleClouds = overcast ? CLOUD_LAYERS : isDay ? CLOUD_LAYERS.slice(0, 1) : [];

  return (
    <div
      aria-hidden
      className={cn(className ?? "absolute left-[50.5%] top-[8.5%] w-[27.5%] -translate-x-1/2")}
      style={{ aspectRatio: "640 / 879" }}
    >
      <div className="absolute overflow-hidden" style={{ ...GLASS_BOX, borderRadius: "50% 50% 0 0 / 28% 28% 0 0" }}>
        <Background className="absolute inset-0" />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ filter: `brightness(${CLOUD_BRIGHTNESS[timeOfDay]})`, transition: "filter var(--duration-scene) var(--ease-soft)" }}
        >
          {CLOUD_LAYERS.map((cloud, index) => (
            // eslint-disable-next-line @next/next/no-img-element -- painted sprite, matches the room's plain <img> convention
            <img
              key={cloud.src}
              src={cloud.src}
              alt=""
              className={reducedMotion ? "absolute" : "window-cloud"}
              style={{
                top: cloud.top,
                left: cloud.left,
                width: cloud.width,
                opacity: visibleClouds.includes(cloud) ? (overcast ? 0.92 : 0.6) : 0,
                transition: "opacity var(--duration-scene) var(--ease-soft)",
                animationDuration: reducedMotion ? undefined : `${cloud.duration}s`,
                animationDelay: reducedMotion ? undefined : `${cloud.delay}s`,
              }}
            />
          ))}
        </div>

        {/* rain running down the glass (the wrapper fades it in; the image itself shimmers) */}
        <div
          className="absolute inset-0"
          style={{ opacity: weather === "rain" ? 1 : 0, transition: "opacity var(--duration-scene) var(--ease-soft)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- painted overlay */}
          <img src="/assets/scene/window/rain-glass.png" alt="" className="rain-glass h-full w-full object-cover" />
        </div>
      </div>

      <img
        src="/assets/scene/window/window-frame.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[var(--shadow-warm-lg)]"
      />
    </div>
  );
}
