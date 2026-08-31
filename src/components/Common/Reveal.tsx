"use client";

import { createElement, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type RevealTag = "div" | "article" | "li" | "section";

interface RevealProps {
  children: ReactNode;
  as?: RevealTag;
  className?: string;
  variant?: "fade-up" | "fade-in";
  delay?: number;
}

export function Reveal({
  children,
  as: Tag = "div",
  className,
  variant = "fade-up",
  delay = 0,
}: RevealProps) {
  const { ref, isInView } = useInView<HTMLElement>();

  return createElement(
    Tag,
    {
      ref,
      "data-reveal": variant,
      "data-reveal-visible": isInView ? "" : undefined,
      className,
      style: { transitionDelay: isInView ? `${delay}ms` : "0ms" },
    },
    children,
  );
}
