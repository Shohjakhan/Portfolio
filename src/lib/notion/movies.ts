import "server-only";
import { movies as fallbackMovies } from "@/data/movies";
import { queryDatabase } from "@/lib/notion/client";
import { getMoviesDatabaseId } from "@/lib/notion/env";
import { getFirstFileUrl, getMultiSelectNames, getPageCoverUrl, getTitle } from "@/lib/notion/properties";
import { sortByOrder } from "@/lib/notion/sort";
import { resolveSlug } from "@/lib/notion/slug";
import type { NotionPage } from "@/lib/notion/types";
import type { Movie } from "@/types/content";

/**
 * This maps to the user's actual pre-existing Movies database (a watch
 * tracker, not a from-scratch "favorites" list built for this site) —
 * property names/values below are what's really there, not the
 * from-scratch schema `docs/notion-integration.md` originally proposed
 * for a fresh setup:
 *
 * | Property | Type   | Used as                                   |
 * |----------|--------|--------------------------------------------|
 * | name     | Title  | `title` (required — a row without one is skipped) |
 * | status   | Status | publish gate — only `"Completed"` rows are fetched (user's explicit choice: a tracker isn't a curated favorites list, most rows aren't meant to be public) |
 * | screenshots | Files | fallback `poster.src` if a row has no page cover |
 * | genre    | Multi-select | `note` — there's no dedicated "why I like this" field in this database, so the genre tags stand in as a short line under the title |
 *
 * The real poster image lives on the page itself (Notion's "Add cover"),
 * read via `getPageCoverUrl` — that's where this database's images
 * actually are, not in the `screenshots` files property, which is tried
 * second only as a fallback in case a row was covered differently.
 *
 * No `Slug`/`Order` properties exist on this database — `resolveSlug`
 * falls back to deriving one from the title for every row, and
 * `sortByOrder` falls back to `queryDatabase`'s own `created_time`
 * ascending order (the order rows were added in Notion) since `order` is
 * always `undefined` here.
 */
function mapPage(page: NotionPage): (Movie & { slug: string; order?: number }) | null {
  const title = getTitle(page, "name");
  if (!title) return null;

  const posterUrl = getPageCoverUrl(page) ?? getFirstFileUrl(page, "screenshots");
  const genres = getMultiSelectNames(page, "genre");

  return {
    id: page.id,
    title,
    poster: posterUrl ? { src: posterUrl, alt: title } : undefined,
    note: genres.length > 0 ? genres.join(", ") : undefined,
    slug: resolveSlug(undefined, title),
  };
}

export interface MoviesResult {
  items: Movie[];
  source: "notion" | "fallback";
  reason?: "not_configured" | "request_failed" | "invalid_response";
}

export async function getMovies(): Promise<MoviesResult> {
  const result = await queryDatabase(getMoviesDatabaseId(), { property: "status", status: { equals: "Completed" } });

  if (!result.ok) {
    return { items: fallbackMovies, source: "fallback", reason: result.reason };
  }

  const mapped = result.pages
    .map(mapPage)
    .filter((movie): movie is Movie & { slug: string; order?: number } => movie !== null);
  return { items: sortByOrder(mapped), source: "notion" };
}
