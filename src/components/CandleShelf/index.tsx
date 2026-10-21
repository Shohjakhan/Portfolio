/**
 * A wall shelf with a lit candle on it — environmental. The flame is painted flame that gently
 * flickers (see `.flame-a`), with a soft warm glow behind it. Positions are % of the
 * shelf's own box: the shelf art is 870×152, and the candle (470×384) stands on its top.
 */
export function CandleShelf() {
  return (
    <div aria-hidden className="pointer-events-none relative h-full w-full">
      {/* eslint-disable-next-line @next/next/no-img-element -- painted art, matches the room's plain <img> convention */}
      <img src="/assets/scene/living/shelf.png" alt="" className="absolute inset-0 h-full w-full drop-shadow-[0_6px_6px_rgba(0,0,0,0.5)]" />
      <div className="absolute" style={{ left: "10%", bottom: "62%", width: "25%" }}>
        {/* warm light the flame throws */}
        <span
          className="candle-glow absolute rounded-full"
          style={{
            left: "-120%",
            top: "-260%",
            width: "340%",
            height: "340%",
            background: "radial-gradient(closest-side, rgba(255, 190, 100, 0.5), rgba(255, 150, 60, 0.18) 55%, transparent 80%)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- painted art */}
        <img src="/assets/scene/living/candle.png" alt="" className="relative block w-full" />
        {/* the flame stands on the wick tip; the wrapper positions it, the image flickers */}
        <div className="absolute" style={{ left: "48.9%", top: 0, width: "62%", transform: "translate(-48.5%, -75%)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- painted art */}
          <img src="/assets/scene/living/flame-a.png" alt="" className="flame-a block w-full" />
        </div>
      </div>
    </div>
  );
}
