import type { GalleryImage } from "@/types/content";

/**
 * A horizontal strip of photos for a project/experience item — shared by
 * `ProjectCard` and `ExperienceCard` rather than duplicated in both. Renders
 * nothing when `images` is empty/undefined (no placeholder tiles); ready
 * for real photos to be dropped into `data/projects.ts`/`experience.ts`
 * whenever they exist.
 */
export function Gallery({ images }: { images?: GalleryImage[] }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
      {images.map((image, index) => (
        // eslint-disable-next-line @next/next/no-img-element -- decorative, data-driven; matches the rest of the room's plain <img> convention
        <img
          key={image.src + index}
          src={image.src}
          alt={image.alt}
          className="h-24 w-36 shrink-0 rounded-[var(--radius-sm)] border border-white/10 object-cover"
        />
      ))}
    </div>
  );
}
