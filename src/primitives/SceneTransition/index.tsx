"use client";

import type { ReactNode } from "react";
import { SoundTrigger } from "@/primitives/SoundTrigger";
import { useSceneValue } from "@/state/sceneStore";
import { cn } from "@/utils/cn";

export type SceneTransitionVariant = "fade" | "page-turn" | "artwork-forward" | "artwork-backward";

export interface SceneTransitionProps {
  /** Change this to re-trigger the transition (a panel id, a time-of-day value, ...). */
  transitionKey: string | number;
  children: ReactNode;
  className?: string;
  /** "fade" (default) — the shared quick fade+rise every panel uses.
   * "page-turn" — pivots in from the left edge like a page in an open book
   * (see `components/BookshelfLibrary`'s reader).
   * "artwork-forward"/"artwork-backward" — walks in from the right/left
   * and settles slightly enlarged, "stepping toward the viewer" (see
   * `components/ArtGallery`). */
  variant?: SceneTransitionVariant;
}

const VARIANT_CLASS: Record<SceneTransitionVariant, string> = {
  fade: "animate-scene-in",
  "page-turn": "animate-page-turn",
  "artwork-forward": "animate-artwork-forward",
  "artwork-backward": "animate-artwork-backward",
};

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
export function SceneTransition({ transitionKey, children, className, variant = "fade" }: SceneTransitionProps) {
  const reducedMotion = useSceneValue((state) => state.reducedMotion);

  return (
    <>
      <div key={transitionKey} className={cn(!reducedMotion && VARIANT_CLASS[variant], className)}>
        {children}
      </div>
      {/* "Magical scene transition" cue — deliberately a sibling of the
          keyed div above, not a child of it: the div remounts fresh on
          every `transitionKey` change (that's what restarts its CSS
          animation), which would reset `SoundTrigger`'s own "skip first
          mount" tracking every single time and mean it never actually
          fires. Living outside the keyed div, this stays one persistent
          instance for as long as `SceneTransition` itself is mounted, so
          it correctly skips only the very first `transitionKey` (a
          panel's initial content) and plays on every real navigation
          after that. */}
      <SoundTrigger cue="sceneTransition" trigger={transitionKey} />
    </>
  );
}
