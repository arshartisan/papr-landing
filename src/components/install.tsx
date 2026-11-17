"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Apple, Check, Windows } from "./icons";
import { Logo } from "./logo";
import { SectionHead } from "./reveal";
import { GlowButton } from "./glow-button";
import { InstallFilm } from "./install-film";
import { site } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

/** Steps 0..n-1 once in view, looping (static on reduced motion). */
function useSequence(n: number, ms: number, hold = 2200) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    let t: ReturnType<typeof setTimeout>;
    let v = 0;
    const tick = () => {
      v = (v + 1) % n;
      setI(v);
      t = setTimeout(tick, v === n - 1 ? hold : ms);
    };
    t = setTimeout(tick, ms);
    return () => clearTimeout(t);
  }, [inView, reduce, n, ms, hold]);
  return [ref, reduce ? n - 1 : i] as const;
}

export function Install({ cta = true, id = "install" }: { cta?: boolean; id?: string }) {
  return (
    <section id={id} data-nav="light" className="border-t border-line bg-paper py-28 md:py-36">
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHead
            eyebrow="Install"
            title={
              <>
                Up and running <span className="serif-accent text-ink-3">in a minute.</span>
              </>
            }
            sub="Papr is a direct download, not a store listing. Three steps on Windows or macOS, then every new tab is a notepad."
          />
        </div>

        {/* full walkthrough, macOS */}
        <div className="mt-14">
          <InstallFilm />
        </div>

        {/* progress rail */}
        <Rail />

        <ol className="mt-6 grid gap-3 md:grid-cols-3">
          <Step i={0} title="Buy once" body="Check out with Polar. Your download link appears the moment payment goes through.">
            <CheckoutArt />
          </Step>
          <Step
            i={1}
            title="Unzip it somewhere safe"
            body="Keep the folder somewhere permanent, like Documents. Chrome runs Papr from it, so don't delete it."
          >
            <UnzipArt />
          </Step>
          <Step
            i={2}
            title="Load it in Chrome"
            body="Open the extensions page, switch on Developer mode, click Load unpacked and pick the Papr folder."
            footer={<CopyChip text="chrome://extensions" />}
          >
            <ChromeArt />
          </Step>
        </ol>

        <Updating />

        {cta && (
        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <GlowButton href={site.checkoutUrl}>Get Papr - ${site.price}</GlowButton>
          <p className="text-[14px] text-ink-3">
            Stuck?{" "}
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
            >
              Message me on LinkedIn
            </a>{" "}
            and I&apos;ll help you set it up.
          </p>
        </div>
        )}
      </div>
    </section>
  );
}

function Rail() {
  return (
    <div aria-hidden className="relative mt-14 hidden grid-cols-3 md:grid">
      <div className="absolute top-1/2 right-[calc(100%/6)] left-[calc(100%/6)] h-px -translate-y-1/2 bg-line" />
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 1.4, ease, delay: 0.2 }}
        className="absolute top-1/2 right-[calc(100%/6)] left-[calc(100%/6)] h-px origin-left -translate-y-1/2 bg-teal"
      />
      {[1, 2, 3].map((n, i) => (
        <motion.span
          key={n}
          initial={{ backgroundColor: "#ffffff", color: "#77817e" }}
          whileInView={{ backgroundColor: "#005148", color: "#ffdebd" }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.6 }}
          className="relative mx-auto grid size-8 place-items-center rounded-full border border-line font-mono text-[12px]"
        >
          {n}
        </motion.span>
      ))}
    </div>
  );
}

function Step({
  i,
  title,
  body,
  footer,
  children,
}: {
  i: number;
  title: string;
  body: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease, delay: i * 0.08 }}
      className="group flex flex-col rounded-[20px] border border-line bg-white p-3"
    >
      <div className="relative h-[200px] overflow-hidden rounded-[14px] bg-paper">{children}</div>
      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <span className="font-mono text-[11px] tracking-[0.12em] text-teal md:hidden">STEP {i + 1}</span>
        <h3 className="text-[19px] font-medium tracking-[-0.025em] max-md:mt-1">{title}</h3>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-pretty text-ink-2">{body}</p>
        {footer && <div className="mt-auto pt-5">{footer}</div>}
      </div>
    </motion.li>
  );
}

/* ---------------- step art ---------------- */

function CheckoutArt() {
  const [ref, s] = useSequence(3, 1300); // 0 pay · 1 paid · 2 download ready
  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center p-5">
      <div className="w-full max-w-[250px] rounded-xl border border-line bg-white p-4 shadow-[0_18px_40px_-26px_rgb(13_21_19/0.4)]">
        <div className="flex items-center gap-2.5">
          <Logo className="size-7" />
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium">Papr</div>
            <div className="text-[11px] text-ink-3">One-time purchase</div>
          </div>
          <div className="text-[14px] font-medium tabular-nums">${site.price}.00</div>
        </div>
        <div className="mt-3.5 h-9">
          <AnimatePresence mode="wait" initial={false}>
            {s === 0 ? (
              <motion.div
                key="pay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid h-9 place-items-center rounded-lg bg-ink text-[12.5px] font-medium text-white"
              >
                Pay ${site.price}
              </motion.div>
            ) : (
              <motion.div
                key="paid"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease }}
                className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-teal/10 text-[12.5px] font-medium text-teal"
              >
                <Check className="size-3.5" /> Paid
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.div
          animate={{ opacity: s === 2 ? 1 : 0.35 }}
          transition={{ duration: 0.4 }}
          className="mt-2.5 flex items-center gap-2 rounded-lg border border-dashed border-line px-3 py-2 text-[12px]"
        >
          <DownloadIcon className="size-3.5 text-teal" />
          <span className="flex-1 font-mono">papr.zip</span>
          <span className="text-ink-3">ready</span>
        </motion.div>
      </div>
    </div>
  );
}

function UnzipArt() {
  const [os, setOs] = useState<"win" | "mac">("win");
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (/Mac|iPhone|iPad/.test(navigator.userAgent)) setOs("mac");
    });
    return () => cancelAnimationFrame(id);
  }, []);
  const tip =
    os === "win" ? (
      <>
        Right-click <b className="font-medium text-ink">papr.zip</b> → <b className="font-medium text-ink">Extract All…</b>
      </>
    ) : (
      <>
        Double-click <b className="font-medium text-ink">papr.zip</b> in Finder
      </>
    );
  return (
    <div className="absolute inset-0 flex flex-col p-4">
      <div role="tablist" aria-label="Operating system" className="flex gap-0.5 self-start rounded-full border border-line bg-white p-0.5">
        {(
          [
            ["win", "Windows", <Windows key="w" className="size-3" />],
            ["mac", "macOS", <Apple key="a" className="size-3.5 -translate-y-px" />],
          ] as const
        ).map(([k, label, icon]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={os === k}
            onClick={() => setOs(k)}
            className={`relative flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-teal ${
              os === k ? "text-white" : "text-ink-3 hover:text-ink"
            }`}
          >
            {os === k && (
              <motion.span layoutId="os-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 36 }} />
            )}
            <span className="relative flex items-center gap-1.5">
              {icon}
              {label}
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={os}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-3 text-[12.5px] text-ink-2"
        >
          {tip}
        </motion.p>
      </AnimatePresence>
      <div className="mt-auto rounded-lg border border-line bg-white px-3 py-2.5 font-mono text-[11.5px] leading-[1.75] text-ink-2">
        <div className="text-ink-3">{os === "win" ? "C:\\Users\\you\\Documents" : "~/Documents"}</div>
        <div className="flex items-center gap-1.5 rounded bg-teal/8 px-1 text-teal">
          <FolderIcon className="size-3.5" /> Papr
        </div>
        <div className="pl-6 text-ink-3">manifest.json · newtab.html · pkg/</div>
      </div>
    </div>
  );
}

function ChromeArt() {
  const [ref, s] = useSequence(4, 1100, 2600); // 0 off · 1 dev mode · 2 load unpacked · 3 papr installed
  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full overflow-hidden rounded-xl border border-line bg-white text-[11.5px] shadow-[0_18px_40px_-26px_rgb(13_21_19/0.4)]">
        <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
          <span className="font-medium">Extensions</span>
          <span className="flex items-center gap-2 text-ink-3">
            Developer mode
            <span className={`relative h-4 w-7 rounded-full transition-colors duration-300 ${s >= 1 ? "bg-teal" : "bg-line"}`}>
              <span
                className={`absolute top-0.5 size-3 rounded-full bg-white shadow transition-[left] duration-300 ${s >= 1 ? "left-3.5" : "left-0.5"}`}
              />
            </span>
          </span>
        </div>
        <div className="flex h-9 items-center gap-1.5 border-b border-line px-3">
          <motion.span
            animate={{ opacity: s >= 1 ? 1 : 0, scale: s === 2 ? 0.95 : 1 }}
            transition={{ duration: 0.25 }}
            className={`rounded-md border px-2 py-1 font-medium transition-colors ${
              s === 2 ? "border-teal bg-teal text-peach" : "border-line text-teal"
            }`}
          >
            Load unpacked
          </motion.span>
          <motion.span animate={{ opacity: s >= 1 ? 1 : 0 }} className="rounded-md border border-line px-2 py-1 text-ink-3">
            Pack extension
          </motion.span>
        </div>
        <div className="h-[66px] p-2.5">
          <AnimatePresence>
            {s === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease }}
                className="flex items-center gap-2.5 rounded-lg border border-line p-2"
              >
                <Logo className="size-7" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium">Papr {site.version}</div>
                  <div className="truncate text-ink-3">Replaces the new tab page with a notepad</div>
                </div>
                <span className="relative h-4 w-7 flex-none rounded-full bg-teal">
                  <span className="absolute top-0.5 left-3.5 size-3 rounded-full bg-white shadow" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function CopyChip({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable: the text is still selectable */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="group inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-line bg-paper py-1 pr-1 pl-3.5 font-mono text-[12px] text-ink transition-colors hover:border-ink/20 focus-visible:outline-2 focus-visible:outline-teal"
      aria-label={`Copy ${text}`}
    >
      {text}
      <span
        className={`grid h-7 min-w-7 place-items-center rounded-full px-2 font-sans text-[11px] font-medium transition-colors ${
          copied ? "bg-teal text-peach" : "bg-white text-ink-3 group-hover:text-ink"
        }`}
      >
        {copied ? "Copied" : <CopyIcon className="size-3.5" />}
      </span>
    </button>
  );
}

function Updating() {
  const steps = ["Download the new zip", "Replace the files in your Papr folder", "Press reload on chrome://extensions"];
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease }}
      className="mt-3 rounded-[20px] border border-line bg-paper-2 p-6 md:p-7"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
        <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-ink-3 uppercase md:w-36 md:flex-none">
          <RefreshIcon className="size-3.5 text-teal" /> Updating
        </span>
        <ol className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-3">
          {steps.map((t, i) => (
            <li key={t} className="flex items-center gap-3 md:contents">
              <span className="flex items-center gap-2.5 text-[14px] text-ink-2">
                <span className="grid size-5 flex-none place-items-center rounded-full bg-white font-mono text-[10.5px] text-ink-3">{i + 1}</span>
                {t}
              </span>
              {i < steps.length - 1 && <span aria-hidden className="hidden h-px w-6 flex-none bg-line md:block" />}
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#f0d9bf] bg-[#fff6ec] px-4 py-3 text-[13.5px] leading-relaxed text-[#7a4a17]">
        <WarnIcon className="mt-0.5 size-4 flex-none" />
        <span>
          <b className="font-medium">Never remove the extension to update.</b> Removing it deletes the notes stored in
          your browser.
        </span>
      </p>
    </motion.div>
  );
}

/* ---------------- small icons ---------------- */
const s = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
const DownloadIcon = ({ className }: { className?: string }) => (
  <svg {...s} className={className}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
);
const FolderIcon = ({ className }: { className?: string }) => (
  <svg {...s} className={className}><path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h4l2 2h7a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" /></svg>
);
const CopyIcon = ({ className }: { className?: string }) => (
  <svg {...s} className={className}><rect x="8.5" y="8.5" width="11" height="11" rx="2.5" /><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" /></svg>
);
const RefreshIcon = ({ className }: { className?: string }) => (
  <svg {...s} className={className}><path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4" /></svg>
);
const WarnIcon = ({ className }: { className?: string }) => (
  <svg {...s} className={className}><path d="M12 4 2.8 19.5h18.4L12 4Z" /><path d="M12 10v4M12 17h.01" /></svg>
);
