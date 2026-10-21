import { cn } from "@/utils/cn";

/**
 * The hover glow of an interactive object: two soft, warm-tinted copies of its own art, laid
 * behind it and hidden until the object's button is hovered or focused (see `.glow-copy` in
 * animations.css). The blur is rasterised once, so showing it is only an opacity change — a
 * live CSS `filter` on the hovered object re-blurs it every frame, which lags or drops out on
 * big objects. Being the object's own silhouette, the glow hugs its edges.
 *
 * Place it inside the art's own positioned box, before the art, with the same sizing.
 */
export function GlowCopy({ src, className }: { src: string; className?: string }) {
  return (
    <>
      {(["is-wide", "is-tight"] as const).map((size) => (
        // eslint-disable-next-line @next/next/no-img-element -- decorative, matches the room's plain <img> convention
        <img
          key={size}
          src={src}
          alt=""
          aria-hidden
          className={cn("glow-copy pointer-events-none absolute inset-0 h-full w-full object-contain", size, className)}
        />
      ))}
    </>
  );
}
