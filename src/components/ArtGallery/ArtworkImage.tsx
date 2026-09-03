"use client";

import NextImage from "next/image";
import { useEffect, useState } from "react";
import type { GalleryImage } from "@/types/content";
import { cn } from "@/utils/cn";

interface ArtworkImageProps {
  image: GalleryImage;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** "contain" (default) shows the whole image, letterboxed if its aspect
   * doesn't match the frame — right for the lightbox, where seeing the
   * complete uncropped piece is the point. "cover" fills the frame
   * completely, cropping as needed — right for `GalleryWall`'s mosaic,
   * where frame tiers intentionally span many different aspect ratios
   * (a real gallery's mats aren't reshaped to fit whatever aspect a
   * piece happens to be; the piece fills its frame). */
  fit?: "contain" | "cover";
}

/**
 * The gallery's "large images optimized appropriately" — routes to
 * `next/image` (responsive `sizes`, lazy by default, `priority` only for
 * the piece actually in view) for real raster photography/scans, since
 * that's where Next's optimization pipeline actually matters. Falls back
 * to a plain `<img>` for `.svg` sources — vector art has no "large image"
 * problem to solve, and Next's Image Optimization API rejects local SVGs
 * outright unless `images.dangerouslyAllowSVG` is set repo-wide (not
 * worth flipping a security-sensitive flag just for today's placeholder
 * art). Real photographed/scanned pieces will be raster (jpg/png/webp)
 * and get the full treatment automatically the moment they're added to
 * `data/gallery.ts` — no component changes needed.
 */
export function ArtworkImage({
  image,
  priority = false,
  sizes = "(max-width: 640px) 88vw, 480px",
  className,
  fit = "contain",
}: ArtworkImageProps) {
  const [loaded, setLoaded] = useState(false);
  const isSvg = image.src.toLowerCase().endsWith(".svg");
  const fitClass = fit === "cover" ? "object-cover" : "object-contain";

  // A new src (piece changed) should show the loading state again, not
  // keep showing the previous piece's "loaded" fade-in as already done.
  useEffect(() => {
    setLoaded(false);
  }, [image.src]);

  if (isSvg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- deliberate: next/image rejects local SVGs by default, see the doc comment above
      <img
        src={image.src}
        alt={image.alt}
        onLoad={() => setLoaded(true)}
        className={cn("h-full w-full transition-opacity duration-500", fitClass, loaded ? "opacity-100" : "opacity-0", className)}
      />
    );
  }

  return (
    <NextImage
      src={image.src}
      alt={image.alt}
      fill
      priority={priority}
      loading={priority ? undefined : "lazy"}
      sizes={sizes}
      onLoad={() => setLoaded(true)}
      className={cn("transition-opacity duration-500", fitClass, loaded ? "opacity-100" : "opacity-0", className)}
    />
  );
}
