import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { GlowButton } from "@/components/glow-button";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Checkout unavailable - Papr", robots: { index: false } };

export default function CheckoutUnavailable() {
  return (
    <PageShell endsDark>
      <section
        data-nav="dark"
        className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-night pt-32 pb-24 text-snow"
      >
        <div className="grid-fade pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto max-w-[720px] px-5 text-center sm:px-8">
          <p className="font-mono text-[12px] tracking-[0.14em] text-fog uppercase">Checkout</p>
          <h1 className="display mt-4 text-[clamp(2.2rem,5vw,3.5rem)]">
            Checkout is taking a break. <span className="serif-accent text-mist">You haven&apos;t been charged.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[44ch] text-[17px] text-mist">
            We couldn&apos;t open the payment page just now. Please try again in a minute.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <GlowButton href={site.checkoutUrl}>Try again</GlowButton>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14.5px] font-medium text-snow/85 hover:text-snow"
            >
              Still stuck? Message me
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
