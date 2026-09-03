/**
 * Shared vocabulary for the illustrated-room scene: which objects exist,
 * what panel each one opens, and the environmental state that drives the
 * room's living background (time of day, weather, motion/audio prefs).
 */

/**
 * Five phases derived from the visitor's own browser clock (see
 * useLocalTimeOfDay) — not astronomically precise sunrise/sunset, just
 * clock-hour buckets that read naturally across a real day. "evening" sits
 * between "sunset" and "night": lamp mostly on, sky deep blue, stars
 * gathering but not yet at full night intensity.
 */
export type TimeOfDay = "morning" | "afternoon" | "sunset" | "evening" | "night";

export type WeatherCondition = "clear" | "cloudy" | "rain" | "snow";

/**
 * How long the visitor has stayed on the page, not what they've done —
 * purely a dwell-time signal driving very small ambient changes (see
 * useVisitProgress). Four stages, advanced once each via a scheduled
 * timeout, never polled continuously.
 */
export type VisitStage = "initial" | "settled" | "relaxed" | "lateVisitor";

/** Every clickable object in the room. Extend this when a new object ships.
 * `Cat`/`Plants` aren't here — they're purely ambient, no panel of their
 * own (see `data/sceneObjects.ts`'s doc comment). */
export type SceneObjectId =
  | "bookshelf"
  | "easel"
  | "laptop"
  | "coffee"
  | "journal"
  | "phone"
  | "memoryWall"
  | "moviePoster"
  | "plushie";

/** Content destinations an object can open. Several objects may share one panel. */
export type PanelId =
  | "about"
  | "work"
  | "writings"
  | "art"
  | "notes"
  | "memories"
  | "movies"
  | "contact"
  | "fandom";

export interface SceneObjectDefinition {
  id: SceneObjectId;
  /** Accessible name — also used as the hover label's title. */
  label: string;
  /** Short line shown in the hover callout, mirrors the design reference's cards. */
  description: string;
  panel: PanelId;
}

export interface PanelDefinition {
  id: PanelId;
  title: string;
  subtitle?: string;
}
