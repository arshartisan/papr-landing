/** "$5", "$4.50", "€5" … (pure; safe for client components). Pass `cents` to force two decimals. */
export function formatPrice(amount: number, currency = "usd", cents = false) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: cents || !Number.isInteger(amount) ? 2 : 0,
  }).format(amount);
}

/** Splits "$5" into { symbol: "$", value: "5" } for the large pricing display. */
export function splitPrice(label: string) {
  const symbol = label.replace(/[\d.,\s]/g, "");
  return { symbol, value: label.replace(symbol, "").trim() };
}
