type P = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const Windows = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M3 5.4 10.4 4.4v7.1H3V5.4Zm0 13.2 7.4 1v-7H3v6Zm8.3 1.1L21 21V12.6h-9.7v7.1Zm0-15.4v7.2H21V3l-9.7 1.3Z" />
  </svg>
);
export const Apple = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M16.37 12.67c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.6 1.1 8.75.73 1.05 1.6 2.24 2.73 2.2 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.4 1.2-2.46-.03-.01-2.3-.88-2.32-3.5ZM14.2 6.21c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.68-.92 2.67.97.08 1.96-.49 2.56-1.22Z" />
  </svg>
);
export const Polar = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden className={className}>
    <circle cx="12" cy="12" r="9.75" />
    <ellipse cx="12" cy="12" rx="4.6" ry="9.75" />
    <path d="M12 2.25v19.5" />
  </svg>
);
export const ArrowUpRight =({ className }: P) => (
  <svg {...base} className={className}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const ArrowRight = ({ className }: P) => (
  <svg {...base} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const Check = ({ className }: P) => (
  <svg {...base} strokeWidth={2.25} className={className}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const Plus = ({ className }: P) => (
  <svg {...base} className={className}><path d="M12 5v14M5 12h14" /></svg>
);
export const Lock = ({ className }: P) => (
  <svg {...base} className={className}><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg>
);
export const Sidebar = ({ className }: P) => (
  <svg {...base} className={className}><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><path d="M9.5 4.5v15" /></svg>
);
export const Sun = ({ className }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const Moon = ({ className }: P) => (
  <svg {...base} className={className}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>
);

/** Column-layout glyphs copied from the extension's top bar */
export const Cols = ({ n, className }: P & { n: 1 | 2 | 3 | 4 }) => {
  const lines = { 1: "", 2: "M12 4.5v15", 3: "M9.2 4.5v15M14.8 4.5v15", 4: "M7.75 4.5v15M12 4.5v15M16.25 4.5v15" }[n];
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      {lines && <path d={lines} />}
    </svg>
  );
};

/** Toolbar-rail glyphs from the extension */
export const Bold = ({ className }: P) => (
  <svg {...base} className={className}><path d="M7 5h6.5a3.5 3.5 0 0 1 0 7H7zM7 12h7.5a3.5 3.5 0 0 1 0 7H7z" /></svg>
);
export const Italic = ({ className }: P) => (
  <svg {...base} className={className}><path d="M10 5h8M6 19h8M14.5 5l-5 14" /></svg>
);
export const Bullets = ({ className }: P) => (
  <svg {...base} className={className}><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth={2.6} /></svg>
);
export const Checklist = ({ className }: P) => (
  <svg {...base} className={className}><rect x="3.5" y="4" width="6" height="6" rx="1.5" /><path d="M3.5 16.5l2 2 3.5-4M13 7h7.5M13 17h7.5" /></svg>
);
