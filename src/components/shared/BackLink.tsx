"use client";

import { cn } from "@/utils/cn";

interface BackLinkProps {
  onClick: () => void;
  /** What follows "← back to " — defaults to "the room" (every panel's
   * exit), overridden where a panel has its own nested "back" (e.g.
   * `FilmStrip`'s "the reels", stepping out of one reel to the shelf). */
  label?: string;
  /** "light" (default) — paper-ink on a paper/cream surface, the
   * `Modal` "memory" variant every non-dark panel uses. "dark" — cream on
   * the near-black `texture-gallery`/`texture-screen` surfaces
   * (`ArtGallery`). */
  variant?: "light" | "dark";
  align?: "start" | "center";
  className?: string;
}

/**
 * The room's one "leave this panel" link — every panel's exit control
 * used to be ~10 copies of the same className string (identical down to
 * the duration token), which meant a deliberate change to one — like the
 * contrast pass that took every instance from 60%/50% opacity to a
 * WCAG-AA-passing 70% — had to be repeated by hand at every call site and
 * was easy to miss one of. One component now, one place to change.
 */
export function BackLink({ onClick, label = "the room", variant = "light", align = "start", className }: BackLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "font-hand-note text-xl transition-colors duration-[var(--duration-fast)]",
        align === "start" ? "self-start" : "self-center",
        variant === "light" ? "text-[var(--color-paper-ink)]/70 hover:text-[var(--color-accent)]" : "text-[var(--color-cream)]/70 hover:text-[var(--room-lamp-glow)]",
        className,
      )}
    >
      ← back to {label}
    </button>
  );
}
