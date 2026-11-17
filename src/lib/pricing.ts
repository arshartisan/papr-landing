/**
 * Papr is sold as a one-time purchase through Polar: pay once, download the
 * extension, keep it forever. The price includes 6 months of updates.
 *
 * The price itself is read live from the Polar product (src/lib/price.ts).
 */
export const plan = {
  name: "Papr",
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
