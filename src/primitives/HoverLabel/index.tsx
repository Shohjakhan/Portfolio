"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/utils/cn";

/** Minimum gap kept between a label and the viewport's left/right edge. */
const EDGE_GUTTER_PX = 12;

export type HoverLabelPlacement = "top" | "bottom" | "left" | "right";

export interface HoverLabelProps {
  label: string;
  description: string;
  visible: boolean;
  placement?: HoverLabelPlacement;
  /** Nudges the label closer to (or further from) the object — for an
   * object whose interactive box has empty space between its edge and
   * the actual art (see `Easel`, whose box is taller than the canvas it
   * draws), the default placement anchors to the box edge and ends up
   * reading as "too far away" from the thing being labeled. */
  style?: CSSProperties;
}

const placementClasses: Record<HoverLabelPlacement, string> = {
  top: "bottom-full left-1/2 mb-3 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-3 -translate-x-1/2",
  left: "right-full top-1/2 mr-3 -translate-y-1/2",
  right: "left-full top-1/2 ml-3 -translate-y-1/2",
};

/**
 * The callout card from the design reference — a little handwritten note
 * pinned to whatever's being hovered/focused, not a UI tooltip. Purely
 * presentational — visibility is driven by whichever primitive owns
 * hover/focus state (normally InteractiveObject).
 *
 * Title uses `--font-hand` (Alex Brush, a flowing ink-calligraphy face —
 * ties to the feather-quill cursor, "written with the same quill") so the
 * label itself feels magical/storybook, not like a system tooltip. The
 * description stays serif: a full sentence set in a cursive display face
 * gets hard to read fast, so only the short title gets the handwritten
 * treatment. No font-weight class on the title — Alex Brush only ships
 * one weight, a bold class would just trigger faux-bold.
 */
export function HoverLabel({ label, description, visible, placement = "top", style }: HoverLabelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shiftRef = useRef(0);
  const [shiftX, setShiftX] = useState(0);

  // Objects near the room's left/right edge (bookshelf, movie poster,
  // plushie) would otherwise push a centered label past the viewport.
  // That's two bugs, not one: the visible label gets clipped by the
  // stage's `overflow-x-hidden`, and the *hidden* label (opacity 0, still
  // laid out) widens the stage's scrollable area — keyboard focus can then
  // scroll the whole room sideways with no way back. So this clamps at all
  // times, not only while visible: on mount, on each reveal, and on resize.
  // The previous shift is subtracted to recover the natural position.
  useLayoutEffect(() => {
    // Only the horizontally-centered placements can overflow sideways this way.
    if (placement === "left" || placement === "right") return;
    const clamp = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const left = rect.left - shiftRef.current;
      const right = rect.right - shiftRef.current;
      const viewportWidth = document.documentElement.clientWidth;
      let next = 0;
      if (left < EDGE_GUTTER_PX) next = EDGE_GUTTER_PX - left;
      else if (right > viewportWidth - EDGE_GUTTER_PX) next = viewportWidth - EDGE_GUTTER_PX - right;
      shiftRef.current = next;
      setShiftX(next);
    };
    clamp();
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, [visible, placement]);

  return (
    <div
      ref={ref}
      aria-hidden
      style={shiftX ? { ...style, marginLeft: shiftX } : style}
      className={cn(
        "texture-paper pointer-events-none absolute z-10 w-max max-w-56 rounded-[var(--radius-md)] px-4 py-3 shadow-[var(--shadow-warm-md)] transition-[opacity,transform] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]",
        placementClasses[placement],
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0",
      )}
    >
      <p className="font-hand text-2xl leading-none text-[var(--color-paper-ink)]">{label}</p>
      <p className="mt-1.5 font-serif text-xs leading-snug text-[var(--color-paper-ink)]/75">{description}</p>
    </div>
  );
}
