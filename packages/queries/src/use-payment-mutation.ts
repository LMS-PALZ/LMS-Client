import { useMutation } from "@tanstack/react-query";
import { initializePayment } from "@ssu/api";

export function useInitializePaymentMutation() {
  return useMutation({
    mutationFn: async ({
      email,
      program,
    }: {
      email: string;
      program: string;
    }) => {
      const res = await initializePayment(email, program);

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res.data;
    },
  });
}
