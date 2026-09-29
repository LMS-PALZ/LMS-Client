import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  isPaymentFullySuccessful,
  storePaymentReference,
  verifyPayment,
} from "@ssu/api";
import { getErrorMessage, mutationToast } from "./notify";

export function useVerifyPayment(
  reference: string | null,
  options?: { notify?: boolean },
) {
  const notify = options?.notify !== false;
  const notifiedRef = useRef(false);

  const query = useQuery({
    queryKey: ["verify-payment", reference],
    queryFn: async () => {
      if (!reference) throw new Error("No payment reference found.");

      const res = await verifyPayment(reference);

      if (!res.ok) throw new Error(res.message);

      return res.data;
    },
    enabled: !!reference,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (!notify) return;
    if (notifiedRef.current || !query.isFetched) return;

    if (query.isSuccess && query.data) {
      notifiedRef.current = true;
      if (isPaymentFullySuccessful(query.data)) {
        storePaymentReference(query.data.reference);
        mutationToast.success("Payment verified successfully");
      } else {
        mutationToast.error(
          query.data.failureReason || query.data.paymentStatus,
        );
      }
    }

    if (query.isError) {
      notifiedRef.current = true;
      mutationToast.error(
        getErrorMessage(query.error, "Payment verification failed"),
      );
    }
  }, [
    notify,
    query.isFetched,
    query.isSuccess,
    query.data,
    query.isError,
    query.error,
  ]);

  return query;
}
