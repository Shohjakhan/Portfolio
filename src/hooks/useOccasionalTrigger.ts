"use client";

import { useEffect, useState } from "react";
import { useSceneValue } from "@/state/sceneStore";

/**
 * Fires a brief `true` pulse on a recurring interval — for anything that
 * should do something small "occasionally" rather than continuously (a cat
 * stirring, a page fluttering). Returns `active`: true only for
 * `activeDurationMs` after each interval tick, false otherwise. Automatically
 * off under `prefers-reduced-motion` (no timers even scheduled) so this is
 * safe to call unconditionally from any object.
 *
 * Interval-driven, not per-frame — every tick is one state write, nothing
 * continuous. Object components own how visible the resulting animation is
 * (see Cat's `data-stir` class); this hook only owns the timing.
 */
export function useOccasionalTrigger(intervalMs: number, activeDurationMs = 1600): boolean {
  const reducedMotion = useSceneValue((state) => state.reducedMotion);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setActive(false);
      return;
    }

    let activeTimeoutId: number | undefined;
    const intervalId = window.setInterval(() => {
      setActive(true);
      activeTimeoutId = window.setTimeout(() => setActive(false), activeDurationMs);
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
      if (activeTimeoutId !== undefined) window.clearTimeout(activeTimeoutId);
    };
  }, [intervalMs, activeDurationMs, reducedMotion]);

  return active;
}
