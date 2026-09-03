"use client";

import { AmbientLayer, type AmbientVariant } from "@/primitives/AmbientLayer";
import { useSceneValue } from "@/state/sceneStore";
import type { VisitStage } from "@/types/scene";

/** "More particles appear" the longer someone stays (LONG-STAY SYSTEM) —
 * a gentle multiplier on the base count, never a jump. */
const STAGE_PARTICLE_MULTIPLIER: Record<VisitStage, number> = {
  initial: 1,
  settled: 1.2,
  relaxed: 1.4,
  lateVisitor: 1.6,
};

interface AmbientEffectsProps {
  /** Extra multiplier on top of the visit-stage one — `MobileRoom` passes
   * `0.5` for "Mobile: simplified animations": fewer particles animating
   * at once is a real, deliberate simplification (less to paint per
   * frame on typically less powerful hardware), not a visual regression,
   * since these are already purely decorative (`aria-hidden`) atmosphere. */
  density?: number;
}

/**
 * Picks which ambient particle variant matches the room's current weather
 * and time-of-day, so individual scenes don't each hardcode one. Weather
 * takes priority over time-of-day (rain/snow read as an override of the
 * ambient mood, not a competing signal) — "cloudy" has no dedicated
 * particle variant (it's a sky/window change, see Window/index.tsx), so it
 * falls through to the time-of-day default.
 */
export function AmbientEffects({ density = 1 }: AmbientEffectsProps) {
  const timeOfDay = useSceneValue((state) => state.timeOfDay);
  const weather = useSceneValue((state) => state.weather);
  const visitStage = useSceneValue((state) => state.visitStage);

  const multiplier = STAGE_PARTICLE_MULTIPLIER[visitStage] * density;
  const scaled = (base: number) => Math.round(base * multiplier);

  let variant: AmbientVariant;
  let base: number;
  if (weather === "snow") {
    variant = "snow";
    base = 22;
  } else if (weather === "rain") {
    variant = "rain";
    base = 30;
  } else if (timeOfDay === "night" || timeOfDay === "evening") {
    variant = "firefly";
    base = 14;
  } else {
    variant = "dust";
    base = 10;
  }

  return <AmbientLayer variant={variant} count={scaled(base)} />;
}
