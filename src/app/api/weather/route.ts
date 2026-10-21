import { NextResponse } from "next/server";
import type { WeatherCondition } from "@/types/scene";

/** The weather outside the owner's window (Tashkent), from Open-Meteo — free, no key. Fetched
 * here, on the server, and cached for 15 minutes, so visitors' browsers never call a third party
 * and the service is hit a handful of times an hour at most. */
const URL =
  "https://api.open-meteo.com/v1/forecast?latitude=41.2995&longitude=69.2401&current=weather_code";

/** WMO weather codes -> the room's four conditions. */
function toCondition(code: number): WeatherCondition {
  if (code === 0 || code === 1) return "clear";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) return "rain";
  return "cloudy";
}

export async function GET() {
  try {
    const response = await fetch(URL, { next: { revalidate: 900 } });
    if (!response.ok) throw new Error(`open-meteo ${response.status}`);
    const data = (await response.json()) as { current?: { weather_code?: number } };
    const code = data.current?.weather_code;
    return NextResponse.json({ weather: typeof code === "number" ? toCondition(code) : "clear" });
  } catch {
    return NextResponse.json({ weather: "clear" });
  }
}
