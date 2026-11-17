import type { Metadata } from "next";
import { LegalPage } from "@/components/page-shell";
import { legal } from "@/lib/legal";

export const metadata: Metadata = { title: "Refunds - Papr" };

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function RefundsPage() {
  return (
    <LegalPage
      active="refunds"
      title="Refund Policy"
      intro={`If Papr isn't right for you, ask for a refund within ${legal.refundDays} days of your purchase and you'll get your money back. No questions asked.`}
      updated={legal.updated}
      sections={[
        {
          id: "how",
          title: "How to ask",
          body: (
            <p>
              Message us on <a href={legal.contactUrl} {...ext}>LinkedIn</a> with the email address you used at
              checkout. Refunds are issued through <a href="https://polar.sh" {...ext}>Polar</a>, our merchant of record,
              to your original payment method. Depending on your bank, it can take 5 to 10 business days to appear.
            </p>
          ),
        },
        {
          id: "after-refund",
          title: "After a refund",
          body: (
            <p>
              Once refunded, your access to downloads in the customer portal ends and you agree to remove Papr from your
              browser. Copy any notes you want to keep first, because removing the extension deletes them.
            </p>
          ),
        },
        {
          id: "late",
          title: `After ${legal.refundDays} days`,
          body: (
            <p>
              We can&apos;t usually refund older purchases, but if something is broken, get in touch. We&apos;d rather
              fix it, and we&apos;ll be fair about it. This doesn&apos;t affect any statutory rights you have where you
              live.
            </p>
          ),
        },
      ]}
    />
  );
}
