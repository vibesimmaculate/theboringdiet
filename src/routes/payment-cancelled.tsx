import { createFileRoute, Link } from "@tanstack/react-router";
import { EditorialEyebrow, Folio } from "@/components/editorial/primitives";

export const Route = createFileRoute("/payment-cancelled")({
  head: () => ({
    meta: [
      { title: "Payment Cancelled — The Boring Diet" },
      { name: "robots", content: "noindex,nofollow" },
    ],
    links: [{ rel: "canonical", href: "/payment-cancelled" }],
  }),
  component: () => (
    <section className="bg-bone paper-grain pt-24 pb-32 min-h-[70vh]">
      <div className="editorial-main">
        <div className="flex items-baseline justify-between">
          <EditorialEyebrow>PAYMENT CANCELLED</EditorialEyebrow>
          <Folio>THE BORING DIET · CANCELLED</Folio>
        </div>
        <h1 className="mt-6 h-display">
          NO CHARGE<br />WAS MADE<span className="text-gold">.</span>
        </h1>
        <p className="mt-8 max-w-lg text-lg leading-relaxed">
          You cancelled the checkout before completing payment. Nothing was charged. You can start again whenever
          you're ready.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/product" className="btn-primary">RETURN TO PURCHASE</Link>
          <Link to="/" className="btn-outline">BACK TO COVER</Link>
        </div>
      </div>
    </section>
  ),
});
