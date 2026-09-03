"use client";

import { BookOpenText } from "lucide-react";
import { BookFrame } from "@/components/BookshelfLibrary/BookFrame";
import type { BookReadEntry } from "@/types/content";

interface BookReadItemProps {
  book: BookReadEntry;
  onBack: () => void;
}

/**
 * One "Books I've Read" entry, opened on its own — not a section inside a
 * shared "Books I've Read" volume. Each spine on the shelf's bottom row
 * (see `Shelf.tsx`) is its own book; this is what opens when one is
 * clicked. Single "page," so no `BookReader` tabs/pagination — that
 * machinery is for multi-section books like Warkinless. Takes the
 * already-resolved `book` (found by `BookshelfLibrary/index.tsx` in
 * whichever list it fetched) rather than a bare id — no second lookup
 * against a separately-imported list that could disagree with it.
 */
export function BookReadItem({ book, onBack }: BookReadItemProps) {
  return (
    <BookFrame title={book.title} subtitle={book.author} icon={BookOpenText} onBack={onBack} tilt={1}>
      <div className="flex h-full flex-col items-center justify-center gap-5 px-6 py-8 text-center sm:px-10">
        {book.cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- decorative, data-driven; matches the room's plain <img> convention
          <img
            src={book.cover.src}
            alt={book.cover.alt}
            className="h-44 w-32 rounded-[3px] object-cover shadow-[var(--shadow-warm-md)]"
          />
        ) : null}
        <div>
          <h3 className="font-serif text-xl text-[var(--color-paper-ink)]">{book.title}</h3>
          <p className="mt-1 text-sm text-[var(--color-paper-ink)]/70">{book.author}</p>
        </div>
        {book.note ? (
          <p className="max-w-sm font-hand-note text-xl leading-snug text-[var(--color-paper-ink)]">
            &ldquo;{book.note}&rdquo;
          </p>
        ) : null}
      </div>
    </BookFrame>
  );
}
