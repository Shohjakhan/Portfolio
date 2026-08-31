"use client";

import { createStore, useStoreSelector } from "@/state/createStore";

export type CursorVariant = "default" | "interactive" | "text";

export interface CursorState {
  /** False on touch/coarse-pointer devices — CustomCursor renders nothing and the native cursor is left untouched. */
  supported: boolean;
  variant: CursorVariant;
  /** Bumped every time `variant` transitions *into* "interactive" — lets the sparkle re-trigger per hover-enter. */
  hoverSeq: number;
  /** Bumped on every click. CustomCursor keys its ripple off this, and it's the hook point for the future click sound (see SoundTrigger). */
  clickSeq: number;
}

const initialState: CursorState = {
  supported: true,
  variant: "default",
  hoverSeq: 0,
  clickSeq: 0,
};

export const cursorStore = createStore<CursorState>(initialState);

/**
 * Elements the cursor reacts to automatically — no per-object wiring
 * required. A future interactive object gets the hover reaction for free
 * just by being a real button/link/[role="button"]; anything else can opt
 * in with `data-cursor="interactive"`, or opt out with `data-cursor="default"`
 * (e.g. a decorative hover target that shouldn't look clickable).
 */
export const CURSOR_INTERACTIVE_SELECTOR =
  'a[href], button:not(:disabled), [role="button"], summary, select, label[for], input[type="checkbox"], input[type="radio"], input[type="range"], [tabindex]:not([tabindex="-1"]), [data-cursor="interactive"]';

/** Text-entry elements get the native text-beam cursor instead of the feather, so the cursor never sits on top of what's being typed. */
export const CURSOR_TEXT_SELECTOR =
  'input:not([type]), input[type="text"], input[type="email"], input[type="search"], input[type="tel"], input[type="url"], input[type="number"], input[type="password"], textarea, [contenteditable="true"], [data-cursor="text"]';

export function resolveCursorVariant(target: EventTarget | null): CursorVariant {
  if (!(target instanceof Element)) return "default";
  if (target.closest('[data-cursor="default"]')) return "default";
  if (target.closest(CURSOR_TEXT_SELECTOR)) return "text";
  if (target.closest(CURSOR_INTERACTIVE_SELECTOR)) return "interactive";
  return "default";
}

export const cursorActions = {
  setSupported(supported: boolean) {
    if (cursorStore.getState().supported === supported) return;
    cursorStore.setState({ supported });
  },
  /** No-op when unchanged — pointermove fires far more often than the hovered element actually changes, and every store write notifies subscribers. */
  setVariant(variant: CursorVariant) {
    const state = cursorStore.getState();
    if (state.variant === variant) return;
    cursorStore.setState({
      variant,
      hoverSeq: variant === "interactive" ? state.hoverSeq + 1 : state.hoverSeq,
    });
  },
  pulseClick() {
    cursorStore.setState((state) => ({ clickSeq: state.clickSeq + 1 }));
  },
};

export function useCursorValue<U>(selector: (state: CursorState) => U): U {
  return useStoreSelector(cursorStore, selector);
}
