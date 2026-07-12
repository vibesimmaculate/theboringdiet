import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EditorialEyebrow, Folio, LoadingState } from "@/components/editorial/primitives";
import { verifyPurchase } from "@/lib/polar-verify.functions";
import { markPurchased } from "@/lib/checkout-state";
import { BRAND, CUSTOMER_PORTAL_URL } from "@/config/brand";
import { z } from "zod";

type Status = "verifying" | "success" | "pending" | "failed" | "wrong_product";

const search = z.object({
  checkout_id: z.string().optional(),
  order_id: z.string().optional(),
});

export const Route = createFileRoute("/success")({
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { title: "Purchase Complete — The Boring Diet" },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:url", content: "/success" },
    ],
    links: [{ rel: "canonical", href: "/success" }],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { checkout_id, order_id } = Route.useSearch();
  const [status, setStatus] = useState<Status>("verifying");
  const [orderId, setOrderId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkout_id && !order_id) { setStatus("failed"); return; }
    verifyPurchase({ data: { checkoutId: checkout_id, orderId: order_id } })
      .then((r) => {
        if (r.status === "success") { setStatus("success"); setOrderId(r.orderId); markPurchased(); }
        else if (r.status === "pending") { setStatus("pending"); markPurchased(); }
        else if (r.status === "wrong_product") setStatus("wrong_product");
        else setStatus("failed");
      })
      .catch(() => setStatus("failed"));
  }, [checkout_id, order_id, navigate]);

  return (
    <section className="bg-bone paper-grain min-h-[80vh] pt-24 pb-32">
      <div className="editorial-main">
        <div className="flex items-baseline justify-between">
          <EditorialEyebrow>ORDER STATUS</EditorialEyebrow>
          <Folio>THE BORING DIET · SUCCESS</Folio>
        </div>

        {status === "verifying" && (
          <div className="mt-16">
            <h1 className="h-chapter">VERIFYING YOUR PURCHASE<span className="text-gold">…</span></h1>
            <div className="mt-10"><LoadingState label="Contacting Polar" /></div>
          </div>
        )}

        {status === "success" && (
          <div className="mt-16">
            <EditorialEyebrow>PURCHASE COMPLETE</EditorialEyebrow>
            <h1 className="mt-6 h-display">
              YOUR PROTOCOL<br />IS READY<span className="text-gold">.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed">
              Polar has sent your order confirmation and digital access to the email address used at checkout.
            </p>
            <p className="mt-3 mono-label text-stone-dark">
              USE THE SAME EMAIL ADDRESS ENTERED AT CHECKOUT. POLAR MAY SEND A ONE-TIME SIGN-IN CODE.
            </p>
            {orderId && <p className="mt-6 mono-label text-stone-dark">ORDER ID · {orderId}</p>}
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={CUSTOMER_PORTAL_URL(import.meta.env.VITE_POLAR_ORGANIZATION_SLUG)}
                target="_blank" rel="noreferrer"
                data-analytics="portal_clicked"
                className="btn-primary"
              >OPEN YOUR DOWNLOAD</a>
              <a
                href={CUSTOMER_PORTAL_URL(import.meta.env.VITE_POLAR_ORGANIZATION_SLUG)}
                target="_blank" rel="noreferrer"
                className="btn-outline"
              >OPEN CUSTOMER PORTAL</a>
            </div>
            <p className="mt-12 mono-label text-stone-dark">
              READ THE SAFETY NOTICE BEFORE CHOOSING A START DATE.
            </p>
          </div>
        )}

        {status === "pending" && (
          <div className="mt-16">
            <h1 className="h-chapter">YOUR PAYMENT IS STILL PROCESSING<span className="text-gold">.</span></h1>
            <p className="mt-6 max-w-lg">
              Polar has received your payment but has not confirmed it yet. You can safely refresh this page in a
              minute. You will also receive a confirmation email as soon as processing completes.
            </p>
            <button className="btn-outline mt-8" onClick={() => window.location.reload()}>REFRESH</button>
          </div>
        )}

        {status === "failed" && (
          <div className="mt-16">
            <h1 className="h-chapter">WE COULD NOT VERIFY THIS PURCHASE<span className="text-red">.</span></h1>
            <p className="mt-6 max-w-lg">
              If you completed a payment, please check the confirmation email from Polar or open the customer portal below.
              If you were charged and no email arrived, contact support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={CUSTOMER_PORTAL_URL(import.meta.env.VITE_POLAR_ORGANIZATION_SLUG)}
                target="_blank" rel="noreferrer"
                className="btn-primary"
              >CUSTOMER PORTAL</a>
              <a href="/contact" className="btn-outline">CONTACT SUPPORT</a>
            </div>
          </div>
        )}

        {status === "wrong_product" && (
          <div className="mt-16">
            <h1 className="h-chapter">THIS ORDER DOES NOT MATCH THE EXPECTED PRODUCT<span className="text-red">.</span></h1>
            <p className="mt-6 max-w-lg">
              The order returned by Polar is not for {BRAND.name}. Please contact support and include your order confirmation.
            </p>
            <a href="/contact" className="btn-primary mt-8">CONTACT SUPPORT</a>
          </div>
        )}
      </div>
    </section>
  );
}
