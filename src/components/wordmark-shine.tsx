"use client";

import { useEffect, useRef } from "react";

/**
 * Giant footer wordmark whose shine follows the pointer while it's over the
 * footer panel. Touch devices (no hover) keep the automatic sweep from CSS.
 */
export function WordmarkShine({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const area = el?.closest("footer");
    if (!el || !area || !matchMedia("(hover: hover)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      el.style.setProperty("--shine", "1");
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const leave = () => el.style.setProperty("--shine", "0");

    el.dataset.pointer = "";
    area.addEventListener("pointermove", move);
    area.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="wf-mark relative select-none">
      <span className="wf-mark__glow">{text}</span>
      <span className="wf-mark__fill">{text}</span>
      <span className="wf-mark__sweep">{text}</span>
      <span className="wf-mark__shine">{text}</span>
    </div>
  );
}
