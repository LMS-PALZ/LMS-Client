import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { verifyPayment } from "@ssu/api";
import { getErrorMessage, mutationToast } from "./notify";

export function useVerifyPayment(reference: string | null) {
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
  });

  useEffect(() => {
    if (notifiedRef.current) return;

    if (query.isSuccess && query.data) {
      notifiedRef.current = true;
      mutationToast.success(
        query.data.message ?? "Payment verified successfully",
      );
    }

    if (query.isError) {
      notifiedRef.current = true;
      mutationToast.error(
        getErrorMessage(query.error, "Payment verification failed"),
      );
    }
  }, [query.isSuccess, query.data, query.isError, query.error]);

  return query;
}
