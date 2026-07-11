import { createFileRoute } from "@tanstack/react-router";
import { EditorialEyebrow, Folio, HorizontalRule } from "@/components/editorial/primitives";
import { SITE, BRAND } from "@/config/brand";

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
        <p className="mt-6 mono-label text-stone-dark">
          THIS DOCUMENT IS A TEMPLATE. IT IS NOT LEGAL ADVICE.
        </p>
        <HorizontalRule className="mt-8" />
        <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed">{children}</div>
        <div className="mt-16 mono-label text-stone-dark">
          {BRAND.name.toUpperCase()} · PUBLISHED BY {SITE.legalName.toUpperCase()}
        </div>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Sale — The Boring Diet" },
      { name: "description", content: "Terms of sale and use for The Boring Diet digital publication." },
      { property: "og:title", content: "Terms of Sale — The Boring Diet" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <LegalShell title="Terms of Sale and Use" kicker="TERMS">
      <p><em>Last updated: {now()}.</em></p>
      <p>
        By purchasing or downloading {BRAND.name}, you agree to these terms. {SITE.legalName} publishes the
        product; Polar Software Inc. processes payment as merchant of record.
      </p>
      <h2 className="font-display text-2xl pt-6">The product</h2>
      <p>A single one-time digital publication: a 36-page PDF describing a bounded 14-day eating experiment. No subscription. No renewal.</p>
      <h2 className="font-display text-2xl pt-6">License</h2>
      <p>You receive a personal, non-transferable, non-exclusive license to read and print the PDF for your own use. You may not resell, redistribute or publicly host the PDF or any substantial portion of its contents.</p>
      <h2 className="font-display text-2xl pt-6">Not medical advice</h2>
      <p>The product provides general educational information. It is not medical advice, diagnosis or treatment. See the <a className="underline" href="/disclaimer">Disclaimer</a> and <a className="underline" href="/safety">Safety Notice</a>.</p>
      <h2 className="font-display text-2xl pt-6">Age</h2>
      <p>You must be 18 or older to purchase.</p>
      <h2 className="font-display text-2xl pt-6">Refunds</h2>
      <p>See the <a className="underline" href="/refunds">Refund Policy</a>.</p>
      <h2 className="font-display text-2xl pt-6">Governing law</h2>
      <p>These terms are governed by the laws of {SITE.governingLaw}.</p>
    </LegalShell>
  ),
});
