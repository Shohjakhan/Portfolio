"use client";

import type { MemoryReel } from "@/types/content";

interface ReelShelfProps {
  reels: MemoryReel[];
  onSelect: (reel: MemoryReel) => void;
}

/** Three spoke holes per reel, positions chosen by eye (not literal
 * trigonometry) — close enough to read as a film canister at this size. */
const HOLE_POSITIONS = [
  { left: "50%", top: "20%" },
  { left: "74%", top: "64%" },
  { left: "26%", top: "64%" },
];

/**
 * The photo frames open onto this — a shelf of film-reel canisters, one
 * per event/place, each labeled with its title. "A collection of movie
 * tape rolls," per the brief, not a photo grid — clicking a reel is what
 * opens its actual photos (see `FilmStrip`).
 */
export function ReelShelf({ reels, onSelect }: ReelShelfProps) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-8 px-2 py-4">
      {reels.map((reel) => (
        <button
          key={reel.id}
          type="button"
          onClick={() => onSelect(reel)}
          className="group flex flex-col items-center gap-3"
        >
          <span className="relative block h-28 w-28 shrink-0 transition-transform duration-[var(--duration-base)] ease-[var(--ease-bounce-soft)] group-hover:-rotate-6 group-hover:scale-105">
            <span className="film-reel absolute inset-0" aria-hidden />
            {HOLE_POSITIONS.map((pos, index) => (
              <span
                key={index}
                className="film-reel-hole absolute h-[16%] w-[16%] -translate-x-1/2 -translate-y-1/2"
                style={pos}
                aria-hidden
              />
            ))}
          </span>
          <span className="flex flex-col items-center">
            <span className="font-hand-note text-lg leading-none text-[var(--color-paper-ink)] group-hover:text-[var(--color-accent)]">
              {reel.title}
            </span>
            {reel.period ? <span className="mt-1 text-xs text-[var(--color-paper-ink)]/70">{reel.period}</span> : null}
          </span>
        </button>
      ))}
    </div>
  );
}
