"use client";

import { Volume2, VolumeX } from "lucide-react";
import { sceneActions, useSceneValue } from "@/state/sceneStore";
import { cn } from "@/utils/cn";

export interface AudioControlsProps {
  className?: string;
}

/**
 * Toggles the scene's global `audioEnabled` flag that every SoundTrigger
 * gates playback on. No audio files are wired in yet — see
 * docs/adding-interactive-objects.md before attaching the first one.
 */
export function AudioControls({ className }: AudioControlsProps) {
  const audioEnabled = useSceneValue((state) => state.audioEnabled);

  return (
    <button
      type="button"
      onClick={sceneActions.toggleAudio}
      aria-pressed={audioEnabled}
      aria-label={audioEnabled ? "Mute room ambience" : "Unmute room ambience"}
      className={cn(
        "texture-paper inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-pill)] shadow-[var(--shadow-warm-sm)] transition-transform duration-[var(--duration-fast)] ease-[var(--ease-soft)] hover:scale-105 focus-visible:scale-105",
        className,
      )}
    >
      {audioEnabled ? <Volume2 size={18} strokeWidth={1.75} /> : <VolumeX size={18} strokeWidth={1.75} />}
    </button>
  );
}
