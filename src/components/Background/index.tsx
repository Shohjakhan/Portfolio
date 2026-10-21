"use client";

import { useEffect, useState } from "react";
import { Birds } from "@/components/Birds";
import { useSceneValue } from "@/state/sceneStore";
import type { TimeOfDay } from "@/types/scene";

const SKY_TOKENS: Record<TimeOfDay, [string, string]> = {
  morning: ["--sky-morning-top", "--sky-morning-bottom"],
  afternoon: ["--sky-afternoon-top", "--sky-afternoon-bottom"],
  sunset: ["--sky-sunset-top", "--sky-sunset-bottom"],
  evening: ["--sky-evening-top", "--sky-evening-bottom"],
  night: ["--sky-night-top", "--sky-night-bottom"],
};

/** One painted sky per phase of the day (public/assets/scene/window/). */
const SKY_PLATES: Record<TimeOfDay, string> = {
  morning: "/assets/scene/window/sky-dawn.jpg",
  afternoon: "/assets/scene/window/sky-day.jpg",
  sunset: "/assets/scene/window/sky-sunset.jpg",
  evening: "/assets/scene/window/sky-dusk.jpg",
  night: "/assets/scene/window/sky-night.jpg",
};
const SKY_FADE_MS = 7000;

/** The painted skies, cross-faded as the clock moves on: the new sky fades in over the old one,
 * which stays underneath until it is done (so there's never a dim dip between the two). */
function SkyPlates({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const [layers, setLayers] = useState<{ time: TimeOfDay; fresh: boolean }[]>([{ time: timeOfDay, fresh: false }]);

  useEffect(() => {
    Object.values(SKY_PLATES).forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  useEffect(() => {
    setLayers((current) => {
      if (current[current.length - 1]?.time === timeOfDay) return current;
      return [...current.filter((layer) => layer.time !== timeOfDay), { time: timeOfDay, fresh: true }];
    });
    const id = window.setTimeout(() => setLayers((current) => current.slice(-1).map((l) => ({ ...l, fresh: false }))), SKY_FADE_MS + 200);
    return () => window.clearTimeout(id);
  }, [timeOfDay]);

  return (
    <>
      {layers.map((layer) => (
        // eslint-disable-next-line @next/next/no-img-element -- painted plate, matches the room's plain <img> convention
        <img
          key={layer.time}
          src={SKY_PLATES[layer.time]}
          alt=""
          className={layer.fresh ? "sky-plate-in absolute inset-0 h-full w-full object-cover object-bottom" : "absolute inset-0 h-full w-full object-cover object-bottom"}
        />
      ))}
    </>
  );
}

/**
 * The room's sky — reads only `timeOfDay`/`weather`, so a hover on some
 * unrelated object never re-renders this. Only ever mounted inside
 * `Window`, which layers the frame/moon/stars/clouds on top of it.
 */
export function Background({ className }: { className?: string }) {
  const timeOfDay = useSceneValue((state) => state.timeOfDay);
  const weather = useSceneValue((state) => state.weather);
  const [top, bottom] = SKY_TOKENS[timeOfDay];
  const isOvercast = weather === "cloudy" || weather === "rain";

  return (
    <div
      aria-hidden
      className={className ?? "absolute inset-0"}
      style={{
        background: `linear-gradient(180deg, var(${top}), var(${bottom}))`,
        transition: `background var(--duration-scene) var(--ease-soft)`,
      }}
    >
      <SkyPlates timeOfDay={timeOfDay} />

      {/* Overcast tint — a soft grey wash, not a filter/desaturate hack on
          the gradient itself, so the underlying sky colors stay intact and
          just read muted. */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(160, 168, 180, 0.22)",
          opacity: isOvercast ? 1 : 0,
          transition: `opacity var(--duration-scene) var(--ease-soft)`,
        }}
      />
      <Birds />
    </div>
  );
}
