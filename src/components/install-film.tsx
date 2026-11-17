"use client";

import { usePrice } from "./price-context";
import { formatPrice } from "@/lib/format-price";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { Logo } from "./logo";
import { Apple } from "./icons";

/* ------------------------------------------------------------------
   A scripted "screen recording" of installing Papr on macOS.
   Everything is derived from one clock `t` (ms), so it can be paused,
   scrubbed and jumped by chapter. Stage is drawn at 1200×750 and scaled.
   ------------------------------------------------------------------ */

const W = 1200;
const H = 750;
const DUR = 33000;

const CHAPTERS = [
  { title: "Buy and download", from: 0, to: 6000 },
  { title: "Unzip, keep it in Documents", from: 6000, to: 12800 },
  { title: "Open chrome://extensions", from: 12800, to: 16000 },
  { title: "Developer mode → Load unpacked", from: 16000, to: 21800 },
  { title: "Open a new tab", from: 21800, to: DUR },
];

// Cursor path: [time, x, y] in stage coordinates.
const PATH: [number, number, number][] = [
  [0, 660, 560],
  [1100, 235, 362],
  [1700, 235, 362],
  [2400, 600, 452],
  [3000, 600, 452],
  [3800, 600, 404],
  [4600, 600, 404],
  [5600, 660, 480],
  [6800, 480, 262],
  [7500, 480, 262],
  [8300, 600, 262],
  [8600, 600, 262],
  [9800, 310, 311],
  [10300, 310, 311],
  [11600, 560, 430],
  [13300, 545, 112],
  [15400, 545, 112],
  [16000, 1038, 160],
  [16500, 1038, 160],
  [17000, 170, 211],
  [17600, 170, 211],
  [18300, 675, 143],
  [18800, 675, 143],
  [19400, 860, 426],
  [19900, 860, 426],
  [20900, 470, 520],
  [23200, 760, 600],
  [27000, 760, 600],
  [27400, 335, 268],
  [28100, 335, 268],
  [29400, 700, 560],
];
const CLICKS = [1500, 2700, 4200, 7200, 7380, 13600, 16200, 17200, 18600, 19650, 27700];
const URL_TEXT = "chrome://extensions";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const typed = (t: number, a: number, b: number, s: string) => s.slice(0, Math.floor(prog(t, a, b) * s.length));

function cursorAt(t: number) {
  for (let i = 0; i < PATH.length - 1; i++) {
    const [t0, x0, y0] = PATH[i];
    const [t1, x1, y1] = PATH[i + 1];
    if (t <= t1) {
      const k = eio(prog(t, t0, t1));
      return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k };
    }
  }
  const last = PATH[PATH.length - 1];
  return { x: last[1], y: last[2] };
}

/* ------------------------------------------------------------------ */

export function InstallFilm() {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { amount: 0.45 });
  const reduce = useReducedMotion();
  const [scale, setScale] = useState(0.5);
  const [t, setT] = useState(reduce ? 20600 : 0);
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);

  // Fit the 1200×750 stage to the container width.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Autoplay the first time it's on screen; pause when scrolled away.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (inView && !started.current && !reduce) {
        started.current = true;
        setPlaying(true);
      }
      if (!inView) setPlaying(false);
    });
    return () => cancelAnimationFrame(id);
  }, [inView, reduce]);

  // Clock
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setT((v) => {
        const n = v + dt;
        if (n >= DUR) {
          setPlaying(false);
          return DUR;
        }
        return n;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = useCallback(() => {
    if (t >= DUR) setT(0);
    setPlaying((p) => !p || t >= DUR);
  }, [t]);
  const seek = (ms: number) => {
    setT(ms);
    setPlaying(true);
  };

  const chapter = CHAPTERS.findIndex((c) => t >= c.from && t < c.to);
  const cur = chapter === -1 ? CHAPTERS.length - 1 : chapter;

  return (
    <figure className="relative">
      <div
        ref={wrap}
        className="relative overflow-hidden rounded-[20px] border border-line bg-night shadow-[0_40px_90px_-40px_rgb(13_21_19/0.55)]"
        style={{ height: H * scale }}
        onClick={toggle}
      >
        <div
          aria-hidden
          className="absolute top-0 left-0 origin-top-left select-none"
          style={{ width: W, height: H, transform: `scale(${scale})` }}
        >
          <Desktop t={t} />
        </div>

        {/* big play button when paused */}
        {!playing && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            aria-label={t >= DUR ? "Replay" : "Play"}
            className="absolute inset-0 grid cursor-pointer place-items-center bg-night/25 transition-colors hover:bg-night/15"
          >
            <span className="grid size-16 place-items-center rounded-full bg-white/90 text-ink shadow-[0_10px_40px_rgb(0_0_0/0.35)] backdrop-blur">
              {t >= DUR ? <ReplayIcon /> : <PlayIcon />}
            </span>
          </button>
        )}
      </div>

      {/* controls + chapters */}
      <figcaption className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : t >= DUR ? "Replay" : "Play"}
          className="grid size-10 flex-none cursor-pointer place-items-center rounded-full bg-ink text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
        >
          {playing ? <PauseIcon /> : t >= DUR ? <ReplayIcon small /> : <PlayIcon small />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-[14px] font-medium text-ink">
              <span className="mr-2 font-mono text-[12px] text-teal">{String(cur + 1).padStart(2, "0")}</span>
              {CHAPTERS[cur].title}
            </p>
            <span className="flex-none font-mono text-[11.5px] text-ink-3 tabular-nums">
              0:{String(Math.floor(t / 1000)).padStart(2, "0")} / 0:{Math.round(DUR / 1000)}
            </span>
          </div>
          <div className="mt-2 flex gap-1" role="group" aria-label="Chapters">
            {CHAPTERS.map((c, i) => (
              <button
                key={c.title}
                type="button"
                onClick={() => seek(c.from)}
                aria-label={`Chapter ${i + 1}: ${c.title}`}
                className="group h-3 cursor-pointer py-1"
                style={{ flex: c.to - c.from }}
              >
                <span className="block h-1 overflow-hidden rounded-full bg-line transition-[height] group-hover:h-1.5">
                  <span className="block h-full bg-teal" style={{ width: `${prog(t, c.from, c.to) * 100}%` }} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */

function Desktop({ t }: { t: number }) {
  const finderOn = t >= 6000 && t < 12800;
  const finderP = finderOn ? Math.min(prog(t, 6000, 6350), 1 - prog(t, 12450, 12800)) : 0;
  const c = cursorAt(t);
  const click = CLICKS.find((k) => t >= k && t < k + 380);
  const dragging = t >= 8600 && t < 10000;

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(60% 70% at 18% 18%, #0f6a5e 0%, transparent 60%), radial-gradient(45% 55% at 85% 25%, rgb(255 201 148 / 0.55) 0%, transparent 60%), radial-gradient(70% 60% at 60% 110%, #0b4a42 0%, transparent 70%), linear-gradient(160deg, #06302b, #021512)",
      }}
    >
      <MenuBar app={finderOn ? "Finder" : "Chrome"} />
      <Browser t={t} dim={finderP > 0.5} />
      {finderOn && <Finder t={t} p={finderP} dragging={dragging} />}
      <Dock t={t} />

      {/* ⌘T keycaps */}
      {t >= 22000 && t < 22950 && (
        <div
          className="absolute top-1/2 left-1/2 z-40 flex -translate-x-1/2 -translate-y-1/2 gap-3"
          style={{ opacity: Math.min(prog(t, 22000, 22200), 1 - prog(t, 22750, 22950)) }}
        >
          <Key>⌘</Key>
          <Key>T</Key>
        </div>
      )}

      {/* drag ghost */}
      {dragging && (
        <div className="absolute z-50" style={{ left: c.x - 30, top: c.y - 34, opacity: 0.85 }}>
          <FolderIcon size={60} />
        </div>
      )}

      {/* click ripple */}
      {click !== undefined && (
        <span
          className="absolute z-50 rounded-full border-2 border-white/80"
          style={{
            left: c.x - 14,
            top: c.y - 14,
            width: 28,
            height: 28,
            opacity: 1 - prog(t, click, click + 380),
            transform: `scale(${0.4 + prog(t, click, click + 380) * 0.9})`,
          }}
        />
      )}

      {/* cursor */}
      {t < 29600 && (
        <svg
          width="22"
          height="30"
          viewBox="0 0 22 30"
          className="absolute z-[60] drop-shadow-[0_2px_3px_rgb(0_0_0/0.4)]"
          style={{ left: c.x - 2, top: c.y - 2, transform: click !== undefined || dragging ? "scale(0.88)" : undefined }}
        >
          <path d="M2 2v21.5l5.6-5.2 3.6 8.3 3.6-1.6-3.5-8.1H19z" fill="#111" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      )}

      {/* end card */}
      {t >= 29500 && (
        <div
          className="absolute inset-0 z-[55] grid place-items-center bg-[#021512]/70 backdrop-blur-md"
          style={{ opacity: prog(t, 29500, 30300) }}
        >
          <div className="text-center text-[#f3eee7]" style={{ transform: `translateY(${(1 - eio(prog(t, 29600, 30500))) * 14}px)` }}>
            <Logo className="mx-auto size-16" />
            <div className="mt-6 text-[52px] font-medium tracking-[-0.04em]">You&apos;re all set.</div>
            <div className="mt-2 text-[22px] text-[#9db1ac]">Every new tab is now a notepad.</div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuBar({ app }: { app: string }) {
  return (
    <div className="absolute inset-x-0 top-0 z-30 flex h-[26px] items-center gap-5 bg-black/25 px-4 text-[13px] text-white backdrop-blur-xl">
      <Apple className="size-[15px] -translate-y-px" />
      <span className="font-semibold">{app}</span>
      {["File", "Edit", "View", app === "Finder" ? "Go" : "History", "Window", "Help"].map((m) => (
        <span key={m} className="text-white/90">
          {m}
        </span>
      ))}
      <span className="ml-auto flex items-center gap-4 text-white/90">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0M12 19.5h.01" />
        </svg>
        <span className="flex items-center gap-1">
          <span className="relative h-[11px] w-[22px] rounded-[3px] border border-white/80 p-[1.5px]">
            <span className="block h-full w-[75%] rounded-[1px] bg-white" />
          </span>
        </span>
        <span>Tue 9:41 AM</span>
      </span>
    </div>
  );
}

function Dock({ t }: { t: number }) {
  const bounce = (a: number) => (t >= a && t < a + 700 ? -Math.abs(Math.sin(prog(t, a, a + 700) * Math.PI * 2)) * 18 : 0);
  const icons: { key: string; el: ReactNode; running?: boolean; y?: number }[] = [
    { key: "finder", el: <FinderAppIcon />, running: true, y: bounce(5700) },
    { key: "browser", el: <BrowserAppIcon />, running: true },
    { key: "notes", el: <span className="block size-full rounded-[12px] bg-[linear-gradient(180deg,#fde68a,#f59e0b)]" /> },
    { key: "papr", el: <Logo className="size-full" />, running: t >= 22900 },
    { key: "sep", el: null },
    { key: "trash", el: <span className="block size-full rounded-[12px] border border-white/30 bg-white/15" /> },
  ];
  return (
    <div className="absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-end gap-2.5 rounded-[22px] border border-white/20 bg-white/15 px-3 pt-2 pb-2.5 backdrop-blur-2xl">
      {icons.map((i) =>
        i.key === "sep" ? (
          <span key="sep" className="mx-1 h-11 w-px self-center bg-white/25" />
        ) : (
          <span key={i.key} className="relative flex flex-col items-center">
            <span className="block size-[50px]" style={{ transform: `translateY(${i.y ?? 0}px)` }}>
              {i.el}
            </span>
            <span className={`absolute -bottom-2 size-1 rounded-full ${i.running ? "bg-white/80" : "bg-transparent"}`} />
          </span>
        ),
      )}
    </div>
  );
}

/* ------------------------------ Browser ------------------------------ */

function Browser({ t, dim }: { t: number; dim: boolean }) {
  const view =
    t < 1700 ? "site" : t < 3300 ? "checkout" : t < 15300 ? "success" : t < 22900 ? "extensions" : "papr";
  const typing = t >= 13600 && t < 15300;
  const url = typing
    ? typed(t, 13800, 15000, URL_TEXT)
    : view === "site"
      ? "papr-landing.vercel.app"
      : view === "checkout"
        ? "polar.sh/checkout"
        : view === "success"
          ? "papr-landing.vercel.app/success"
          : view === "extensions"
            ? URL_TEXT
            : "";
  const twoTabs = t >= 22900;
  const tab1 =
    view === "checkout" ? "Checkout" : view === "extensions" || view === "papr" ? "Extensions" : "Papr - Every new tab";

  return (
    <div
      className="absolute overflow-hidden rounded-[12px] border border-black/40 bg-[#f6f6f6] shadow-[0_30px_80px_-10px_rgb(0_0_0/0.55)] transition-[filter] duration-300"
      style={{ left: 80, top: 52, width: 1040, height: 610, filter: dim ? "brightness(0.82) saturate(0.9)" : undefined }}
    >
      {/* titlebar + tabs */}
      <div className="flex h-10 items-end gap-1 bg-[#dfe3e6] pr-3 pl-4">
        <TrafficLights className="mb-3.5 mr-4" />
        <Tab title={tab1} active={!twoTabs} icon={view === "extensions" || view === "papr" ? "puzzle" : "papr"} />
        {twoTabs && <Tab title="Papr" active icon="papr" enter={prog(t, 22900, 23150)} />}
        <span className="mb-2.5 ml-1 text-[18px] leading-none text-[#555]">+</span>
      </div>
      {/* toolbar */}
      <div className="relative flex h-10 items-center gap-3 border-b border-[#d6d6d6] bg-white px-3 text-[#555]">
        <span className="flex gap-3 text-[16px]">
          <span>←</span>
          <span className="text-[#bbb]">→</span>
          <span>↻</span>
        </span>
        <div
          className={`flex h-7 flex-1 items-center gap-2 rounded-full bg-[#eef1f3] px-4 text-[13.5px] ${
            typing ? "bg-white ring-2 ring-[#1a73e8]" : ""
          }`}
          style={{ maxWidth: 630 }}
        >
          <span className="text-[11px] text-[#777]">{url.startsWith("chrome") || typing ? "◎" : "🔒"}</span>
          <span className="text-[#202124]">
            {url || <span className="text-[#888]">Search or type a URL</span>}
            {typing && <span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-pulse bg-[#202124]" />}
          </span>
        </div>
        <span className="ml-auto flex items-center gap-4">
          <span className="relative">
            <DownloadGlyph />
            {t >= 5200 && <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[#1a73e8]" />}
          </span>
          <span className="size-6 rounded-full bg-[linear-gradient(135deg,#0a6157,#ffdebd)]" />
        </span>
        {/* download popover */}
        {t >= 4400 && t < 6200 && (
          <div
            className="absolute top-9 right-3 z-10 w-[290px] rounded-xl border border-[#e3e3e3] bg-white p-3 text-[#202124] shadow-[0_12px_32px_rgb(0_0_0/0.18)]"
            style={{ opacity: Math.min(prog(t, 4400, 4600), 1 - prog(t, 5950, 6200)) }}
          >
            <div className="text-[12px] font-medium text-[#5f6368]">Recent download</div>
            <div className="mt-2 flex items-center gap-3">
              <ZipIcon size={30} />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium">papr-1.5.0.zip</div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#e8eaed]">
                  <div className="h-full bg-[#1a73e8]" style={{ width: `${prog(t, 4500, 5200) * 100}%` }} />
                </div>
              </div>
              <span className="text-[12px] text-[#188038]">{t >= 5200 ? "✓ Done" : `${Math.round(prog(t, 4500, 5200) * 292)} KB`}</span>
            </div>
          </div>
        )}
      </div>

      {/* content (1040×530) */}
      <div className="relative h-[530px] overflow-hidden">
        {view === "site" && <SiteView />}
        {view === "checkout" && <CheckoutView t={t} />}
        {view === "success" && <SuccessView pressed={t >= 4200 && t < 4400} />}
        {view === "extensions" && <ExtensionsView t={t} />}
        {view === "papr" && <PaprView t={t} />}
      </div>

      {/* Load-unpacked folder picker sheet (drawn in window coordinates) */}
      {t >= 17400 && t < 20000 && <PickerSheet t={t} />}
    </div>
  );
}

function SiteView() {
  const price = usePrice();
  return (
    <div className="absolute inset-0 bg-[#031b18] px-20 pt-[70px] text-[#f3eee7]">
      <div className="absolute top-5 left-20 flex items-center gap-2 text-[15px] font-semibold">
        <Logo className="size-6" /> papr
      </div>
      <div className="text-[54px] leading-[1] font-medium tracking-[-0.045em]">
        Every new tab,
        <br />
        <span className="font-normal text-[#9db1ac]">a blank page.</span>
      </div>
      <div className="absolute top-[210px] left-20 grid h-10 w-[150px] place-items-center rounded-full bg-[linear-gradient(180deg,#0b6d5f,#03463e)] text-[14px] font-semibold text-white shadow-[inset_0_-1px_0_rgb(150_255_222/0.6),0_8px_20px_-8px_rgb(20_190_155/0.7)]">
        Get Papr - {price.label} ↗
      </div>
      <div className="absolute right-16 bottom-0 h-[220px] w-[470px] overflow-hidden rounded-t-xl border border-white/10 bg-[#161616] p-6">
        <div className="h-4 w-40 rounded bg-white/80" />
        <div className="mt-4 space-y-2.5">
          {[70, 85, 55, 65].map((w, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className={`size-3 rounded-[3px] border ${i < 2 ? "border-[#ffdebd] bg-[#ffdebd]" : "border-white/30"}`} />
              <span className="h-2 rounded bg-white/25" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckoutView({ t }: { t: number }) {
  const price = usePrice();
  const full = formatPrice(price.amount, price.currency, true);
  const paid = t >= 2950;
  return (
    <div className="absolute inset-0 bg-[#f4f5f7]">
      <div className="absolute top-[70px] left-[330px] h-[300px] w-[380px] rounded-2xl bg-white p-[30px] text-[#111] shadow-[0_10px_40px_rgb(0_0_0/0.08)]">
        <div className="flex items-center gap-3">
          <Logo className="size-9" />
          <div className="flex-1">
            <div className="text-[15px] font-semibold">Papr</div>
            <div className="text-[12px] text-[#6b7280]">One-time purchase</div>
          </div>
          <div className="text-[18px] font-semibold">{full}</div>
        </div>
        <div className="mt-5 space-y-2.5 text-[13px]">
          <div className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-[#374151]">you@example.com</div>
          <div className="flex justify-between rounded-lg border border-[#e5e7eb] px-3 py-2 text-[#374151]">
            <span>4242 4242 4242 4242</span>
            <span className="text-[#9ca3af]">12/34 · 123</span>
          </div>
        </div>
        <div
          className={`absolute bottom-[30px] left-[30px] grid h-10 w-[320px] place-items-center rounded-lg text-[14px] font-semibold text-white transition-colors ${
            paid ? "bg-[#16a34a]" : "bg-[#111]"
          }`}
        >
          {paid ? "✓ Paid" : t >= 2700 ? "Processing…" : `Pay ${full}`}
        </div>
      </div>
      <div className="absolute bottom-6 w-full text-center text-[12px] text-[#9ca3af]">Secure checkout by Polar</div>
    </div>
  );
}

function SuccessView({ pressed }: { pressed: boolean }) {
  return (
    <div className="absolute inset-0 bg-[#031b18] text-center text-[#f3eee7]">
      <div className="mx-auto mt-[70px] grid size-12 place-items-center rounded-full bg-[linear-gradient(180deg,#ffdebd,#ffb877)] text-[20px] text-[#0d1513]">
        ✓
      </div>
      <div className="mt-6 text-[44px] font-medium tracking-[-0.04em]">
        You&apos;re in. <span className="font-normal text-[#9db1ac]">Thanks!</span>
      </div>
      <div
        className="absolute top-[250px] left-[420px] grid h-11 w-[200px] place-items-center rounded-full bg-[linear-gradient(180deg,#0b6d5f,#03463e)] text-[15px] font-semibold text-white shadow-[inset_0_-1px_0_rgb(150_255_222/0.6),0_10px_24px_-8px_rgb(20_190_155/0.7)]"
        style={{ transform: pressed ? "scale(0.96)" : undefined }}
      >
        Download Papr ↓
      </div>
    </div>
  );
}

function ExtensionsView({ t }: { t: number }) {
  const dev = t >= 16300;
  const pressed = t >= 17200 && t < 17400;
  const card = t >= 20200;
  return (
    <div className="absolute inset-0 bg-[#f8f9fa] text-[#202124]">
      <div className="flex h-14 items-center border-b border-[#e0e0e0] bg-white px-[30px]">
        <span className="text-[19px]">Extensions</span>
        <span className="ml-10 h-8 w-[360px] rounded-full bg-[#f1f3f4] px-4 text-[13px] leading-8 text-[#80868b]">Search extensions</span>
        <span className="ml-auto mr-3 text-[13px] text-[#5f6368]">Developer mode</span>
        <span className={`relative h-4 w-9 rounded-full transition-colors duration-300 ${dev ? "bg-[#8ab4f8]" : "bg-[#bdc1c6]"}`}>
          <span
            className={`absolute -top-0.5 size-5 rounded-full shadow transition-[left,background-color] duration-300 ${
              dev ? "left-[18px] bg-[#1a73e8]" : "left-0 bg-white"
            }`}
          />
        </span>
      </div>
      <div className="flex h-11 items-center gap-2 border-b border-[#e0e0e0] bg-white px-[30px]" style={{ opacity: dev ? 1 : 0, transition: "opacity .3s" }}>
        <span
          className="rounded-md border border-[#dadce0] px-3 py-1 text-[13px] font-medium text-[#1a73e8] transition-colors"
          style={{ background: pressed ? "#e8f0fe" : undefined }}
        >
          Load unpacked
        </span>
        <span className="rounded-md border border-[#dadce0] px-3 py-1 text-[13px] font-medium text-[#1a73e8]">Pack extension</span>
        <span className="rounded-md border border-[#dadce0] px-3 py-1 text-[13px] font-medium text-[#1a73e8]">Update</span>
      </div>
      {card && (
        <div
          className="absolute top-[120px] left-[30px] w-[380px] rounded-xl border border-[#e0e0e0] bg-white p-4 shadow-[0_1px_3px_rgb(0_0_0/0.08)]"
          style={{ opacity: prog(t, 20200, 20500), transform: `translateY(${(1 - eio(prog(t, 20200, 20600))) * 10}px)` }}
        >
          <div className="flex gap-3">
            <Logo className="size-11 flex-none" />
            <div>
              <div className="text-[15px] font-medium">
                Papr <span className="ml-1 text-[13px] font-normal text-[#5f6368]">1.5.0</span>
              </div>
              <div className="mt-0.5 text-[13px] text-[#5f6368]">Replaces the new tab page with a distraction-free notepad.</div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="flex gap-2 text-[13px] text-[#1a73e8]">
              <span className="rounded-md border border-[#dadce0] px-3 py-1">Details</span>
              <span className="rounded-md border border-[#dadce0] px-3 py-1">Remove</span>
            </span>
            <span className="relative h-4 w-9 rounded-full bg-[#8ab4f8]">
              <span className="absolute -top-0.5 left-[18px] size-5 rounded-full bg-[#1a73e8] shadow" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function PickerSheet({ t }: { t: number }) {
  const y = t < 19700 ? (1 - eio(prog(t, 17400, 17800))) * -380 : eio(prog(t, 19700, 20000)) * -380;
  const sel = t >= 18600;
  // stage coords → window coords: window is at (80, 52)
  return (
    <div className="absolute overflow-hidden" style={{ left: 290 - 80, top: 92 - 52, width: 620, height: 360 }}>
      <div
        className="h-full w-full overflow-hidden rounded-b-xl border border-black/20 bg-[#ececec]/95 text-[#1d1d1f] shadow-[0_20px_50px_rgb(0_0_0/0.35)] backdrop-blur-xl"
        style={{ transform: `translateY(${y}px)` }}
      >
        <div className="flex h-full">
          <div className="w-[150px] border-r border-black/10 bg-[#e3e3e3]/80 px-2 pt-3 text-[12.5px]">
            <div className="px-2 pb-1 text-[11px] font-semibold text-black/40">Favorites</div>
            {["Desktop", "Documents", "Downloads", "Applications"].map((n) => (
              <div key={n} className={`flex items-center gap-2 rounded-md px-2 py-1 ${n === "Documents" ? "bg-black/10" : ""}`}>
                <span className="text-[#2f7cf6]">▢</span>
                {n}
              </div>
            ))}
          </div>
          <div className="relative flex-1 bg-white">
            <div className="flex h-[30px] items-center border-b border-black/10 px-3 text-[12.5px] font-medium">Documents</div>
            {[
              { n: "Papr", folder: true, active: sel },
              { n: "Invoices", folder: true },
              { n: "Screenshots", folder: true },
              { n: "Resume.pdf", folder: false },
            ].map((r, i) => (
              <div
                key={r.n}
                className={`flex h-[26px] items-center gap-2 px-3 text-[12.5px] ${r.active ? "bg-[#2f7cf6] text-white" : i % 2 ? "bg-[#f5f5f5]" : ""} ${
                  !r.folder ? "text-black/30" : ""
                }`}
                style={{ marginTop: i === 0 ? 8 : 0 }}
              >
                {r.folder ? <FolderIcon size={16} /> : <span className="w-4 text-center">▤</span>}
                {r.n}
              </div>
            ))}
            <div className="absolute right-[10px] bottom-[12px] flex gap-2 text-[13px]">
              <span className="rounded-md border border-black/15 bg-white px-4 py-1">Cancel</span>
              <span
                className={`rounded-md px-4 py-1 text-white transition-colors ${sel ? "bg-[#2f7cf6]" : "bg-[#2f7cf6]/40"}`}
                style={{ transform: t >= 19650 && t < 19800 ? "scale(0.96)" : undefined }}
              >
                Select
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaprView({ t }: { t: number }) {
  const h1 = typed(t, 23400, 24200, "Weekend");
  const items = [
    typed(t, 24400, 25300, "Farmers market"),
    typed(t, 25500, 26100, "Call mom"),
    typed(t, 26300, 27100, "Finish the book"),
  ];
  const active = t < 24300 ? -1 : t < 25400 ? 0 : t < 26200 ? 1 : t < 27200 ? 2 : -2;
  const done = t >= 27700;
  const caret = <span className="ml-px inline-block h-[1em] w-[2px] translate-y-[3px] animate-pulse bg-[#ffdebd]" />;
  return (
    <div className="absolute inset-0 bg-[#161616] text-[#e8e8e8]" style={{ opacity: prog(t, 22900, 23150) }}>
      <div className="flex h-8 items-center gap-2 border-b border-[#2a2a2a] px-4 text-[12px] text-[#8c8c8c]">
        <Logo className="size-4" /> papr <span className="text-[#5c5c5c]">/</span>
        <span className="text-[#e8e8e8]">{h1 || "Untitled"}</span>
        <span className="ml-2 rounded-full bg-[#262626] px-2 py-0.5 text-[9.5px] tracking-[0.06em] uppercase">● Saved</span>
      </div>
      <div className="absolute top-[60px] left-[240px] w-[560px]">
        <div className="text-[34px] leading-tight font-semibold tracking-[-0.03em]">
          {h1}
          {active === -1 && caret}
        </div>
        <ul className="mt-5 space-y-[6px] text-[17px]">
          {items.map((txt, i) =>
            txt || active === i ? (
              <li key={i} className={`flex h-[26px] items-center gap-3 ${i === 0 && done ? "text-[#8c8c8c] line-through decoration-[#5c5c5c]" : ""}`}>
                <span
                  className={`grid size-[15px] flex-none place-items-center rounded-[4px] border-[1.5px] text-[10px] font-extrabold transition-colors ${
                    i === 0 && done ? "border-[#ffdebd] bg-[#ffdebd] text-[#141414]" : "border-[#5c5c5c]"
                  }`}
                >
                  {i === 0 && done && "✓"}
                </span>
                <span>
                  {txt}
                  {active === i && caret}
                </span>
              </li>
            ) : null,
          )}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------ Finder ------------------------------ */

function Finder({ t, p, dragging }: { t: number; p: number; dragging: boolean }) {
  const inDocs = t >= 10300;
  const unzipped = t >= 7800;
  const hoverDocs = t >= 9500 && t < 10300;
  const zipSel = t >= 7200 && t < 8400;
  return (
    <div
      className="absolute z-20 overflow-hidden rounded-[12px] border border-black/30 bg-white text-[#1d1d1f] shadow-[0_30px_80px_-10px_rgb(0_0_0/0.6)]"
      style={{ left: 220, top: 150, width: 760, height: 440, opacity: p, transform: `scale(${0.96 + 0.04 * p})` }}
    >
      <div className="flex h-[52px] items-center gap-4 border-b border-black/10 bg-[#f6f6f6] px-4">
        <TrafficLights />
        <span className="ml-2 text-[16px] text-black/40">‹ ›</span>
        <span className="text-[14px] font-semibold">{inDocs ? "Documents" : "Downloads"}</span>
        <span className="ml-auto h-6 w-[180px] rounded-md bg-black/5 px-2 text-[12px] leading-6 text-black/35">Search</span>
      </div>
      <div className="flex h-[388px]">
        <div className="w-[180px] bg-[#ececec]/80 px-2 pt-3 text-[13px]">
          <div className="px-2 pb-1 text-[11px] font-semibold text-black/40">Favorites</div>
          {["Recents", "Applications", "Desktop", "Documents", "Downloads"].map((n) => {
            const on = (n === "Documents" && (inDocs || hoverDocs)) || (n === "Downloads" && !inDocs && !hoverDocs);
            return (
              <div
                key={n}
                className={`flex h-[28px] items-center gap-2 rounded-md px-2 transition-colors ${
                  on ? (hoverDocs && n === "Documents" ? "bg-[#2f7cf6] text-white" : "bg-black/10") : ""
                }`}
              >
                <span className={hoverDocs && n === "Documents" ? "text-white" : "text-[#2f7cf6]"}>▢</span>
                {n}
              </div>
            );
          })}
        </div>
        <div className="relative flex-1 p-[22px]">
          {!inDocs ? (
            <div className="flex gap-5">
              <FileTile label="papr-1.5.0.zip" selected={zipSel}>
                <ZipIcon size={60} />
              </FileTile>
              {unzipped && (
                <FileTile label="Papr" pop={prog(t, 7800, 8050)} faded={dragging}>
                  <FolderIcon size={64} />
                </FileTile>
              )}
            </div>
          ) : (
            <div className="flex gap-5">
              <FileTile label="Papr" pop={prog(t, 10300, 10550)} selected>
                <FolderIcon size={64} />
              </FileTile>
              <FileTile label="Invoices">
                <FolderIcon size={64} />
              </FileTile>
              <FileTile label="Screenshots">
                <FolderIcon size={64} />
              </FileTile>
            </div>
          )}
          {/* subtle caption chip inside Finder */}
          {t >= 10600 && (
            <div
              className="absolute bottom-5 left-[22px] rounded-full bg-[#2f7cf6]/10 px-3 py-1 text-[12px] text-[#2f7cf6]"
              style={{ opacity: prog(t, 10600, 10900) }}
            >
              Keep this folder. Chrome loads Papr from it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FileTile({
  label,
  selected,
  faded,
  pop = 1,
  children,
}: {
  label: string;
  selected?: boolean;
  faded?: boolean;
  pop?: number;
  children: ReactNode;
}) {
  return (
    <div
      className="flex w-[100px] flex-col items-center gap-1.5"
      style={{ opacity: faded ? 0.35 : pop, transform: `scale(${0.7 + 0.3 * eio(pop)})` } as CSSProperties}
    >
      <div className={`grid h-[74px] w-[84px] place-items-center rounded-lg ${selected ? "bg-black/10" : ""}`}>{children}</div>
      <span className={`max-w-full truncate rounded px-1.5 text-[12px] ${selected ? "bg-[#2f7cf6] text-white" : ""}`}>{label}</span>
    </div>
  );
}

/* ------------------------------ bits ------------------------------ */

function TrafficLights({ className = "" }: { className?: string }) {
  return (
    <span className={`flex gap-2 ${className}`}>
      <span className="size-3 rounded-full bg-[#ff5f57]" />
      <span className="size-3 rounded-full bg-[#febc2e]" />
      <span className="size-3 rounded-full bg-[#28c840]" />
    </span>
  );
}

function Tab({ title, active, icon, enter = 1 }: { title: string; active?: boolean; icon: "papr" | "puzzle"; enter?: number }) {
  return (
    <span
      className={`flex h-[32px] items-center gap-2 overflow-hidden rounded-t-[10px] px-3 text-[12.5px] whitespace-nowrap ${
        active ? "bg-white text-[#202124]" : "text-[#5f6368]"
      }`}
      style={{ width: 220 * eio(enter), opacity: enter }}
    >
      {icon === "papr" ? <Logo className="size-4 flex-none" /> : <span className="flex-none text-[12px]">🧩</span>}
      <span className="truncate">{title}</span>
      <span className="ml-auto text-[#888]">×</span>
    </span>
  );
}

function Key({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-[92px] place-items-center rounded-2xl border border-white/25 bg-white/15 text-[44px] text-white shadow-[0_20px_50px_rgb(0_0_0/0.35)] backdrop-blur-xl">
      {children}
    </span>
  );
}

function FolderIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 60 48" aria-hidden>
      <path d="M3 8a4 4 0 0 1 4-4h14l5 5h27a4 4 0 0 1 4 4v29a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" fill="#5fb0f2" />
      <path d="M3 16a4 4 0 0 1 4-4h46a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" fill="#7cc4fa" />
    </svg>
  );
}

function ZipIcon({ size }: { size: number }) {
  return (
    <svg width={size * 0.8} height={size} viewBox="0 0 40 50" aria-hidden>
      <path d="M4 2h22l10 10v34a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#fff" stroke="#c9ccd1" />
      <path d="M26 2v10h10" fill="#eef0f2" stroke="#c9ccd1" />
      <path d="M17 6h4v3h-4zM17 12h4v3h-4zM17 18h4v3h-4zM17 24h4v6h-4z" fill="#9aa1aa" />
      <text x="20" y="43" textAnchor="middle" fontSize="7" fontWeight="700" fill="#6b7280">ZIP</text>
    </svg>
  );
}

function FinderAppIcon() {
  return (
    <svg viewBox="0 0 50 50" className="size-full" aria-hidden>
      <rect width="50" height="50" rx="12" fill="url(#fa)" />
      <defs>
        <linearGradient id="fa" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6ec1ff" />
          <stop offset="1" stopColor="#1f7ae0" />
        </linearGradient>
      </defs>
      <path d="M8 14h34M8 25h34M8 36h34" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />
      <rect x="14" y="10" width="22" height="30" rx="3" fill="#fff" fillOpacity=".9" />
      <path d="M18 18h14M18 23h14M18 28h9" stroke="#1f7ae0" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BrowserAppIcon() {
  return (
    <svg viewBox="0 0 50 50" className="size-full" aria-hidden>
      <rect width="50" height="50" rx="12" fill="#f8f9fa" />
      <circle cx="25" cy="25" r="15" fill="none" stroke="#1a73e8" strokeWidth="3" />
      <path d="M10 25h30M25 10c6 5 6 25 0 30M25 10c-6 5-6 25 0 30" fill="none" stroke="#1a73e8" strokeWidth="2" />
    </svg>
  );
}

function DownloadGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
    </svg>
  );
}

function PlayIcon({ small }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={small ? "size-4 translate-x-px" : "size-7 translate-x-0.5"} fill="currentColor" aria-hidden>
      <path d="M7 4.5v15l12.5-7.5z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z" />
    </svg>
  );
}
function ReplayIcon({ small }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={small ? "size-4" : "size-7"} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4" />
    </svg>
  );
}
