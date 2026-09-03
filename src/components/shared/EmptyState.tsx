import { Feather } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  message: string;
  icon?: LucideIcon;
}

/**
 * An honest "nothing here yet" — used by any panel/section with no real
 * content yet (the library's writings/Warkinless/books-read, the
 * gallery's artworks). Never a fabricated placeholder entry; see each
 * data file's own "do not invent" doc comment (`data/writings.ts`,
 * `data/warkinless.ts`, `data/booksRead.ts`, `data/gallery.ts`).
 */
export function EmptyState({ message, icon: Icon = Feather }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius-md)] border border-dashed border-[var(--color-paper-ink)]/25 px-6 py-10 text-center">
      <Icon size={20} strokeWidth={1.5} className="text-[var(--color-paper-ink)]/30" aria-hidden />
      <p className="font-serif text-sm italic text-[var(--color-paper-ink)]/70">{message}</p>
    </div>
  );
}
