"use client";

import { cn } from "@/utils/cn";
import type { NavLink } from "@/types/content";

interface MobileMenuProps {
  links: NavLink[];
  open: boolean;
  onNavigate: () => void;
}

export function MobileMenu({ links, open, onNavigate }: MobileMenuProps) {
  return (
    <div
      aria-hidden={!open}
      className={cn(
        "flex flex-col overflow-hidden border-t border-border bg-[rgba(247,245,242,0.96)] px-6 backdrop-blur-lg transition-[max-height,padding] duration-[440ms] ease-out-expo md:hidden",
        open ? "max-h-[400px] py-6" : "max-h-0 py-0",
      )}
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className="border-b border-border py-4 text-[1.0625rem] text-ink-2 transition-colors duration-150 last:border-none hover:text-ink"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
