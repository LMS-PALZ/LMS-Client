/** postMessage type between Korapay checkout popup and paymentdetail opener. */
export const PAYMENT_CHECKOUT_MESSAGE = "ssu:payment-checkout-done";

export type PaymentCheckoutMessage = {
  type: typeof PAYMENT_CHECKOUT_MESSAGE;
  reference: string;
  paid: boolean;
  paymentStatus?: string;
};

export function isPaymentCheckoutMessage(
  data: unknown,
): data is PaymentCheckoutMessage {
  if (!data || typeof data !== "object") return false;
  const row = data as Record<string, unknown>;
  return (
    row.type === PAYMENT_CHECKOUT_MESSAGE &&
    typeof row.reference === "string" &&
    typeof row.paid === "boolean"
  );
}

export function openPaymentCheckoutPopup(checkoutUrl: string): Window | null {
  const width = 520;
  const height = 740;
  const left = Math.max(
    0,
    Math.floor(window.screenX + (window.outerWidth - width) / 2),
  );
  const top = Math.max(
    0,
    Math.floor(window.screenY + (window.outerHeight - height) / 2),
  );

  return window.open(
    checkoutUrl,
    "ssu_korapay_checkout",
    `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
  );
}
