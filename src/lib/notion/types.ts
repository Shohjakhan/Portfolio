/**
 * Minimal shims for the slice of Notion's REST API JSON shape this
 * integration actually reads — not a full SDK type surface (there's no
 * `@notionhq/client` dependency; `client.ts` talks to the REST API
 * directly with `fetch`, see its own doc comment for why). Every field
 * here is `unknown`/optional-safe on purpose: Notion's API is external
 * input, never trust it to match this shape exactly — `properties.ts`'s
 * extractors defensively narrow rather than assert.
 */
export interface NotionPage {
  id: string;
  properties: Record<string, NotionPropertyValue>;
  /** The page's own cover image (set via Notion's "Add cover" — separate
   * from any `Files & media` property) — `null` when unset. Several
   * content types here use this as their primary image (see
   * `properties.ts`'s `getPageCoverUrl`) since that's where the real
   * data actually put images, not in a dedicated files property. */
  cover?: NotionFile | null;
}

export interface NotionQueryResponse {
  results?: NotionPage[];
}

/**
 * Deliberately *not* padded out with a generic `{ type: string; [key:
 * string]: unknown }` catch-all member — that reads like a safety net for
 * "some other property type Notion might send," but a catch-all whose
 * own `type` is the widened `string` breaks TypeScript's discriminated-
 * union narrowing for every *other* member too (it can no longer be sure
 * a `type: "title"` object doesn't also structurally match the
 * catch-all), which is exactly what happened here originally. Not having
 * one is fine: nothing in this file constructs a `NotionPropertyValue`,
 * every read of `page.properties[name]` goes through `properties.ts`'s
 * extractors, and each one already checks `property?.type !== "..."`
 * before touching the payload — an actually-unrecognized property type
 * just fails that check and returns `undefined`, same outcome the
 * catch-all was trying to guarantee, without the narrowing cost.
 */
export type NotionPropertyValue =
  | { type: "title"; title: NotionRichText[] }
  | { type: "rich_text"; rich_text: NotionRichText[] }
  | { type: "number"; number: number | null }
  | { type: "select"; select: { name: string } | null }
  | { type: "status"; status: { name: string } | null }
  | { type: "multi_select"; multi_select: { name: string }[] }
  | { type: "checkbox"; checkbox: boolean }
  | { type: "url"; url: string | null }
  | { type: "date"; date: { start: string } | null }
  | { type: "files"; files: NotionFile[] };

export interface NotionRichText {
  plain_text?: string;
}

export type NotionFile =
  | { type: "file"; file: { url: string } }
  | { type: "external"; external: { url: string } };
