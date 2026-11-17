import { Reveal, SectionHead } from "./reveal";

// Mirrors the shortcut table in the extension's README
const shortcuts: { action: string; keys: string[]; md?: string }[] = [
  { action: "New note", keys: ["Alt", "N"] },
  { action: "Heading 1 / 2", keys: ["Ctrl", "Alt", "1 / 2"], md: "# / ##" },
  { action: "Bold · Italic · Underline", keys: ["Ctrl", "B / I / U"] },
  { action: "Bullets", keys: ["Ctrl", "Shift", "8"], md: "-" },
  { action: "Numbering", keys: ["Ctrl", "Shift", "7"], md: "1." },
  { action: "Checklist", keys: ["Ctrl", "Shift", "9"], md: "[]" },
  { action: "1 – 4 columns", keys: ["Alt", "1 … 4"] },
  { action: "Show / hide sidebar", keys: ["Ctrl", "\\"] },
  { action: "Text size", keys: ["Ctrl", "Shift", ". / ,"] },
  { action: "Light / dark", keys: ["Ctrl", "Shift", "L"] },
];

export function Shortcuts() {
  return (
    <section id="shortcuts" data-nav="light" className="border-t border-line bg-paper py-28 md:py-36">
      <div className="mx-auto grid max-w-[1120px] gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead
            eyebrow="Keyboard first"
            title={
              <>
                Hands stay <span className="serif-accent text-ink-3">on the keys.</span>
              </>
            }
            sub="Every action has a shortcut, and common formatting follows Markdown. You may never need the toolbar."
          />
        </div>

        <ul className="border-t border-line">
          {shortcuts.map((s, i) => (
            <Reveal
              as="li"
              key={s.action}
              delay={i * 0.03}
              y={10}
              className="flex items-center justify-between gap-4 border-b border-line py-4"
            >
              <span className="text-[15px] text-ink">{s.action}</span>
              <span className="flex flex-wrap items-center justify-end gap-1.5">
                {s.md && (
                  <span className="mr-2 hidden font-mono text-[12px] text-ink-3 sm:inline">
                    or type <span className="text-teal">{s.md}</span>
                  </span>
                )}
                {s.keys.map((k) => (
                  <kbd key={k} className="kbd">
                    {k}
                  </kbd>
                ))}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
