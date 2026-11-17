import type { ReactNode } from "react";
import { ArrowUpRight } from "./icons";

const sizes = {
  sm: "h-9 px-4 text-[13px] gap-1.5",
  md: "h-11 px-5 text-[14.5px] gap-2",
  lg: "h-12 px-6 text-[15px] gap-2",
};

/**
 * Deep-teal pill lit from below: dark body gradient, light pooled on the bottom
 * rim, a top sheen and a bloom that widens on hover; presses in on click.
 * (Modelled on the Emerald Glow Button; styles live in globals.css `.glow-btn`.)
 */
export function GlowButton({
  href,
  children,
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`glow-btn group pointer-events-auto inline-flex items-center justify-center rounded-full font-semibold text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach ${sizes[size]} ${className}`}
    >
      <span className="relative">{children}</span>
      <ArrowUpRight
        className={`relative transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
          size === "sm" ? "size-3.5" : "size-4"
        }`}
      />
    </a>
  );
}
