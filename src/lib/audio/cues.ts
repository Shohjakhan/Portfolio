/**
 * The one catalog every sound in the room is registered in — mirrors
 * `data/assets.ts`'s "one place that says what file backs a thing"
 * convention, applied to audio instead of art. Components never reference
 * a raw file path; they ask the manager (`lib/audio/manager.ts`) for a
 * cue id, so a filename only ever needs to change here.
 *
 * `volume` is deliberately low across the board — "sound should be
 * subtle" per the brief, a background presence, not a UI that announces
 * itself. `cooldownMs` is the minimum gap between two plays of the *same*
 * cue (see `AudioManager.playInteraction`) — the guard against a rapid
 * hover/click spree turning into a machine-gun of overlapping copies of
 * one sound.
 *
 * No files exist under `public/sounds/` yet — every cue here resolves to
 * a 404, which `AudioManager` (and, before it, `SoundTrigger`) already
 * swallows silently by design, same "wired now, silent until a real file
 * lands" convention this codebase already uses for quill-tap/page-turn/
 * phone-ring (see docs/adding-interactive-objects.md §5).
 */

export type AmbientCueId = "rain" | "wind" | "roomTone" | "fireplace" | "music";

export type InteractionCueId =
  | "featherClick"
  | "hoverSparkle"
  | "bookOpen"
  | "pageTurn"
  | "paperRustle"
  | "laptopClick"
  | "phoneRing"
  | "phoneHandset"
  | "brushStroke"
  | "uiTransition"
  | "sceneTransition";

export interface AmbientCueDefinition {
  src: string;
  /** Target volume once fully faded in — see `AudioManager`'s crossfade. */
  volume: number;
}

export interface InteractionCueDefinition {
  src: string;
  volume: number;
  cooldownMs: number;
}

/** Loop, longer-lived "environment" beds — see `useAmbientAudio` for how
 * `weather`/`timeOfDay` pick which of these plays. Only one of
 * rain/wind/roomTone is ever active at a time; fireplace layers on top;
 * music is registered but never auto-started (see `useAmbientAudio`'s own
 * doc comment for why). */
export const AMBIENT_CUES: Record<AmbientCueId, AmbientCueDefinition> = {
  rain: { src: "/sounds/ambient/rain.mp3", volume: 0.32 },
  wind: { src: "/sounds/ambient/wind.mp3", volume: 0.26 },
  roomTone: { src: "/sounds/ambient/room-tone.mp3", volume: 0.2 },
  fireplace: { src: "/sounds/ambient/fireplace.mp3", volume: 0.22 },
  music: { src: "/sounds/ambient/music.mp3", volume: 0.16 },
};

/** One-shot cues. `featherClick`/`pageTurn`/`phoneRing` keep the exact
 * paths already referenced by CustomCursor/PlainBook+BookReader/Phone
 * from before this catalog existed — renaming them would just add
 * pointless churn for files that don't exist yet either way. */
export const INTERACTION_CUES: Record<InteractionCueId, InteractionCueDefinition> = {
  featherClick: { src: "/sounds/quill-tap.mp3", volume: 0.18, cooldownMs: 70 },
  hoverSparkle: { src: "/sounds/hover-sparkle.mp3", volume: 0.14, cooldownMs: 220 },
  bookOpen: { src: "/sounds/book-open.mp3", volume: 0.32, cooldownMs: 400 },
  pageTurn: { src: "/sounds/page-turn.mp3", volume: 0.28, cooldownMs: 150 },
  paperRustle: { src: "/sounds/paper-rustle.mp3", volume: 0.22, cooldownMs: 220 },
  laptopClick: { src: "/sounds/laptop-click.mp3", volume: 0.28, cooldownMs: 300 },
  phoneRing: { src: "/sounds/phone-ring.mp3", volume: 0.38, cooldownMs: 500 },
  phoneHandset: { src: "/sounds/phone-handset.mp3", volume: 0.28, cooldownMs: 500 },
  brushStroke: { src: "/sounds/brush-stroke.mp3", volume: 0.28, cooldownMs: 300 },
  uiTransition: { src: "/sounds/ui-transition.mp3", volume: 0.22, cooldownMs: 200 },
  sceneTransition: { src: "/sounds/scene-transition.mp3", volume: 0.26, cooldownMs: 300 },
};
