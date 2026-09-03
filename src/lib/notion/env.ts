import "server-only";

/**
 * Reads Notion configuration from `process.env` — never throws, never
 * caches a "missing" result as permanent (each call re-reads, so setting
 * the var and restarting the dev server picks it up without code
 * changes). Every caller in this module treats a missing/empty value as
 * "not configured yet," not an error — the whole point of
 * `NotionQueryResult`'s `"not_configured"` branch (see `client.ts`) is
 * that the room and its panels have to keep working when this is unset,
 * per the task's own "the room must still render even if content APIs
 * fail" requirement.
 *
 * `import "server-only"` makes any accidental import of this file from a
 * `"use client"` component a build error, not just a code-review nit —
 * see docs/notion-integration.md's security section for what that
 * actually protects against.
 */

const NOTION_API_VERSION = "2022-06-28";

export function getNotionApiKey(): string | undefined {
  return process.env.NOTION_API_KEY || undefined;
}

export function getNotionApiVersion(): string {
  return process.env.NOTION_API_VERSION || NOTION_API_VERSION;
}

/** One accessor per content-type database ID — add a line here (and to
 * `.env.example`/docs/notion-integration.md) when a new content type
 * gets wired up. Keeping these as named functions instead of a generic
 * `getDatabaseId(key: string)` means a typo'd env var name is a
 * TypeScript error at the call site, not a silent `undefined` at runtime. */
export function getMoviesDatabaseId(): string | undefined {
  return process.env.NOTION_DATABASE_ID_MOVIES || undefined;
}

export function getAnimeDatabaseId(): string | undefined {
  return process.env.NOTION_DATABASE_ID_ANIME || undefined;
}

export function getBooksDatabaseId(): string | undefined {
  return process.env.NOTION_DATABASE_ID_BOOKS || undefined;
}

export function getWritingsDatabaseId(): string | undefined {
  return process.env.NOTION_DATABASE_ID_WRITINGS || undefined;
}
