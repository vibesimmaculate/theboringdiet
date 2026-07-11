import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EditorialEyebrow, Folio } from "@/components/editorial/primitives";
import { SITE } from "@/config/brand";

const TOPICS = [
  "Purchase question",
  "Download access",
  "Receipt or invoice",
  "Refund request",
  "Product question",
  "Safety information",
  "Other",
];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — The Boring Diet Support" },
      { name: "description", content: "Contact support for purchase questions, download access, receipts and refund requests. Do not use this form for urgent medical questions." },
      { property: "og:title", content: "Contact — The Boring Diet" },
      { property: "og:description", content: "Support for purchase, download, receipt and refund questions." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const email = SITE.supportEmail;
  const mailto = (msg: FormData) => {
    const subject = encodeURIComponent(`[${topic}] ${msg.get("name") || "Support enquiry"}`);
    const body = encodeURIComponent(`${msg.get("message") || ""}\n\n—\nFrom: ${msg.get("name")} <${msg.get("email")}>`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  };

  return (
    <section className="bg-bone paper-grain pt-24 pb-32">
      <div className="editorial-main">
        <div className="flex items-baseline justify-between">
          <EditorialEyebrow>SUPPORT</EditorialEyebrow>
          <Folio>THE BORING DIET · CONTACT</Folio>
        </div>
        <h1 className="mt-6 h-display">
          WRITE<br />TO US<span className="text-gold">.</span>
        </h1>

        <p className="mt-6 mono-label text-red">
          DO NOT USE THIS FORM FOR URGENT MEDICAL QUESTIONS.
          <br />Contact an appropriate healthcare professional or emergency service.
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); mailto(new FormData(e.currentTarget)); }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl"
        >
          <label className="md:col-span-1">
            <span className="mono-label text-stone-dark block mb-2">NAME</span>
            <input required name="name" className="w-full bg-paper border border-charcoal px-4 py-3" />
          </label>
          <label className="md:col-span-1">
            <span className="mono-label text-stone-dark block mb-2">EMAIL</span>
            <input required type="email" name="email" className="w-full bg-paper border border-charcoal px-4 py-3" />
          </label>
          <label className="md:col-span-2">
            <span className="mono-label text-stone-dark block mb-2">TOPIC</span>
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-paper border border-charcoal px-4 py-3">
              {TOPICS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className="md:col-span-2">
            <span className="mono-label text-stone-dark block mb-2">MESSAGE</span>
            <textarea required name="message" rows={6} className="w-full bg-paper border border-charcoal px-4 py-3" />
          </label>
          <p className="md:col-span-2 mono-label text-stone-dark">
            WE DO NOT REQUEST MEDICAL HISTORY. PLEASE DO NOT INCLUDE IT.
          </p>
          <div className="md:col-span-2 flex gap-3 items-center">
            <button className="btn-primary">SEND MESSAGE</button>
            <a href={`mailto:${email}`} className="mono-label text-stone-dark hover:underline">or email {email}</a>
          </div>
          {status === "sent" && <p className="md:col-span-2 mono-label text-gold">YOUR MAIL APP HAS BEEN OPENED.</p>}
        </form>
      </div>
    </section>
  );
}
