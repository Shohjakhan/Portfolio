"use client";

import { Ticket as TicketIcon } from "lucide-react";
import { useState } from "react";
import { MovieDetail } from "@/components/CinemaTickets/MovieDetail";
import { Ticket } from "@/components/CinemaTickets/Ticket";
import { BackLink } from "@/components/shared/BackLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { movies as staticMovies } from "@/data/movies";
import { useContentList } from "@/hooks/useContentList";
import type { Movie } from "@/types/content";

interface CinemaTicketsProps {
  onClose: () => void;
}

/** The movie poster → "Cinema" experience — a scattered stack of ticket
 * stubs, one per favorite film; clicking a ticket enlarges it (poster +
 * why it's a favorite) via `MovieDetail`, same click-to-enlarge shape as
 * the art gallery's frames.
 *
 * Content is Notion-backed (see docs/notion-integration.md) — `movies`
 * (this panel's `useContentList` result) fetches `/api/content/movies`
 * on mount, which itself falls back to `staticMovies` (this file's own
 * import, currently `[]`) server-side if Notion isn't configured or is
 * unreachable. `useContentList` *also* falls back to `staticMovies` if
 * the fetch itself fails outright — so this panel behaves identically to
 * before Notion existed in every failure case, never worse. */
export function CinemaTickets({ onClose }: CinemaTicketsProps) {
  const [openMovie, setOpenMovie] = useState<Movie | null>(null);
  const { items: movies } = useContentList<Movie>("/api/content/movies", staticMovies);

  return (
    <div className="flex flex-col gap-6">
      {movies.length === 0 ? (
        <EmptyState icon={TicketIcon} message="No tickets stubbed yet — favorite films will land here." />
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {movies.map((movie) => (
            <Ticket key={movie.id} movie={movie} onSelect={() => setOpenMovie(movie)} />
          ))}
        </div>
      )}
      <BackLink onClick={onClose} />
      {openMovie ? <MovieDetail movie={openMovie} onClose={() => setOpenMovie(null)} /> : null}
    </div>
  );
}
