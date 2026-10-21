"use client";

import { useEffect } from "react";
import { sceneActions } from "@/state/sceneStore";
import type { WeatherCondition } from "@/types/scene";

const REFRESH_MS = 15 * 60 * 1000;
const VALID: WeatherCondition[] = ["clear", "cloudy", "rain", "snow"];

/** Keeps the window's weather in step with the real weather outside the owner's window
 * (`/api/weather`). Any failure just leaves the last known weather in place. */
export function useRealWeather() {
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch("/api/weather");
        if (!response.ok) return;
        const data = (await response.json()) as { weather?: WeatherCondition };
        if (!cancelled && data.weather && VALID.includes(data.weather)) sceneActions.setWeather(data.weather);
      } catch {
        /* keep the current weather */
      }
    };
    void load();
    const id = window.setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);
}
