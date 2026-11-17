"use client";

import { createContext, useContext } from "react";
import type { Price } from "@/lib/price";
import { site } from "@/lib/site";

const PriceContext = createContext<Price>({ amount: site.price, currency: "usd", label: `$${site.price}` });

/** Makes the live Polar price available to client components. */
export function PriceProvider({ price, children }: { price: Price; children: React.ReactNode }) {
  return <PriceContext.Provider value={price}>{children}</PriceContext.Provider>;
}

export const usePrice = () => useContext(PriceContext);
