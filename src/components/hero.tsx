"use client";

import { motion, type Variants } from "motion/react";
import { AppMockup } from "./app-mockup";
import { Apple, ArrowRight, Windows } from "./icons";
import { GlowButton } from "./glow-button";
import { site } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;
const item: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease, delay: 0.15 + i * 0.08 },
  }),
};

export function Hero() {
  return (
    <section id="top" data-nav="dark" className="relative isolate overflow-hidden bg-night text-snow">
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto max-w-[1180px] px-4 pt-36 sm:px-8 md:pt-44">
        <motion.a
          href="#features"
          custom={0}
          variants={item}
          initial="hidden"
          animate="show"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pr-3 pl-1 text-[12.5px] text-mist backdrop-blur transition-colors hover:border-white/20 hover:text-snow"
        >
          <span className="rounded-full bg-peach/15 px-2 py-0.5 font-medium text-peach">v{site.version}</span>
          Up to four notes, side by side
          <ArrowRight className="size-3.5 text-peach transition-transform group-hover:translate-x-0.5" />
        </motion.a>

        <motion.h1
          custom={1}
          variants={item}
          initial="hidden"
          animate="show"
          className="display mt-7 max-w-[13ch] text-[clamp(2.6rem,6.4vw,5rem)]"
        >
          Every new tab, <span className="serif-accent text-mist">a blank page.</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={item}
          initial="hidden"
          animate="show"
          className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-pretty text-mist md:text-lg"
        >
          Papr turns your new tab into a quiet, instant notepad. No account, no cloud, nothing between you and the
          page.
        </motion.p>

        <motion.div
          custom={3}
          variants={item}
          initial="hidden"
          animate="show"
          className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
        >
          <GlowButton href={site.checkoutUrl}>Get Papr - ${site.price}</GlowButton>
          <a
            href="#features"
            className="group inline-flex items-center gap-1.5 text-[14.5px] font-medium text-snow/85 hover:text-snow focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-peach"
          >
            See how it works
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        <motion.p
          custom={4}
          variants={item}
          initial="hidden"
          animate="show"
          className="mt-7 flex items-center gap-2.5 font-mono text-[12px] tracking-[0.08em] text-fog uppercase"
        >
          <span>Works on</span>
          <span className="inline-flex items-center gap-1.5 text-mist">
            <Windows className="size-3.5" /> Windows
          </span>
          <span className="size-1 rounded-full bg-fog/60" />
          <span className="inline-flex items-center gap-1.5 text-mist">
            <Apple className="size-[15px] -translate-y-px" /> macOS
          </span>
        </motion.p>
      </div>

      {/* Stage */}
      <div className="relative mx-auto mt-20 max-w-[1180px] px-4 [--beam-x:84%] sm:px-8 md:mt-24 md:[--beam-x:72%]">
        <div className="relative">
          <motion.div
            className="beam"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1], delay: 0.2 }}
          >
            <div className="beam__halo" />
            <div className="beam__glow" />
            <div className="beam__core" />
            <div className="beam__spark" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="absolute -top-8 left-0 flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-fog uppercase"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-peach/60" />
              <span className="relative size-1.5 rounded-full bg-peach" />
            </span>
            Live demo - click and type
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.35 }}
            className="relative h-[420px] overflow-hidden rounded-t-[18px] border border-b-0 border-white/12 shadow-[0_-30px_90px_-30px_rgb(255_201_148/0.25)] sm:h-[500px] md:h-[540px]"
          >
            <AppMockup />
            <div className="mock-spill pointer-events-none absolute inset-0" />
            <div className="mock-rim pointer-events-none absolute inset-x-0 top-0 h-px" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-night" />
          </motion.div>

          <motion.div
            className="beam-pool"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.25 }}
          >
            <div className="beam-pool__spread" />
            <div className="beam-pool__hot" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
