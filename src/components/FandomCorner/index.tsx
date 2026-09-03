"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { AnimeDetail } from "@/components/FandomCorner/AnimeDetail";
import { Charm } from "@/components/FandomCorner/Charm";
import { BackLink } from "@/components/shared/BackLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { animeEntries as staticAnimeEntries } from "@/data/anime";
import { useContentList } from "@/hooks/useContentList";
import type { AnimeEntry } from "@/types/content";

interface FandomCornerProps {
  onClose: () => void;
}

/** The plushie → "Anime & Manga" experience — "think of smth creative,"
 * so instead of a poster/card grid this is a small charm rack: a rail
 * with one hanging, gently swaying charm per title, matching the
 * plushie/"comfort characters" framing better than a list would.
 * Clicking a charm enlarges it via `AnimeDetail`.
 *
 * Notion-backed the same way as `CinemaTickets` — see its doc comment
 * and docs/notion-integration.md for the fallback chain. */
export function FandomCorner({ onClose }: FandomCornerProps) {
  const [openEntry, setOpenEntry] = useState<AnimeEntry | null>(null);
  const { items: animeEntries } = useContentList<AnimeEntry>("/api/content/anime", staticAnimeEntries);

  return (
    <div className="flex flex-col gap-8">
      {animeEntries.length === 0 ? (
        <EmptyState icon={Sparkles} message="No charms on the rack yet — favorites will hang here." />
      ) : (
        <div className="flex flex-col">
          <div className="charm-rail mx-6" aria-hidden />
          <div className="flex flex-wrap justify-center gap-8 px-6 pt-1">
            {animeEntries.map((entry, index) => (
              <Charm key={entry.id} entry={entry} index={index} onSelect={() => setOpenEntry(entry)} />
            ))}
          </div>
        </div>
      )}
      <BackLink onClick={onClose} />
      {openEntry ? <AnimeDetail entry={openEntry} onClose={() => setOpenEntry(null)} /> : null}
    </div>
  );
}
