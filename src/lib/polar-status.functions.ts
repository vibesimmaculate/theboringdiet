import { createServerFn } from "@tanstack/react-start";
import { polarApproved } from "./env.server";

/**
 * Returns whether purchase controls should be enabled.
 * Reads POLAR_APPROVED at request time (Cloudflare Workers inject env per-request).
 */
export const getPolarApprovedStatus = createServerFn({ method: "GET" }).handler(async () => {
  return { approved: polarApproved() };
});
