/**
 * Stable anonymous visitor id (no PII) so the admin dashboard can group
 * funnel events per visitor across pages and sessions on this device.
 */

const KEY = "tbd_vid";

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID().replace(/-/g, "").slice(0, 10)
          : Math.random().toString(36).slice(2, 12);
      window.localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}
