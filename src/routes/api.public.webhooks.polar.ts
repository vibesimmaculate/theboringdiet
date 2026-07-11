import { createFileRoute } from "@tanstack/react-router";
import { Webhook } from "standardwebhooks";
import { polarEnv, metaEnv } from "@/lib/env.server";

type PolarEvent = {
  type: string;
  data: {
    id?: string;
    product_id?: string;
    amount?: number;
    currency?: string;
    paid?: boolean;
    status?: string;
    customer?: { email?: string };
  };
};

const processed = new Set<string>();

async function sendMetaPurchase(orderId: string, amount: number, currency: string, email?: string | null) {
  const meta = metaEnv();
  if (!meta.pixelId || !meta.capiToken) return;
  try {
    const eventId = `polar_order_${orderId}`;
    await fetch(`https://graph.facebook.com/v18.0/${meta.pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: "Purchase",
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            action_source: "website",
            user_data: email ? { em: [await sha256(email.trim().toLowerCase())] } : {},
            custom_data: {
              currency: currency.toUpperCase(),
              value: amount / 100,
              content_name: "The Boring Diet",
              content_ids: [polarEnv().productId],
              content_type: "product",
              order_id: orderId,
            },
          },
        ],
        access_token: meta.capiToken,
      }),
    });
  } catch (err) {
    console.error("Meta CAPI Purchase failed", err);
  }
}

async function sha256(input: string) {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const Route = createFileRoute("/api/public/webhooks/polar")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const env = polarEnv();
        if (!env.webhookSecret) return new Response("Webhook not configured", { status: 503 });

        const body = await request.text();
        const headers: Record<string, string> = {};
        request.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });

        // Polar uses Standard Webhooks. standardwebhooks expects base64-encoded secret.
        const encodedSecret = Buffer.from(env.webhookSecret).toString("base64");
        let evt: PolarEvent;
        try {
          const wh = new Webhook(encodedSecret);
          evt = wh.verify(body, headers) as PolarEvent;
        } catch (err) {
          console.warn("Polar webhook signature rejected", err);
          return new Response("Invalid signature", { status: 400 });
        }

        // Idempotency (per worker instance; production uses external store)
        const evtId = headers["webhook-id"];
        if (evtId) {
          if (processed.has(evtId)) return new Response("ok", { status: 200 });
          processed.add(evtId);
        }

        const type = evt.type;
        const d = evt.data ?? {};
        const productMatches = !d.product_id || d.product_id === env.productId;

        if ((type === "order.paid" || type === "order.updated") && d.paid && productMatches && d.id) {
          // Fire and forget analytics; do NOT deliver file (Polar handles it).
          sendMetaPurchase(d.id, d.amount ?? 0, d.currency ?? "USD", d.customer?.email).catch(() => {});
        }

        if (type === "order.refunded") {
          // Record refund analytics only. No file access removal from our side.
          console.info("[polar] order.refunded", d.id);
        }

        return new Response("ok", { status: 200, headers: { "content-type": "text/plain" } });
      },
    },
  },
});
