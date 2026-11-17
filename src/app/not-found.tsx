import { PageShell } from "@/components/page-shell";
import { GlowButton } from "@/components/glow-button";

export default function NotFound() {
  return (
    <PageShell endsDark>
      <section
        data-nav="dark"
        className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-night pt-32 pb-24 text-snow"
      >
        <div className="grid-fade pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto max-w-[720px] px-5 text-center sm:px-8">
          <p className="font-mono text-[12px] tracking-[0.14em] text-fog uppercase">404</p>
          <h1 className="display mt-4 text-[clamp(2.4rem,5.4vw,4rem)]">
            A blank page. <span className="serif-accent text-mist">Just not the useful kind.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[40ch] text-[17px] text-mist">The page you&apos;re looking for doesn&apos;t exist.</p>
          <div className="mt-9 flex justify-center">
            <GlowButton href="/">Back to Papr</GlowButton>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
