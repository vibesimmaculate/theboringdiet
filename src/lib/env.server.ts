/**
 * Server-only environment resolver for Polar + Meta gate.
 * Do NOT import into client code — read env inside server fn handlers only.
 */

export function polarApproved(): boolean {
  const v = (process.env.POLAR_APPROVED ?? "").toLowerCase().trim();
  return v === "true" || v === "1";
}

export function polarEnv() {
  return {
    approved: polarApproved(),
    accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET ?? "",
    productId: process.env.POLAR_PRODUCT_ID ?? "",
    organizationSlug: process.env.POLAR_ORGANIZATION_SLUG ?? "",
    server: (process.env.POLAR_ENVIRONMENT ?? "sandbox") as "sandbox" | "production",
  };
}

export function metaEnv() {
  return {
    pixelId: process.env.VITE_META_PIXEL_ID ?? "",
    capiToken: process.env.META_CONVERSIONS_API_TOKEN ?? "",
  };
}
