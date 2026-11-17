import { NextRequest, NextResponse } from "next/server";
import { hostedPortalUrl, polarClient, polarConfigured } from "@/lib/polar";

/**
 * GET /portal?checkout_id=…  → a fresh, signed-in Polar customer portal session
 *                              for the buyer of that (succeeded) checkout, where
 *                              the Papr download lives.
 * GET /portal                → Polar's hosted portal (sign in by email) for re-downloads.
 */
export async function GET(req: NextRequest) {
  const fallback = hostedPortalUrl() ?? new URL("/#pricing", req.url).toString();
  const checkoutId = req.nextUrl.searchParams.get("checkout_id");
  if (!checkoutId || !polarConfigured) return NextResponse.redirect(fallback);

  try {
    const polar = polarClient();
    const checkout = await polar.checkouts.get(checkoutId);
    if (
      checkout.status !== "succeeded" ||
      !checkout.customer_id ||
      checkout.product_id !== process.env.POLAR_PRODUCT_ID
    ) {
      return NextResponse.redirect(fallback);
    }
    const session = await polar.customerSessions.create({
      customer_id: checkout.customer_id,
      return_url: `${req.nextUrl.origin}/success?checkout_id=${encodeURIComponent(checkoutId)}`,
    });
    return NextResponse.redirect(session.customer_portal_url);
  } catch {
    return NextResponse.redirect(fallback);
  }
}
