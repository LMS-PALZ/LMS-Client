import { getSiteUrl } from "./env";
import { studentRoutes } from "./routes/student";

/** Absolute URL where the payment gateway should return after checkout. */
export function getPaymentVerifyCallbackUrl(origin?: string): string {
  const base = (origin ?? getSiteUrl())?.replace(/\/$/, "");
  if (!base) {
    return studentRoutes.verifyPayment;
  }
  return `${base}${studentRoutes.verifyPayment}`;
}
