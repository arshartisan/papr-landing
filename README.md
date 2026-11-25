# Papr — landing site

Next.js 16 (App Router, Cache Components) · Tailwind v4 · Motion · Lenis · Polar.

```bash
npm install
cp .env.example .env.local   # fill in Polar values
npm run dev
```

## Selling with Polar

Papr is sold as a **one-time $7 purchase**. Polar is the merchant of record: it runs checkout,
tax, receipts and delivers the download.

1. In Polar (start in the **sandbox**: https://sandbox.polar.sh), create a product:
   - Name `Papr`, **one-time** price **$7**.
   - Add a **File Downloads** benefit and upload the extension zip (`papr.zip`, the `extension/` folder).
2. Settings → Developers → create an **organization access token**.
3. Fill `.env.local`:

   | Var | Value |
   |---|---|
   | `POLAR_SERVER` | `sandbox` while testing, `production` when live |
   | `POLAR_ACCESS_TOKEN` | the token from step 2 (sandbox and production tokens differ) |
   | `POLAR_PRODUCT_ID` | the product id from step 1 |
   | `POLAR_ORG_ID` | your organization id (the site looks up its slug for the "Re-download" portal link) |

4. Test a purchase with Stripe's test card `4242 4242 4242 4242` in the sandbox.
5. To go live, recreate the product in production Polar, switch the env vars, redeploy.

### Flow

| Route | What it does |
|---|---|
| `/checkout` | Creates a Polar checkout for `POLAR_PRODUCT_ID` and redirects to it. Supports `?discount_code=CODE`. Falls back to `/checkout/unavailable` if Polar isn't configured or errors. |
| `/success?checkout_id=…` | Verifies the checkout with Polar. Paid → "Download Papr" button + setup guide. Still confirming → auto-refreshes. Anything else → help screen. |
| `/portal?checkout_id=…` | Opens a signed-in Polar customer portal for that buyer, where the download lives. |
| `/portal` | Polar's hosted portal (sign in by email) for re-downloads. |
| `/privacy`, `/terms`, `/refunds` | Legal pages. **Templates — review before launch** (`src/lib/legal.ts` holds the date and refund window). |

### Running a sale

`src/lib/deal.ts` holds the current sale (code, sale price, end time, price afterwards).
While it's live the site shows the sale price (worked out from the Polar product price and the
discount code, so it always matches checkout), a countdown on the pricing card, a sale pill in the
hero and a sale share image, and `/checkout` applies the code automatically. If the discount can't
be read from Polar (the token needs `products:read` and `discounts:read`), no sale price is shown. If Polar rejects the code, checkout continues at the regular price. Everything turns
off by itself at `endsAt` (pages refresh every minute).

The discount itself is a Polar discount code on the product. Keep its "Ends at" equal to `endsAt`.
The price shown as "then …" is the product's regular price in Polar.

### Shipping an update

Upload the new zip to the File Downloads benefit in Polar. Buyers get it from the portal.
Purchases include 6 months of updates; Polar won't enforce that window by itself.
