"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { AnimeDetail } from "@/components/FandomCorner/AnimeDetail";
import { CharmRail } from "@/components/FandomCorner/CharmRail";
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
// the painted rail has five hooks; the charms are laid out to hang from them
const CHARMS_PER_ROW = 5;

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

export function FandomCorner({ onClose }: FandomCornerProps) {
  const [openEntry, setOpenEntry] = useState<AnimeEntry | null>(null);
  const { items: animeEntries } = useContentList<AnimeEntry>("/api/content/anime", staticAnimeEntries);

  return (
    <div className="flex flex-col gap-8">
      {animeEntries.length === 0 ? (
        <EmptyState icon={Sparkles} message="No charms on the rack yet — favorites will hang here." />
      ) : (
        <div className="flex flex-col gap-4">
          {chunk(animeEntries, CHARMS_PER_ROW).map((row, rowIndex) => (
            // each row has its own rail to hang from
            <div key={rowIndex} className="mx-auto flex w-full max-w-[34rem] flex-col">
              <CharmRail />
              <div className="mx-auto -mt-3 grid w-[74%] grid-cols-5 justify-items-center">
                {row.map((entry, i) => (
                  <Charm key={entry.id} entry={entry} index={rowIndex * CHARMS_PER_ROW + i} onSelect={() => setOpenEntry(entry)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <BackLink onClick={onClose} />
      {openEntry ? <AnimeDetail entry={openEntry} onClose={() => setOpenEntry(null)} /> : null}
    </div>
  );
}
