import "server-only";
import { writings as fallbackWritings } from "@/data/writings";
import { fetchPageBodyText } from "@/lib/notion/blocks";
import { queryDatabase } from "@/lib/notion/client";
import { getWritingsDatabaseId } from "@/lib/notion/env";
import { getDate, getTitle } from "@/lib/notion/properties";
import type { NotionPage } from "@/lib/notion/types";
import type { WritingCategory, WritingEntry } from "@/types/content";

/**
 * Maps the user's real "Journal 2024" database — nested inside a "Posts"
 * page, not a standalone top-level database, and much sparser than
 * `docs/notion-integration.md`'s originally-proposed schema:
 *
 * | Property | Type  | Used as |
 * |----------|-------|---------|
 * | Name     | Title | `title` |
 * | Date     | Date  | `date` |
 *
 * No `Category`/`Status`/body property exists. Two deliberate choices,
 * both explicit user decisions rather than guesses:
 *
 * - **No publish gate** — unlike Movies/Anime/Books, this database has no
 *   status property to filter on, and the user was asked directly
 *   whether to add one (a "Published" checkbox) or publish everything as-is.
 *   They chose to publish every entry — `getWritings` fetches all rows,
 *   unfiltered, on purpose, not because a gate is technically impossible.
 * - **`category` is inferred, not read** — titles follow a "Poem N: ..."
 *   / "Post N: ..." convention; a title starting with "Poem" maps to the
 *   `"poem"` category, everything else to `"personal"`. This is a
 *   heuristic over the existing title text, not a real Notion field —
 *   if the convention ever breaks, entries just land in "Personal
 *   Writing" instead of "Poems," never crash or disappear.
 *
 * `body` comes from the page's own content, not a property — see
 * `blocks.ts`'s `fetchPageBodyText` and its own doc comment for what
 * that does and doesn't capture.
 */
function inferCategory(title: string): WritingCategory {
  return /^poem/i.test(title.trim()) ? "poem" : "personal";
}

async function mapPage(page: NotionPage): Promise<WritingEntry | null> {
  const title = getTitle(page, "Name");
  if (!title) return null;

  const body = await fetchPageBodyText(page.id);

  return {
    id: page.id,
    category: inferCategory(title),
    title,
    date: getDate(page, "Date"),
    body,
  };
}

export interface WritingsResult {
  items: WritingEntry[];
  source: "notion" | "fallback";
  reason?: "not_configured" | "request_failed" | "invalid_response";
}

/** Oldest first — the book reader lays entries out left to right like
 * physical pages (see `BookshelfLibrary`'s `MyWritingsBook`), so index 0
 * has to be the first thing written, not the most recent. Entries with no
 * date (shouldn't happen — `Date` is set on every real row) sort last
 * rather than colliding at the front. */
function sortByDateAscending(items: WritingEntry[]): WritingEntry[] {
  return [...items].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });
}

export async function getWritings(): Promise<WritingsResult> {
  const result = await queryDatabase(getWritingsDatabaseId());

  if (!result.ok) {
    return { items: fallbackWritings, source: "fallback", reason: result.reason };
  }

  const mapped = await Promise.all(result.pages.map(mapPage));
  const items = mapped.filter((entry): entry is WritingEntry => entry !== null);
  return { items: sortByDateAscending(items), source: "notion" };
}
