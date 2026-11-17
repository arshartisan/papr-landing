import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/page-shell";
import { Install } from "@/components/install";
import { GlowButton } from "@/components/glow-button";
import { Check } from "@/components/icons";
import { AutoRefresh } from "@/components/auto-refresh";
import { purchaseState } from "@/lib/polar";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thanks for buying Papr",
  robots: { index: false },
};

export default function SuccessPage({ searchParams }: PageProps<"/success">) {
  return (
    <PageShell>
      <section data-nav="dark" className="relative isolate overflow-hidden bg-night pt-40 pb-24 text-snow md:pt-48 md:pb-32">
        <div className="pointer-events-none absolute top-[-200px] left-1/2 -z-10 h-[460px] w-[900px] -translate-x-1/2 rounded-full bg-[rgb(255_201_148/0.12)] blur-[110px]" />
        <div className="grid-fade pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto max-w-[720px] px-5 text-center sm:px-8">
          <Suspense fallback={<Status kind="loading" />}>
            <Resolved searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
      <Install cta={false} id="setup" />
    </PageShell>
  );
}

async function Resolved({ searchParams }: { searchParams: PageProps<"/success">["searchParams"] }) {
  const sp = await searchParams;
  const checkoutId = typeof sp.checkout_id === "string" ? sp.checkout_id : undefined;
  const state = await purchaseState(checkoutId);
  if (state.kind === "paid") return <Status kind="paid" checkoutId={checkoutId!} email={state.email} />;
  if (state.kind === "processing") return <Status kind="processing" />;
  return <Status kind="invalid" />;
}

function Status(
  props:
    | { kind: "loading" }
    | { kind: "processing" }
    | { kind: "invalid" }
    | { kind: "paid"; checkoutId: string; email: string | null },
) {
  if (props.kind === "paid") {
    return (
      <>
        <Badge />
        <h1 className="display mt-7 text-[clamp(2.4rem,5.4vw,4rem)]">
          You&apos;re in. <span className="serif-accent text-mist">Thanks for buying Papr.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[46ch] text-[17px] leading-relaxed text-mist">
          Download the extension below, then follow the setup steps.
          {props.email && (
            <>
              {" "}
              Your receipt is on its way to <span className="text-snow">{props.email}</span>.
            </>
          )}
        </p>
        <div className="mt-9 flex flex-col items-center gap-4">
          <GlowButton href={`/portal?checkout_id=${encodeURIComponent(props.checkoutId)}`} size="lg">
            Download Papr
          </GlowButton>
          <p className="max-w-[48ch] text-[13px] text-fog">
            Opens your Polar customer portal, where the download lives. Need it again later? Use{" "}
            <a href="/portal" className="text-mist underline decoration-white/20 underline-offset-4 hover:text-snow">
              Re-download
            </a>{" "}
            and sign in with the email you paid with.
          </p>
        </div>
      </>
    );
  }
  if (props.kind === "processing") {
    return (
      <>
        <Spinner />
        <h1 className="display mt-7 text-[clamp(2.2rem,5vw,3.5rem)]">Confirming your payment…</h1>
        <p className="mx-auto mt-5 max-w-[44ch] text-[17px] leading-relaxed text-mist">
          This usually takes a few seconds. The page refreshes on its own.
        </p>
        <AutoRefresh every={3000} />
      </>
    );
  }
  if (props.kind === "loading") {
    return (
      <>
        <Spinner />
        <h1 className="display mt-7 text-[clamp(2.2rem,5vw,3.5rem)]">Checking your purchase…</h1>
      </>
    );
  }
  return (
    <>
      <h1 className="display text-[clamp(2.2rem,5vw,3.5rem)]">
        We couldn&apos;t find that purchase. <span className="serif-accent text-mist">Let&apos;s sort it out.</span>
      </h1>
      <p className="mx-auto mt-5 max-w-[48ch] text-[17px] leading-relaxed text-mist">
        If you&apos;ve already paid, sign in to the customer portal with the email you used at checkout to download
        Papr.
      </p>
      <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <GlowButton href="/portal">Open customer portal</GlowButton>
        <a
          href={site.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14.5px] font-medium text-snow/85 hover:text-snow"
        >
          Contact me on LinkedIn
        </a>
      </div>
    </>
  );
}

function Badge() {
  return (
    <span className="mx-auto grid size-14 place-items-center rounded-full bg-[linear-gradient(180deg,#ffdebd,#ffb877)] text-ink shadow-[0_0_40px_rgb(255_201_148/0.45)]">
      <Check className="size-6" />
    </span>
  );
}

function Spinner() {
  return (
    <span className="mx-auto block size-12 animate-spin rounded-full border-2 border-white/10 border-t-peach" aria-hidden />
  );
}
