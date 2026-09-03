import "server-only";
import { getNotionApiKey, getNotionApiVersion } from "@/lib/notion/env";
import type { NotionPage, NotionQueryResponse } from "@/lib/notion/types";

/**
 * Talks to Notion's REST API directly (`fetch`, no `@notionhq/client`
 * dependency) — the API surface this integration needs is a handful of
 * endpoints (query a database, read a page's block children), so a full
 * SDK isn't worth the added dependency; this also means the *only* place
 * a Notion API key is ever read or sent is this one function (plus
 * `blocks.ts`'s block-fetcher, same pattern), making the "never in
 * browser code" requirement easy to audit — every file here starts with
 * `import "server-only"`, never imported by anything under a
 * `"use client"` boundary. See docs/notion-integration.md's security
 * section for the full argument.
 */

export type NotionQueryResult =
  | { ok: true; pages: NotionPage[] }
  | { ok: false; reason: "not_configured" | "request_failed" | "invalid_response" };

const NOTION_QUERY_TIMEOUT_MS = 8000;

/**
 * Queries a database, with an optional server-side filter (a raw Notion
 * filter object, so each content type's mapper — `movies.ts`, `books.ts`,
 * etc. — decides its own property name and gate value, rather than this
 * function assuming every database uses the same "Status equals
 * Published" convention. Real databases in the wild have their own
 * pre-existing schemas (a watch-tracker's `status` might be "Completed",
 * not "Published") — this stays a thin, unopinionated pass-through so it
 * fits whatever a given database actually looks like. Pass no filter to
 * fetch every row unfiltered.
 *
 * `sorts` defaults to `created_time` ascending — a real drag-ordered row
 * position inside a Notion database view isn't exposed by the API at
 * all, so "the order I added them in Notion" (oldest row first) is the
 * closest deterministic proxy to "the order it's in, in Notion" a mapper
 * can actually ask for, rather than leaving order to whatever internal
 * sequence the API happens to return unsorted queries in (documented as
 * not guaranteed to be stable).
 */
export async function queryDatabase(
  databaseId: string | undefined,
  filter?: Record<string, unknown>,
  sorts: Record<string, unknown>[] = [{ timestamp: "created_time", direction: "ascending" }],
): Promise<NotionQueryResult> {
  const apiKey = getNotionApiKey();
  if (!apiKey || !databaseId) {
    return { ok: false, reason: "not_configured" };
  }

  const body: Record<string, unknown> = {};
  if (filter) body.filter = filter;
  if (sorts.length > 0) body.sorts = sorts;

  let response: Response;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), NOTION_QUERY_TIMEOUT_MS);
    try {
      response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Notion-Version": getNotionApiVersion(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
        // Content is edited in Notion, not by a redeploy — cache briefly
        // server-side instead of refetching on every panel open, but
        // don't go stale for a whole day either.
        next: { revalidate: 300 },
      });
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    // Network failure, timeout, DNS — Notion is unreachable, not misconfigured.
    return { ok: false, reason: "request_failed" };
  }

  if (!response.ok) {
    return { ok: false, reason: "request_failed" };
  }

  let data: NotionQueryResponse;
  try {
    data = (await response.json()) as NotionQueryResponse;
  } catch {
    return { ok: false, reason: "invalid_response" };
  }

  if (!Array.isArray(data.results)) {
    return { ok: false, reason: "invalid_response" };
  }

  return { ok: true, pages: data.results };
}
