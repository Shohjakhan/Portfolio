import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface WindowProps {
  title: string;
  icon: LucideIcon;
  onBack: () => void;
  children: ReactNode;
}

/**
 * Reusable "OS window" chrome — every laptop section renders through this
 * rather than each building its own header. Decorative traffic-light dots
 * (aria-hidden, not interactive — a real close/minimize would be confusing
 * since this window's only real affordance is going back to the desktop).
 * `icon` is the section's own icon (from `data/laptopSections.ts`) — the
 * desktop tiles themselves are uniform folder glyphs (see
 * `LaptopInterface`), so this is the one place that semantic icon shows up.
 */
export function Window({ title, icon: Icon, onBack, children }: WindowProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-black/20">
      <div className="flex items-center gap-3 border-b border-white/10 bg-black/15 px-4 py-2.5">
        <span aria-hidden className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e0645a]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e8b355]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#6fae6a]/70" />
        </span>
        <p className="flex flex-1 items-center justify-center gap-1.5 truncate text-center text-xs tracking-[0.08em] text-[var(--color-cream)]/60 uppercase">
          <Icon size={13} strokeWidth={1.75} aria-hidden />
          {title}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs text-[var(--color-cream)]/60 transition-colors duration-[var(--duration-fast)] hover:bg-white/10 hover:text-[var(--color-cream)]"
        >
          <ArrowLeft size={13} strokeWidth={1.75} aria-hidden />
          Desktop
        </button>
      </div>
      <div className="max-h-[64vh] overflow-y-auto p-5 sm:p-6">{children}</div>
    </div>
  );
}
