import { Logo } from "./logo";
import { WordmarkShine } from "./wordmark-shine";
import { Apple, ArrowUpRight, Windows } from "./icons";
import { linkGroups, site } from "@/lib/site";

export function Footer({ onDark = false }: { onDark?: boolean }) {
  return (
    <footer data-nav={onDark ? "dark" : "light"} className={`${onDark ? "bg-night" : "bg-paper"} p-3 sm:p-2 sm:pt-0`}>
      <div className="@container relative isolate overflow-hidden rounded-[20px] border border-white/8 bg-night text-snow">
        {/* glow from below + grain */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-[radial-gradient(60%_80%_at_50%_100%,rgb(255_201_148/0.22),transparent_70%)]" />
        <div className="wf-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.07] mix-blend-overlay" />

        <div className="relative z-10 grid gap-12 px-6 pt-10 @md:px-10 @md:pt-12 @3xl:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)] @3xl:gap-16">
          {/* brand */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2.5">
              <Logo className="size-8" />
              <span className="text-[18px] font-semibold tracking-[-0.03em]">papr</span>
            </div>
            <p className="max-w-[30ch] text-[14px] leading-relaxed text-mist">
              A quiet notepad for every new tab. Your notes stay on your device.
            </p>
            <dl className="flex flex-col gap-2 text-[13px] text-mist">
              {details.map(([k, v]) => (
                <div key={k} className="flex items-center gap-3">
                  <dt className="w-20 font-mono text-[10.5px] tracking-[0.12em] text-fog uppercase">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* link columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 @xl:grid-cols-3">
            {linkGroups.map((g) => (
              <nav key={g.title} aria-label={g.title}>
                <h2 className="text-[12.5px] font-medium text-fog">{g.title}</h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group inline-flex items-center gap-1 text-[14.5px] text-snow/75 transition-colors hover:text-snow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach"
                      >
                        {l.label}
                        <ArrowUpRight
                          className={`size-3.5 transition-all duration-300 ${
                            l.external ? "text-fog" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-6 mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-5 text-[12.5px] text-fog @md:mx-10">
          <span>© 2026 Papr. All rights reserved.</span>
          <span className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2">
              Backed by
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/focaldive.svg" alt="" width={14} height={16} className="h-4 w-auto opacity-90" />
              <span className="font-medium text-snow/85">FocalDive</span>
            </span>
            <a
              href={site.social.linkedin}
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-mist transition-colors hover:border-white/25 hover:text-snow focus-visible:outline-2 focus-visible:outline-peach"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-3.5">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
              </svg>
            </a>
          </span>
        </div>

        {/* giant wordmark, cropped by the panel edge */}
        <WordmarkShine text="papr" />
      </div>
    </footer>
  );
}

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
