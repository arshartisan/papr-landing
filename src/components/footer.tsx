import { Logo } from "./logo";
import { Apple, ArrowUpRight, Windows } from "./icons";
import { nav, site } from "@/lib/site";

export function Footer({ onDark = false }: { onDark?: boolean }) {
  const links = [...nav.map((n) => ({ ...n, href: `/${n.href}` })), { label: "Buy Papr", href: site.checkoutUrl }];
  return (
    <footer data-nav={onDark ? "dark" : "light"} className={`${onDark ? "bg-night" : "bg-paper"} p-3 sm:p-2 sm:pt-0`}>
      <div className="@container relative isolate overflow-hidden rounded-[20px] border border-white/8 bg-night text-snow">
        {/* glow from below + grain */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-[radial-gradient(60%_80%_at_50%_100%,rgb(255_201_148/0.22),transparent_70%)]" />
        <div className="wf-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.07] mix-blend-overlay" />

        <div className="relative z-10 grid gap-10 px-6 pt-8 @md:px-10 @md:pt-10 @2xl:grid-cols-[minmax(0,1fr)_auto] @2xl:gap-12">
          {/* left: logo + tagline, then links */}
          <div className="grid grid-cols-2 gap-8 @md:grid-cols-[auto_auto] @md:justify-start @md:gap-24">
            <div>
              <Logo className="size-8" />
              <p className="mt-4 max-w-[24ch] text-[13.5px] leading-relaxed text-mist">
                A quiet notepad for every new tab. Your notes stay on your device.
              </p>
            </div>
            <nav aria-label="Footer">
              <ul className="grid grid-flow-col grid-rows-3 gap-x-14 gap-y-1.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="group inline-flex items-center gap-1.5 text-[15px] text-snow/85 transition-colors hover:text-peach focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach"
                    >
                      {l.label}
                      <ArrowUpRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* right: icon links + details */}
          <div className="flex flex-col gap-5 @2xl:items-end">
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-mist transition-colors hover:border-white/25 hover:text-snow focus-visible:outline-2 focus-visible:outline-peach"
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <address className="flex flex-col gap-2 text-[13px] text-mist not-italic @2xl:items-end">
              {details.map(([k, v]) => (
                <span key={k} className="flex items-center gap-2">
                  <span className="font-mono text-[10.5px] tracking-[0.12em] text-fog uppercase">{k}</span>
                  {v}
                </span>
              ))}
            </address>
          </div>
        </div>

        <div className="relative z-10 mx-6 mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-5 text-[12.5px] text-fog @md:mx-10">
          <span>© 2026 Papr. All rights reserved.</span>
          <span className="flex gap-5">
            <a href="/portal" className="hover:text-snow">Re-download</a>
            <a href="/refunds" className="hover:text-snow">Refunds</a>
            <a href="/privacy" className="hover:text-snow">Privacy</a>
            <a href="/terms" className="hover:text-snow">Terms</a>
          </span>
        </div>

        {/* giant wordmark, cropped by the panel edge */}
        <div aria-hidden="true" className="wf-mark relative select-none">
          <span className="wf-mark__glow">papr</span>
          <span className="wf-mark__fill">papr</span>
          <span className="wf-mark__sweep">papr</span>
        </div>
      </div>
    </footer>
  );
}

const iconProps = { className: "size-4", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;
const socials = [
  {
    label: "LinkedIn",
    href: site.social.linkedin,
    icon: (
      <svg {...iconProps}>
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
    ),
  },
];
const details: [string, React.ReactNode][] = [
  [
    "Runs on",
    <span key="os" className="inline-flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5">
        <Windows className="size-3.5" /> Windows
      </span>
      <span className="size-1 rounded-full bg-fog/60" />
      <span className="inline-flex items-center gap-1.5">
        <Apple className="size-[15px] -translate-y-px" /> macOS
      </span>
    </span>,
  ],
  ["Built with", "Rust + WebAssembly"],
  ["Version", `v${site.version}`],
];
