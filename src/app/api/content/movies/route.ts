import { NextResponse } from "next/server";
import { getMovies } from "@/lib/notion/movies";

/**
 * Server-side only — this is a Route Handler, Next.js never bundles it
 * into client JS, so the Notion API key `getMovies` → `queryPublishedDatabase`
 * reads is never sent to the browser. `CinemaTickets` (client component)
 * fetches this same-origin endpoint instead of calling Notion directly.
 *
 * Always returns 200 with a body, even when Notion is unconfigured or
 * unreachable — that's an expected, handled state (`source: "fallback"`),
 * not a server error. The one thing this route won't do is throw an
 * *uncaught* exception past `getMovies`, but the outer try/catch is a
 * last-resort net in case something upstream ever does — still a 200
 * with an empty fallback, never a 500 the panel would have to handle.
 */
export async function GET() {
  try {
    const result = await getMovies();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ items: [], source: "fallback", reason: "unexpected_error" });
  }
}
