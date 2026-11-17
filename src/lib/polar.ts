/**
 * Server-only Polar configuration. Never import this from a client component:
 * it reads the organization access token.
 *
 * Env (see .env.example):
 *   POLAR_ACCESS_TOKEN   organization access token (sandbox and production tokens differ)
 *   POLAR_PRODUCT_ID     the one-time "Papr" product, with a File Downloads benefit
 *   POLAR_SERVER         "sandbox" | "production" (default "sandbox")
 *   POLAR_ORG_ID         your Polar organization id (its slug is looked up for the re-download link)
 *   POLAR_ORG_SLUG       optional: set the slug directly instead of looking it up
 */
import { createPolar } from "@polar-sh/sdk/2026-10";

export const polarEnv = (process.env.POLAR_SERVER === "production" ? "production" : "sandbox") as
  | "production"
  | "sandbox";

export const polarConfigured = Boolean(process.env.POLAR_ACCESS_TOKEN && process.env.POLAR_PRODUCT_ID);

export function polarClient() {
  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  if (!accessToken) throw new Error("POLAR_ACCESS_TOKEN is not set");
  return createPolar({ accessToken, environment: polarEnv });
}

let cachedSlug: string | undefined;

/** Polar's hosted customer portal, where buyers sign in by email to re-download. */
export async function hostedPortalUrl(): Promise<string | null> {
  let slug = process.env.POLAR_ORG_SLUG || cachedSlug;
  if (!slug && process.env.POLAR_ORG_ID && process.env.POLAR_ACCESS_TOKEN) {
    try {
      slug = cachedSlug = (await polarClient().organizations.get(process.env.POLAR_ORG_ID)).slug;
    } catch {
      return null;
    }
  }
  if (!slug) return null;
  const host = polarEnv === "production" ? "https://polar.sh" : "https://sandbox.polar.sh";
  return `${host}/${slug}/portal`;
}

export type PurchaseState =
  | { kind: "paid"; email: string | null; name: string | null }
  | { kind: "processing" }
  | { kind: "invalid" };

/** Resolve a checkout id from the success redirect into what the page should show. */
export async function purchaseState(checkoutId: string | undefined): Promise<PurchaseState> {
  if (!checkoutId || !polarConfigured) return { kind: "invalid" };
  try {
    const checkout = await polarClient().checkouts.get(checkoutId);
    if (checkout.product_id !== process.env.POLAR_PRODUCT_ID) return { kind: "invalid" };
    if (checkout.status === "succeeded") {
      return { kind: "paid", email: checkout.customer_email, name: checkout.customer_name };
    }
    if (checkout.status === "confirmed") return { kind: "processing" };
    return { kind: "invalid" };
  } catch {
    return { kind: "invalid" };
  }
}
