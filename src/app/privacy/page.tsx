import type { Metadata } from "next";
import { LegalPage } from "@/components/page-shell";
import { legal } from "@/lib/legal";

export const metadata: Metadata = { title: "Privacy - Papr" };

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function PrivacyPage() {
  return (
    <LegalPage
      active="privacy"
      title="Privacy Policy"
      intro="Papr is built to know as little about you as possible. This policy explains what data exists, where it lives, and who can see it."
      updated={legal.updated}
      sections={[
        {
          id: "extension",
          title: "The extension",
          body: (
            <>
              <p>
                The Papr extension makes no network requests. It has no account, no sync server, no analytics and no
                tracking. Your notes, settings and window layout are stored in your browser&apos;s local storage on your
                device, and never leave it. We cannot see, recover or delete your notes.
              </p>
              <p>Removing the extension from your browser deletes the notes it stored. Keep that in mind before uninstalling.</p>
            </>
          ),
        },
        {
          id: "website",
          title: "This website",
          body: (
            <p>
              This website does not use cookies, analytics or advertising trackers, and it loads its fonts from our own
              server. Like any website, our hosting provider may keep standard server logs (such as IP address, browser
              type and pages requested) for security and reliability. We don&apos;t use them to identify or profile
              visitors.
            </p>
          ),
        },
        {
          id: "purchases",
          title: "Purchases",
          body: (
            <>
              <p>
                Payments are handled by <a href="https://polar.sh" {...ext}>Polar</a>, who acts as the merchant of
                record. Polar collects the details needed to process your payment, calculate tax and send your receipt,
                such as your name, email address, billing country and payment details, under{" "}
                <a href="https://polar.sh/legal/privacy" {...ext}>Polar&apos;s privacy policy</a>. We never see your full
                card details.
              </p>
              <p>
                Polar shares order information with us (your name, email address, country and what you bought) so we can
                deliver your download, handle refunds and answer support questions. We don&apos;t sell this information
                or use it for marketing without your consent.
              </p>
            </>
          ),
        },
        {
          id: "rights",
          title: "Your rights",
          body: (
            <p>
              You can ask us what purchase information we hold about you, or ask us to correct or delete it, subject to
              any records we must keep for tax and accounting. Contact us using the details below.
            </p>
          ),
        },
        {
          id: "changes",
          title: "Changes to this policy",
          body: (
            <p>
              If we change how Papr handles data, we&apos;ll update this page and the date at the top. The extension
              will never start sending your notes anywhere without a clear, opt-in change.
            </p>
          ),
        },
        {
          id: "contact",
          title: "How to contact us",
          body: (
            <p>
              Questions about privacy? Reach us on <a href={legal.contactUrl} {...ext}>LinkedIn</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
