import "server-only";
import { animeEntries as fallbackAnime } from "@/data/anime";
import { queryDatabase } from "@/lib/notion/client";
import { getAnimeDatabaseId } from "@/lib/notion/env";
import { getFirstFileUrl, getMultiSelectNames, getPageCoverUrl, getTitle } from "@/lib/notion/properties";
import { sortByOrder } from "@/lib/notion/sort";
import { resolveSlug } from "@/lib/notion/slug";
import type { NotionPage } from "@/lib/notion/types";
import type { AnimeEntry } from "@/types/content";

/**
 * Same real pre-existing watch-tracker shape as `movies.ts` — see its
 * doc comment for the full rationale. Property names here:
 *
 * | Property    | Type   | Used as |
 * |-------------|--------|---------|
 * | name        | Title  | `title` |
 * | status      | Status | publish gate — only `"Completed"` |
 * | screenshots | Files  | fallback `cover.src` if a row has no page cover |
 * | genre       | Multi-select | `note` |
 *
 * Same page-cover-first sourcing as `movies.ts` — see its doc comment
 * for why `screenshots` is only a fallback, not the primary source.
 */
function mapPage(page: NotionPage): (AnimeEntry & { slug: string; order?: number }) | null {
  const title = getTitle(page, "name");
  if (!title) return null;

  const coverUrl = getPageCoverUrl(page) ?? getFirstFileUrl(page, "screenshots");
  const genres = getMultiSelectNames(page, "genre");

  return {
    id: page.id,
    title,
    cover: coverUrl ? { src: coverUrl, alt: title } : undefined,
    note: genres.length > 0 ? genres.join(", ") : undefined,
    slug: resolveSlug(undefined, title),
  };
}

export interface AnimeResult {
  items: AnimeEntry[];
  source: "notion" | "fallback";
  reason?: "not_configured" | "request_failed" | "invalid_response";
}

export async function getAnimeEntries(): Promise<AnimeResult> {
  const result = await queryDatabase(getAnimeDatabaseId(), { property: "status", status: { equals: "Completed" } });

  if (!result.ok) {
    return { items: fallbackAnime, source: "fallback", reason: result.reason };
  }

  const mapped = result.pages
    .map(mapPage)
    .filter((entry): entry is AnimeEntry & { slug: string; order?: number } => entry !== null);
  return { items: sortByOrder(mapped), source: "notion" };
}
