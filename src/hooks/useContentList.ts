"use client";

import { useEffect, useState } from "react";

interface ContentListState<T> {
  items: T[];
  /** "loading" only ever shows the *initial* static data — never a
   * spinner. A Notion-backed panel that's still fetching looks exactly
   * like it did before this integration existed, and only swaps in once
   * real data (or a confirmed fallback) arrives. */
  status: "loading" | "ready";
  source?: "notion" | "fallback";
}

/**
 * Fetches a `/api/content/*` route's `{ items, source }` body on mount.
 * `initialItems` is both what's shown immediately (no loading flash) and
 * what's kept if the fetch itself fails outright (network down, bad
 * JSON, thrown exception) — so a panel using this hook can *never* end
 * up worse off than it was before Notion was wired in; the worst case is
 * identical to today's static-array behavior.
 */
export function useContentList<T>(endpoint: string, initialItems: T[]): ContentListState<T> {
  const [state, setState] = useState<ContentListState<T>>({ items: initialItems, status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch(endpoint)
      .then((response) => response.json())
      .then((data: { items?: unknown; source?: "notion" | "fallback" }) => {
        if (cancelled) return;
        const items = Array.isArray(data.items) ? (data.items as T[]) : initialItems;
        setState({ items, status: "ready", source: data.source });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ items: initialItems, status: "ready" });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- endpoint is the real dependency; initialItems is a stable module-level import, re-running on its identity would be pointless
  }, [endpoint]);

  return state;
}
