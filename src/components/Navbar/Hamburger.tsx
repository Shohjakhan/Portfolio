"use client";

import { cn } from "@/utils/cn";

interface HamburgerProps {
  open: boolean;
  onClick: () => void;
}

export function Hamburger({ open, onClick }: HamburgerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="flex flex-col gap-[5px] p-2 md:hidden"
    >
      <span
        className={cn(
          "block h-[1.5px] w-[22px] origin-center bg-ink transition-transform duration-[260ms] ease-out-expo",
          open && "translate-y-[6.5px] rotate-45",
        )}
      />
      <span
        className={cn(
          "block h-[1.5px] w-[22px] origin-center bg-ink transition-transform duration-[260ms] ease-out-expo",
          open && "-translate-y-[6.5px] -rotate-45",
        )}
      />
    </button>
  );
}
