import type { Artwork, ArtworkMedium } from "@/types/content";

/** Labels for each medium — shown as a small line under a piece's title in
 * `ArtworkDetail` (e.g. "PAINTING · 2024"). No category filter/sections
 * exist in the gallery itself (removed per explicit feedback — "no need
 * for sections at all"); this is purely a display label lookup. */
export const MEDIUM_LABELS: Record<ArtworkMedium, string> = {
  painting: "Paintings",
  sketch: "Sketches",
  digital: "Digital Art",
  photography: "Photography",
};

const PLACEHOLDER_IMAGES = [
  { src: "/assets/scene/art/gallery-painting-1.svg", alt: "Mock artwork: layered mountain landscape" },
  { src: "/assets/scene/art/gallery-painting-2.svg", alt: "Mock artwork: abstract warm-toned study" },
  { src: "/assets/scene/art/gallery-painting-3.svg", alt: "Mock artwork: simple standing figure" },
];

const MOCK_TITLES = [
  "Quiet Mountains",
  "Dusk Study",
  "Figure, Standing",
  "Untitled Sketch",
  "Fragment 01",
  "Morning Light",
  "Second Wall Study",
  "Late Afternoon",
  "Reflection",
  "Coastline",
  "Study in Green",
  "Untitled No. 4",
  "Evening Walk",
  "Fragment 02",
  "Portrait, Unfinished",
  "Still Water",
  "Field Notes",
  "Untitled No. 7",
  "After the Rain",
  "Small Study",
  "Interior",
  "Fragment 03",
  "Late Light",
  "Untitled No. 9",
];

const MOCK_MEDIUMS: ArtworkMedium[] = ["painting", "sketch", "digital", "photography"];

/**
 * MOCK DATA — for previewing the wall layout only, not real artwork.
 * Reuses the 3 placeholder SVGs across enough entries to fill more than
 * one wall (`WALL_SIZE` is 11, see `wallLayout.ts`) — a sparse handful of
 * pieces doesn't actually show what a fairly full wall looks like, which
 * is the whole point of this layout. Swap this back to `[]` once real
 * photographed/scanned pieces are ready — no real artwork has been
 * supplied yet, so none of these titles/descriptions are real, don't
 * treat them as such.
 */
export const artworks: Artwork[] = MOCK_TITLES.map((title, index) => ({
  id: `mock-${index + 1}`,
  title,
  medium: MOCK_MEDIUMS[index % MOCK_MEDIUMS.length],
  year: index % 3 === 0 ? String(2021 + (index % 5)) : undefined,
  description: index % 4 === 0 ? "A short study, part of an ongoing series." : undefined,
  notes: index % 7 === 0 ? "One of the pieces I keep coming back to and reworking." : undefined,
  image: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
}));
