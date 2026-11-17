import { Checkout } from "@polar-sh/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { polarConfigured, polarEnv } from "@/lib/polar";

/**
 * GET /checkout → Polar hosted checkout for the Papr product.
 * Polar redirects back to /success?checkout_id=… after payment.
 */
export async function GET(req: NextRequest) {
  const unavailable = NextResponse.redirect(new URL("/checkout/unavailable", req.url));
  if (!polarConfigured) return unavailable;

  const origin = req.nextUrl.origin;
  const handler = Checkout({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    successUrl: `${origin}/success`,
    returnUrl: `${origin}/#pricing`,
    environment: polarEnv,
    theme: "dark",
  });

  const url = new URL(req.url);
  url.search = "";
  url.searchParams.set("products", process.env.POLAR_PRODUCT_ID!);
  // Pass through an optional discount code: /checkout?discount_code=LAUNCH
  const discount = req.nextUrl.searchParams.get("discount_code");
  if (discount) url.searchParams.set("discount_code", discount);

  const res = await handler(new NextRequest(url, { headers: req.headers }));
  // The adapter answers failures with Response.error(); send people somewhere useful instead.
  return res.status >= 300 && res.status < 400 ? res : unavailable;
}
