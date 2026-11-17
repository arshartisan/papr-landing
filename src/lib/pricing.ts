/**
 * Papr is sold as a one-time purchase through Polar: pay once, download the
 * extension, keep it forever. The price includes 6 months of updates.
 *
 * TODO(polar): set `site.checkoutUrl` to the Polar checkout link for this product
 * (one-time price, with a File Downloads benefit holding the extension zip).
 */
export const plan = {
  name: "Papr",
  price: 20,
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
