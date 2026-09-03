"use client";

import type { AnimeEntry } from "@/types/content";

/** Fallback shell color when a title has no cover art yet — cycled so a
 * row of un-covered charms doesn't read as one repeated color. */
const FALLBACK_COLORS = ["#e8b4bc", "#f0d68a", "#a8c8a0", "#9fc6d9", "#d9a8c6"];

interface CharmProps {
  entry: AnimeEntry;
  index: number;
  onSelect: () => void;
}

/**
 * A small acrylic-style photo charm — a rounded-square tile bearing the
 * title's real cover art, clipped onto a loop and hung from the rack's
 * rail by a string. Replaces an earlier flat-color-ball treatment that
 * had no room for real artwork (a title could only ever show as ~9
 * truncated characters inside a circle) — real anime keychain/acrylic
 * charms are square-ish photo tiles, not plain spheres, so this reads
 * closer to the actual collectible it's referencing. No cover yet →
 * an initial-letter tile in a rotating color, same "never a blank gap"
 * contract as the rest of the room, never a broken image.
 */
export function Charm({ entry, index, onSelect }: CharmProps) {
  const fallbackColor = FALLBACK_COLORS[index % FALLBACK_COLORS.length];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={entry.title}
      className="group flex flex-col items-center gap-1.5"
    >
      <span className="h-7 w-[2px] bg-black/25" aria-hidden />
      <span className="charm-swing flex flex-col items-center" style={{ animationDelay: `${index * 350}ms` }}>
        <span aria-hidden className="-mb-1 h-3 w-3 rounded-full border-2 border-[var(--color-wood-dark)]/60" />
        <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[10px] border-2 border-[var(--color-cream)] bg-[var(--color-cream)] shadow-[var(--shadow-warm-sm)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-bounce-soft)] group-hover:-translate-y-1 group-hover:rotate-[-2deg] group-hover:shadow-[var(--shadow-warm-md)]">
          {entry.cover ? (
            // eslint-disable-next-line @next/next/no-img-element -- decorative thumbnail, data-driven; matches the room's plain <img> convention for small covers
            <img src={entry.cover.src} alt="" className="h-full w-full object-cover" />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center font-hand text-2xl text-[var(--color-paper-ink)]/70"
              style={{ backgroundColor: fallbackColor }}
            >
              {entry.title.charAt(0)}
            </span>
          )}
        </span>
      </span>
      <span className="max-w-[4.5rem] truncate font-hand-note text-xs leading-none text-[var(--color-paper-ink)]/70 group-hover:text-[var(--color-accent)]">
        {entry.title}
      </span>
    </button>
  );
}
