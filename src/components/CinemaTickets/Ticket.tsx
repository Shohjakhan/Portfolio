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
      aria-label={movie.title}
      className="group relative block w-72 text-left drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-bounce-soft)] hover:-translate-y-1 hover:rotate-[-1deg] hover:[filter:var(--hover-glow)] focus-visible:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--room-lamp-glow)]"
      style={{ aspectRatio: "732 / 326" }}
    >
      {/* the painted blank ticket (art-source/07-panels C1); the stub and body are drawn, the words are live text */}
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative, matches the room's plain <img> convention */}
      <img src="/assets/panels/cinema/ticket.png" alt="" aria-hidden className="absolute inset-0 h-full w-full" />
      <div className="absolute flex flex-col justify-center gap-0.5" style={{ left: "31%", top: "16%", width: "60%", height: "56%" }}>
        <p className="font-hand-note text-xl leading-none text-[var(--color-paper-ink)]">{movie.title}</p>
        {movie.year ? <p className="text-[0.7rem] text-[var(--color-paper-ink)]/75">{movie.year}</p> : null}
        {movie.note ? <p className="line-clamp-2 text-[0.7rem] text-[var(--color-paper-ink)]/75">{movie.note}</p> : null}
      </div>
      <span
        aria-hidden
        className="absolute flex items-center justify-center text-[0.5rem] tracking-[0.18em] whitespace-nowrap text-[var(--color-paper-ink)]/70 uppercase"
        style={{ left: "4%", top: "16%", width: "10%", height: "66%", writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        Admit One
      </span>
    </button>
  );
}
