"use client";

import { Volume2, VolumeX } from "lucide-react";
import { sceneActions, useSceneValue } from "@/state/sceneStore";
import { cn } from "@/utils/cn";

export interface AudioControlsProps {
  className?: string;
}

/**
 * The room's one sound toggle — turns the scene's global `audioEnabled`
 * flag on/off, the single gate every cue in `lib/audio/manager.ts` checks
 * before playing anything. This click is also the "explicit user
 * interaction" the brief requires before any sound starts — nothing
 * attempts to play before this button is pressed at least once.
 * Deliberately plain (an icon, no label, no onboarding tooltip): the room
 * should read as complete with sound off, so the control that turns it on
 * shouldn't call attention to itself either. No audio files exist under
 * `public/sounds/` yet — every cue is wired and silently no-ops until one
 * is added (see docs/adding-interactive-objects.md §5).
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
