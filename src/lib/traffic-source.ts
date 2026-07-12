import type { TrafficSource } from "@/config/funnel-defaults";

/**
 * Detects what brought the visitor here — UTM parameters first, referrer
 * second — and persists it (session = current visit, localStorage = first touch)
 * so the funnel can personalize and report against it.
 */

export type TrafficInfo = {
  source: TrafficSource;
  medium: string;
  campaign: string;
  referrer: string;
  landing: string;
  ts: number;
};

const SESSION_KEY = "tbd_traffic_v1";
const FIRST_TOUCH_KEY = "tbd_traffic_first_v1";

const UNKNOWN: TrafficInfo = { source: "other", medium: "", campaign: "", referrer: "", landing: "", ts: 0 };

function classify(utmSource: string, utmMedium: string, referrerHost: string, hasGclid: boolean): TrafficSource {
  const s = utmSource.toLowerCase();
  const m = utmMedium.toLowerCase();
  const r = referrerHost.toLowerCase();

  const match = (needles: string[], hay: string) => needles.some((n) => hay.includes(n));

  if (match(["facebook", "instagram", "meta", "fb", "ig"], s) || match(["facebook.", "instagram.", "fb.", "l.messenger"], r)) return "meta";
  if (s.includes("tiktok") || r.includes("tiktok")) return "tiktok";
  if (s.includes("youtube") || r.includes("youtube") || r.includes("youtu.be")) return "youtube";
  if (s.includes("reddit") || r.includes("reddit")) return "reddit";
  if (match(["twitter", "x.com", "x-ads"], s) || match(["twitter.", "t.co", "x.com"], r)) return "x";
  if (m === "email" || match(["email", "newsletter", "klaviyo", "mailchimp", "beehiiv"], s)) return "email";
  if (hasGclid || match(["google", "bing", "adwords"], s) || match(["google.", "bing.", "duckduckgo."], r)) return "google";
  if (!r && !s) return "direct";
  return "other";
}

function detect(): TrafficInfo {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source") ?? "";
  const utmMedium = params.get("utm_medium") ?? "";
  const utmCampaign = params.get("utm_campaign") ?? "";
  const hasGclid = params.has("gclid") || params.has("gbraid") || params.has("wbraid");
  const fbclid = params.has("fbclid");
  const ttclid = params.has("ttclid");

  let referrerHost = "";
  try {
    if (document.referrer) {
      const u = new URL(document.referrer);
      if (u.host !== window.location.host) referrerHost = u.host;
    }
  } catch {
    /* invalid referrer */
  }

  let source = classify(utmSource, utmMedium, referrerHost, hasGclid);
  // Click-ids are the strongest signal — they survive even when UTMs are stripped.
  if (source === "other" || source === "direct") {
    if (fbclid) source = "meta";
    else if (ttclid) source = "tiktok";
  }

  return {
    source,
    medium: utmMedium,
    campaign: utmCampaign,
    referrer: referrerHost,
    landing: window.location.pathname,
    ts: Date.now(),
  };
}

/** Current-visit traffic info; computed once per session, safe to call anywhere. */
export function getTrafficInfo(): TrafficInfo {
  if (typeof window === "undefined") return UNKNOWN;
  try {
    const cached = window.sessionStorage.getItem(SESSION_KEY);
    if (cached) return JSON.parse(cached) as TrafficInfo;
    const info = detect();
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(info));
    if (!window.localStorage.getItem(FIRST_TOUCH_KEY)) {
      window.localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(info));
    }
    return info;
  } catch {
    return UNKNOWN;
  }
}

/** First-ever visit attribution (falls back to current session). */
export function getFirstTouch(): TrafficInfo {
  if (typeof window === "undefined") return UNKNOWN;
  try {
    const raw = window.localStorage.getItem(FIRST_TOUCH_KEY);
    return raw ? (JSON.parse(raw) as TrafficInfo) : getTrafficInfo();
  } catch {
    return UNKNOWN;
  }
}
