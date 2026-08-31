"use client";

import { useState } from "react";
import { Sun } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * A placeholder toggle — flashes on click but doesn't switch themes yet.
 * Kept intentionally inert to match the original design pending a full
 * dark-mode implementation.
 */
export function ThemeToggle() {
  const [pulsing, setPulsing] = useState(false);

  const handleClick = () => {
    setPulsing(true);
    window.setTimeout(() => setPulsing(false), 300);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Toggle theme"
      className={cn(
        "hidden h-9 w-9 items-center justify-center rounded-full border border-border text-ink-2 transition-colors duration-150 hover:border-ink-2 hover:bg-bg-alt hover:text-ink md:flex",
        pulsing && "opacity-40",
      )}
    >
      <Sun size={18} strokeWidth={1.5} />
    </button>
  );
}
