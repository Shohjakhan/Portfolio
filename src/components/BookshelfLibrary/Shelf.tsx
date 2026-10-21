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

const SPINE_COUNT = 5;

/** Painted covers for the two main books, shown face-out on the top shelf. */
const COVER: Record<LibraryBookId, string> = {
  writings: "/assets/panels/library/cover-writings.jpg",
  warkinless: "/assets/panels/library/cover-warkinless.jpg",
};

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
    // The bookcase is the whole panel: one big painted case (art-source/07-panels B1, two
    // compartments), nothing around it. Compartment boxes are measured from the painting
    // (% of its size): upper 19-51.5% of the height, lower 58-90.5%, inner sides 13% / 5.5%.
    <div
      className="relative w-full overflow-hidden rounded-[var(--radius-md)] shadow-[var(--shadow-warm-lg)]"
      style={{ aspectRatio: "1202 / 594", backgroundImage: "url(/assets/panels/library/bookcase.jpg)", backgroundSize: "100% 100%" }}
    >
      {/* upper compartment — your two books, face out */}
      <div className="absolute flex items-end justify-center gap-[7%]" style={{ left: "13%", right: "5.5%", top: "20%", height: "31.5%" }}>
        {libraryBooks.map((book, index) => (
          <button
            key={book.id}
            type="button"
            onClick={() => onSelectBook(book.id)}
            aria-label={`Open ${book.title}`}
            style={{ animationDelay: `${index * 90}ms` }}
            className="group relative h-[94%] shrink-0 transition-[transform,filter] duration-[var(--duration-base)] ease-[var(--ease-bounce-soft)] hover:-translate-y-2 hover:rotate-[-1.5deg] hover:[filter:var(--hover-glow)] focus-visible:-translate-y-2 focus-visible:[filter:var(--hover-glow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--room-lamp-glow)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative, matches the room's plain <img> convention */}
            <span className="block h-full overflow-hidden rounded-[3px] shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
              <img src={COVER[book.id]} alt="" aria-hidden className="block h-full w-auto" />
            </span>
            {/* the title, on the shelf board under the book */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-full mt-[4%] -translate-x-1/2 whitespace-nowrap font-hand text-[clamp(0.9rem,1.9vw,1.7rem)] leading-none text-[var(--color-cream)]/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.85)]"
            >
              {book.title}
            </span>
          </button>
        ))}
      </div>

      {/* lower compartment — everything read, one painted spine each; scrolls sideways */}
      <div
        className="absolute flex items-end gap-[0.6%] overflow-x-auto overflow-y-hidden pb-1"
        style={{ left: "13%", right: "5.5%", top: "58%", height: "32.5%" }}
      >
        {booksRead.length === 0 ? (
          <p className="w-full self-center px-4 text-center font-serif text-xs italic text-white/55">
            This shelf is still empty — books read and loved will line up here.
          </p>
        ) : (
          booksRead.map((book, index) => (
            <button
              key={book.id}
              type="button"
              onClick={() => onSelectReadBook(book.id)}
              aria-label={`Open ${book.title}`}
              className="group relative h-[92%] shrink-0 transition-[transform,filter] duration-[var(--duration-base)] ease-[var(--ease-bounce-soft)] hover:-translate-y-2 hover:[filter:var(--hover-glow)] focus-visible:-translate-y-2 focus-visible:[filter:var(--hover-glow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--room-lamp-glow)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative, matches the room's plain <img> convention */}
              <img src={`/assets/panels/library/spine-${(index % SPINE_COUNT) + 1}.png`} alt="" aria-hidden className="block h-full w-auto drop-shadow-[0_3px_4px_rgba(0,0,0,0.5)]" />
              {/* the title sits on the spine's own face (the painted book also shows its side
                  on the right, so the face is the left ~84%), centred both ways */}
              <span
                className="pointer-events-none absolute bottom-[10%] left-0 right-[16%] top-[10%] flex items-center justify-center overflow-hidden px-[8%] font-serif text-[clamp(0.5rem,1vw,0.8rem)] text-[var(--color-cream)]/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.7)]"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                <span className="max-h-full truncate">{book.title}</span>
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
