"use client";

import { AMBIENT_CUES, INTERACTION_CUES, type AmbientCueId, type InteractionCueId } from "@/lib/audio/cues";
import { sceneStore } from "@/state/sceneStore";

/** Hard cap on one-shots playing at once, across every cue — the backstop
 * against "avoid overlapping sounds becoming chaotic" for the case a
 * per-cue cooldown alone can't catch: several *different* cues triggered
 * in quick succession (a click that fires a laptop-click, immediately
 * followed by hovers firing sparkles elsewhere). */
const MAX_CONCURRENT_INTERACTION = 3;

const AMBIENT_FADE_MS = 1400;

/**
 * Purely atmospheric cues — each one's only job is to accompany a visual
 * flourish that's already suppressed under `prefers-reduced-motion` (see
 * `animations.css`'s own reduced-motion block: the click ripple, the
 * cursor sparkle, and the page-turn/scene-transition animations are all
 * in there). Silencing these too keeps sound and motion in agreement
 * instead of leaving a flourish sound playing with no flourish left to
 * accompany. Every other interaction cue carries real information — a
 * click registered, a page actually turned, the phone was picked up — and
 * stays audible regardless of the motion preference; see
 * `docs/adding-interactive-objects.md` §5 for the full list and reasoning.
 */
const DECORATIVE_CUES = new Set<InteractionCueId>(["featherClick", "hoverSparkle", "paperRustle", "sceneTransition"]);

function isAudioEnabled(): boolean {
  return sceneStore.getState().audioEnabled;
}

function isReducedMotion(): boolean {
  return sceneStore.getState().reducedMotion;
}

/**
 * The room's one audio engine — every sound in the room, ambient or
 * interaction, plays through this, never a bare `new Audio()` scattered
 * per component (see `SoundTrigger`, which wraps this for the
 * declarative "play on value change" case). A single module-level
 * instance, not a React hook — audio playback is inherently imperative
 * and outlives any one component's render, so it lives as a plain class
 * that hooks call into, the same relationship `sceneStore` has to
 * `useSceneValue`.
 *
 * Three jobs, matching the brief this was built against:
 * - **Gating** — every method reads `sceneStore`'s `audioEnabled` itself
 *   at call time, so nothing plays before the user has explicitly opted
 *   in via `AudioControls`, and everything stops the instant they opt out.
 * - **Reasonable preloading** — one-shot elements are created lazily
 *   (first `play()` call constructs them), except `warmInteractionCues`,
 *   called once when sound is switched on, which front-loads just the
 *   small one-shot clips so the *first* real trigger isn't delayed by a
 *   cold fetch. Ambient beds stay fully lazy even after that — a rain
 *   loop that never gets used this session (because it never rains) never
 *   loads at all.
 * - **Anti-chaos** — per-cue cooldowns, a global concurrency cap, and
 *   ambient crossfades instead of hard cuts (see `syncAmbient`).
 */
class AudioManager {
  private interactionElements = new Map<InteractionCueId, HTMLAudioElement>();
  private ambientElements = new Map<AmbientCueId, HTMLAudioElement>();
  private lastPlayedAt = new Map<InteractionCueId, number>();
  private activeInteractionCount = 0;
  private currentBed: AmbientCueId | null = null;
  private fireplaceOn = false;

  private getInteractionElement(id: InteractionCueId): HTMLAudioElement {
    let element = this.interactionElements.get(id);
    if (!element) {
      element = new Audio(INTERACTION_CUES[id].src);
      element.preload = "auto";
      this.interactionElements.set(id, element);
    }
    return element;
  }

  private getAmbientElement(id: AmbientCueId): HTMLAudioElement {
    let element = this.ambientElements.get(id);
    if (!element) {
      element = new Audio(AMBIENT_CUES[id].src);
      element.loop = true;
      element.preload = "none";
      element.volume = 0;
      this.ambientElements.set(id, element);
    }
    return element;
  }

  /** Warms every one-shot interaction clip without playing any of them —
   * called once, right when the user turns sound on (see
   * `useAmbientAudio`). Never called before that: no request for any
   * sound file goes out until there's been explicit consent. */
  warmInteractionCues() {
    if (typeof window === "undefined") return;
    (Object.keys(INTERACTION_CUES) as InteractionCueId[]).forEach((id) => this.getInteractionElement(id));
  }

  /**
   * Plays a one-shot interaction cue. Silently does nothing when: sound
   * is off, this specific cue is still on cooldown from its last play,
   * the global concurrency cap is already full, the cue is purely
   * decorative and motion is reduced, or the browser blocks playback
   * outright (autoplay policy, missing file) — never throws, same
   * "fail quiet" contract `SoundTrigger` already had.
   */
  playInteraction(id: InteractionCueId) {
    if (typeof window === "undefined" || !isAudioEnabled()) return;
    if (DECORATIVE_CUES.has(id) && isReducedMotion()) return;

    const def = INTERACTION_CUES[id];
    const now = performance.now();
    const last = this.lastPlayedAt.get(id) ?? -Infinity;
    if (now - last < def.cooldownMs) return;
    if (this.activeInteractionCount >= MAX_CONCURRENT_INTERACTION) return;

    const element = this.getInteractionElement(id);
    this.lastPlayedAt.set(id, now);
    element.volume = def.volume;
    element.currentTime = 0;

    this.activeInteractionCount += 1;
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      this.activeInteractionCount = Math.max(0, this.activeInteractionCount - 1);
    };
    element.addEventListener("ended", release, { once: true });

    element.play().catch(release);
  }

  private fadeTo(element: HTMLAudioElement, target: number, durationMs = AMBIENT_FADE_MS) {
    const start = element.volume;
    const startTime = performance.now();

    const step = () => {
      const elapsed = performance.now() - startTime;
      const t = durationMs <= 0 ? 1 : Math.min(1, elapsed / durationMs);
      element.volume = start + (target - start) * t;
      if (t < 1) {
        requestAnimationFrame(step);
      } else if (target === 0) {
        element.pause();
      }
    };
    requestAnimationFrame(step);
  }

  private startBed(id: AmbientCueId) {
    const element = this.getAmbientElement(id);
    if (element.paused) {
      element.volume = 0;
      element.play().catch(() => {
        // Blocked (autoplay policy, missing file) — stays silent, no retry loop.
      });
    }
    this.fadeTo(element, AMBIENT_CUES[id].volume);
  }

  private stopBed(id: AmbientCueId) {
    const element = this.ambientElements.get(id);
    if (!element) return;
    this.fadeTo(element, 0);
  }

  /**
   * The one entry point for ambient state — called by `useAmbientAudio`
   * whenever `audioEnabled`/`weather`/`timeOfDay` changes. `bed` is the
   * single environment loop that should be playing (rain XOR wind XOR
   * room tone — never more than one at once, so the room never sounds
   * like it's simultaneously raining and silent-calm); `fireplace` is an
   * independent low layer that can be on at the same time. Switches
   * crossfade (`fadeTo`) rather than hard-cut, the same "gradual, never
   * abrupt" rule CLAUDE.md §2 already applies to sky/lighting, just for
   * sound.
   */
  syncAmbient(options: { enabled: boolean; bed: AmbientCueId; fireplace: boolean }) {
    if (typeof window === "undefined") return;

    if (!options.enabled) {
      if (this.currentBed) this.stopBed(this.currentBed);
      this.currentBed = null;
      if (this.fireplaceOn) this.stopBed("fireplace");
      this.fireplaceOn = false;
      return;
    }

    if (options.bed !== this.currentBed) {
      if (this.currentBed) this.stopBed(this.currentBed);
      this.startBed(options.bed);
      this.currentBed = options.bed;
    }

    if (options.fireplace !== this.fireplaceOn) {
      if (options.fireplace) this.startBed("fireplace");
      else this.stopBed("fireplace");
      this.fireplaceOn = options.fireplace;
    }
  }
}

/** One instance for the whole app — see the class doc comment for why
 * this isn't a hook. */
export const audioManager = new AudioManager();
