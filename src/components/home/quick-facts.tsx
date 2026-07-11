import { EditorialEyebrow, FactTable, Folio } from "@/components/editorial/primitives";
import { FACTS } from "@/config/brand";

export function QuickFacts() {
  return (
    <section className="bg-bone py-24 sm:py-32 paper-grain relative">
      <div className="editorial-main relative">
        <div
          aria-hidden="true"
          className="hidden lg:block absolute left-0 top-8 mono-label text-stone-dark"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          THE EXACT FOODS REMAIN INSIDE THE GUIDE.
        </div>

        <div className="mx-auto max-w-3xl bg-paper border border-stone p-8 sm:p-14 shadow-[0_20px_50px_-30px_rgba(17,17,17,0.15)]">
          <div className="flex items-start justify-between gap-4">
            <EditorialEyebrow>THE PRODUCT · AT A GLANCE</EditorialEyebrow>
            <Folio>THE BORING DIET · 003</Folio>
          </div>
          <h2 className="mt-8 h-chapter">
            ONE PURCHASE.<br />ONE PROTOCOL<span className="text-gold">.</span>
          </h2>
          <div className="mt-10">
            <FactTable rows={FACTS} emphasizeValues />
          </div>
          <p className="mt-8 mono-label text-stone-dark">
            ALL FACTS ARE PUBLISHED · NO HIDDEN CHARGES · NO SUBSCRIPTION
          </p>
        </div>
      </div>
    </section>
  );
}
