"use client";

import { useId, useState, type CSSProperties, type ReactNode } from "react";
import type { InteractionCueId } from "@/lib/audio/cues";
import { audioManager } from "@/lib/audio/manager";
import { HoverLabel, type HoverLabelPlacement } from "@/primitives/HoverLabel";
import { sceneActions, useSceneValue } from "@/state/sceneStore";
import type { SceneObjectId } from "@/types/scene";
import { cn } from "@/utils/cn";

export type IdleAnimation = "none" | "sway" | "float" | "flicker" | "breathe" | "settle";
export type HoverEffect = "none" | "glow" | "tilt" | "wiggle" | "lift";

export interface InteractiveObjectProps {
  id: SceneObjectId;
  /** Accessible name. Also the hover callout's handwritten title — see docs/adding-interactive-objects.md's
   * naming guidance ("About Me", not "Coffee") and `src/data/sceneObjects.ts`. */
  label: string;
  /** One line shown in the hover callout and exposed to screen readers via aria-describedby. */
  description: string;
  /** Fires the object's OPEN transition (see the component doc below) — normally `() => sceneActions.openPanel(id)`. */
  onActivate: () => void;
  idleAnimation?: IdleAnimation;
  hoverEffect?: HoverEffect;
  /** Cue played on hover-enter/focus (see `lib/audio/manager.ts`) —
   * "magical hover sparkle" by default so every object gets it for free,
   * same as `hoverEffect`. Override for an object whose hover reads as
   * something more specific than generic magic (Journal's page-skew
   * hover uses `"paperRustle"` instead — see `components/Journal`). */
  hoverSound?: InteractionCueId;
  /** Staggers this object's idle animation against every other object's, so a
   * room full of "breathe"/"sway" objects doesn't pulse in visible unison. */
  idleDelayMs?: number;
  idleDurationMs?: number;
  labelPlacement?: HoverLabelPlacement;
  /** Passed through to `HoverLabel` — see its doc comment for when an
   * object needs this (a box taller/wider than its actual art). */
  labelStyle?: CSSProperties;
  /** For toggles (the lamp): exposes on/off to assistive tech. */
  pressed?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * The room's one interaction abstraction — every clickable object is built
 * by wrapping this around some art, not by hand-rolling hover/focus/click
 * state per object. See docs/adding-interactive-objects.md for the
 * checklist to add a new one.
 *
 * Implements the three states every interactive object supports:
 * - **IDLE** — `idleAnimation`, a continuous `data-idle` CSS loop (see
 *   `room-*` keyframes in animations.css). Optional ("none" is valid) but
 *   per the design brief every real object should set one.
 * - **HOVER** (mirrors keyboard focus — pointer and keyboard users get the
 *   identical reaction) — `hoverEffect` drives the object's own
 *   glow/tilt/wiggle/lift, `HoverLabel` shows the handwritten callout,
 *   `hoverSound` plays through `audioManager` (gated on sound being on;
 *   see the manager's own cooldown/concurrency limits for why a rapid
 *   sweep across several objects doesn't turn into overlapping noise),
 *   and the feather cursor's
 *   scale/glow/sparkle reaction (`CustomCursor`, `cursorStore`) happens
 *   automatically for any real `<button>` — this component renders one,
 *   so no extra wiring is needed per object.
 * - **OPEN** — `onActivate` fires on click *or* Enter/Space (native button
 *   semantics, not a custom key handler), normally opening `Modal` via
 *   `sceneActions.openPanel`, which owns its own smooth entrance/exit
 *   (`animate-scene-in`), focus trap, and Escape-to-close.
 *
 * A real <button> underneath — not a styled <div> — is what makes
 * keyboard access, an accessible name, and "activates on tap with no
 * hover step" all fall out for free rather than needing to be
 * reimplemented per object.
 */
export function InteractiveObject({
  id,
  label,
  description,
  onActivate,
  idleAnimation = "none",
  hoverEffect = "glow",
  hoverSound = "hoverSparkle",
  idleDelayMs = 0,
  idleDurationMs,
  labelPlacement = "top",
  labelStyle,
  pressed,
  className,
  style,
  children,
}: InteractiveObjectProps) {
  const descriptionId = useId();
  const [isLocalActive, setIsLocalActive] = useState(false);
  const reducedMotion = useSceneValue((state) => state.reducedMotion);

  const effectiveIdle = reducedMotion ? "none" : idleAnimation;
  const effectiveHover = reducedMotion && hoverEffect === "wiggle" ? "lift" : hoverEffect;

  const setActive = (active: boolean) => {
    setIsLocalActive(active);
    sceneActions.setActiveObject(active ? id : null);
    if (active) audioManager.playInteraction(hoverSound);
  };

  return (
    <div className={cn("pointer-events-auto relative inline-flex", className)} style={style}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={descriptionId}
        aria-pressed={pressed}
        data-hover={effectiveHover !== "none" ? effectiveHover : undefined}
        data-object={id}
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        onClick={onActivate}
        className="relative block h-full w-full cursor-pointer bg-transparent p-0 transition-[transform,filter] duration-[var(--duration-fast)] ease-[var(--ease-soft)]"
      >
        {/* Idle motion lives on this inner wrapper, not on the button: a running CSS
            animation on `transform` beats the hover rule's `transform: scale(...)` on
            the same element, so with both on the button an animated object (coffee,
            journal, easel, photo wall, plushie) would never grow on hover. */}
        <span
          data-idle={effectiveIdle !== "none" ? effectiveIdle : undefined}
          style={
            effectiveIdle !== "none"
              ? { animationDelay: `${idleDelayMs}ms`, animationDuration: idleDurationMs ? `${idleDurationMs}ms` : undefined }
              : undefined
          }
          className="interactive-body block h-full w-full"
        >
          {children}
        </span>
        <span id={descriptionId} className="sr-only">
          {description}
        </span>
      </button>
      <HoverLabel
        label={label}
        description={description}
        visible={isLocalActive}
        placement={labelPlacement}
        style={labelStyle}
      />
    </div>
  );
}
