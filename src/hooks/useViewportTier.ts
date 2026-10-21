"use client";

import { useEffect, useState } from "react";

export type ViewportTier = "mobile" | "tablet" | "desktop";

/**
 * Matches `--breakpoint-sm`/`--breakpoint-lg` in `styles/variables.css`
 * (520px / 1200px) rather than inventing new numbers — those tokens
 * already drive every `sm:`/`lg:` Tailwind utility in this codebase, so a
 * JS-computed tier and a CSS breakpoint can never disagree at the
 * boundary. `tablet` (520–1199px) intentionally covers a wide range —
 * see `Room`'s doc comment for why tablet reuses the desktop canvas
 * rather than needing a third bespoke layout: hover/tap behavior is
 * already decided per-device by `useCursorSupport`'s
 * `(pointer: fine) and (hover: hover)` check, not by viewport width, so
 * this hook's only real job is "is this narrow enough that the canvas
 * composition would produce tiny/imprecise targets" — i.e. `mobile` vs.
 * everything else.
 */
const MOBILE_MAX_WIDTH = 519;
const TABLET_MAX_WIDTH = 1199;

/** A portrait screen (a tablet held upright) can't show the landscape 3:2 room at a
 * useful size — it would be a small strip between large empty bands — so it gets
 * the purpose-built vertical composition (`MobileRoom`), same as a phone. */
const PORTRAIT_MAX_WIDTH = 1100;

function resolveTier(width: number, height: number): ViewportTier {
  if (width <= MOBILE_MAX_WIDTH) return "mobile";
  if (width <= PORTRAIT_MAX_WIDTH && height > width * 1.1) return "mobile";
  if (width <= TABLET_MAX_WIDTH) return "tablet";
  return "desktop";
}

/**
 * SSR-safe default of `"desktop"` (same "safe static default, corrected
 * client-side" pattern as `useLocalTimeOfDay`/`usePrefersReducedMotion`) —
 * it's the currently-shipped experience, so a fresh page load never
 * flashes a *different* layout than what search engines/no-JS clients see
 * before this effect corrects it. Re-checked on resize/rotate (not just
 * on mount) so `Room` can actually switch composition when the window is
 * resized across a tier boundary or the device rotates, per the brief's
 * "browser resize works" / "orientation changes don't break layout".
 */
export function useViewportTier(): ViewportTier {
  const [tier, setTier] = useState<ViewportTier>("desktop");

  useEffect(() => {
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const tabletQuery = window.matchMedia(`(max-width: ${TABLET_MAX_WIDTH}px)`);

    const sync = () => setTier(resolveTier(window.innerWidth, window.innerHeight));
    sync();

    mobileQuery.addEventListener("change", sync);
    tabletQuery.addEventListener("change", sync);
    // orientation / height-only changes don't cross either width query
    window.addEventListener("resize", sync);
    return () => {
      mobileQuery.removeEventListener("change", sync);
      tabletQuery.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return tier;
}
