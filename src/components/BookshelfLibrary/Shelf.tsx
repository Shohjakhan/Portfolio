"use client";

import { libraryBooks, type LibraryBookId } from "@/data/library";
import type { BookReadEntry } from "@/types/content";

interface ShelfProps {
  booksRead: BookReadEntry[];
  onSelectBook: (id: LibraryBookId) => void;
  onSelectReadBook: (id: string) => void;
}

/** Rotates through a small palette so a row of read-book spines doesn't
 * read as one repeated color once real entries land. */
const READ_SPINE_COLORS: [string, string][] = [
  ["#7a4a3a", "#54301f"],
  ["#3f5f6b", "#28404a"],
  ["#5f6b3f", "#3a4327"],
  ["#6b3f5a", "#43273a"],
  ["#3f4a6b", "#27314a"],
  ["#6b5a3f", "#44371f"],
];

/**
 * The library's entry screen — an actual two-tier bookcase (cornice, side
 * frame, a shelf board between tiers, base trim), not a wood-textured bar
 * with books floating on it. Top shelf: the user's own two books, standing
 * tall. Bottom shelf: every book read/recommended, each its OWN spine and
 * its own click target — not one "Books I've Read" volume (see
 * `BookshelfLibrary/index.tsx` and `BookReadItem.tsx`).
 */
export function Shelf({ booksRead, onSelectBook, onSelectReadBook }: ShelfProps) {
  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-md font-serif text-sm leading-relaxed text-[var(--color-paper-ink)]/70">
        A little bookcase — two books of mine up top, everything I&apos;ve read lines the shelf below.
      </p>

      <div
        className="relative rounded-[var(--radius-md)] border border-black/40 p-3 shadow-[var(--shadow-warm-lg)] sm:p-4"
        style={{ background: "linear-gradient(180deg, #3a2a1c, #241810)" }}
      >
        {/* cornice / top trim */}
        <div
          aria-hidden
          className="h-3 rounded-[2px] shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
          style={{ background: "linear-gradient(180deg, #5a4230, #3a2a1c)" }}
        />

        {/* top shelf — the two main books, standing tall */}
        <div className="texture-wood-dark relative mt-2 flex items-end justify-center gap-6 rounded-[3px] px-6 pt-10 pb-4 sm:gap-10 sm:pt-14">
          <div aria-hidden className="pointer-events-none absolute inset-x-3 top-0 h-2 rounded-full bg-black/30 blur-[2px]" />
          {libraryBooks.map((book, index) => {
            const Icon = book.icon;
            return (
              <button
                key={book.id}
                type="button"
                onClick={() => onSelectBook(book.id)}
                aria-label={`Open ${book.title}`}
                style={{
                  background: `linear-gradient(155deg, ${book.spineColor}, ${book.spineColorDark})`,
                  animationDelay: `${index * 90}ms`,
                }}
                className="group relative flex h-48 w-28 shrink-0 flex-col items-center justify-between rounded-t-[4px] rounded-b-[2px] border border-black/25 px-2.5 pb-3 pt-5 text-center shadow-[var(--shadow-warm-sm)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-bounce-soft)] hover:-translate-y-3 hover:rotate-[-1.5deg] hover:shadow-[var(--shadow-warm-md)] focus-visible:-translate-y-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--room-lamp-glow)] sm:h-64 sm:w-36 sm:pt-7"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-[6px] rounded-[2px] border border-white/10"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15), inset 0 10px 24px rgba(255,255,255,0.06)" }}
                />
                <Icon size={24} strokeWidth={1.5} className="text-white/85 drop-shadow-sm" aria-hidden />
                <span className="font-serif text-sm leading-tight text-white/95">{book.title}</span>
                <span className="text-[0.65rem] leading-snug text-white/55">{book.subtitle}</span>
                <span
                  aria-hidden
                  className="absolute top-0 right-4 h-6 w-2.5 bg-[var(--room-lamp-glow)]/70 shadow-[var(--shadow-warm-sm)]"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)" }}
                />
              </button>
            );
          })}
        </div>

        {/* the board the two shelves sit on top of one another through */}
        <div
          aria-hidden
          className="relative h-3"
          style={{ background: "linear-gradient(180deg, #5a4230, #2c2015)", boxShadow: "0 3px 6px rgba(0,0,0,0.45) inset" }}
        />

        {/* bottom shelf — books read, each its own spine */}
        <div className="texture-wood-dark relative mb-1 flex min-h-[7.5rem] items-end gap-2 overflow-x-auto rounded-[3px] px-4 pt-6 pb-3 sm:gap-2.5 sm:px-6">
          {booksRead.length === 0 ? (
            <p className="w-full py-6 text-center font-serif text-xs italic text-white/40">
              This shelf is still empty — books read and loved will line up here.
            </p>
          ) : (
            booksRead.map((book, index) => {
              const [top, bottom] = READ_SPINE_COLORS[index % READ_SPINE_COLORS.length];
              return (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => onSelectReadBook(book.id)}
                  aria-label={`Open ${book.title}`}
                  style={{ background: `linear-gradient(155deg, ${top}, ${bottom})` }}
                  className="group flex h-20 w-9 shrink-0 flex-col items-center justify-end rounded-t-[3px] border border-black/25 pb-1.5 shadow-[var(--shadow-warm-sm)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-bounce-soft)] hover:-translate-y-2 hover:shadow-[var(--shadow-warm-md)] focus-visible:-translate-y-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--room-lamp-glow)] sm:h-24 sm:w-11"
                >
                  <span
                    className="truncate text-[0.55rem] text-white/80 sm:text-[0.6rem]"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    {book.title}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* base trim */}
        <div aria-hidden className="mt-1 h-2 rounded-[2px]" style={{ background: "linear-gradient(180deg, #3a2a1c, #241810)" }} />
      </div>
    </div>
  );
}
