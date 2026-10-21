"use client";

import { useState } from "react";

/**
 * The brass rod a row of charms hangs from. Uses the painted rail
 * (`public/assets/panels/fandom/rail.png`, prompt F1) as soon as that file exists;
 * until then — or if it ever fails to load — falls back to the plain CSS rod
 * (`.charm-rail`), so a row is never left hanging from nothing. One of these sits
 * above EVERY row of charms, not only the first.
 */
export function CharmRail() {
  const [missing, setMissing] = useState(false);

  if (missing) return <div className="charm-rail mx-6" aria-hidden />;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- decorative, matches the room's plain <img> convention
    <img
      src="/assets/panels/fandom/rail.png"
      alt=""
      aria-hidden
      onError={() => setMissing(true)}
      className="mx-auto block h-auto w-full drop-shadow-[0_4px_5px_rgba(0,0,0,0.45)]"
    />
  );
}
