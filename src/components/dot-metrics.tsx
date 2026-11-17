"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

/**
 * Dot-matrix metrics (modelled on FocalDive's Dot Matrix Metrics): each figure
 * counts up while a grid of dots lights row by row from the bottom. Instead of a
 * plain percentage fill, each metric draws its own pattern.
 */
const COLS = 11;
const ROWS = 7;

type Metric = {
  tag: string;
  hue: string;
  lead: string;
  detail: string;
  value: number;
  suffix?: string;
  lit: (row: number, col: number) => boolean;
};

const METRICS: Metric[] = [
  {
    tag: "Local",
    hue: "#ffdebd",
    lead: "Stored on your device.",
    detail: "Every note lives in your browser.",
    value: 100,
    suffix: "%",
    lit: () => true,
  },
  {
    tag: "Private",
    hue: "#5eead4",
    lead: "Network requests.",
    detail: "No account, no server, no analytics.",
    value: 0,
    lit: () => false,
  },
  {
    tag: "Focus",
    hue: "#ffb877",
    lead: "Columns side by side.",
    detail: "Open up to four notes at once.",
    value: 4,
    lit: (_r, c) => c % 3 !== 2, // four 2-dot-wide bars
  },
];

export function DotMetrics() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <div
      ref={ref}
      data-inview={inView || undefined}
      className="relative mt-14 overflow-hidden rounded-[24px] bg-night px-6 py-8 text-snow md:px-10 md:py-10"
    >
      <div className="grid-fade pointer-events-none absolute inset-0" />
      <div className="relative">
        <h3 className="max-w-[22ch] text-[clamp(1.5rem,2.6vw,2rem)] leading-tight font-medium tracking-[-0.03em] text-balance">
          Light by design. <span className="text-mist">What Papr leaves out matters as much as what it does.</span>
        </h3>

        <dl className="mt-10 grid gap-7 md:grid-cols-3 md:gap-8">
          {METRICS.map((m, i) => (
            <div
              key={m.tag}
              className={`grid grid-cols-[1fr_minmax(0,9.5rem)] items-end gap-5 md:grid-cols-1 md:items-start ${
                i > 0 ? "border-t border-white/10 pt-7 md:border-t-0 md:pt-0" : ""
              }`}
            >
              <div className="md:order-2">
                <span className="rounded-md px-2 py-0.5 text-[11.5px] font-semibold text-night" style={{ background: m.hue }}>
                  {m.tag}
                </span>
                <dt className="mt-4 text-[15px] font-medium">
                  {m.lead} <span className="font-normal text-snow/50">{m.detail}</span>
                </dt>
                <dd className="mt-3 text-[clamp(2.5rem,4.4vw,3.5rem)] leading-none font-normal tracking-[-0.04em] tabular-nums">
                  <CountUp value={m.value} delay={i * 0.18} run={inView} />
                  {m.suffix}
                  <span className="sr-only">
                    {m.value}
                    {m.suffix}
                  </span>
                </dd>
              </div>
              <Dots metric={m} index={i} />
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function Dots({ metric, index }: { metric: Metric; index: number }) {
  return (
    <div
      aria-hidden
      className="grid w-full gap-[0.32rem] md:order-1 md:max-w-[11rem]"
      style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, "--hue": metric.hue } as CSSProperties}
    >
      {Array.from({ length: COLS * ROWS }).map((_, i) => {
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        const lit = metric.lit(row, col);
        const delay = index * 180 + (ROWS - 1 - row) * 85 + col * 18;
        return (
          <span
            key={i}
            data-lit={lit || undefined}
            className="dmm-dot aspect-square rounded-full"
            style={{ "--d": `${delay}ms` } as CSSProperties}
          />
        );
      })}
    </div>
  );
}

function CountUp({ value, delay, run }: { value: number; delay: number; run: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || !run) return;
    if (reduce || value === 0) {
      el.textContent = String(value);
      return;
    }
    const c = animate(0, value, {
      duration: 1.3,
      ease: [0.22, 1, 0.36, 1],
      delay: delay + 0.15,
      onUpdate: (v) => (el.textContent = String(Math.round(v))),
    });
    return () => c.stop();
  }, [run, value, delay, reduce]);
  return <span ref={ref}>0</span>;
}
