import { Feather, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type LibraryBookId = "writings" | "warkinless";

export interface LibraryBookDefinition {
  id: LibraryBookId;
  /** Spine label — what's printed on the book standing on the shelf. */
  title: string;
  subtitle: string;
  icon: LucideIcon;
  /** Spine + cover color, one per book so the shelf doesn't read as identical rectangles. */
  spineColor: string;
  spineColorDark: string;
}

/**
 * The two books of the user's own writing, standing on the bookcase's top
 * shelf — mirrors CLAUDE.md §2's "Bookshelf → Writings/Fantasy Novel".
 * "Books I've Read" isn't a third entry here: per explicit feedback it's
 * not one book, it's a row of individually-clickable spines on the shelf
 * below, sourced straight from `data/booksRead.ts` (see `Shelf.tsx`).
 */
export const libraryBooks: LibraryBookDefinition[] = [
  {
    id: "writings",
    title: "My Writings",
    subtitle: "Poems, essays & selected thoughts",
    icon: Feather,
    spineColor: "#6b4a3a",
    spineColorDark: "#4a3226",
  },
  {
    id: "warkinless",
    title: "Ruining of Warkinless",
    subtitle: "A fantasy novel in progress",
    icon: Sparkles,
    spineColor: "#3f4a6b",
    spineColorDark: "#2a3248",
  },
];

export function getLibraryBook(id: LibraryBookId): LibraryBookDefinition | undefined {
  return libraryBooks.find((book) => book.id === id);
}
