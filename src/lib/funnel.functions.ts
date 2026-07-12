import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { DEFAULT_FUNNEL_CONFIG, type FunnelConfig } from "@/config/funnel-defaults";
import {
  ADMIN_COOKIE,
  SESSION_TTL_MS,
  checkCredentials,
  createSessionToken,
  verifySessionToken,
} from "./admin-auth.server";
import {
  getConfigOverride,
  setConfigOverride,
  pushFunnelEvent,
  getFunnelEvents,
} from "./funnel-store.server";

// ---------------------------------------------------------------------------
// Public: funnel config + event ingestion
// ---------------------------------------------------------------------------

export const getFunnelConfig = createServerFn({ method: "GET" }).handler(
  async (): Promise<FunnelConfig> => {
    return getConfigOverride().config ?? DEFAULT_FUNNEL_CONFIG;
  },
);

const eventSchema = z.object({
  name: z.enum([
    "session_start",
    "page_view",
    "pricing_view",
    "cta_hover",
    "checkout_opened",
    "checkout_abandoned",
    "purchase_confirmed",
    "popup_shown",
    "popup_dismissed",
    "popup_cta_click",
    "faq_open",
  ]),
  path: z.string().max(200).catch(""),
  source: z.string().max(24).catch(""),
  tier: z.string().max(12).catch(""),
  objection: z.string().max(16).catch(""),
  score: z.number().min(0).max(100).catch(0),
  visitorId: z.string().max(24).catch(""),
});

export const recordFunnelEvent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => eventSchema.parse(data))
  .handler(async ({ data }) => {
    pushFunnelEvent({ ts: Date.now(), ...data });
    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Admin: auth
// ---------------------------------------------------------------------------

const loginSchema = z.object({ email: z.string().max(200), password: z.string().max(200) });

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => loginSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const ok = await checkCredentials(data.email, data.password);
    if (!ok) return { ok: false };
    setCookie(ADMIN_COOKIE, await createSessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(SESSION_TTL_MS / 1000),
      secure: process.env.NODE_ENV === "production",
    });
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(ADMIN_COOKIE, { path: "/" });
  return { ok: true };
});

export const adminSession = createServerFn({ method: "GET" }).handler(async () => {
  return { authed: await verifySessionToken(getCookie(ADMIN_COOKIE)) };
});

async function requireAdmin() {
  if (!(await verifySessionToken(getCookie(ADMIN_COOKIE)))) {
    throw new Error("UNAUTHORIZED");
  }
}

// ---------------------------------------------------------------------------
// Admin: funnel state (config + live event feed)
// ---------------------------------------------------------------------------

const variantSchema = z.object({
  eyebrow: z.string().max(80),
  headlineTop: z.string().max(60),
  headlineItalic: z.string().max(80),
  body: z.string().max(300),
  bullets: z.array(z.string().max(140)).max(5),
  cta: z.string().max(60),
});

const configSchema = z.object({
  version: z.number(),
  popupEnabled: z.boolean(),
  armAfterMs: z.number().min(0).max(60000),
  minIntentScore: z.number().min(0).max(100),
  variants: z.object({
    default: variantSchema,
    abandoned: variantSchema,
    price: variantSchema,
    trust: variantSchema,
    safety: variantSchema,
    evidence: variantSchema,
  }),
  sourceEyebrows: z.record(z.string().max(80)),
});

export const adminGetFunnelState = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const override = getConfigOverride();
  return {
    config: override.config ?? DEFAULT_FUNNEL_CONFIG,
    overrideActive: override.config !== null,
    overrideSavedAt: override.savedAt,
    events: getFunnelEvents(200),
  };
});

export const adminSaveFunnelConfig = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => configSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    setConfigOverride(data as FunnelConfig);
    return { ok: true };
  });

export const adminResetFunnelConfig = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  setConfigOverride(null);
  return { ok: true };
});
