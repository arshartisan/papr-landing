"use client";

import { useDeal, usePrice } from "./price-context";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Logo } from "./logo";
import { nav, site } from "@/lib/site";
import { GlowButton } from "./glow-button";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Framed layout nav: the page sits inside a dark frame, and the links live in a
 * notch hanging from the top edge. Logo (left) and CTA (right) float inside the page
 * and switch ink/snow depending on the section underneath (`data-nav` on sections).
 */
export function Nav() {
  const { scrollY } = useScroll();
  const price = usePrice();
  const deal = useDeal();
  const home = usePathname() === "/";
  const link = (hash: string) => (home ? hash : `/${hash}`);
  const [active, setActive] = useState<string>("");
  const [tone, setTone] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);

  const update = () => {
    setScrolled(window.scrollY > 8);
    // section under the nav
    const under = document
      .elementsFromPoint(48, 40)
      .find((el) => !el.closest("[data-chrome]"))
      ?.closest<HTMLElement>("[data-nav]");
    setTone((under?.dataset.nav as "dark" | "light") ?? "dark");

    // scroll-spy
    let cur = "";
    for (const n of nav) {
      const el = document.querySelector(n.href);
      if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) cur = n.href;
    }
    setActive(cur);
  };
  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    const id = requestAnimationFrame(update);
    return () => cancelAnimationFrame(id);
  }, []);

  const light = tone === "light";

  return (
    <>
      {/* page frame */}
      <div data-chrome aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 hidden overflow-hidden sm:block">
        <div className="absolute inset-2 rounded-[28px] shadow-[0_0_0_40px_var(--color-frame)]" />
      </div>

      <motion.header
        data-chrome
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 sm:inset-x-2 sm:top-2"
      >
        {/* Below md there's no notch: the bar gets its own surface once scrolled,
            tinted to match the section underneath. Top corners follow the frame. */}
        <div
          className={`flex h-16 items-center justify-between border-b px-4 transition-[background-color,border-color] duration-300 sm:rounded-t-[28px] sm:px-6 md:border-transparent md:bg-transparent md:backdrop-blur-none ${
            !scrolled
              ? "border-transparent bg-transparent"
              : light
                ? "pointer-events-auto border-line bg-paper/85 backdrop-blur-xl"
                : "pointer-events-auto border-white/8 bg-night/85 backdrop-blur-xl"
          }`}
        >
          {/* logo */}
          <a
            href={home ? "#top" : "/"}
            aria-label="Papr home"
            className={`pointer-events-auto inline-flex items-center gap-2 rounded-full transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-peach ${
              light ? "text-ink" : "text-snow"
            }`}
          >
            <Logo className="size-7" />
            <span className="text-[16px] font-semibold tracking-[-0.03em]">papr</span>
          </a>

          {/* CTA */}
          <GlowButton href={site.checkoutUrl} size="sm">
            Get Papr - {deal ? deal.label : price.label}
          </GlowButton>
        </div>

        {/* notch */}
        <nav
          aria-label="Primary"
          className="notch pointer-events-auto absolute top-0 left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-b-[18px] bg-frame px-2 pt-1.5 pb-2 md:flex"
        >
          {nav.map((n) => {
            const on = active === n.href;
            return (
              <a
                key={n.href}
                href={link(n.href)}
                aria-current={on ? "location" : undefined}
                className={`relative inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-peach ${
                  on ? "text-snow" : "text-fog hover:text-mist"
                }`}
              >
                {on && (
                  <motion.span layoutId="notch-mark" transition={{ type: "spring", stiffness: 500, damping: 38 }} className="flex">
                    <Logo tile={false} className="size-3.5" />
                  </motion.span>
                )}
                {n.label}
              </a>
            );
          })}
        </nav>
      </motion.header>
    </>
  );
}
