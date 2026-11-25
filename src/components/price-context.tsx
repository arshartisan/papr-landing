"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Deal, Price } from "@/lib/price";
import { site } from "@/lib/site";

const PriceContext = createContext<Price>({ amount: site.price, currency: "usd", label: `$${site.price}` });

/** Makes the live Polar price available to client components. */
export function PriceProvider({ price, children }: { price: Price; children: React.ReactNode }) {
  return <PriceContext.Provider value={price}>{children}</PriceContext.Provider>;
}

export const usePrice = () => useContext(PriceContext);

/**
 * The running sale, or undefined. The server only includes it while it's live;
 * this also drops it in the browser the moment it ends, for pages left open.
 */
export function useDeal(): Deal | undefined {
  const { deal } = usePrice();
  const [ended, setEnded] = useState(false);
  useEffect(() => {
    if (!deal) return;
    const left = Date.parse(deal.endsAt) - Date.now();
    if (left <= 0) {
      const id = requestAnimationFrame(() => setEnded(true));
      return () => cancelAnimationFrame(id);
    }
    // setTimeout caps at ~24.8 days; the deal is far shorter than that.
    const id = setTimeout(() => setEnded(true), Math.min(left, 2 ** 31 - 1));
    return () => clearTimeout(id);
  }, [deal]);
  return ended ? undefined : deal;
}

/** "2d 14h 03m" until `endsAt`; renders nothing on the server to avoid hydration drift. */
export function Countdown({ endsAt, className = "" }: { endsAt: string; className?: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = requestAnimationFrame(tick);
    const id = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(first);
      clearInterval(id);
    };
  }, []);
  if (now === null) return null;
  const left = Math.max(0, Date.parse(endsAt) - now);
  const d = Math.floor(left / 86_400_000);
  const h = Math.floor(left / 3_600_000) % 24;
  const m = Math.floor(left / 60_000) % 60;
  const s = Math.floor(left / 1000) % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className={`tabular-nums ${className}`} suppressHydrationWarning>
      {d > 0 ? `${d}d ${pad(h)}h ${pad(m)}m` : `${pad(h)}h ${pad(m)}m ${pad(s)}s`}
    </span>
  );
}
