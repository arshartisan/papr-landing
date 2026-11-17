import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Inter, Source_Code_Pro } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { site } from "@/lib/site";
import { getPrice } from "@/lib/price";
import { PriceProvider } from "@/components/price-context";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});
// Used only to preview the fonts Papr ships with
const inter = Inter({ variable: "--font-inter-v", subsets: ["latin"] });
const sourceCode = Source_Code_Pro({ variable: "--font-source-code", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} - ${site.tagline}`,
  description: site.description,
  openGraph: {
    title: `${site.name} - ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#031b18",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const price = await getPrice();
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable} ${inter.variable} ${sourceCode.variable} font-sans antialiased`}
    >
      <body>
        <PriceProvider price={price}>
          <SmoothScroll>{children}</SmoothScroll>
        </PriceProvider>
      </body>
    </html>
  );
}
