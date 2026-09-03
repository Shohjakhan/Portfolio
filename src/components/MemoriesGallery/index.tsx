"use client";

import { Film } from "lucide-react";
import { useState } from "react";
import { FilmStrip } from "@/components/MemoriesGallery/FilmStrip";
import { ReelShelf } from "@/components/MemoriesGallery/ReelShelf";
import { BackLink } from "@/components/shared/BackLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { memoryReels } from "@/data/memories";
import type { MemoryReel } from "@/types/content";

interface MemoriesGalleryProps {
  onClose: () => void;
}

/**
 * The photo frames → "Memories" experience — same small state-machine
 * shape as `BookshelfLibrary`/`LaptopInterface`: a shelf of reels, and
 * picking one opens onto its own filmstrip. Not a photo grid — per the
 * brief, the frames are the *entrance*, reels are what they open onto.
 */
export function MemoriesGallery({ onClose }: MemoriesGalleryProps) {
  const [activeReel, setActiveReel] = useState<MemoryReel | null>(null);

  if (activeReel) {
    return <FilmStrip reel={activeReel} onBack={() => setActiveReel(null)} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {memoryReels.length === 0 ? (
        <EmptyState icon={Film} message="No reels on the shelf yet — memories will hang here soon." />
      ) : (
        <ReelShelf reels={memoryReels} onSelect={setActiveReel} />
      )}
      <BackLink onClick={onClose} />
    </div>
  );
}
