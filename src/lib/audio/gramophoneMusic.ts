/**
 * The gramophone's music: the owner's YouTube playlist, played through YouTube's official embedded
 * player (IFrame API) — nothing is downloaded or re-hosted. Every time the gramophone is switched
 * on, the playlist is shuffled and a random track starts; when a track ends the next one in the
 * shuffle follows. If YouTube can't be reached or keeps refusing to play, the generated lo-fi loop
 * (`lofi.ts`) plays instead.
 *
 * The YouTube script is only requested when someone first points at the gramophone, never on page
 * load.
 */
import { lofi } from "@/lib/audio/lofi";

const PLAYLIST_ID = "PL6wpKSgIcNwHcPgc7Ti3dx6KFsQovTeVA";
const VOLUME = 55;
const MAX_CONSECUTIVE_ERRORS = 3;
const START_TIMEOUT_MS = 9000;

interface YTPlayer {
  cuePlaylist(options: { listType: "playlist"; list: string }): void;
  loadPlaylist(playlist: string[] | { listType: "playlist"; list: string; index?: number }): void;
  mute(): void;
  unMute(): void;
  pauseVideo(): void;
  getPlaylist(): string[] | null;
  getVideoData(): { title?: string; video_id?: string };
  nextVideo(): void;
  setVolume(volume: number): void;
  stopVideo(): void;
  destroy(): void;
}
interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      width: number;
      height: number;
      playerVars: Record<string, string | number>;
      events: {
        onReady: () => void;
        onStateChange: (event: { data: number }) => void;
        onError: (event: { data: number }) => void;
      };
    },
  ) => YTPlayer;
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface MusicState {
  playing: boolean;
  title: string;
}

type Listener = () => void;
const listeners = new Set<Listener>();
const SERVER_STATE: MusicState = { playing: false, title: "" };
let state: MusicState = SERVER_STATE;
let player: YTPlayer | null = null;
let ready = false;
let ids: string[] = [];
let apiPromise: Promise<void> | null = null;
let useFallback = false;
let errors = 0;
let startTimer: number | undefined;

const HOST_ID = "gramophone-player-host";
// A reloaded copy of this module (hot reload while developing) must not leave the previous copy's
// player playing: removing its iframe silences it.
if (typeof document !== "undefined") document.getElementById(HOST_ID)?.remove();

function set(next: Partial<MusicState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function loadApi(): Promise<void> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>((resolve, reject) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => reject(new Error("youtube api"));
    document.head.appendChild(script);
  });
  apiPromise.catch(() => {
    apiPromise = null;
  });
  return apiPromise;
}

function createPlayer(): void {
  if (player || !window.YT?.Player) return;
  // YouTube wants a real (not display:none) player of a sensible size; it is kept off-screen
  const host = document.createElement("div");
  host.id = HOST_ID;
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = "position:fixed;left:-9999px;top:0;width:200px;height:200px;overflow:hidden;pointer-events:none;";
  const mount = document.createElement("div");
  host.appendChild(mount);
  document.body.appendChild(host);

  player = new window.YT.Player(mount, {
    width: 200,
    height: 200,
    playerVars: { controls: 0, playsinline: 1, rel: 0, disablekb: 1, fs: 0, origin: window.location.origin },
    events: {
      onReady: () => {
        ready = true;
        player?.setVolume(VOLUME);
        if (state.playing) playRandom();
      },
      onStateChange: ({ data }) => {
        if (player && ids.length === 0 && (data === 5 || data === 1 || data === 3)) {
          const got = player.getPlaylist();
          if (got && got.length > 0) {
            ids = got;
            if (state.playing) {
              // we started on the playlist's first track only to learn its ids: restart on a random one
              playRandom();
              player.unMute();
              return;
            }
          }
        }
        if (data === 1 && player && !state.playing) {
          // never play unless the gramophone was pressed
          player.stopVideo();
          return;
        }
        if (data === 1 && player) {
          window.clearTimeout(startTimer);
          errors = 0;
          const data = player.getVideoData();
          console.info("[gramophone] playing from your playlist:", data.title, `(https://youtu.be/${data.video_id})`);
          set({ title: data.title ?? "" });
        }
      },
      onError: ({ data }) => {
        console.warn("[gramophone] YouTube could not play a track (error", data, ")");
        errors += 1;
        if (errors >= MAX_CONSECUTIVE_ERRORS) switchToFallback();
        else player?.nextVideo();
      },
    },
  });
}

function playRandom() {
  if (!player || !ready) return;
  if (ids.length === 0) {
    // the track ids aren't known yet: begin the playlist (muted) just to learn them
    player.mute();
    player.loadPlaylist({ listType: "playlist", list: PLAYLIST_ID, index: 0 });
    return;
  }
  player.setVolume(VOLUME);
  player.loadPlaylist(shuffled(ids));
  window.clearTimeout(startTimer);
  startTimer = window.setTimeout(() => {
    if (state.playing && !state.title) switchToFallback();
  }, START_TIMEOUT_MS);
}

function switchToFallback() {
  if (useFallback || !state.playing) return;
  useFallback = true;
  player?.stopVideo();
  lofi.toggle();
  console.warn("[gramophone] YouTube did not start — playing the built-in lo-fi loop instead");
  set({ title: "lo-fi loop (YouTube unavailable)" });
}

export const music = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => state,
  getServerSnapshot: (): MusicState => SERVER_STATE,
  /** Start fetching YouTube's player ahead of the click (called when the gramophone is pointed at). */
  preload() {
    void loadApi().then(createPlayer).catch(() => undefined);
  },
  toggle() {
    lofi.prime(); // inside the click, so the fallback can sound even if it starts later
    if (state.playing) {
      set({ playing: false, title: "" });
      window.clearTimeout(startTimer);
      if (useFallback) {
        useFallback = false;
        lofi.toggle();
      } else {
        player?.mute();
        player?.pauseVideo();
        player?.stopVideo();
      }
      return;
    }
    set({ playing: true, title: "" });
    errors = 0;
    useFallback = false;
    loadApi()
      .then(() => {
        createPlayer();
        if (ready) playRandom();
      })
      .catch(() => switchToFallback());
    // the player may need a few seconds to fetch the playlist; if nothing is playing by then, use the fallback
    window.clearTimeout(startTimer);
    startTimer = window.setTimeout(() => {
      if (state.playing && !state.title) switchToFallback();
    }, START_TIMEOUT_MS);
  },
};
