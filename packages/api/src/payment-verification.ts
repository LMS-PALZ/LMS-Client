export const PAYMENT_REFERENCE_STORAGE_KEY = "payment_reference";

export type PaymentGatewayStatus = "pending" | "successful" | "failed";
export type PaymentFulfillmentStatus = "pending" | "completed" | "failed";

export interface PaymentVerificationData {
  reference: string;
  paymentStatus: PaymentGatewayStatus;
  fulfillmentStatus: PaymentFulfillmentStatus;
  failureReason?: string;
  applicationStatus?: string;
  message?: string;
}

export function normalizePaymentVerification(
  raw: unknown,
): PaymentVerificationData | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const reference =
    typeof row.reference === "string" ? row.reference.trim() : "";
  const paymentStatus = String(row.paymentStatus ?? "").toLowerCase();
  const fulfillmentStatus = String(row.fulfillmentStatus ?? "").toLowerCase();

  if (!reference) return null;
  if (
    paymentStatus !== "pending" &&
    paymentStatus !== "successful" &&
    paymentStatus !== "failed"
  ) {
    return null;
  }
  if (
    fulfillmentStatus !== "pending" &&
    fulfillmentStatus !== "completed" &&
    fulfillmentStatus !== "failed"
  ) {
    return null;
  }

  return {
    reference,
    paymentStatus,
    fulfillmentStatus,
    failureReason:
      typeof row.failureReason === "string" ? row.failureReason : undefined,
    applicationStatus:
      typeof row.applicationStatus === "string"
        ? row.applicationStatus
        : undefined,
    message: typeof row.message === "string" ? row.message : undefined,
  };
}

/** Paid + fulfilled — only then may signup continue past payment. */
export function isPaymentFullySuccessful(
  data: PaymentVerificationData | null | undefined,
): boolean {
  if (!data) return false;
  return (
    data.paymentStatus === "successful" &&
    data.fulfillmentStatus === "completed"
  );
}

export function readStoredPaymentReference(): string | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(PAYMENT_REFERENCE_STORAGE_KEY)?.trim();
  return value || null;
}

export function storePaymentReference(reference: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PAYMENT_REFERENCE_STORAGE_KEY, reference);
}

export function clearStoredPaymentReference(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PAYMENT_REFERENCE_STORAGE_KEY);
}
