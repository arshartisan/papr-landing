import { Nav } from "./nav";
import { Footer } from "./footer";
import { LegalNav, type LegalKey } from "./legal-nav";

/** Nav + footer wrapper for every page other than the landing page. */
export function PageShell({ children, endsDark = false }: { children: React.ReactNode; endsDark?: boolean }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer onDark={endsDark} />
    </>
  );
}

export type LegalSection = { id: string; title: string; body: React.ReactNode };

/** Long-form legal page: big header, sticky policy/section sidebar, numbered sections. */
export function LegalPage({
  active,
  title,
  intro,
  updated,
  sections,
}: {
  active: LegalKey;
  title: string;
  intro: React.ReactNode;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <PageShell>
      <section data-nav="light" className="bg-paper pt-36 pb-24 md:pt-48 md:pb-32">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
          <header className="max-w-[720px]">
            <h1 className="display text-[clamp(2.6rem,6vw,4.5rem)]">{title}</h1>
            <p className="mt-6 text-[clamp(1.1rem,1.6vw,1.3rem)] leading-snug text-pretty text-ink">{intro}</p>
            <p className="mt-6 text-[15px] text-ink-3">Last updated: {updated}</p>
          </header>

          <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
            <LegalNav active={active} sections={sections.map(({ id, title }) => ({ id, title }))} />
            <div className="legal max-w-[680px]">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-28">
                  <h2>
                    {i + 1}. {s.title}
                  </h2>
                  {s.body}
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
