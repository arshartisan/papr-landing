import { cacheLife, cacheTag } from "next/cache";
import { polarClient, polarConfigured } from "./polar";
import { site } from "./site";
import { formatPrice } from "./format-price";
import { deal, isDealLive } from "./deal";

export type Deal = {
  name: string;
  code: string;
  amount: number;
  label: string;
  endsAt: string;
  lastDay: string;
};

export type Price = { amount: number; currency: string; label: string; deal?: Deal };

type Base = Omit<Price, "deal">;

/** How much the sale code takes off, as Polar will apply it. */
type Off = { kind: "fixed"; amount: number; currency: string } | { kind: "percent"; basisPoints: number };

/**
 * Look the sale code up in Polar so the site shows exactly what checkout will charge.
 * Returns null when the code doesn't exist, isn't active right now, is used up, or
 * can't be read (the token needs the `discounts:read` scope).
 */
async function polarDiscount(code: string, now: number): Promise<Off | null> {
  try {
    // Polar's `query` filter matches discount names, not codes, so list and match the code here.
    const { items } = await polarClient().discounts.list({ limit: 100 });
    const d = items.find((x) => x.code?.toUpperCase() === code.toUpperCase());
    const skip = (why: string) => {
      console.warn(`[papr] not showing the "${code}" sale: ${why}`);
      return null;
    };
    if (!d) return skip("no discount with that code in Polar");
    if (d.starts_at && Date.parse(d.starts_at) > now) return skip(`it starts at ${d.starts_at}`);
    if (d.ends_at && Date.parse(d.ends_at) <= now) return skip(`it ended at ${d.ends_at}`);
    if (d.max_redemptions != null && d.redemptions_count >= d.max_redemptions) return skip("it's used up");
    const pid = process.env.POLAR_PRODUCT_ID;
    if (d.products.length > 0 && !d.products.some((p) => p.id === pid)) return skip("it isn't valid for this product");
    if ("basis_points" in d) return { kind: "percent", basisPoints: d.basis_points };
    if ("amount" in d) return { kind: "fixed", amount: d.amount / 100, currency: d.currency };
    return null;
  } catch (e) {
    console.warn("[papr] Polar discount lookup failed, not showing the sale:", (e as Error)?.message);
    return null;
  }
}

/** Attach the running sale, if any, priced from the real Polar discount. */
async function withDeal(price: Base): Promise<Price> {
  const now = Date.now();
  if (!isDealLive(now)) return price;

  let amount: number;
  if (polarConfigured) {
    const off = await polarDiscount(deal.code, now);
    if (!off) return price;
    if (off.kind === "fixed" && off.currency.toLowerCase() !== price.currency.toLowerCase()) return price;
    amount =
      off.kind === "fixed"
        ? price.amount - off.amount
        : price.amount * (1 - off.basisPoints / 10_000);
    amount = Math.round(amount * 100) / 100;
  } else {
    // Local preview without Polar: use the configured preview price.
    amount = deal.previewPrice;
  }
  if (!(amount > 0 && amount < price.amount)) return price;

  return {
    ...price,
    deal: {
      name: deal.name,
      code: deal.code,
      amount,
      label: formatPrice(amount, price.currency),
      endsAt: deal.endsAt,
      lastDay: deal.lastDay,
    },
  };
}

const fallbackBase = (): Base => ({ amount: site.price, currency: "usd", label: formatPrice(site.price) });

/**
 * The live price of the Papr product, read from Polar so that changing the
 * price in the Polar dashboard updates the site too. Cached for a minute or so;
 * falls back to `site.price` if Polar isn't configured or can't be reached.
 */
export async function getPrice(): Promise<Price> {
  "use cache";
  cacheLife("minutes");
  cacheTag("polar-price");

  if (!polarConfigured) return withDeal(fallbackBase());
  let base = fallbackBase();
  try {
    const product = await polarClient().products.get(process.env.POLAR_PRODUCT_ID!);
    const p = product.prices.find(
      (x) => !x.is_archived && "amount_type" in x && x.amount_type === "fixed" && "price_amount" in x,
    ) as { price_amount: number; price_currency: string } | undefined;
    if (p) {
      const amount = p.price_amount / 100;
      base = { amount, currency: p.price_currency, label: formatPrice(amount, p.price_currency) };
    }
  } catch (e) {
    // Usually a missing `products:read` scope on the access token.
    console.warn("[papr] Polar price lookup failed, using fallback:", (e as Error)?.message);
  }
  return withDeal(base);
}
