export const site = {
  name: "Papr",
  tagline: "Every new tab, a blank page",
  description:
    "Papr turns your browser's new tab into a quiet, instant notepad. No account, no cloud. Your notes stay on your device.",
  url: "https://papr-landing.vercel.app",
  // Polar checkout (see src/app/checkout/route.ts)
  checkoutUrl: "/checkout",
  price: 5,
  version: "1.5",
  social: { linkedin: "https://www.linkedin.com/in/muhammed-arshaq/" },
};

export const nav = [
  { label: "Features", href: "#features" },
  { label: "Shortcuts", href: "#shortcuts" },
  { label: "Install", href: "#install" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

/** Grouped site links, shared by the footer and the 404 page. */
export const linkGroups: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Shortcuts", href: "/#shortcuts" },
      { label: "Install guide", href: "/#install" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Get Papr",
    links: [
      { label: `Buy Papr - $${site.price}`, href: site.checkoutUrl },
      { label: "Re-download", href: "/portal" },
      { label: "Contact", href: site.social.linkedin, external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Sale", href: "/terms" },
      { label: "Refund Policy", href: "/refunds" },
    ],
  },
];
