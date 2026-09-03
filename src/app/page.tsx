import { Room } from "@/components/Room";

/**
 * No fixed height/overflow here on purpose — `Room` owns that decision
 * itself, per viewport tier (`h-screen overflow-hidden` for the
 * desktop/tablet canvas, `min-h-screen` and scrollable for `MobileRoom`).
 * A fixed `h-screen overflow-hidden` on this wrapper would clip
 * `MobileRoom`'s intentionally-taller-than-one-screen content — it was
 * harmless before `MobileRoom` existed (the canvas always was exactly one
 * screen tall) but would silently cut off everything past the first
 * viewport on mobile now.
 */
export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[var(--room-wall-dark)]">
      <Room />
    </main>
  );
}
