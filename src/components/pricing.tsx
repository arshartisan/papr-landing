"use client";

import { motion } from "motion/react";
import { plan } from "@/lib/pricing";
import { site } from "@/lib/site";
import { ArrowUpRight, Check } from "./icons";
import { SectionHead } from "./reveal";

const ease = [0.16, 1, 0.3, 1] as const;

export function Pricing() {
  return (
    <section id="pricing" data-nav="dark" className="relative isolate overflow-hidden bg-night py-28 text-snow md:py-36">
      <div className="pointer-events-none absolute top-[-180px] left-1/2 -z-10 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[rgb(255_201_148/0.13)] blur-[110px]" />
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <SectionHead
            dark
            center
            eyebrow="Pricing"
            title={
              <>
                One price. <span className="serif-accent text-mist">Yours to keep.</span>
              </>
            }
            sub={`Pay $${plan.price} once and get every feature. No subscription, no account, no tiers.`}
          />
        </div>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease }}
          className="relative mx-auto mt-14 grid max-w-[920px] overflow-hidden rounded-3xl border border-peach/25 bg-[linear-gradient(180deg,#0f3a34_0%,#082824_70%)] shadow-[0_30px_80px_-30px_rgb(255_201_148/0.25)] md:grid-cols-[1fr_1.1fr]"
        >
          <div className="pointer-events-none absolute -top-16 left-1/4 h-32 w-1/2 -translate-x-1/2 rounded-full bg-peach/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-peach to-transparent" />

          {/* price + CTA */}
          <div className="relative flex flex-col p-8 md:p-10">
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-medium tracking-[-0.02em]">{plan.name}</h3>
              <span className="rounded-full border border-peach/30 bg-peach/10 px-2.5 py-1 text-[11px] font-medium text-peach">
                One-time
              </span>
            </div>
            <p className="mt-1.5 text-[14px] text-mist">{plan.blurb}</p>

            <div className="mt-10 flex items-end gap-2">
              <span className="mb-[0.55rem] text-[22px] text-mist">$</span>
              <span className="text-[4rem] leading-none font-medium tracking-[-0.05em] tabular-nums">{plan.price}</span>
              <span className="mb-2 text-[14px] text-fog">USD</span>
            </div>
            <p className="mt-2 text-[13px] text-fog">One payment. Keep it forever.</p>

            <a
              href={site.checkoutUrl}
              // TODO(polar): Polar checkout link
              className="group mt-8 inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-peach text-[15px] font-semibold text-ink transition-colors hover:bg-[#ffe8d2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach md:mt-auto"
            >
              {plan.cta}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <p className="mt-4 text-center text-[12.5px] text-fog">Instant download · Secure checkout by Polar</p>
          </div>

          {/* included */}
          <div className="relative border-t border-white/8 p-8 md:border-t-0 md:border-l md:p-10">
            <p className="font-mono text-[11px] tracking-[0.12em] text-fog uppercase">Everything included</p>
            <ul className="mt-5 space-y-3.5">
              {plan.features.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease, delay: 0.2 + i * 0.04 }}
                  className="flex items-start gap-3 text-[14.5px] text-snow/85"
                >
                  <span className="mt-0.5 grid size-[18px] flex-none place-items-center rounded-full bg-[linear-gradient(180deg,#ffdebd,#ffb877)] text-ink shadow-[0_0_12px_rgb(255_201_148/0.45)]">
                    <Check className="size-2.5" />
                  </span>
                  {f}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.article>

        <p className="mt-10 text-center text-[13px] text-fog">
          Price in USD. Taxes calculated at checkout. After {plan.updatesMonths} months your copy keeps working; you just
          stop receiving new versions.
        </p>
      </div>
    </section>
  );
}
