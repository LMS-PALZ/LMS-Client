import { useQuery } from "@tanstack/react-query";
import {
  isPaymentFullySuccessful,
  readStoredPaymentReference,
  verifyPayment,
  type PaymentVerificationData,
} from "@ssu/api";

export function resolveSignupPaymentReference(
  referenceFromUrl?: string | null,
): string | null {
  const fromUrl = referenceFromUrl?.trim();
  if (fromUrl) return fromUrl;
  return readStoredPaymentReference();
}

export function useSignupPaymentVerification(
  referenceFromUrl?: string | null,
  enabled = true,
) {
  const reference = resolveSignupPaymentReference(referenceFromUrl);

  return useQuery({
    queryKey: ["signup-payment-verification", reference],
    queryFn: async () => {
      if (!reference) {
        throw new Error(
          "Payment reference not found. Please start payment again.",
        );
      }

      const res = await verifyPayment(reference);
      if (!res.ok) throw new Error(res.message);

      return res.data;
    },
    enabled: enabled && Boolean(reference),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });
}

export function assertSignupPaymentComplete(
  data: PaymentVerificationData,
): void {
  if (!isPaymentFullySuccessful(data)) {
    throw new Error(data.failureReason || data.paymentStatus);
  }
}
