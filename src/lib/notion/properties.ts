import "server-only";
import type { NotionFile, NotionPage, NotionPropertyValue } from "@/lib/notion/types";

/**
 * Every extractor here returns `undefined` for a missing/wrong-shaped
 * property instead of throwing — a Notion database is user-edited (that
 * *is* the point of this integration), so a property renamed, deleted,
 * or left the wrong type is a normal, expected event, not a bug to crash
 * over. Each content-type mapper (see `movies.ts`) decides what to do
 * with `undefined` per-field: required fields skip the row entirely
 * (`isMissingRequired` below), optional ones just render as absent.
 */

function readText(values: { plain_text?: string }[] | undefined): string | undefined {
  const joined = (values ?? []).map((value) => value.plain_text ?? "").join("");
  return joined.trim() ? joined : undefined;
}

export function getTitle(page: NotionPage, propertyName: string): string | undefined {
  const property = page.properties[propertyName];
  if (property?.type !== "title") return undefined;
  return readText(property.title);
}

export function getRichText(page: NotionPage, propertyName: string): string | undefined {
  const property = page.properties[propertyName];
  if (property?.type !== "rich_text") return undefined;
  return readText(property.rich_text);
}

export function getNumber(page: NotionPage, propertyName: string): number | undefined {
  const property = page.properties[propertyName];
  if (property?.type !== "number") return undefined;
  return property.number ?? undefined;
}

export function getSelectName(page: NotionPage, propertyName: string): string | undefined {
  const property = page.properties[propertyName];
  if (property?.type === "select") return property.select?.name;
  if (property?.type === "status") return property.status?.name;
  return undefined;
}

export function getMultiSelectNames(page: NotionPage, propertyName: string): string[] {
  const property = page.properties[propertyName];
  if (property?.type !== "multi_select") return [];
  return property.multi_select.map((option) => option.name);
}

export function getUrl(page: NotionPage, propertyName: string): string | undefined {
  const property = page.properties[propertyName];
  if (property?.type !== "url") return undefined;
  return property.url ?? undefined;
}

export function getDate(page: NotionPage, propertyName: string): string | undefined {
  const property = page.properties[propertyName];
  if (property?.type !== "date") return undefined;
  return property.date?.start;
}

function fileUrl(file: NotionFile): string | undefined {
  return file.type === "file" ? file.file.url : file.type === "external" ? file.external.url : undefined;
}

/** First file's URL only — every content type here shows one cover
 * image, not a gallery, so the first attachment is what's used. */
export function getFirstFileUrl(page: NotionPage, propertyName: string): string | undefined {
  const property = page.properties[propertyName] as NotionPropertyValue | undefined;
  if (property?.type !== "files") return undefined;
  const first = property.files[0];
  return first ? fileUrl(first) : undefined;
}

/** The page's own cover image (see `NotionPage.cover`'s doc comment) —
 * where the real Movies/Anime/Books data actually keeps its images
 * (including GIFs), not in a `Files & media` property. */
export function getPageCoverUrl(page: NotionPage): string | undefined {
  return page.cover ? fileUrl(page.cover) : undefined;
}
