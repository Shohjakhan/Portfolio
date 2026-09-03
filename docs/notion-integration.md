# Notion content integration

Lets content (movies, anime, books read, and personal writing — following
the same pattern — anything else listed below) be maintained by editing a
Notion database instead of editing this repo's source. This document is
the full setup guide and the architecture reference for adding the next
content type.

## Why this exists

Editing `src/data/*.ts` and redeploying works, but it means every new
favorite film or piece of writing requires a code change. This
integration lets *some* content types be edited from Notion instead —
add a row, it shows up on the site within a few minutes, no redeploy.

**Four content types are wired up: Movies, Anime, Books, and Writings.**
All four map onto the user's own real, pre-existing Notion databases
(a watch tracker, a reading tracker, and a journal) rather than
from-scratch databases built for this site — see "Real schemas, not the
originally-proposed ones" below for what that changed.

## Security model (read this before setting anything up)

**The Notion API key never reaches the browser.** Concretely:

- Every file under `src/lib/notion/` starts with `import "server-only"`
  — a zero-dependency package that makes Next.js *fail the build* if
  anything under a `"use client"` boundary ever imports one of these
  files, even by accident.
- The key is only ever read (`src/lib/notion/env.ts`) and only ever sent
  over the network (`src/lib/notion/client.ts`/`blocks.ts`, as an
  `Authorization` header to `api.notion.com`) from inside these
  server-only files.
- The only thing client components (`CinemaTickets`, `FandomCorner`,
  `Shelf`/`BookReadItem`, `MyWritingsBook`) talk to is this app's own
  `/api/content/*` Route Handlers — same-origin endpoints that Next.js
  always executes server-side. The client never calls `api.notion.com`
  directly and never sees a token.
- `.env.local` (where the real key lives locally) is gitignored via this
  repo's existing `.env*` pattern — never committed.

If you're auditing this: `grep -rn "NOTION_API_KEY" src/` should only
ever show it inside `src/lib/notion/env.ts`.

**If a token is ever pasted into a chat/AI session instead of typed
directly into `.env.local`, treat it as compromised** — regenerate it in
Notion (integration page → regenerate secret) even though it was only
used locally and never committed. A chat transcript isn't a secrets
store, regardless of who's on the other end of it.

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Description |
|---|---|---|
| `NOTION_API_KEY` | For real data | The integration's "Internal Integration Secret" |
| `NOTION_API_VERSION` | No | Defaults to `2022-06-28` |
| `NOTION_DATABASE_ID_MOVIES` | For real Movies data | |
| `NOTION_DATABASE_ID_ANIME` | For real Anime data | |
| `NOTION_DATABASE_ID_BOOKS` | For real Books data | |
| `NOTION_DATABASE_ID_WRITINGS` | For real Writings data | |

**None of these are required for the site to run.** Leave them all
unset and the app builds, runs, and renders normally — every panel just
shows its existing empty state (see "Fallback behavior" below), exactly
as it did before this integration existed.

## Notion setup

1. **Create an integration** at <https://www.notion.so/my-integrations>
   → "New integration". Internal integration, no OAuth needed for a
   single-owner site like this. Copy its "Internal Integration Secret" —
   that's `NOTION_API_KEY`.
2. **Share each database with the integration** — open the database,
   "..." menu → "Connections" → add the integration by name. Skipping
   this step is the most common setup mistake: the API key is valid but
   the integration still can't see the database, which this app reports
   as a request failure (falls back gracefully, see below) rather than a
   crash. Sharing a *parent page* cascades to its sub-pages/databases —
   useful if several databases live under one page, but the search
   endpoint used to discover them (see below) only surfaces what's
   actually been shared, not the whole workspace by default.
3. **A database nested inside a page, not standalone, still works** —
   the real Writings database here ("Journal 2024") lives inside a
   "Posts" page as an embedded/linked database, not as its own top-level
   item. Notion's search API still finds it once the page (or the
   database itself) is shared; if a database isn't showing up, check
   whether it's nested somewhere and share that specific database
   directly rather than assuming a parent share always cascades far
   enough.
4. **Get the database ID** from its URL:
   `notion.so/<workspace>/<DATABASE_ID>?v=<view_id>` — the 32-character
   segment (letters/numbers, may have dashes) right after the workspace
   name and before the `?v=`. That's the `NOTION_DATABASE_ID_*` value.
5. **Property names must match exactly** what's in the tables below —
   case-sensitive. Unlike a from-scratch setup, these map onto
   *existing* databases the user already had, so the property names are
   whatever those databases already used, not a fresh convention chosen
   for this site.

## Real schemas, not the originally-proposed ones

An earlier draft of this integration (and an earlier version of this
doc) proposed a from-scratch schema — `Title`/`Note`/`Poster`/`Slug`/
`Order`/`Status` with `Status` always meaning "Published." That schema
was never actually put into a database. Once real credentials were
provided, the real databases turned out to be a pre-existing
Letterboxd/MyAnimeList-style watch tracker (Movies, Anime — `status`
values like Watching/Completed/Dropped, episode counts, ratings, genre
tags) and a reading tracker (Books — chapters-read progress), not a
simple curated favorites list. The tables below describe what's
*actually* read by the code today.

### Movies (`src/lib/notion/movies.ts`)

| Property | Type | Required | Maps to |
|---|---|---|---|
| `name` | Title | Yes | `title` |
| `status` | Status | Yes | publish gate — only `"Completed"` rows are fetched |
| `screenshots` | Files & media | No | `poster.src` (first file) |
| `genre` | Multi-select | No | `note` (there's no dedicated "why I like this" field, so genre tags stand in) |

The **`"Completed"` filter, not "Published," was an explicit choice**,
not a guess: a watch tracker's rows are mostly not things meant to be
public (in-progress, dropped, paused), so when asked what should decide
what's public, the answer was "Completed only."

### Anime (`src/lib/notion/anime.ts`)

Identical property shape to Movies — same database structure, different
database. See the table above.

### Books (`src/lib/notion/books.ts`)

| Property | Type | Required | Maps to |
|---|---|---|---|
| `Title` | Title | Yes | `title` |
| `Author` | Rich text | Yes | `author` |
| `Status` | Status | Yes | publish gate — only `"Completed"` |
| `Quote` | Rich text | No | `note` — a favorite line, shown the way a hand-written note would be |

No `cover`/files property exists on this database — `cover` is always
`undefined` for Notion-sourced books; `BookReadItem` already renders
correctly without one.

### Writings (`src/lib/notion/writings.ts`)

| Property | Type | Required | Maps to |
|---|---|---|---|
| `Name` | Title | Yes | `title` |
| `Date` | Date | No | `date` |

This is the sparsest schema and the one exception to the "filter by
status" pattern above:

- **No publish gate, on purpose.** This database has no status property
  at all. Asked directly whether to add a "Published" checkbox property
  or publish every entry as-is, the explicit choice was **publish
  everything** — `getWritings()` fetches every row, unfiltered. This
  matters because the entries are personal (poem/journal titles, not a
  curated portfolio-ready list) — the "everything" behavior here is a
  deliberate decision recorded once, not something to silently change
  later without the same conversation.
- **`category` is inferred from the title, not read from a property.**
  Entries follow a "Poem N: ..." / "Post N: ..." title convention; a
  title starting with "Poem" (case-insensitive) maps to the `"poem"`
  category, everything else to `"personal"`. See `inferCategory` in
  `writings.ts` — if the naming convention ever changes, entries just
  land in the wrong category, never crash or disappear.
- **`body` comes from the page's own content, not a property** — see
  "Writings' body content" below.

## Writings' body content — the one type that isn't a property read

Every other content type here reads from database *properties* (one API
call per list). A Notion page's actual body text lives in its block
tree instead, a separate API call per page. `src/lib/notion/blocks.ts`'s
`fetchPageBodyText` fetches a page's direct children and extracts plain
text from the block types a journal entry is realistically made of
(paragraphs, headings, quotes, list items), joined into
`\n\n`-separated text that renders through the same
`whitespace-pre-line` prose treatment `MyWritingsBook` already used for
hand-written entries.

**What this does not do**: recurse into nested blocks, preserve rich
formatting (bold/italic/links), or render images/embeds/tables. A full
Notion block-tree-to-HTML renderer is a real upgrade path, not
attempted here — acceptable for a small journal (6 entries at the time
this was built; `getWritings` does one extra request per entry, so this
scales linearly with entry count and would need a different approach —
pagination, lazy-loading per entry — well before it became a real
concern).

## Schema design (applies to every content type, built or not)

- **Identifiers**: Notion's own page `id` (always present, stable) is
  the real internal identifier — used as the React `key` and anywhere
  uniqueness actually matters.
- **Slugs**: derived from the title (`src/lib/notion/slug.ts`'s
  `slugify`) for every content type built so far — none of the real
  databases have a dedicated `Slug` property, so this is always the
  fallback path in practice today, not a fallback for an edge case.
  `resolveSlug` still accepts an explicit slug if a future database adds
  one.
- **Ordering**: `src/lib/notion/sort.ts`'s `sortByOrderThenTitle` sorts
  by an `order` field first (ascending) when present, title
  alphabetically otherwise. None of the real databases have an `Order`
  property either, so Movies/Anime/Books currently sort alphabetically
  in practice. Writings is the one exception — sorted newest-first by
  `Date` (`sortByDateDescending` in `writings.ts`), since a journal reads
  chronologically, not alphabetically.
- **Publication status**: Movies/Anime/Books each have a real `status`/
  `Status` property, filtered server-side to `"Completed"` in the Notion
  query itself (an explicit choice for those three, see their tables
  above). Writings has no such property and publishes everything by
  explicit choice, not by omission — see its own section above. A future
  content type with no natural status field should have this same
  conversation rather than defaulting to "everything," given how
  personal Writings' content turned out to be.

## Fallback behavior — "the room must still render even if content APIs fail"

Four layers, each independently sufficient:

1. **`src/lib/notion/client.ts`** — a missing API key/database id, a
   failed/timed-out request (8s timeout), or a malformed response all
   return a typed `{ ok: false, reason }` result, never a thrown
   exception.
2. **`src/lib/notion/movies.ts` / `anime.ts` / `books.ts` / `writings.ts`**
   — on any `ok: false`, returns the *existing* static array from
   `src/data/*.ts` instead of an empty result invented on the spot.
3. **`src/app/api/content/*/route.ts`** — wraps the whole thing in a
   try/catch as a last-resort net; always responds `200` with a body,
   even in a genuinely unexpected-exception case. There's no scenario in
   which one of these routes returns a `5xx` for "Notion isn't
   available" — that's an expected, handled state, not a server error.
4. **`src/hooks/useContentList.ts`** (client-side) — if the `fetch` to
   the API route itself fails outright (offline, blocked, thrown
   exception in the browser), falls back to the same static array
   passed in as `initialItems`.

Net effect: every consuming component behaves *identically* to how it
did before this integration existed, in every failure mode. There is no
code path where a Notion problem produces anything worse than the
pre-integration "nothing here yet" empty state — never a crash, never a
blank panel, never an error bleeding into the room.

**The room itself (`src/app/page.tsx` → `Room`) makes zero Notion calls**
— nothing here runs until a visitor actually opens a Notion-backed
panel, and even then it's that panel's own concern, not something the
room's initial render depends on.

## How to add the next content type

Using Projects as the example:

1. Add `NOTION_DATABASE_ID_PROJECTS` to `.env.example` and
   `src/lib/notion/env.ts` (a `getProjectsDatabaseId()` function, same
   shape as `getMoviesDatabaseId()`).
2. Share the Notion database with the integration (setup steps 2–3
   above) and note its real property names — don't assume they'll match
   any schema proposed in a doc; read the actual database.
3. Add `src/lib/notion/projects.ts` — copy `books.ts`'s shape: a
   `mapPage` function using `src/lib/notion/properties.ts`'s extractors
   against the *real* property names, a `getProjects()` that calls
   `queryDatabase` with whatever filter (if any) makes sense for that
   database, falls back to `data/projects.ts`'s existing array on
   failure, sorts with `sortByOrderThenTitle` (or a custom sort, see
   Writings' date-descending example).
4. Add `src/app/api/content/projects/route.ts` — copy
   `api/content/movies/route.ts` verbatim, swap the import.
5. In the consuming component, swap the static import for
   `useContentList("/api/content/projects", staticProjects)`, same as
   every component already wired up.
6. Update this document's schema section with the real property table.

## Testing this integration

All of the following were actually run, not just reasoned through:

- **No env vars set**: every panel showed its existing empty state,
  `npm run dev` had no errors, no route threw. `curl`'d
  `/api/content/movies` and `/api/content/anime` directly —
  `{"items":[],"source":"fallback","reason":"not_configured"}` for both.
- **Notion unreachable/misconfigured**: wrote a throwaway `.env.local`
  with a fake API key and a fake database id, restarted, `curl`'d again
  — `{"items":[],"source":"fallback","reason":"request_failed"}`,
  confirming the actual network-failure branch (not just
  not-configured). Deleted the fake file and restarted back to a clean
  state before doing anything else.
- **Successful retrieval — real workspace, real credentials**: once the
  user shared a real integration token and shared the four real
  databases, `curl`'d all four `/api/content/*` routes directly and
  confirmed `"source":"notion"` with real titles, genres, dates, and
  (for Writings) real body text of the expected length for each entry.
  Then opened all four panels in the browser (Movies' tickets, Anime's
  charms, the Bookshelf's bottom shelf, "My Writings"' pages) and
  confirmed each renders the real data correctly, with no console errors
  beyond the project's known-benign browser-extension exceptions.
