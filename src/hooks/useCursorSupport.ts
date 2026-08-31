"use client";

import { useEffect } from "react";
import { cursorActions } from "@/state/cursorStore";

/**
 * Mounted once by CustomCursor. A custom cursor only makes sense on devices
 * with a precise pointer that can hover — touchscreens (and hybrid devices
 * while in touch mode) fall back to the native cursor instead. Both media
 * queries are re-checked on change so a hybrid device switching input modes
 * mid-session is handled, not just the initial load.
 */
export function useCursorSupport() {
  useEffect(() => {
    const pointerFine = window.matchMedia("(pointer: fine)");
    const hoverCapable = window.matchMedia("(hover: hover)");

    const sync = () => cursorActions.setSupported(pointerFine.matches && hoverCapable.matches);
    sync();

    pointerFine.addEventListener("change", sync);
    hoverCapable.addEventListener("change", sync);
    return () => {
      pointerFine.removeEventListener("change", sync);
      hoverCapable.removeEventListener("change", sync);
    };
  }, []);
}
