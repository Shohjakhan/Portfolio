"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  /** "fade" (default) — the shared quick fade+rise every panel uses.
   * "memory" — a slower, warmer unfold with an amber-tinted backdrop, for
   * an experience that should feel like opening something personal rather
   * than a plain UI panel (see AboutExperience).
   * "screen" — the same unfold, but a dark `texture-screen` dialog instead
   * of paper, for an experience that's a machine, not a page (see
   * LaptopInterface). */
  variant?: "fade" | "memory" | "screen";
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** Must match the .animate-scene-out/.animate-memory-close durations in
 * animations.css — this is how long the dialog stays mounted after `open`
 * goes false, playing its exit animation, before actually unmounting.
 * "screen" reuses "memory"'s unfold timing — both are the "not a plain
 * fade" treatment, just with a different dialog surface. */
const EXIT_DURATION_MS: Record<NonNullable<ModalProps["variant"]>, number> = {
  fade: 400,
  memory: 480,
  screen: 480,
};

/**
 * The room's one overlay primitive — every panel (About, Projects, Contact,
 * ...) renders through this rather than reimplementing focus trapping.
 * Portals to document.body, traps Tab, closes on Escape/backdrop click, and
 * restores focus to whatever opened it. Animates both in *and* out — stays
 * mounted for `EXIT_DURATION_MS` after `open` goes false so the close has
 * somewhere to play, then actually unmounts.
 */
export function Modal({ open, onClose, title, subtitle, children, className, variant = "fade" }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const [rendered, setRendered] = useState(open);
  const [closing, setClosing] = useState(false);

  // Mount immediately on open; on close, keep rendering (playing the exit
  // animation) for EXIT_DURATION_MS before actually unmounting. Harmless to
  // run this while already unmounted (`rendered` false, `closing` unused
  // since the component returns null before reading it) — no extra guard needed.
  useEffect(() => {
    if (open) {
      setRendered(true);
      setClosing(false);
      return;
    }
    setClosing(true);
    const id = window.setTimeout(() => setRendered(false), EXIT_DURATION_MS[variant]);
    return () => window.clearTimeout(id);
  }, [open, variant]);

  useEffect(() => {
    // `rendered` (not just `open`) is a real dependency here, not just a
    // guard: opening starts with `rendered` still false for one render pass
    // (see the effect above), so the dialog DOM node doesn't exist yet the
    // instant `open` flips true — grabbing/focusing it has to wait for the
    // render where `rendered` actually becomes true too.
    if (!open || !rendered) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus();
    };
  }, [open, rendered, onClose]);

  if (!rendered) return null;

  const isUnfold = variant !== "fade";
  const isScreen = variant === "screen";

  return createPortal(
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8", closing && "pointer-events-none")}>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "absolute inset-0 backdrop-blur-sm",
          isScreen
            ? "bg-[radial-gradient(75%_60%_at_50%_50%,rgba(255,184,112,0.1),rgba(8,7,5,0.82))]"
            : isUnfold
              ? "bg-[radial-gradient(80%_60%_at_50%_38%,rgba(255,184,112,0.18),rgba(15,10,6,0.74))]"
              : "bg-black/60",
          closing ? "animate-scene-out" : "animate-scene-in",
        )}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          isScreen ? "texture-screen" : "texture-paper",
          "relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-warm-lg)] outline-none sm:p-10",
          isUnfold
            ? closing
              ? "animate-memory-close"
              : "animate-memory-open"
            : closing
              ? "animate-scene-out"
              : "animate-scene-in",
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={cn(
            "absolute right-4 top-4 rounded-full p-1.5 transition-colors duration-[var(--duration-fast)]",
            isScreen
              ? "text-[var(--color-cream)]/70 hover:bg-white/10 hover:text-[var(--color-cream)]"
              : "text-[var(--color-paper-ink)]/70 hover:bg-black/5 hover:text-[var(--color-paper-ink)]",
          )}
        >
          <X size={20} strokeWidth={1.75} />
        </button>
        <header>
          <h2 id={titleId} className="font-serif text-2xl">
            {title}
          </h2>
          {subtitle ? (
            <p className={cn("mt-1 text-sm", isScreen ? "text-[var(--color-cream)]/55" : "text-[var(--color-paper-ink)]/60")}>
              {subtitle}
            </p>
          ) : null}
        </header>
        <div className="mt-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
