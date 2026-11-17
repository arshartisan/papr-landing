import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/page-shell";
import { legal } from "@/lib/legal";
import { plan } from "@/lib/pricing";
import { getPrice } from "@/lib/price";

export const metadata: Metadata = { title: "Terms - Papr" };

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export default async function TermsPage() {
  const price = await getPrice();
  return (
    <LegalPage
      active="terms"
      title="Terms of Sale"
      intro="These terms apply when you buy and use Papr, a notepad extension for Chromium-based browsers. By buying or using Papr you agree to them."
      updated={legal.updated}
      sections={[
        {
          id: "purchase",
          title: "Purchase",
          body: (
            <p>
              Papr costs a one-time payment of {price.label} {price.currency.toUpperCase()} (plus any applicable taxes). There is no subscription
              and nothing renews. Orders are processed by <a href="https://polar.sh" {...ext}>Polar</a>, our merchant of
              record, which also handles payment, tax and invoicing. Polar&apos;s own{" "}
              <a href="https://polar.sh/legal/terms" {...ext}>terms</a> apply to the payment.
            </p>
          ),
        },
        {
          id: "delivery",
          title: "Delivery",
          body: (
            <p>
              After payment you get access to the Papr download through Polar&apos;s customer portal, and you can
              re-download it there using the email address you paid with. Papr is installed manually by loading it as an
              unpacked extension in your browser, as described in our <Link href="/#install">install guide</Link>.
            </p>
          ),
        },
        {
          id: "updates",
          title: "Updates",
          body: (
            <p>
              Your purchase includes every version of Papr released within {plan.updatesMonths} months of your order
              date. After that period the version you have keeps working with no time limit; you simply stop receiving
              new versions.
            </p>
          ),
        },
        {
          id: "licence",
          title: "Licence",
          body: (
            <p>
              We grant you a personal, non-transferable licence to install and use Papr on browsers and devices you own
              or control. You may not resell, redistribute or publicly share the Papr download or its source, or present
              it as your own work.
            </p>
          ),
        },
        {
          id: "notes",
          title: "Your notes",
          body: (
            <p>
              Your notes are stored only in your browser, on your device. We have no copy of them and cannot recover
              them. You are responsible for keeping copies of anything important. Removing the extension, clearing your
              browser&apos;s site data or resetting your browser can permanently delete your notes.
            </p>
          ),
        },
        {
          id: "refunds",
          title: "Refunds",
          body: (
            <p>
              See our <Link href="/refunds">Refund Policy</Link>.
            </p>
          ),
        },
        {
          id: "warranty",
          title: "No warranty",
          body: (
            <p>
              Papr is provided &ldquo;as is&rdquo;. We work hard to make it reliable, but we don&apos;t guarantee it
              will be error-free, will work with every browser version, or will never lose data. Browser makers can
              change how extensions work at any time.
            </p>
          ),
        },
        {
          id: "liability",
          title: "Limitation of liability",
          body: (
            <p>
              To the extent the law allows, our total liability for any claim relating to Papr is limited to the amount
              you paid for it, and we are not liable for indirect or consequential losses, including lost notes or lost
              data. Nothing in these terms limits rights you have under consumer protection laws that cannot be
              excluded.
            </p>
          ),
        },
        {
          id: "changes",
          title: "Changes to these terms",
          body: <p>We may update these terms. The version in effect when you bought Papr applies to that purchase.</p>,
        },
        {
          id: "contact",
          title: "How to contact us",
          body: (
            <p>
              Questions? Reach us on <a href={legal.contactUrl} {...ext}>LinkedIn</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
