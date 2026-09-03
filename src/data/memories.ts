import type { MemoryReel } from "@/types/content";

/**
 * The photo wall's reel shelf — one reel per event/place worth its own
 * shelf slot. Real reel titles the user gave directly, not invented; the
 * photos/videos *inside* each reel are a separate thing — `items` stays
 * `[]` until real media is supplied, same "don't invent" rule as every
 * other content file in this room (`data/gallery.ts`, `data/warkinless.ts`,
 * `data/booksRead.ts`).
 */
export const memoryReels: MemoryReel[] = [
  {
    id: "mun",
    title: "MUN",
    items: [],
  },
  {
    id: "graduation",
    title: "Graduation",
    items: [],
  },
];
