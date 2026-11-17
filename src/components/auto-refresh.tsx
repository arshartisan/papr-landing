"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Re-renders the server page every `every` ms (stops after ~1 minute). */
export function AutoRefresh({ every }: { every: number }) {
  const router = useRouter();
  useEffect(() => {
    let n = 0;
    const id = setInterval(() => {
      if (++n > 20) return clearInterval(id);
      router.refresh();
    }, every);
    return () => clearInterval(id);
  }, [router, every]);
  return null;
}
