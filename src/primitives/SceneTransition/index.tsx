"use client";

import type { ReactNode } from "react";
import { useSceneValue } from "@/state/sceneStore";
import { cn } from "@/utils/cn";

export interface SceneTransitionProps {
  /** Change this to re-trigger the transition (a panel id, a time-of-day value, ...). */
  transitionKey: string | number;
  children: ReactNode;
  className?: string;
}

/**
 * Enter transition for content that swaps wholesale — a modal's panel body,
 * a time-of-day-driven background. Keying a fresh element on `transitionKey`
 * remounts it, which restarts the CSS animation; no JS animation loop and
 * no re-render of anything outside this subtree.
 *
 * This is enter-only (no true cross-fade with the outgoing content) — good
 * enough for the current instant panel-swap needs. If a scene ever needs an
 * overlapping exit, that's the point to reach for a real animation library.
 */
export function SceneTransition({ transitionKey, children, className }: SceneTransitionProps) {
  const reducedMotion = useSceneValue((state) => state.reducedMotion);

  return (
    <div key={transitionKey} className={cn(!reducedMotion && "animate-scene-in", className)}>
      {children}
    </div>
  );
}
