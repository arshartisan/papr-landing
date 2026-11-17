/**
 * Papr is sold as a one-time purchase through Polar: pay once, download the
 * extension, keep it forever. The price includes 6 months of updates.
 *
 * The price shown here must match the Polar product (POLAR_PRODUCT_ID).
 * Change it in src/lib/site.ts.
 */
import { site } from "./site";

export const plan = {
  name: "Papr",
  price: site.price,
  blurb: "Every feature. One payment. Yours to keep.",
  updatesMonths: 6,
  cta: "Buy & download",
  features: [
    "Unlimited local notes",
    "Headings, lists and checklists",
    "Markdown and keyboard shortcuts",
    "1–4 columns side by side",
    "4 bundled fonts, light & dark",
    "Sync between open tabs",
    "Works offline, no account",
    "6 months of free updates",
  ],
};
