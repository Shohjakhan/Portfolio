"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { useScrolled } from "@/hooks/useScrolled";
import { navLinks } from "@/data/navigation";
import { siteInfo } from "@/data/site";
import { NavLinks } from "@/components/Navbar/NavLinks";
import { MobileMenu } from "@/components/Navbar/MobileMenu";
import { ThemeToggle } from "@/components/Navbar/ThemeToggle";
import { Hamburger } from "@/components/Navbar/Hamburger";

export function Navbar() {
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] h-nav border-b border-transparent transition-[background,backdrop-filter,border-color] duration-[260ms] ease-out-expo",
        scrolled && "border-border bg-[rgba(247,245,242,0.88)] backdrop-blur-lg backdrop-saturate-[1.4]",
      )}
    >
      <div className="mx-auto grid h-full max-w-[1280px] grid-cols-2 items-center px-6 sm:px-10 md:grid-cols-[1fr_auto_1fr] md:px-20">
        <a href="#" aria-label="Home" className="font-serif text-xl tracking-[-0.01em] text-ink justify-self-start">
          {siteInfo.name}
        </a>

        <NavLinks links={navLinks} />

        <div className="hidden items-center gap-4 justify-self-end md:flex">
          <ThemeToggle />
        </div>

        <div className="justify-self-end md:hidden">
          <Hamburger open={mobileOpen} onClick={() => setMobileOpen((prev) => !prev)} />
        </div>
      </div>

      <MobileMenu links={navLinks} open={mobileOpen} onNavigate={() => setMobileOpen(false)} />
    </header>
  );
}
