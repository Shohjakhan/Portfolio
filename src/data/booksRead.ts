import type { BookReadEntry } from "@/types/content";

/**
 * "Books I've Read" — a visual shelf of books read/recommended. Empty for
 * now; structured so it's a one-line-per-book addition later
 * (`{ id, title, author, note?, cover? }`), no fabricated titles.
 */
export const booksRead: BookReadEntry[] = [];
