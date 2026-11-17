"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export const LEGAL_DOCS = [
  { key: "privacy", label: "Privacy Policy", href: "/privacy" },
  { key: "terms", label: "Terms of Sale", href: "/terms" },
  { key: "refunds", label: "Refund Policy", href: "/refunds" },
] as const;

export type LegalKey = (typeof LEGAL_DOCS)[number]["key"];

/** Sticky sidebar: policy switcher, with the current page's sections (scroll-spied). */
export function LegalNav({ active, sections }: { active: LegalKey; sections: { id: string; title: string }[] }) {
  const [current, setCurrent] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Legal documents" className="lg:sticky lg:top-28 lg:self-start">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 border-b border-line pb-5 lg:flex-col lg:border-b-0 lg:pb-0">
        {LEGAL_DOCS.map((d) => {
          const on = d.key === active;
          return (
            <li key={d.key}>
              <Link
                href={d.href}
                aria-current={on ? "page" : undefined}
                className={`text-[15.5px] transition-colors ${on ? "font-medium text-teal" : "text-ink-2 hover:text-ink"}`}
              >
                {d.label}
              </Link>
              {on && (
                <ol className="mt-3 mb-2 hidden space-y-1.5 border-l border-line lg:block">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className={`-ml-px block border-l py-0.5 pl-4 text-[13.5px] transition-colors ${
                          current === s.id ? "border-teal text-ink" : "border-transparent text-ink-3 hover:text-ink-2"
                        }`}
                      >
                        <span className="mr-1.5 font-mono text-[11.5px] tabular-nums">{i + 1}.</span>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
