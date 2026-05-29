import { useQuery } from "@tanstack/react-query";
import { verifyPayment } from "@ssu/api";

export function useVerifyPayment(reference: string | null) {
  return useQuery({
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
}
