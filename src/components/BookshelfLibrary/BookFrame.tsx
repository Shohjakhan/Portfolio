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
    <div className="animate-book-open w-full" style={{ "--book-tilt": tilt, transformOrigin: "left center" } as CSSProperties}>
      {/* the way back, and which book this is — above the book, on the dark backdrop */}
      <div className="mb-2 flex items-center gap-3 px-1 text-[var(--color-cream)]">
        <button
          type="button"
          onClick={onBack}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-xs backdrop-blur-sm transition-colors duration-[var(--duration-fast)] hover:bg-black/55"
        >
          <ArrowLeft size={14} strokeWidth={1.75} aria-hidden />
          Shelf
        </button>
        <Icon size={16} strokeWidth={1.5} className="shrink-0 text-[var(--room-lamp-glow)]" aria-hidden />
        <div className="min-w-0">
          <p className="truncate font-serif text-sm">{title}</p>
          <p className="truncate text-[0.7rem] text-[var(--color-cream)]/70">{subtitle}</p>
        </div>
      </div>

      {/* the painted open book (art-source/08-living-room); the pages are the two light areas, so the
          reading content is inset to sit on them */}
      <div
        className="book-art relative w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]"
        style={{ aspectRatio: "1810 / 1265", backgroundImage: "url(/assets/panels/library/book-open.jpg)", backgroundSize: "100% 100%" }}
      >
        <div className="absolute overflow-hidden" style={{ left: "7%", right: "7%", top: "8.5%", bottom: "9%" }}>
          <div className="h-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
