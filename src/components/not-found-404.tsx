"use client";

import { useId, useMemo, useState } from "react";
import { motion, type Variants } from "motion/react";
import { linkGroups } from "@/lib/site";
import { ArrowRight } from "./icons";

const ease = [0.16, 1, 0.3, 1] as const;
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease, delay: 0.05 + i * 0.08 } }),
};

const PAGES = linkGroups.flatMap((g) => g.links.filter((l) => !l.external).map((l) => ({ ...l, section: g.title })));
const QUICK = [
  { label: "Install guide", href: "/#install" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Re-download", href: "/portal" },
  { label: "FAQ", href: "/#faq" },
];

/**
 * 404: an outlined "404" draws itself in behind the message and is sliced by
 * the divider; below, a page search and quick links. (After FocalDive's Not Found 404.)
 */
export function NotFound404() {
  return (
    <section data-nav="light" className="relative isolate overflow-hidden bg-paper pt-40 md:pt-48">
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        {/* message */}
        <div className="relative z-10 mx-auto flex max-w-[640px] flex-col items-center text-center">
          <motion.span
            custom={0}
            variants={item}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase"
          >
            <span className="size-1.5 rounded-full bg-[#ff7a45]" />
            Error 404
          </motion.span>
          <motion.h1 custom={1} variants={item} initial="hidden" animate="show" className="display mt-6 text-[clamp(2.6rem,6.4vw,4.75rem)]">
            A blank page. <span className="serif-accent text-ink-3">Just not the useful kind.</span>
          </motion.h1>
          <motion.p
            custom={2}
            variants={item}
            initial="hidden"
            animate="show"
            className="mt-5 max-w-[42ch] text-[16.5px] leading-relaxed text-pretty text-ink-2"
          >
            The link may be old, or the page moved while we were tidying up. Search below, or head back to somewhere
            familiar.
          </motion.p>
          <motion.a
            custom={3}
            variants={item}
            initial="hidden"
            animate="show"
            href="/"
            className="group mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14.5px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            <ArrowRight className="size-4 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </motion.a>
        </div>

        {/* giant outlined 404, sliced by the divider below */}
        <div aria-hidden className="relative -mt-6 md:-mt-14">
          <svg viewBox="0 0 1000 250" className="nf-digits block w-full text-ink">
            <defs>
              <linearGradient id="nf-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <text
              x="500"
              y="335"
              textAnchor="middle"
              className="font-sans"
              fontSize="400"
              fontWeight="300"
              letterSpacing="-24"
              fill="url(#nf-fill)"
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeWidth="1.5"
            >
              404
            </text>
          </svg>
        </div>
      </div>

      {/* exits */}
      <div className="relative z-10 border-t border-line">
        <div className="mx-auto grid max-w-[1120px] gap-12 px-5 py-14 sm:px-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-20 md:py-16">
          <SiteSearch />
          <div>
            <h2 className="text-[12.5px] font-medium text-ink-3">Popular</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {QUICK.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-[15px] text-ink-2 transition-colors hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteSearch() {
  const id = useId();
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return PAGES.filter((p) => p.label.toLowerCase().includes(t) || p.section.toLowerCase().includes(t)).slice(0, 4);
  }, [q]);

  return (
    <div>
      <label htmlFor={id} className="text-[12.5px] font-medium text-ink-3">
        Find a page
      </label>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (results[0]) window.location.href = results[0].href;
        }}
        className="mt-3 flex items-center gap-3 border-b border-line pb-2 focus-within:border-ink"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" aria-hidden className="size-4 flex-none text-ink-3">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-4.2-4.2" />
        </svg>
        <input
          id={id}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pricing, install, refunds…"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-1.5 text-[16px] text-ink outline-none placeholder:text-ink-3"
        />
        <button
          type="submit"
          aria-label="Go to first result"
          className="grid size-8 flex-none cursor-pointer place-items-center rounded-full bg-ink text-white transition-opacity hover:opacity-90 disabled:opacity-30"
          disabled={!results.length}
        >
          <ArrowRight className="size-3.5" />
        </button>
      </form>

      <p aria-live="polite" className="sr-only">
        {q ? `${results.length} result${results.length === 1 ? "" : "s"}` : ""}
      </p>
      {q.trim() &&
        (results.length ? (
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
            {results.map((r) => (
              <li key={r.href}>
                <a href={r.href} className="flex items-center justify-between px-4 py-3 text-[14.5px] text-ink transition-colors hover:bg-paper">
                  {r.label}
                  <span className="text-[12.5px] text-ink-3">{r.section}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[14px] text-ink-3">
            Nothing matches. Try &ldquo;install&rdquo; or &ldquo;refund&rdquo;.
          </p>
        ))}
    </div>
  );
}
