import { createFileRoute } from "@tanstack/react-router";
import { EditorialEyebrow, FactTable, Folio, HorizontalRule } from "@/components/editorial/primitives";
import { BookMockup } from "@/components/editorial/book-mockup";
import { BRAND, SITE } from "@/config/brand";

const FACTS = [
  { k: "BRAND", v: BRAND.name },
  { k: "PRODUCT", v: "The Boring Diet Digital Edition" },
  { k: "FORMAT", v: "PDF · 36 pages" },
  { k: "PRICE", v: "$19 USD · one-time" },
  { k: "DURATION", v: "14 days" },
  { k: "AUDIENCE", v: "Adults 18+" },
  { k: "SUPPORT", v: SITE.supportEmail },
];

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "Press — The Boring Diet" },
      { name: "description", content: "Approved brand and product facts, short/long descriptions, wordmark and support contact for media use." },
      { property: "og:title", content: "Press — The Boring Diet" },
      { property: "og:description", content: "Media resources: brand facts, description, wordmark, contact." },
      { property: "og:url", content: "/press" },
    ],
    links: [{ rel: "canonical", href: "/press" }],
  }),
  component: () => (
    <section className="bg-bone paper-grain pt-24 pb-32">
      <div className="editorial-main">
        <div className="flex items-baseline justify-between">
          <EditorialEyebrow>PRESS · MEDIA</EditorialEyebrow>
          <Folio>THE BORING DIET · PRESS</Folio>
        </div>
        <h1 className="mt-6 h-display">
          MEDIA<br />RESOURCES<span className="text-gold">.</span>
        </h1>

        <div className="mt-14 grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-7 space-y-10">
            <div>
              <div className="mono-label text-stone-dark">SHORT DESCRIPTION</div>
              <p className="mt-2 text-lg">{BRAND.shortDescription}</p>
            </div>
            <div>
              <div className="mono-label text-stone-dark">LONG DESCRIPTION</div>
              <p className="mt-2 text-lg leading-relaxed">{BRAND.longDescription}</p>
            </div>
            <div>
              <div className="mono-label text-stone-dark">SUPPORT CONTACT</div>
              <p className="mt-2">{SITE.supportEmail}</p>
            </div>
            <div>
              <div className="mono-label text-stone-dark">WORDMARK</div>
              <div className="mt-4 border border-stone bg-paper px-8 py-10 font-display text-4xl">
                THE BORING DIET<span className="text-gold">.</span>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5">
            <BookMockup interactive={false} />
            <div className="mt-8"><FactTable rows={FACTS} /></div>
          </div>
        </div>
        <HorizontalRule className="mt-16" />
        <p className="mt-6 mono-label text-stone-dark max-w-3xl">
          NO FABRICATED PRESS QUOTES · NO AWARDS · NO ENDORSEMENTS · NO PUBLICATION LOGOS.
        </p>
      </div>
    </section>
  ),
});
