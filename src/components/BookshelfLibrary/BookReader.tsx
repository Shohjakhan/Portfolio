"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SoundTrigger } from "@/primitives/SoundTrigger";
import { cn } from "@/utils/cn";

interface BookReaderSection<T extends string> {
  id: T;
  label: string;
}

interface BookReaderProps<T extends string> {
  sections: BookReaderSection<T>[];
  renderSection: (id: T) => ReactNode;
}

/** Must match the `.page-flip-leaf-forward`/`-backward` animation duration
 * in animations.css — same pairing contract as `PlainBook`'s. */
const FLIP_DURATION_MS = 780;

/** The left page of the spread for a given section — a plain title page
 * (a real book's part-divider, not more prose) rather than a second
 * content column, since a section's body doesn't naturally split into two
 * independent halves the way sequential pages do. */
function TitlePage({ label }: { label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div aria-hidden className="h-px w-10 bg-[var(--color-paper-ink)]/25" />
      <h3 className="font-serif text-2xl leading-snug text-[var(--color-paper-ink)]">{label}</h3>
      <div aria-hidden className="h-px w-10 bg-[var(--color-paper-ink)]/25" />
    </div>
  );
}

function Spread({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="grid h-full grid-cols-2">
      <div className="hidden h-full overflow-y-auto border-r border-[var(--color-paper-ink)]/10 px-5 py-8 sm:block sm:px-10 sm:py-10">
        {left}
      </div>
      <div className="col-span-2 h-full overflow-y-auto px-5 py-6 sm:col-span-1 sm:px-10 sm:py-10">{right}</div>
    </div>
  );
}

/**
 * The physical reading experience shared by My Writings and Warkinless — a
 * top row of bookmark tabs (the table of contents), then the section
 * itself laid out as a real open-book spread: a decorative left "title"
 * page and the section's actual content on the right (collapses to just
 * the right page below `sm`, where there's no room for two columns).
 * Turning pages is a real two-layer flip, not a fade: the new section's
 * spread sits rendered underneath the whole time, and the *outgoing*
 * spread is rendered a second time into an overlay that rotates away on
 * its spine edge (like an actual page lifting and turning) to reveal it —
 * direction-aware, so paging back rotates the other way.
 */
export function BookReader<T extends string>({ sections, renderSection }: BookReaderProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flip, setFlip] = useState<{ fromIndex: number; direction: "forward" | "backward" } | null>(null);
  const flipTimeoutRef = useRef<number | undefined>(undefined);
  const active = sections[activeIndex];

  useEffect(() => () => window.clearTimeout(flipTimeoutRef.current), []);

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(sections.length - 1, index));
    if (clamped === activeIndex) return;
    window.clearTimeout(flipTimeoutRef.current);
    setFlip({ fromIndex: activeIndex, direction: clamped > activeIndex ? "forward" : "backward" });
    setActiveIndex(clamped);
    flipTimeoutRef.current = window.setTimeout(() => setFlip(null), FLIP_DURATION_MS);
  };

  return (
    <div className="flex h-full flex-col">
      <nav
        aria-label="Table of contents"
        className="flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--color-paper-ink)]/10 px-4 py-2.5 sm:gap-1.5 sm:px-6"
      >
        {sections.map((section, index) => (
          <button
            key={section.id}
            type="button"
            onClick={() => goTo(index)}
            aria-current={index === activeIndex ? "true" : undefined}
            className={cn(
              "shrink-0 rounded-[var(--radius-sm)] px-3 py-2 text-left text-xs whitespace-nowrap transition-colors duration-[var(--duration-fast)]",
              index === activeIndex
                ? "bg-[var(--color-accent)]/12 font-medium text-[var(--color-accent)]"
                : "text-[var(--color-paper-ink)]/70 hover:bg-black/5 hover:text-[var(--color-paper-ink)]",
            )}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <div className="relative flex-1 overflow-hidden" style={{ perspective: "2200px" }}>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 z-[1] hidden w-px -translate-x-1/2 bg-[var(--color-paper-ink)]/10 sm:block" />

        <div key={active.id} className="h-full">
          <Spread left={<TitlePage label={active.label} />} right={renderSection(active.id)} />
        </div>

        {flip ? (
          <div
            key={`${flip.fromIndex}-${activeIndex}`}
            aria-hidden
            className={cn(
              "page-flip-leaf absolute inset-0 z-10",
              flip.direction === "forward" ? "page-flip-leaf-forward" : "page-flip-leaf-backward",
            )}
          >
            <Spread left={<TitlePage label={sections[flip.fromIndex].label} />} right={renderSection(sections[flip.fromIndex].id)} />
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-paper-ink)]/10 px-5 py-3 sm:px-8">
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs text-[var(--color-paper-ink)]/70 transition-colors duration-[var(--duration-fast)] hover:bg-black/5 hover:text-[var(--color-paper-ink)] disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft size={14} strokeWidth={1.75} aria-hidden />
          Previous
        </button>
        <p className="text-[0.7rem] text-[var(--color-paper-ink)]/70">
          {activeIndex + 1} / {sections.length}
        </p>
        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === sections.length - 1}
          className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs text-[var(--color-paper-ink)]/70 transition-colors duration-[var(--duration-fast)] hover:bg-black/5 hover:text-[var(--color-paper-ink)] disabled:pointer-events-none disabled:opacity-30"
        >
          Next
          <ChevronRight size={14} strokeWidth={1.75} aria-hidden />
        </button>
      </div>

      {/* Page-turn sound hook — same "silently no-op until a real file +
          audioEnabled" pattern as CustomCursor's quill-tap click sound. */}
      <SoundTrigger cue="pageTurn" trigger={activeIndex} />
    </div>
  );
}
