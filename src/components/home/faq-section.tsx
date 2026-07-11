import { EditorialFAQ, type FAQ } from "@/components/editorial/editorial-faq";
import { EditorialEyebrow } from "@/components/editorial/primitives";

export const HOME_FAQ: FAQ[] = [
  { q: "What is The Boring Diet?", a: "The Boring Diet is a 36-page digital publication containing a structured, time-limited 14-day eating experiment. It includes exact operating boundaries, a complete daily schedule, preparation guidance, troubleshooting information, a structured exit and safety limitations." },
  { q: "How much does it cost?", a: "The Boring Diet costs $19 USD as a one-time digital purchase. It is not a subscription and has no recurring fee." },
  { q: "Is it a subscription?", a: "No. It is a single one-time payment. Nothing renews." },
  { q: "What do I receive?", a: "A 36-page digital PDF containing the complete protocol, calendar, preparation system, troubleshooting map, structured exit and safety boundaries. Delivery is instant through Polar." },
  { q: "Why are the exact foods not shown?", a: "The exact foods, quantities and operating instructions are the core of the paid protocol. The website explains the structure, evidence boundaries, safety considerations and product contents without publishing the complete method." },
  { q: "How long does the protocol last?", a: "The active protocol lasts fourteen days. It should not be extended or repeated back-to-back. The guide includes a structured exit sequence after Day 14." },
  { q: "Does it guarantee weight loss?", a: "No. The product does not guarantee weight loss or any health outcome. Individual experiences vary." },
  { q: "Is it medical advice?", a: "No. The publication provides general educational information about a bounded personal experiment. It is not medical advice, diagnosis or treatment." },
  { q: "Who should not start without medical advice?", a: "Anyone who has diabetes, kidney disease, a history of disordered eating, is pregnant or breastfeeding, is under 18, takes medication affecting blood sugar or potassium, or has a condition that may alter nutritional requirements. Consult a healthcare professional first." },
  { q: "How is the guide delivered?", a: "Immediately after payment through Polar. Polar sends order confirmation and access to the download benefit to the email address used at checkout." },
  { q: "Do I need an account?", a: "No website account is required. Polar handles receipts, invoices, downloads and access through a passwordless email flow." },
  { q: "How do I retrieve the PDF later?", a: "Use the Customer Portal link with the email address entered at checkout. Polar may send a one-time sign-in code." },
  { q: "Can I read it on my phone?", a: "Yes. The PDF works on phones, tablets and desktop." },
  { q: "What is the refund policy?", a: "See the Refunds page for the exact policy and any consumer withdrawal rights that may apply to your jurisdiction." },
];

const TOP_FAQ = HOME_FAQ.slice(0, 6);

export function HomeFaqSection() {
  return (
    <section className="bg-bone py-14 sm:py-20">
      <div className="editorial-main">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <EditorialEyebrow>QUESTIONS</EditorialEyebrow>
            <h2 className="mt-4 h-chapter">
              QUICK<br />ANSWERS<span className="text-gold">.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8">
            <EditorialFAQ items={TOP_FAQ} />
          </div>
        </div>
      </div>
    </section>
  );
}

