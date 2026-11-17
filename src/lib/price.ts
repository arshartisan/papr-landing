import { cacheLife, cacheTag } from "next/cache";
import { polarClient, polarConfigured } from "./polar";
import { site } from "./site";
import { formatPrice } from "./format-price";

export type Price = { amount: number; currency: string; label: string };

const fallback = (): Price => ({ amount: site.price, currency: "usd", label: formatPrice(site.price) });

/**
 * The live price of the Papr product, read from Polar so that changing the
 * price in the Polar dashboard updates the site too. Cached for a few minutes;
 * falls back to `site.price` if Polar isn't configured or can't be reached.
 */
export async function getPrice(): Promise<Price> {
  "use cache";
  cacheLife("minutes");
  cacheTag("polar-price");

  if (!polarConfigured) return fallback();
  try {
    const product = await polarClient().products.get(process.env.POLAR_PRODUCT_ID!);
    const p = product.prices.find(
      (x) => !x.is_archived && "amount_type" in x && x.amount_type === "fixed" && "price_amount" in x,
    ) as { price_amount: number; price_currency: string } | undefined;
    if (!p) return fallback();
    const amount = p.price_amount / 100;
    return { amount, currency: p.price_currency, label: formatPrice(amount, p.price_currency) };
  } catch (e) {
    // Usually a missing `products:read` scope on the access token.
    console.warn("[papr] Polar price lookup failed, using fallback:", (e as Error)?.message);
    return fallback();
  }
}
