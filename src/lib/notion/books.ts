import "server-only";
import { booksRead as fallbackBooks } from "@/data/booksRead";
import { queryDatabase } from "@/lib/notion/client";
import { getBooksDatabaseId } from "@/lib/notion/env";
import { getPageCoverUrl, getRichText, getTitle } from "@/lib/notion/properties";
import { sortByOrder } from "@/lib/notion/sort";
import { resolveSlug } from "@/lib/notion/slug";
import type { NotionPage } from "@/lib/notion/types";
import type { BookReadEntry } from "@/types/content";

/**
 * Maps the user's real pre-existing "Bookshelf" database (a books+manga
 * tracker with chapters-read progress, not a from-scratch schema built
 * for this site):
 *
 * | Property | Type      | Used as |
 * |----------|-----------|---------|
 * | Title    | Title     | `title` |
 * | Author   | Rich text | `author` (required — a row missing either Title or Author is skipped) |
 * | Status   | Status    | publish gate — only `"Completed"` |
 * | Quote    | Rich text | `note` — a favorite line from the book, shown the same way a hand-written "why I liked it" note would be |
 *
 * No dedicated `cover`/`files` property exists on this database — the
 * cover image lives on the page itself (Notion's "Add cover", set per
 * row), read via `getPageCoverUrl`, same source `movies.ts`/`anime.ts`
 * use. `undefined` when a row has no cover set — `BookReadItem` already
 * renders correctly without one (see its own conditional cover rendering).
 */
function mapPage(page: NotionPage): (BookReadEntry & { slug: string; order?: number }) | null {
  const title = getTitle(page, "Title");
  const author = getRichText(page, "Author");
  if (!title || !author) return null;

  const coverUrl = getPageCoverUrl(page);

  return {
    id: page.id,
    title,
    author,
    note: getRichText(page, "Quote"),
    cover: coverUrl ? { src: coverUrl, alt: title } : undefined,
    slug: resolveSlug(undefined, title),
  };
}

export interface BooksResult {
  items: BookReadEntry[];
  source: "notion" | "fallback";
  reason?: "not_configured" | "request_failed" | "invalid_response";
}

export async function getBooks(): Promise<BooksResult> {
  const result = await queryDatabase(getBooksDatabaseId(), { property: "Status", status: { equals: "Completed" } });

  if (!result.ok) {
    return { items: fallbackBooks, source: "fallback", reason: result.reason };
  }

  const mapped = result.pages
    .map(mapPage)
    .filter((book): book is BookReadEntry & { slug: string; order?: number } => book !== null);
  return { items: sortByOrder(mapped), source: "notion" };
}
