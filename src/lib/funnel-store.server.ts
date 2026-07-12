import type { FunnelConfig } from "@/config/funnel-defaults";

/**
 * Server-side funnel state. Server-only.
 *
 * NOTE ON DURABILITY: this host (Cloudflare Workers) has no attached database,
 * so CMS overrides and the event feed live in worker memory — they survive
 * between requests but reset on redeploy/isolate recycling. The permanent path
 * for config is "Copy JSON" in /admin → paste into DEFAULT_FUNNEL_CONFIG.
 * Wire a KV/DB here later if durable analytics are needed.
 */

export type FunnelEvent = {
  ts: number;
  name: string;
  path: string;
  source: string;
  tier: string;
  objection: string;
  score: number;
};

type FunnelStore = {
  override: FunnelConfig | null;
  overrideSavedAt: number | null;
  events: FunnelEvent[];
};

const MAX_EVENTS = 500;

const g = globalThis as typeof globalThis & { __tbdFunnelStore?: FunnelStore };

function store(): FunnelStore {
  if (!g.__tbdFunnelStore) g.__tbdFunnelStore = { override: null, overrideSavedAt: null, events: [] };
  return g.__tbdFunnelStore;
}

export function getConfigOverride(): { config: FunnelConfig | null; savedAt: number | null } {
  const s = store();
  return { config: s.override, savedAt: s.overrideSavedAt };
}

export function setConfigOverride(config: FunnelConfig | null) {
  const s = store();
  s.override = config;
  s.overrideSavedAt = config ? Date.now() : null;
}

export function pushFunnelEvent(event: FunnelEvent) {
  const s = store();
  s.events.push(event);
  if (s.events.length > MAX_EVENTS) s.events.splice(0, s.events.length - MAX_EVENTS);
}

export function getFunnelEvents(limit = 200): FunnelEvent[] {
  const s = store();
  return s.events.slice(-limit).reverse();
}
