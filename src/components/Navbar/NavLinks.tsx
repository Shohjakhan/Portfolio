"use client";

import { useMemo } from "react";
import { cn } from "@/utils/cn";
import { useActiveSection } from "@/hooks/useActiveSection";
import type { NavLink } from "@/types/content";

interface NavLinksProps {
  links: NavLink[];
}

export function NavLinks({ links }: NavLinksProps) {
  const sectionIds = useMemo(() => links.map((link) => link.href.replace("#", "")), [links]);
  const activeId = useActiveSection(sectionIds);

  return (
    <nav className="hidden items-center gap-12 md:flex" aria-label="Primary navigation">
      {links.map((link) => {
        const isActive = activeId === link.href.replace("#", "");
        return (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              "group relative pb-0.5 text-[0.8125rem] tracking-[0.01em] transition-colors duration-150",
              isActive ? "text-ink" : "text-ink-2 hover:text-ink",
            )}
          >
            {link.label}
            <span className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-ink transition-transform duration-[260ms] ease-out-expo group-hover:scale-x-100" />
          </a>
        );
      })}
    </nav>
  );
}
