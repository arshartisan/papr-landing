"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from "motion/react";
import { Cols, Lock, Moon, Plus, Sun } from "./icons";
import { Logo } from "./logo";
import { SectionHead } from "./reveal";
import { DotMetrics } from "./dot-metrics";

const ease = [0.16, 1, 0.3, 1] as const;

/** Cycles 0..n-1 every `ms` while the element is on screen. */
function useCycle(n: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [manual, setManual] = useState(false);
  useEffect(() => {
    if (!inView || reduce || manual) return;
    const id = setInterval(() => setI((v) => (v + 1) % n), ms);
    return () => clearInterval(id);
  }, [inView, reduce, manual, n, ms]);
  const pick = (v: number) => {
    setManual(true);
    setI(v);
  };
  return [ref, i, pick] as const;
}

/** Types `text` in a loop while visible. */
function useTyping(text: string, hold = 1800) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    let t: ReturnType<typeof setTimeout>;
    let i = 0;
    const tick = () => {
      i = i >= text.length ? 0 : i + 1;
      setN(i);
      t = setTimeout(tick, i === text.length ? hold : i === 0 ? 500 : 55 + Math.random() * 60);
    };
    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, [inView, reduce, text, hold]);
  return [ref, reduce ? text : text.slice(0, n)] as const;
}

export function Bento() {
  return (
    <section id="features" data-nav="light" className="relative bg-paper pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Features"
          title={
            <>
              Nothing extra. <span className="serif-accent text-ink-3">Nothing missing.</span>
            </>
          }
          sub="Papr does a few things, and does them well. Formatting when you need it, quiet when you don't."
        />

        <DotMetrics />

        <div className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
          <Tile i={0} className="md:col-span-2 lg:col-span-4" title="Already open." body="Press Ctrl+T and you're writing. The editor is Rust compiled to WebAssembly, and it opens with the tab.">
            <InstantArt />
          </Tile>
          <Tile i={1} className="lg:col-span-2" title="Markdown, as you type." body="Type # for a heading, - for bullets, [] for a checklist. Or use the toolbar rail. It hides while you type.">
            <MarkdownArt />
          </Tile>
          <Tile i={2} tone="teal" className="lg:col-span-2" title="Private by default." body="No account, no sync server, no analytics. Notes autosave locally and never leave your browser.">
            <PrivateArt />
          </Tile>
          <Tile i={3} className="md:col-span-2 lg:col-span-4" title="Up to four notes, side by side." body="Open one to four columns, each with its own note. Keep a plan beside the draft and a reference beside both.">
            <ColumnsArt />
          </Tile>
          <Tile i={4} tone="peach" className="lg:col-span-2" title="Four fonts, built in." body="Inter, Geist, Instrument Serif and Source Code Pro ship inside the extension. Adjust the size to suit.">
            <FontsArt />
          </Tile>
          <Tile i={5} className="lg:col-span-2" title="Light or dark." body="Follows your system until you pick one. Ctrl+Shift+L to switch.">
            <ThemeArt />
          </Tile>
          <Tile i={6} className="md:col-span-2 lg:col-span-2" title="Every tab in sync." body="Edit in one tab and the others update. Your caret and scroll position come back when you return.">
            <SyncArt />
          </Tile>
        </div>
      </div>
    </section>
  );
}

const tones = {
  paper: "bg-white border-line text-ink",
  teal: "bg-teal border-teal text-snow",
  peach: "bg-peach border-[#f5cfa8] text-ink",
};

function Tile({
  i,
  title,
  body,
  tone = "paper",
  className = "",
  children,
}: {
  i: number;
  title: string;
  body: string;
  tone?: keyof typeof tones;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, ease, delay: (i % 3) * 0.07 }}
      className={`group flex min-h-[340px] flex-col overflow-hidden rounded-[20px] border p-6 md:p-7 ${tones[tone]} ${className}`}
    >
      <div className="relative min-h-[170px] flex-1 transition-transform duration-500 ease-out group-hover:-translate-y-1">
        {children}
      </div>
      <h3 className="mt-6 text-[19px] font-medium tracking-[-0.025em]">{title}</h3>
      <p className={`mt-1.5 min-h-[4.9em] max-w-[46ch] text-[14.5px] leading-relaxed text-pretty ${tone === "teal" ? "text-snow/70" : "opacity-70"}`}>
        {body}
      </p>
    </motion.article>
  );
}

/* ---------------- Tile art ---------------- */

function InstantArt() {
  const [ref, i] = useCycle(2, 2600);
  const fresh = i === 1;
  return (
    <div ref={ref} className="flex h-full items-center justify-center">
      <div className="w-full max-w-[560px] overflow-hidden rounded-xl border border-line bg-paper-2 shadow-[0_24px_50px_-30px_rgb(13_21_19/0.35)]">
        {/* tab strip */}
        <div className="flex h-9 items-end gap-1 px-2 pt-1.5">
          <div className="flex h-7 w-32 items-center gap-1.5 rounded-t-lg px-2.5 text-[11px] text-ink-3">
            <span className="size-3 rounded-full bg-line" /> Inbox (3)
          </div>
          <LayoutGroup>
            <AnimatePresence initial={false}>
              {fresh && (
                <motion.div
                  layout
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 128 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.45, ease }}
                  className="flex h-7 items-center gap-1.5 overflow-hidden rounded-t-lg bg-white px-2.5 text-[11px] whitespace-nowrap text-ink"
                >
                  <Logo className="size-3 flex-none" /> Papr
                </motion.div>
              )}
            </AnimatePresence>
            <motion.span layout className="mb-1.5 ml-1 grid size-5 place-items-center rounded-md text-ink-3">
              <Plus className="size-3.5" />
            </motion.span>
          </LayoutGroup>
          <span className="mb-1 ml-auto flex items-center gap-1 pr-1">
            <kbd className="kbd !h-5 !min-w-0 !px-1.5 !text-[10px]">Ctrl</kbd>
            <kbd className="kbd !h-5 !min-w-0 !px-1.5 !text-[10px]">T</kbd>
          </span>
        </div>
        {/* page */}
        <div className="relative h-[150px] bg-white px-8 pt-6">
          <AnimatePresence mode="wait">
            {fresh ? (
              <motion.div
                key="papr"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease }}
              >
                <div className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
                  Tuesday<span className="caret !bg-teal" />
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-3/5 rounded-full bg-paper-2" />
                  <div className="h-2 w-2/5 rounded-full bg-paper-2" />
                </div>
              </motion.div>
            ) : (
              <motion.div key="blank" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <div className="h-3 w-1/3 rounded-full bg-paper-2" />
                <div className="h-2 w-4/5 rounded-full bg-paper-2" />
                <div className="h-2 w-3/5 rounded-full bg-paper-2" />
                <div className="h-2 w-2/3 rounded-full bg-paper-2" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="absolute right-4 bottom-4 rounded-full bg-paper px-2 py-1 font-mono text-[10px] tracking-wider text-ink-3 uppercase">
            Rust → WASM
          </span>
        </div>
      </div>
    </div>
  );
}

function MarkdownArt() {
  const rows = [
    { k: "#", out: <span className="text-[18px] font-semibold tracking-[-0.03em]">Heading</span> },
    { k: "-", out: <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-ink-3" />Bullet point</span> },
    { k: "1.", out: <span className="flex items-center gap-2"><span className="font-mono text-ink-3 text-[12px]">1.</span>Numbered</span> },
    { k: "[]", out: <span className="flex items-center gap-2"><span className="grid size-3.5 place-items-center rounded-[4px] bg-teal text-[8px] font-bold text-peach">✓</span><span className="text-ink-3 line-through">Checklist</span></span> },
  ];
  return (
    <ul className="flex h-full flex-col justify-center gap-2.5">
      {rows.map((r, i) => (
        <motion.li
          key={r.k}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.1 }}
          className="flex items-center gap-3 text-[14px]"
        >
          <span className="kbd w-12">{r.k}&nbsp;␣</span>
          <span className="h-px w-5 bg-line" />
          {r.out}
        </motion.li>
      ))}
    </ul>
  );
}

function PrivateArt() {
  const rows = [
    ["Account", "none"],
    ["Network", "0 requests"],
    ["Storage", "this device"],
  ];
  return (
    <div className="flex h-full flex-col justify-center">
      <span className="mb-5 grid size-11 place-items-center rounded-xl bg-peach/12 text-peach ring-1 ring-peach/25">
        <Lock className="size-5" />
      </span>
      <dl className="divide-y divide-white/10 border-y border-white/10 font-mono text-[12.5px]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between py-2.5">
            <dt className="text-snow/60">{k}</dt>
            <dd className="text-peach">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ColumnsArt() {
  const [ref, i, pick] = useCycle(4, 1900);
  const cols = i + 1;
  return (
    <div ref={ref} className="flex h-full flex-col items-center justify-center gap-4">
      <div role="group" aria-label="Columns" className="flex gap-0.5 rounded-[10px] border border-line bg-white p-0.5">
        {([1, 2, 3, 4] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => pick(c - 1)}
            aria-pressed={c === cols}
            aria-label={`${c} column${c > 1 ? "s" : ""}`}
            className={`grid h-7 w-8 cursor-pointer place-items-center rounded-lg transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-teal ${
              c === cols ? "bg-teal/10 text-teal" : "text-ink-3 hover:bg-paper hover:text-ink"
            }`}
          >
            <Cols n={c} className="size-4" />
          </button>
        ))}
      </div>
      <div
        className="grid h-[150px] w-full max-w-[560px] overflow-hidden rounded-xl border border-line bg-white"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {Array.from({ length: cols }).map((_, p) => (
            <motion.div
              key={p}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease }}
              className={`min-w-0 ${p > 0 ? "border-l border-line" : ""}`}
            >
              <div
                className={`h-7 border-b border-line px-3 text-[10.5px] leading-7 whitespace-nowrap ${
                  p === 0 ? "text-ink shadow-[inset_0_-2px_0_var(--color-teal)]" : "text-ink-3"
                }`}
              >
                {["Plan", "Draft", "Research", "Inbox"][p]}
              </div>
              <div className="space-y-2 p-3">
                <div className="h-2.5 w-2/3 rounded-full bg-paper-2" />
                <div className="h-1.5 w-full rounded-full bg-paper-2" />
                <div className="h-1.5 w-4/5 rounded-full bg-paper-2" />
                <div className="h-1.5 w-3/5 rounded-full bg-paper-2" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <span className="font-mono text-[11px] text-ink-3">Alt + {cols}</span>
    </div>
  );
}

const fonts = [
  { name: "Inter", cls: "font-inter", kind: "sans" },
  { name: "Geist", cls: "font-sans", kind: "sans" },
  { name: "Instrument Serif", cls: "font-serif", kind: "serif" },
  { name: "Source Code Pro", cls: "font-code", kind: "mono" },
];
function FontsArt() {
  const [ref, i, pick] = useCycle(fonts.length, 1600);
  return (
    <div ref={ref} className="flex h-full items-center justify-between gap-4">
      <div className="relative grid h-28 w-28 flex-none place-items-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: 0.4, ease }}
            className={`text-[72px] leading-none tracking-[-0.04em] ${fonts[i].cls}`}
          >
            Aa
          </motion.span>
        </AnimatePresence>
      </div>
      <ul className="space-y-0.5 text-[13px]">
        {fonts.map((f, j) => (
          <li key={f.name}>
            <button
              type="button"
              onClick={() => pick(j)}
              aria-pressed={j === i}
              className={`flex cursor-pointer items-center gap-2 rounded-md py-0.5 pr-1 transition-opacity duration-300 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-teal ${
                j === i ? "opacity-100" : "opacity-45"
              }`}
            >
              <span className={`size-1.5 rounded-full ${j === i ? "bg-teal" : "bg-transparent"}`} />
              <span className={f.cls}>{f.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThemeArt() {
  const [ref, i] = useCycle(2, 2400);
  const dark = i === 1;
  return (
    <div ref={ref} className="flex h-full items-center justify-center">
      <div
        className={`w-full max-w-[280px] rounded-xl border p-4 transition-colors duration-700 ${
          dark ? "border-[#2a2a2a] bg-[#161616] text-[#e8e8e8]" : "border-line bg-[#fafafa] text-ink"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-[-0.02em]">Morning pages</span>
          <span
            className={`grid size-7 place-items-center rounded-lg transition-colors duration-700 ${
              dark ? "bg-[#262626] text-peach" : "bg-paper-2 text-teal"
            }`}
          >
            {dark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {["w-full", "w-4/5", "w-3/5"].map((w) => (
            <div key={w} className={`h-1.5 rounded-full transition-colors duration-700 ${w} ${dark ? "bg-[#2a2a2a]" : "bg-[#e7e7e7]"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SyncArt() {
  const [ref, text] = useTyping("Call the landlord re: heating");
  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-2.5">
      {["Tab 1", "Tab 2"].map((t, j) => (
        <div key={t} className={`rounded-xl border border-line bg-paper px-4 py-3 ${j === 1 ? "ml-6" : "mr-6"}`}>
          <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-ink-3 uppercase">
            <span className={`size-1.5 rounded-full ${j === 0 ? "bg-teal" : "bg-ink-3/40"}`} />
            {t}
          </div>
          <div className="min-h-[1.5em] truncate text-[14px]">
            {text}
            {j === 0 && <span className="caret !bg-teal" />}
          </div>
        </div>
      ))}
    </div>
  );
}
