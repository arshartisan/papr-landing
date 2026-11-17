"use client";

import { motion } from "motion/react";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "header";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </M>
  );
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  dark,
  center,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <Reveal as="header" className={center ? "mx-auto text-center" : ""}>
      <p
        className={`inline-flex items-center gap-2 font-mono text-[11.5px] tracking-[0.14em] uppercase ${
          dark ? "text-mist" : "text-ink-3"
        }`}
      >
        <span className={`size-1.5 rounded-full ${dark ? "bg-peach shadow-[0_0_10px_#ffdebd]" : "bg-teal"}`} />
        {eyebrow}
      </p>
      <h2
        className={`display mt-4 text-[clamp(2.2rem,4.6vw,3.6rem)] ${center ? "mx-auto" : ""} max-w-[18ch] ${
          dark ? "text-snow" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-5 max-w-[52ch] text-[17px] leading-relaxed text-pretty ${center ? "mx-auto" : ""} ${
            dark ? "text-mist" : "text-ink-2"
          }`}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}
