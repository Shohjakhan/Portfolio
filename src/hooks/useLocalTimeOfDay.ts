"use client";

import { useEffect } from "react";
import { sceneActions } from "@/state/sceneStore";
import type { TimeOfDay } from "@/types/scene";

/**
 * Clock-hour buckets, not a sunrise/sunset calculation — deliberately simple
 * per CLAUDE.md's "don't over-engineer" bias, and per the task brief: use
 * the visitor's own browser clock (`Date` already reflects their local
 * timezone, no IP lookup needed), not astronomical precision.
 */
const PHASE_START_HOUR: [hour: number, phase: TimeOfDay][] = [
  [5, "morning"],
  [12, "afternoon"],
  [17, "sunset"],
  [19, "evening"],
  [21, "night"],
];

export function resolveTimeOfDay(date: Date): TimeOfDay {
  const hour = date.getHours();
  let phase: TimeOfDay = "night"; // covers the 0–4 wrap-around before "morning" starts at 5
  for (const [startHour, candidate] of PHASE_START_HOUR) {
    if (hour >= startHour) phase = candidate;
  }
  return phase;
}

/** How often to re-check the clock. Phases only change a handful of times a
 * day, so this just needs to be frequent enough that a long-open tab drifts
 * into the next phase within a minute of the real boundary — not a render-per-tick clock. */
const CHECK_INTERVAL_MS = 60_000;

/**
 * Mounted once near the room root. Syncs `sceneStore.timeOfDay` to the
 * visitor's actual local clock, live — so a tab left open across a phase
 * boundary (e.g. sunset while browsing) drifts into the next phase on its
 * own, matching CLAUDE.md's "living environment... gradual, never abrupt."
 */
export function useLocalTimeOfDay() {
  useEffect(() => {
    const sync = () => sceneActions.setTimeOfDay(resolveTimeOfDay(new Date()));
    sync();

    const id = window.setInterval(sync, CHECK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);
}
