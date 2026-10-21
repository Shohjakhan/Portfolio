import type { CSSProperties } from "react";
import { GlowCopy } from "@/components/shared/GlowCopy";
import type { IdleAnimation } from "@/primitives/InteractiveObject";
import { cn } from "@/utils/cn";

export interface ArtLayer {
  src: string;
  /** Percentages within the composite's aspect-locked box. Omit for a full-bleed base layer. */
  box?: { left: string; top: string; width: string; height: string };
  idle?: Exclude<IdleAnimation, "none">;
  /** Extra inline style — mainly for staggering `animationDelay` across layers. */
  style?: CSSProperties;
  /** Opt a layer into a CSS hover rule scoped to the parent object's `data-object` button (e.g. `.bookshelf-books-layer`). */
  className?: string;
}

export interface LayeredArtProps {
  /** CSS `aspect-ratio` value, e.g. "150 / 320" — matches the base layer's intrinsic SVG size. */
  aspect: string;
  layers: ArtLayer[];
  className?: string;
  /** Art whose silhouette gives the object its hover glow (see `GlowCopy`); usually the base layer. */
  glowSrc?: string;
}

/**
 * Composes a few independent image layers (e.g. a shelf frame + the books
 * sitting on it) into one object, sized by locking to the base art's own
 * aspect ratio rather than stretching to fill whatever box the room slot
 * gives it — see docs/asset-architecture.md §3 for why these stay SVG.
 * Each layer is a plain <img>, decorative (aria-hidden) since the
 * surrounding InteractiveObject button already carries the accessible name.
 */
export function LayeredArt({ aspect, layers, className, glowSrc }: LayeredArtProps) {
  return (
    <div className={cn("relative mx-auto h-full", className)} style={{ aspectRatio: aspect }}>
      {glowSrc ? <GlowCopy src={glowSrc} /> : null}
      {layers.map((layer, index) => (
        <img
          key={index}
          src={layer.src}
          alt=""
          aria-hidden
          data-idle={layer.idle}
          className={cn("absolute", layer.box ? undefined : "inset-0 h-full w-full", layer.className)}
          style={{
            ...(layer.box ? { left: layer.box.left, top: layer.box.top, width: layer.box.width, height: layer.box.height } : undefined),
            ...layer.style,
          }}
        />
      ))}
    </div>
  );
}
