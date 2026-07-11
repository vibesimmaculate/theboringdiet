import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { polarEnv } from "./env.server";

const inputSchema = z.object({ checkoutId: z.string().min(1).optional(), orderId: z.string().min(1).optional() });

type VerifyResult =
  | { status: "success"; orderId: string; amount: number; currency: string; email: string | null }
  | { status: "pending" }
  | { status: "failed"; reason: string }
  | { status: "wrong_product" }
  | { status: "config_missing" };

/**
 * Server-verifies a checkout with Polar, then returns only safe order info.
 * Never exposes tokens, raw file URLs, or unnecessary customer data.
 */
export const verifyPurchase = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<VerifyResult> => {
    const env = polarEnv();
    if (!env.accessToken || !env.productId) return { status: "config_missing" };
    if (!data.checkoutId && !data.orderId) return { status: "failed", reason: "missing identifier" };

    const base = env.server === "sandbox" ? "https://sandbox-api.polar.sh" : "https://api.polar.sh";
    const headers = { Authorization: `Bearer ${env.accessToken}`, Accept: "application/json" };

    try {
      // Prefer checkout lookup: contains order + payment state
      let orderId = data.orderId ?? null;
      let productId: string | null = null;
      let amount = 0;
      let currency = "USD";
      let email: string | null = null;
      let paid = false;

      if (data.checkoutId) {
        const r = await fetch(`${base}/v1/checkouts/${encodeURIComponent(data.checkoutId)}`, { headers });
        if (!r.ok) return { status: "failed", reason: `checkout lookup ${r.status}` };
        const c = (await r.json()) as {
          status?: string; product_id?: string; total_amount?: number; currency?: string;
          customer_email?: string; customer?: { email?: string }; order_id?: string;
        };
        if (c.status === "succeeded" || c.status === "confirmed") paid = true;
        if (c.status === "open") return { status: "pending" };
        productId = c.product_id ?? null;
        amount = c.total_amount ?? 0;
        currency = (c.currency ?? "USD").toUpperCase();
        email = c.customer_email ?? c.customer?.email ?? null;
        orderId = c.order_id ?? orderId;
      }

      if (!paid && orderId) {
        const r = await fetch(`${base}/v1/orders/${encodeURIComponent(orderId)}`, { headers });
        if (!r.ok) return { status: "failed", reason: `order lookup ${r.status}` };
        const o = (await r.json()) as {
          status?: string; paid?: boolean; product_id?: string; amount?: number;
          currency?: string; customer?: { email?: string };
        };
        paid = Boolean(o.paid) || o.status === "paid";
        productId = productId ?? o.product_id ?? null;
        amount = amount || (o.amount ?? 0);
        currency = (o.currency ?? currency).toUpperCase();
        email = email ?? o.customer?.email ?? null;
      }

      if (!paid) return { status: "pending" };
      if (productId && productId !== env.productId) return { status: "wrong_product" };
      return { status: "success", orderId: orderId ?? "", amount, currency, email };
    } catch (err) {
      console.error("polar verify failed", err);
      return { status: "failed", reason: "network" };
    }
  });
