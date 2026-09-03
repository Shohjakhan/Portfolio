"use client";

import { BookFrame } from "@/components/BookshelfLibrary/BookFrame";
import { PlainBook } from "@/components/BookshelfLibrary/PlainBook";
import { getLibraryBook } from "@/data/library";
import { WRITING_CATEGORIES, writings as staticWritings } from "@/data/writings";
import { useContentList } from "@/hooks/useContentList";
import type { WritingEntry } from "@/types/content";

const definition = getLibraryBook("writings")!;

/** How many blank leaves to show while `writings` is empty — enough that
 * flipping through them reads as "an empty book," not just one card. */
const BLANK_PAGE_COUNT = 4;

function EntryPage({ entry }: { entry: WritingEntry }) {
  const categoryLabel = WRITING_CATEGORIES.find((category) => category.id === entry.category)?.label;

  return (
    <article className="flex h-full flex-col">
      {categoryLabel ? <p className="font-hand-note text-lg leading-none text-[var(--color-accent)]">{categoryLabel}</p> : null}
      <h3 className="mt-2 font-serif text-2xl text-[var(--color-paper-ink)]">{entry.title}</h3>
      {entry.date ? <p className="mt-1 text-xs text-[var(--color-paper-ink)]/70">{entry.date}</p> : null}
      <p className="mt-5 whitespace-pre-line font-serif text-[0.95rem] leading-relaxed text-[var(--color-paper-ink)]/85">
        {entry.body}
      </p>
    </article>
  );
}

function BlankPage({ showNote }: { showNote: boolean }) {
  return (
    <div className="flex h-full items-center justify-center text-center">
      {showNote ? (
        <p className="max-w-[16rem] font-hand-note text-xl leading-snug text-[var(--color-paper-ink)]/70">
          These pages are waiting to be filled.
        </p>
      ) : null}
    </div>
  );
}

/**
 * "My Writings" — deliberately not `BookReader`'s tabbed/sectioned
 * reader. Per explicit feedback, this book has no table of contents; it's
 * read front to back like a real one. Each `WritingEntry` becomes its own
 * page in order; while `writings` is empty it still shows real,
 * flippable (blank) pages rather than one static "empty" card, so it
 * reads as an actual — if unfinished — book.
 *
 * Notion-backed (see docs/notion-integration.md) — unlike every other
 * Notion-backed panel in the room, this database has no publish gate;
 * every entry in it is shown, by the user's own explicit choice when
 * asked (there's no "Published" property to filter by, unlike
 * Movies/Anime/Books).
 */
export function MyWritingsBook({ onBack }: { onBack: () => void }) {
  const { items: writings } = useContentList<WritingEntry>("/api/content/writings", staticWritings);
  const pages =
    writings.length > 0
      ? writings.map((entry) => <EntryPage key={entry.id} entry={entry} />)
      : Array.from({ length: BLANK_PAGE_COUNT }, (_, index) => <BlankPage key={index} showNote={index === 0} />);

  return (
    <BookFrame title={definition.title} subtitle={definition.subtitle} icon={definition.icon} onBack={onBack} tilt={1}>
      <PlainBook pages={pages} />
    </BookFrame>
  );
}
