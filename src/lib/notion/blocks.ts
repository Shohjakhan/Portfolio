import "server-only";
import { getNotionApiKey, getNotionApiVersion } from "@/lib/notion/env";

/**
 * Only Writings needs this — every other content type here reads from
 * database *properties* (a single API call per list), but a Notion page's
 * actual body text lives in its block tree, a separate endpoint per page.
 * This is deliberately a flat, one-level reader: it fetches a page's
 * direct children and extracts plain text from the block types a journal
 * entry is realistically made of (paragraphs, headings, quotes, list
 * items) — it does not recurse into nested blocks, does not render rich
 * formatting (bold/italic/links), and does not handle images/embeds/
 * tables. A full Notion block-tree-to-HTML renderer is a real upgrade
 * path, not attempted here; see docs/notion-integration.md's Writings
 * section for what this trades off and why it's an acceptable trade for
 * a small personal journal (6 entries at the time this was built).
 */

interface NotionRichTextItem {
  plain_text?: string;
}

interface NotionBlock {
  id: string;
  type: string;
  [key: string]: unknown;
}

const TEXT_BLOCK_TYPES = new Set(["paragraph", "heading_1", "heading_2", "heading_3", "quote", "bulleted_list_item", "numbered_list_item"]);

function textFromRichText(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return (value as NotionRichTextItem[]).map((item) => item.plain_text ?? "").join("");
}

async function fetchBlockChildren(blockId: string): Promise<NotionBlock[]> {
  const apiKey = getNotionApiKey();
  if (!apiKey) return [];

  try {
    const response = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children?page_size=100`, {
      headers: { Authorization: `Bearer ${apiKey}`, "Notion-Version": getNotionApiVersion() },
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const data: unknown = await response.json();
    const results = (data as { results?: unknown }).results;
    return Array.isArray(results) ? (results as NotionBlock[]) : [];
  } catch {
    return [];
  }
}

/** Plain text, paragraphs separated by a blank line — matches the room's
 * existing `whitespace-pre-line` prose rendering (see
 * `MyWritingsBook`'s `EntryPage`), so a Notion-sourced entry renders
 * identically to a hand-written one. Returns `""` on any failure
 * (missing key, network error, empty page) rather than throwing — a
 * writing entry with an unreadable body still shows its title, just with
 * an empty body, same as a hand-written entry that hasn't been filled in
 * yet. */
export async function fetchPageBodyText(pageId: string): Promise<string> {
  const blocks = await fetchBlockChildren(pageId);
  const lines = blocks
    .filter((block) => TEXT_BLOCK_TYPES.has(block.type))
    .map((block) => {
      const richText = (block[block.type] as { rich_text?: unknown } | undefined)?.rich_text;
      const text = textFromRichText(richText);
      const isListItem = block.type === "bulleted_list_item" || block.type === "numbered_list_item";
      return isListItem ? `• ${text}` : text;
    })
    .filter((line) => line.trim().length > 0);

  return lines.join("\n\n");
}
