import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export type ObjectSurface = "wood" | "wood-dark" | "paper" | "cream";

const surfaceClass: Record<ObjectSurface, string> = {
  wood: "texture-wood",
  "wood-dark": "texture-wood-dark",
  paper: "texture-paper",
  cream: "texture-cream",
};

export interface ObjectMountProps {
  surface: ObjectSurface;
  children: ReactNode;
  className?: string;
}

/**
 * Shared placeholder body for every room object — a textured plaque holding
 * an icon stand-in. Swap the icon for hand-illustrated art per object later
 * without touching InteractiveObject wiring; see docs/adding-interactive-objects.md.
 */
export function ObjectMount({ surface, children, className }: ObjectMountProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-[var(--radius-sm)] border border-black/15 shadow-[var(--shadow-warm-sm)]",
        surfaceClass[surface],
        className,
      )}
    >
      {children}
    </div>
  );
}
