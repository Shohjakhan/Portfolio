import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-ink text-white border-ink hover:bg-[#2a2a2a] hover:border-[#2a2a2a]",
  secondary: "bg-transparent text-ink border-border hover:border-ink-2 hover:bg-bg-alt",
};

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-md border-[1.5px] px-[22px] py-[11px] text-sm font-medium tracking-[0.005em] transition-[background,color,border-color,transform] duration-150 ease-out active:scale-[0.985]",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
