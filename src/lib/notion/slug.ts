import "server-only";

/**
 * Every content type's identifier strategy: use a real `Slug` property
 * if the Notion row has one, otherwise derive one from the title. This
 * means adding a new row in Notion never *requires* filling in a slug
 * field to show up on the site — one less thing to remember — while
 * still giving anyone who wants a stable, hand-picked URL-safe id a way
 * to set it. Collisions aren't de-duplicated here; Notion's own page id
 * (`NotionPage.id`) is what's actually used as the React `key` and any
 * truly unique internal identifier — `slug` is for predictable,
 * human-readable references (e.g. a future `/movies/<slug>` route), not
 * uniqueness-critical lookups.
 */
export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "untitled"
  );
}

export function resolveSlug(explicitSlug: string | undefined, title: string): string {
  return explicitSlug?.trim() || slugify(title);
}
