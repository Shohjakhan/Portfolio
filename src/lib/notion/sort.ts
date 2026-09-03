import "server-only";

/**
 * The one ordering rule every content type uses: an explicit `Order`
 * number wins (ascending) when set, rows without one keep whatever
 * relative order they arrived in — `queryDatabase` already asks Notion
 * for `created_time` ascending by default, so "no Order property on this
 * database" (true for every real database this integration reads today)
 * means "the order the rows were added in Notion," not an alphabetical
 * reshuffle. Relies on `Array.prototype.sort` being a stable sort (spec
 * guarantee since ES2019) so returning `0` for two order-less items never
 * reorders them relative to each other.
 */
export function sortByOrder<T extends { order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return 0;
  });
}
