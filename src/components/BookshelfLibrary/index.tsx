"use client";

import { useState, type ReactNode } from "react";
import { BookReadItem } from "@/components/BookshelfLibrary/BookReadItem";
import { MyWritingsBook } from "@/components/BookshelfLibrary/MyWritingsBook";
import { Shelf } from "@/components/BookshelfLibrary/Shelf";
import { WarkinlessBook } from "@/components/BookshelfLibrary/WarkinlessBook";
import { BackLink } from "@/components/shared/BackLink";
import { booksRead as staticBooksRead } from "@/data/booksRead";
import type { LibraryBookId } from "@/data/library";
import { useContentList } from "@/hooks/useContentList";
import type { BookReadEntry } from "@/types/content";

interface BookshelfLibraryProps {
  onClose: () => void;
}

/**
 * The Bookshelf → "My Library" experience — a small state machine, same
 * shape as `LaptopInterface`'s. Two id spaces on purpose: `activeBookId`
 * for the two main books (their own `LibraryBookId` type, each with a
 * dedicated multi-section reader) and `activeReadBookId` for whichever
 * "Books I've Read" spine was clicked (a plain string id, matched against
 * whatever `booksRead` resolves to — there's no shared "Books I've Read"
 * book to have a typed id for, each entry opens on its own).
 *
 * `booksRead` is fetched once here (Notion-backed, see
 * docs/notion-integration.md) and passed down to both `Shelf` (the list)
 * and `BookReadItem` (one entry's detail) — fetching it in one place
 * rather than in each child keeps them showing the exact same list
 * instead of two independent fetches that could momentarily disagree.
 */
export function BookshelfLibrary({ onClose }: BookshelfLibraryProps) {
  const [activeBookId, setActiveBookId] = useState<LibraryBookId | null>(null);
  const [activeReadBookId, setActiveReadBookId] = useState<string | null>(null);
  const { items: booksRead } = useContentList<BookReadEntry>("/api/content/books", staticBooksRead);

  const backToShelf = () => {
    setActiveBookId(null);
    setActiveReadBookId(null);
  };

  const activeReadBook = activeReadBookId ? booksRead.find((book) => book.id === activeReadBookId) : undefined;

  const reader = (node: ReactNode) => <div className="w-[min(94vw,1000px,calc(76vh*1.43))]">{node}</div>;
  if (activeBookId === "writings") return reader(<MyWritingsBook key="writings" onBack={backToShelf} />);
  if (activeBookId === "warkinless") return reader(<WarkinlessBook key="warkinless" onBack={backToShelf} />);
  if (activeReadBook) return reader(<BookReadItem key={activeReadBook.id} book={activeReadBook} onBack={backToShelf} />);

  return (
    <div className="relative w-[min(94vw,1180px)]">
      <Shelf booksRead={booksRead} onSelectBook={setActiveBookId} onSelectReadBook={setActiveReadBookId} />
      {/* the way out lives on the case's base trim — nothing else around it */}
      <BackLink
        onClick={onClose}
        variant="dark"
        className="absolute bottom-[1.2%] left-[4%] z-10 [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]"
      />
    </div>
  );
}
