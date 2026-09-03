"use client";

import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { audioManager } from "@/lib/audio/manager";

interface BookFrameProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  onBack: () => void;
  /** ±1-ish — a slightly different opening angle per book (see the
   * `book-open` keyframe's `--book-tilt`) so the three don't feel like the
   * exact same animation replayed three times. */
  tilt?: number;
  children: ReactNode;
}

/**
 * Shared "open book" chrome for both `BookReader` (My Writings, Warkinless)
 * and `BooksReadShelf` — the book-opening animation, the spine gutter
 * shadow, and the "← Shelf" back button live here once rather than being
 * duplicated per book. `BookshelfLibrary/index.tsx` keys this by book id,
 * so a fresh mount (and the open animation) happens every time a book is
 * picked up.
 */
export function BookFrame({ title, subtitle, icon: Icon, onBack, tilt = 1, children }: BookFrameProps) {
  // "Book opening" cue — `BookshelfLibrary/index.tsx` keys every opened
  // book fresh (see its own doc comment), so this component mounting at
  // all *is* "a book was just opened" — a plain mount-effect, not a
  // `SoundTrigger`, since there's no "first mount to skip" here the way
  // there is for a long-lived component like `Modal`.
  useEffect(() => {
    audioManager.playInteraction("bookOpen");
  }, []);

  return (
    <div
      className="animate-book-open texture-paper relative flex h-[76vh] flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-paper-ink)]/10 shadow-[var(--shadow-warm-lg)] sm:h-[80vh]"
      style={{ "--book-tilt": tilt, transformOrigin: "left center" } as CSSProperties}
    >
      {/* spine gutter — a soft shadow down the bound edge, like a real open book */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-black/18 to-transparent"
      />

      <div className="flex items-center gap-3 border-b border-[var(--color-paper-ink)]/10 bg-black/[0.02] px-5 py-3 sm:px-8">
        <button
          type="button"
          onClick={onBack}
          className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs text-[var(--color-paper-ink)]/70 transition-colors duration-[var(--duration-fast)] hover:bg-black/5 hover:text-[var(--color-paper-ink)]"
        >
          <ArrowLeft size={14} strokeWidth={1.75} aria-hidden />
          Shelf
        </button>
        <div className="h-4 w-px bg-[var(--color-paper-ink)]/15" aria-hidden />
        <Icon size={16} strokeWidth={1.5} className="shrink-0 text-[var(--color-accent)]" aria-hidden />
        <div className="min-w-0">
          <p className="truncate font-serif text-sm text-[var(--color-paper-ink)]">{title}</p>
          <p className="truncate text-[0.7rem] text-[var(--color-paper-ink)]/70">{subtitle}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
