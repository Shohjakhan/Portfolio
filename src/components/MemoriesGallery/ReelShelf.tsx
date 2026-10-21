"use client";

import type { MemoryReel } from "@/types/content";

interface ReelShelfProps {
  reels: MemoryReel[];
  onSelect: (reel: MemoryReel) => void;
}

/**
 * The photo frames open onto this — a shelf of film-reel canisters, one
 * per event/place, each labeled with its title. "A collection of movie
 * tape rolls," per the brief, not a photo grid — clicking a reel is what
 * opens its actual photos (see `FilmStrip`).
 */
export function ReelShelf({ reels, onSelect }: ReelShelfProps) {
  return (
    <div className="flex items-start gap-x-10 overflow-x-auto overscroll-x-contain px-2 py-4 sm:justify-center">
      {reels.map((reel) => (
        <button
          key={reel.id}
          type="button"
          onClick={() => onSelect(reel)}
          className="group flex shrink-0 flex-col items-center gap-3"
        >
          <span className="relative block h-28 w-28 shrink-0 transition-transform duration-[var(--duration-base)] ease-[var(--ease-bounce-soft)] group-hover:-rotate-6 group-hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element -- painted canister, matches the room's plain <img> convention */}
            <img src="/assets/panels/memories/reel.png" alt="" aria-hidden className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" />
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
