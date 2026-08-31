"use client";

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
