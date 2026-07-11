import { createFileRoute } from "@tanstack/react-router";
import { EditorialEyebrow, Folio, HorizontalRule } from "@/components/editorial/primitives";
import { SITE } from "@/config/brand";

const now = () => new Date().toISOString().slice(0, 10);
function LegalShell({ title, kicker, children }: { title: string; kicker: string; children: React.ReactNode }) {
  return (
    <section className="bg-bone paper-grain pt-24 pb-32">
      <div className="editorial-main">
        <div className="flex items-baseline justify-between">
          <EditorialEyebrow>{kicker}</EditorialEyebrow>
          <Folio>THE BORING DIET · LEGAL</Folio>
        </div>
        <h1 className="mt-6 h-chapter">{title}<span className="text-gold">.</span></h1>
        <p className="mt-6 mono-label text-stone-dark">THIS DOCUMENT IS A TEMPLATE. IT IS NOT LEGAL ADVICE.</p>
        <HorizontalRule className="mt-8" />
        <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed">{children}</div>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: "Refunds — The Boring Diet" },
      { name: "description", content: "Refund policy for The Boring Diet digital publication and applicable consumer withdrawal rights." },
      { property: "og:title", content: "Refunds — The Boring Diet" },
      { property: "og:url", content: "/refunds" },
    ],
    links: [{ rel: "canonical", href: "/refunds" }],
  }),
  component: () => (
    <LegalShell title="Refund Policy" kicker="REFUNDS">
      <p><em>Last updated: {now()}.</em></p>
      <p>
        The Boring Diet is a digital publication delivered immediately after purchase. By starting the download you
        expressly consent to immediate delivery, which — under many jurisdictions — waives the standard consumer
        withdrawal period for digital content.
      </p>
      <h2 className="font-display text-2xl pt-6">Discretionary refunds</h2>
      <p>
        We may, at our discretion, grant a refund within 14 days of purchase where the file could not be delivered
        or was materially defective. [REFUND CONDITIONS]. Requests: {SITE.supportEmail}.
      </p>
      <h2 className="font-display text-2xl pt-6">Statutory rights</h2>
      <p>
        Nothing in this policy limits any statutory rights you may have that cannot be excluded by contract. See
        [CONSUMER WITHDRAWAL LANGUAGE] for jurisdiction-specific rights.
      </p>
      <h2 className="font-display text-2xl pt-6">Processed by Polar</h2>
      <p>
        Because Polar is the merchant of record, approved refunds are issued through Polar back to the original
        payment method.
      </p>
    </LegalShell>
  ),
});
