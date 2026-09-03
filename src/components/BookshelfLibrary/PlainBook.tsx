"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SoundTrigger } from "@/primitives/SoundTrigger";
import { cn } from "@/utils/cn";

interface PlainBookProps {
  pages: ReactNode[];
}

/** Must match the `.page-flip-leaf-forward`/`-backward` animation duration
 * in animations.css — same pairing contract as `BookReader`'s. */
const FLIP_DURATION_MS = 780;

function Spread({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="grid h-full grid-cols-2">
      <div className="h-full overflow-y-auto border-r border-[var(--color-paper-ink)]/10 px-5 py-8 sm:px-10 sm:py-10">
        {left}
      </div>
      <div className="h-full overflow-y-auto px-5 py-8 sm:px-10 sm:py-10">{right}</div>
    </div>
  );
}

/**
 * A book with no table of contents — just numbered pages, read front to
 * back like an actual paperback, laid out as a real open-book spread (a
 * left page and a right page at once, split by the spine), not one
 * full-width column. `pages` is still a flat array — each *spread* shows
 * `pages[i*2]` on the left and `pages[i*2+1]` on the right, so passing an
 * odd count just leaves the last spread's right page empty rather than
 * needing pairs pre-built by the caller.
 *
 * Same two-layer physical flip as `BookReader` (the outgoing spread is
 * re-rendered into an opaque overlay that rotates away on its spine edge
 * to reveal the next spread already sitting underneath), applied to the
 * whole spread as one turning unit rather than modeling each leaf
 * independently. Click zones on the page's own left/right edges turn
 * pages too, not only the footer buttons.
 */
export function PlainBook({ pages }: PlainBookProps) {
  const spreadCount = Math.max(1, Math.ceil(pages.length / 2));
  const [activeSpread, setActiveSpread] = useState(0);
  const [flip, setFlip] = useState<{ fromSpread: number; direction: "forward" | "backward" } | null>(null);
  const flipTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(flipTimeoutRef.current), []);

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(spreadCount - 1, index));
    if (clamped === activeSpread) return;
    window.clearTimeout(flipTimeoutRef.current);
    setFlip({ fromSpread: activeSpread, direction: clamped > activeSpread ? "forward" : "backward" });
    setActiveSpread(clamped);
    flipTimeoutRef.current = window.setTimeout(() => setFlip(null), FLIP_DURATION_MS);
  };

  const isFirst = activeSpread === 0;
  const isLast = activeSpread === spreadCount - 1;
  const leftPageNumber = activeSpread * 2 + 1;
  const rightPageNumber = activeSpread * 2 + 2;
  const hasRightPage = rightPageNumber <= pages.length;

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden" style={{ perspective: "2200px" }}>
        {/* the spine — always visible under both layers, between the two pages */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 z-[1] w-px -translate-x-1/2 bg-[var(--color-paper-ink)]/10"
        />

        <div key={activeSpread} className="h-full">
          <Spread left={pages[activeSpread * 2] ?? null} right={pages[activeSpread * 2 + 1] ?? null} />
        </div>

        {flip ? (
          <div
            key={`${flip.fromSpread}-${activeSpread}`}
            aria-hidden
            className={cn(
              "page-flip-leaf absolute inset-0 z-10",
              flip.direction === "forward" ? "page-flip-leaf-forward" : "page-flip-leaf-backward",
            )}
          >
            <Spread left={pages[flip.fromSpread * 2] ?? null} right={pages[flip.fromSpread * 2 + 1] ?? null} />
          </div>
        ) : null}

        {!isFirst && (
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => goTo(activeSpread - 1)}
            className="absolute inset-y-0 left-0 z-20 w-10 cursor-w-resize sm:w-16"
          />
        )}
        {!isLast && (
          <button
            type="button"
            aria-label="Next page"
            onClick={() => goTo(activeSpread + 1)}
            className="absolute inset-y-0 right-0 z-20 w-10 cursor-e-resize sm:w-16"
          />
        )}

        {!isLast && (
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 bottom-0 h-9 w-9 opacity-[0.07]"
            style={{
              background: "linear-gradient(135deg, transparent 50%, var(--color-paper-ink) 50%)",
              clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
            }}
          />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-paper-ink)]/10 px-5 py-3 sm:px-8">
        <button
          type="button"
          onClick={() => goTo(activeSpread - 1)}
          disabled={isFirst}
          className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs text-[var(--color-paper-ink)]/70 transition-colors duration-[var(--duration-fast)] hover:bg-black/5 hover:text-[var(--color-paper-ink)] disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft size={14} strokeWidth={1.75} aria-hidden />
          Previous
        </button>
        <p className="text-[0.7rem] text-[var(--color-paper-ink)]/70">
          Pages {leftPageNumber}
          {hasRightPage ? `–${rightPageNumber}` : ""} of {pages.length}
        </p>
        <button
          type="button"
          onClick={() => goTo(activeSpread + 1)}
          disabled={isLast}
          className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs text-[var(--color-paper-ink)]/70 transition-colors duration-[var(--duration-fast)] hover:bg-black/5 hover:text-[var(--color-paper-ink)] disabled:pointer-events-none disabled:opacity-30"
        >
          Next
          <ChevronRight size={14} strokeWidth={1.75} aria-hidden />
        </button>
      </div>

      {/* Same "wired now, file later" sound hook as BookReader/CustomCursor. */}
      <SoundTrigger cue="pageTurn" trigger={activeSpread} />
    </div>
  );
}
