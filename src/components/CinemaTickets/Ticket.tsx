"use client";

import type { Movie } from "@/types/content";

interface TicketProps {
  movie: Movie;
  onSelect: () => void;
}

/** One favorite film as a cinema ticket stub — a dashed tear-line
 * separating the film's details from an "ADMIT ONE" stub, per the brief's
 * "a collection of movie posters or cinema tickets" (tickets read as more
 * distinct than another poster grid). */
export function Ticket({ movie, onSelect }: TicketProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex h-28 w-64 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-cream)] text-left shadow-[var(--shadow-warm-sm)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-bounce-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-warm-md)]"
    >
      <div className="flex flex-1 flex-col justify-center gap-1 px-4">
        <p className="font-hand-note text-xl leading-none text-[var(--color-paper-ink)]">{movie.title}</p>
        {movie.year ? <p className="text-xs text-[var(--color-paper-ink)]/70">{movie.year}</p> : null}
        {movie.note ? <p className="mt-1 line-clamp-2 text-xs text-[var(--color-paper-ink)]/70">{movie.note}</p> : null}
      </div>
      <div className="flex w-14 shrink-0 items-center justify-center border-l-2 border-dashed border-[var(--color-paper-ink)]/20">
        <span className="rotate-90 text-[0.6rem] tracking-[0.2em] whitespace-nowrap text-[var(--color-paper-ink)]/70 uppercase">
          Admit One
        </span>
      </div>
    </button>
  );
}
