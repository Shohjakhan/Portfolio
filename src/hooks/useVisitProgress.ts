"use client";

import { useEffect } from "react";
import { sceneActions } from "@/state/sceneStore";
import type { VisitStage } from "@/types/scene";

/**
 * Dwell-time thresholds, tunable. Deliberately short enough to actually be
 * seen during a normal portfolio visit (a real "come back in an hour"
 * schedule would mean almost nobody ever sees "relaxed"/"lateVisitor").
 * Each stage fires exactly once via its own `setTimeout` — not a ticking
 * interval — so a full visit costs at most 3 state writes total, never a
 * per-second re-render.
 */
const STAGE_THRESHOLDS_MS: [delay: number, stage: VisitStage][] = [
  [45_000, "settled"],
  [150_000, "relaxed"],
  [360_000, "lateVisitor"],
];

/**
 * Mounted once near the room root. Purely a dwell-time signal — see
 * `docs/adding-interactive-objects.md`-style objects for how individual
 * components (Cat's occasional stir, AmbientEffects' particle count) read
 * `sceneStore.visitStage` to make later stages feel like small discoveries,
 * never an obvious "you've been here a while!" prompt.
 */
export function useVisitProgress() {
  useEffect(() => {
    const timers = STAGE_THRESHOLDS_MS.map(([delay, stage]) =>
      window.setTimeout(() => sceneActions.setVisitStage(stage), delay),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);
}
