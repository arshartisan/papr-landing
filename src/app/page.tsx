import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Bento } from "@/components/bento";
import { Shortcuts } from "@/components/shortcuts";
import { Install } from "@/components/install";
import { Pricing } from "@/components/pricing";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Bento />
        <Shortcuts />
        <Install />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
