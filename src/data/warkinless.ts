import type { WarkinlessContent } from "@/types/content";

export type WarkinlessSectionId = "introduction" | "world" | "characters" | "excerpts" | "illustrations" | "updates";

/** "Warkinless" book's table of contents, in display order. */
export const WARKINLESS_SECTIONS: { id: WarkinlessSectionId; label: string }[] = [
  { id: "introduction", label: "Introduction" },
  { id: "world", label: "World & Lore" },
  { id: "characters", label: "Characters" },
  { id: "excerpts", label: "Excerpts" },
  { id: "illustrations", label: "Illustrations" },
  { id: "updates", label: "Future Updates" },
];

/**
 * Warkinless is the user's real, ongoing fantasy project — but no actual
 * lore, characters, or text has been supplied yet. Per explicit
 * instruction ("do not invent lore that is not already provided"), every
 * field here stays empty/null rather than fabricated; `WarkinlessBook`
 * shows an honest "not written yet" placeholder per section until real
 * content is added here.
 */
export const warkinless: WarkinlessContent = {
  tagline: null,
  introduction: null,
  world: null,
  characters: [],
  excerpts: [],
  illustrations: [],
  updates: [],
};
