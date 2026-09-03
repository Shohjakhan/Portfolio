import type { CSSProperties } from "react";
import { cn } from "@/utils/cn";

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
  return (
    <div
      aria-hidden
      style={style}
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
