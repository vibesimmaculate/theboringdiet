/**
 * Admin authentication for the /admin CMS.
 * Server-only — do not import into client code.
 *
 * Credentials default to the owner-requested values but can (and should) be
 * overridden via ADMIN_EMAIL / ADMIN_PASSWORD env vars. Sessions are stateless
 * HMAC-signed expiry tokens in an HttpOnly cookie, so they work on
 * Cloudflare Workers without any session storage.
 */

export const ADMIN_COOKIE = "tbd_admin_session";
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

const encoder = new TextEncoder();

function adminCreds() {
  return {
    email: process.env.ADMIN_EMAIL || "admin@admin.com",
    password: process.env.ADMIN_PASSWORD || "admin12345!!!",
  };
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sessionSecret(): Promise<string> {
  const explicit = process.env.ADMIN_SESSION_SECRET;
  if (explicit) return explicit;
  const { email, password } = adminCreds();
  // Deterministic fallback so stateless tokens verify across worker isolates.
  return sha256Hex(`tbd-admin-secret-v1:${email}:${password}`);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function checkCredentials(email: string, password: string): Promise<boolean> {
  const creds = adminCreds();
  const [givenEmail, wantEmail, givenPw, wantPw] = await Promise.all([
    sha256Hex(email.trim().toLowerCase()),
    sha256Hex(creds.email.toLowerCase()),
    sha256Hex(password),
    sha256Hex(creds.password),
  ]);
  // Compare hashes so length differences leak nothing about the real values.
  const emailOk = timingSafeEqual(givenEmail, wantEmail);
  const pwOk = timingSafeEqual(givenPw, wantPw);
  return emailOk && pwOk;
}

export async function createSessionToken(): Promise<string> {
  const exp = Date.now() + SESSION_TTL_MS;
  const sig = await hmacHex(await sessionSecret(), `tbd-admin:${exp}`);
  return `${exp}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const exp = Number(token.slice(0, dot));
  const sig = token.slice(dot + 1);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = await hmacHex(await sessionSecret(), `tbd-admin:${exp}`);
  return timingSafeEqual(sig, expected);
}
