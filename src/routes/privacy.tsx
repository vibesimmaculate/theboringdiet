import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { EditorialEyebrow, Folio, HorizontalRule } from "@/components/editorial/primitives";
import { SITE, BRAND } from "@/config/brand";

function LegalShell({ title, kicker, children }: { title: string; kicker: string; children: ReactNode }) {
  return (
    <section className="bg-bone paper-grain pt-24 pb-32">
      <div className="editorial-main">
        <div className="flex items-baseline justify-between">
          <EditorialEyebrow>{kicker}</EditorialEyebrow>
          <Folio>THE BORING DIET · LEGAL</Folio>
        </div>
        <h1 className="mt-6 h-chapter">{title}<span className="text-gold">.</span></h1>
        <p className="mt-6 mono-label text-stone-dark">
          THIS DOCUMENT IS A TEMPLATE. IT IS NOT LEGAL ADVICE. REVIEW WITH QUALIFIED COUNSEL BEFORE PUBLISHING TO LIVE CUSTOMERS.
        </p>
        <HorizontalRule className="mt-8" />
        <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed">{children}</div>
        <div className="mt-16 mono-label text-stone-dark">
          {BRAND.name.toUpperCase()} · PUBLISHED BY {SITE.legalName.toUpperCase()} · {SITE.legalAddress}
        </div>
      </div>
    </section>
  );
}

const now = () => new Date().toISOString().slice(0, 10);

export const PrivacyRoute = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — The Boring Diet" },
      { name: "description", content: "How The Boring Diet handles personal data, cookies, analytics and third-party processors." },
      { property: "og:title", content: "Privacy — The Boring Diet" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <LegalShell title="Privacy Notice" kicker="PRIVACY">
      <p><em>Last updated: {now()}.</em></p>
      <p>
        {SITE.legalName} operates {BRAND.name}. This notice describes how we handle personal data when you
        visit the website, purchase the digital publication, or contact support.
      </p>
      <h2 className="font-display text-2xl pt-6">What we collect</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Purchase and billing information handled by Polar (our payment processor and merchant of record).</li>
        <li>Support correspondence when you write to {SITE.supportEmail}.</li>
        <li>Anonymous or pseudonymous analytics events, only if you consent to analytics cookies.</li>
        <li>Marketing conversion events fired via Meta Pixel and the Meta Conversions API, only if you consent to marketing cookies.</li>
      </ul>
      <h2 className="font-display text-2xl pt-6">What we do not collect</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Health conditions, symptoms, medications, diet history, or answers to any safety questions.</li>
        <li>The contents of the PDF you download.</li>
        <li>Card details (handled entirely by Polar).</li>
      </ul>
      <h2 className="font-display text-2xl pt-6">Retention</h2>
      <p>
        Support correspondence: [DATA RETENTION PERIOD]. Order and tax records: retained by Polar and by us for the
        period required by applicable law. Analytics: aggregated only.
      </p>
      <h2 className="font-display text-2xl pt-6">Your rights</h2>
      <p>You may request access, correction or deletion of your personal data by emailing {SITE.supportEmail}.</p>
      <h2 className="font-display text-2xl pt-6">Governing law</h2>
      <p>This notice is governed by the laws of {SITE.governingLaw}, without regard to conflict-of-law rules.</p>
    </LegalShell>
  ),
});

export const Route = PrivacyRoute;
