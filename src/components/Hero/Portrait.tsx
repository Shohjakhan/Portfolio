"use client";

import { useRef } from "react";
import { UserRound } from "lucide-react";

const TILT_STRENGTH = 3;

export function Portrait() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const portrait = portraitRef.current;
    const wrap = wrapRef.current;
    if (!portrait || !wrap || !window.matchMedia("(pointer: fine)").matches) return;

    const rect = wrap.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -TILT_STRENGTH;
    const rotateY = ((x - cx) / cx) * TILT_STRENGTH;

    portrait.style.transition = "transform 80ms ease-out";
    portrait.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const portrait = portraitRef.current;
    if (!portrait) return;
    portrait.style.transition = "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)";
    portrait.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto flex w-full max-w-[340px] items-center justify-center md:mx-0 md:max-w-none"
    >
      <div
        aria-hidden
        className="animate-morph-bg pointer-events-none absolute -inset-y-[5%] -inset-x-[8%] bg-[radial-gradient(ellipse_at_55%_45%,rgba(33,75,62,0.07)_0%,transparent_68%)]"
      />
      <div
        ref={portraitRef}
        className="relative aspect-[3/4] w-full max-w-[480px] overflow-hidden rounded-2xl border border-border bg-bg-alt"
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-ink-3">
          <UserRound size={64} strokeWidth={1.5} aria-hidden />
          <p className="text-[0.8125rem] tracking-[0.05em]">Portrait placeholder</p>
        </div>
      </div>
    </div>
  );
}
