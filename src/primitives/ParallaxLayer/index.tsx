import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface ParallaxLayerProps {
  /** 0 = static, 1 = full pointer-range travel. Farther "background" layers want smaller values. */
  depth?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Shifts its content based on `--pointer-x` / `--pointer-y`, two custom
 * properties the Room root updates imperatively on pointermove (see
 * Room/index.tsx). No React state involved, so pointer movement never
 * triggers a re-render here — only a CSS transform recalculation.
 */
export function ParallaxLayer({ depth = 0.5, className, style, children }: ParallaxLayerProps) {
  const travelX = depth * 18;
  const travelY = depth * 12;

  return (
    <div
      className={cn("will-change-transform", className)}
      style={{
        transform: `translate3d(calc(var(--pointer-x, 0) * ${travelX}px), calc(var(--pointer-y, 0) * ${travelY}px), 0)`,
        transition: `transform var(--duration-slow) var(--ease-soft)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
