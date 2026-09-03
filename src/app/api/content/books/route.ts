import { NextResponse } from "next/server";
import { getBooks } from "@/lib/notion/books";

/** Same shape/rationale as `api/content/movies/route.ts` — see its doc
 * comment. */
export async function GET() {
  try {
    const result = await getBooks();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ items: [], source: "fallback", reason: "unexpected_error" });
  }
}
