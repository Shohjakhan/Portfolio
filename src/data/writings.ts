import type { WritingCategory, WritingEntry } from "@/types/content";

/**
 * "My Writings" book's table of contents — one tab per category, in
 * display order. `MyWritingsBook` renders one per entry regardless of
 * whether any `writings` below belong to it yet (an empty tab still shows,
 * with an honest "nothing here yet" state).
 */
export const WRITING_CATEGORIES: { id: WritingCategory; label: string }[] = [
  { id: "poem", label: "Poems" },
  { id: "essay", label: "Essays" },
  { id: "paragraph", label: "Paragraphs" },
  { id: "personal", label: "Personal Writing" },
  { id: "thought", label: "Selected Thoughts" },
];

/**
 * No real writing has been supplied yet — intentionally empty rather than
 * inventing sample poems/essays. Populate as real pieces are ready; each
 * one just needs an id, a `category` matching one of `WRITING_CATEGORIES`,
 * a title, and a body (optionally a date).
 */
export const writings: WritingEntry[] = [];
