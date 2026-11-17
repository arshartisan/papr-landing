import { Accordion, AccordionItem } from "./accordion";
import { Reveal, SectionHead } from "./reveal";

const faqs = [
  {
    q: "Where are my notes stored?",
    a: "In your browser's local storage, on your device. Papr has no account and no server, and it makes no network requests. Your notes never leave your computer.",
  },
  {
    q: "Does it work offline?",
    a: "Yes. Everything, including the fonts and the editor, is bundled inside the extension, so Papr works the same with or without a connection.",
  },
  {
    q: "Which platforms and browsers are supported?",
    a: "Papr works in Chrome on Windows and macOS. It's a standard Manifest V3 extension, so it should also run in other Chromium browsers that can load unpacked extensions, such as Edge and Brave.",
  },
  {
    q: "What happens to my notes if I open several tabs?",
    a: "They stay in sync. Edit a note in one tab and every other open Papr tab updates, so you never overwrite yourself.",
  },
  {
    q: "What happens after 6 months?",
    a: "Papr keeps working, forever. The 6 months covers updates: any new version released in that window is yours to download. After that you keep the version you have.",
  },
  {
    q: "Why do I need Developer mode?",
    a: "Papr is installed directly instead of through the Chrome Web Store, and Chrome only loads extensions from outside the store with Developer mode on. It's one switch on the extensions page. Chrome may occasionally remind you that it's on; that's expected.",
  },
  {
    q: "Why Rust and WebAssembly?",
    a: "A new tab has to open instantly. The editor core is written in Rust and compiled to WebAssembly, so it is ready by the time your cursor is.",
  },
];

export function Faq() {
  return (
    <section id="faq" data-nav="light" className="bg-paper py-28 md:py-36">
      <div className="mx-auto grid max-w-[1120px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <SectionHead
          eyebrow="FAQ"
          title={
            <>
              Questions, <span className="serif-accent text-ink-3">answered.</span>
            </>
          }
        />
        <Reveal>
          <Accordion defaultExpandedKeys={["q0"]}>
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} id={`q${i}`} title={f.q}>
                {f.a}
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
