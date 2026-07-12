/**
 * Shared client-side checkout state so marketing surfaces (exit popup,
 * sticky dock) never fire over an open checkout or pester a buyer.
 */

const PURCHASED_KEY = "tbd_purchased";

let openCheckouts = 0;

export function markCheckoutOpen() {
  openCheckouts += 1;
}

export function markCheckoutClosed() {
  openCheckouts = Math.max(0, openCheckouts - 1);
}

export function isCheckoutOpen() {
  return openCheckouts > 0;
}

export function markPurchased() {
  try {
    window.localStorage.setItem(PURCHASED_KEY, "1");
  } catch {
    /* storage unavailable */
  }
}

export function hasPurchased() {
  try {
    return window.localStorage.getItem(PURCHASED_KEY) === "1";
  } catch {
    return false;
  }
}
