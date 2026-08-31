"use client";

import { useSyncExternalStore } from "react";

type Listener = () => void;
type Updater<T> = Partial<T> | ((state: T) => Partial<T>);

/**
 * Minimal external store (subscribe/getSnapshot), the same shape React's
 * `useSyncExternalStore` expects. Deliberately not React Context: context
 * re-renders every consumer on every update, which is the wrong default
 * for scene state that changes continuously (time of day, hover, parallax).
 * A selector hook below lets each component subscribe to only the slice
 * it reads, so unrelated re-renders don't happen.
 */
export function createStore<T extends object>(initialState: T) {
  let state = initialState;
  const listeners = new Set<Listener>();

  const getState = () => state;

  const setState = (updater: Updater<T>) => {
    const partial = typeof updater === "function" ? updater(state) : updater;
    state = { ...state, ...partial };
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, setState, subscribe };
}

export type Store<T> = ReturnType<typeof createStore<T & object>>;

/** Subscribe to a derived slice of a store; only re-renders when that slice changes. */
export function useStoreSelector<T extends object, U>(
  store: Store<T>,
  selector: (state: T) => U,
): U {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),
  );
}
