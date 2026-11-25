/**
 * Time-boxed sale. The discount itself lives in Polar (a discount code on the
 * Papr product). The site reads that code from Polar to work out the sale price,
 * so the page always matches checkout; this file says which code to use, how to
 * label it, and when it ends. Everything switches off by itself at `endsAt`.
 *
 * Keep `endsAt` identical to the code's "Ends at" in Polar.
 */
export const deal = {
  name: "Black Friday",
  code: "BLACKFRIDAY",
  /** Exclusive end: the deal is live until this instant. */
  endsAt: "2026-11-30T18:30:00Z", // = Dec 1 00:00 in Sri Lanka (UTC+5:30), same as Polar
  /** Human label for the last day of the deal. */
  lastDay: "Mon Nov 30",
  /** Only used when Polar isn't configured (local preview). The real price comes from Polar. */
  previewPrice: 5.5,
};

export const dealEndsAtMs = Date.parse(deal.endsAt);

export function isDealLive(now: number) {
  return now < dealEndsAtMs;
}
