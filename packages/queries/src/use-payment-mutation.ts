import { useMutation } from "@tanstack/react-query";
import { initializePayment } from "@ssu/api";
import { getErrorMessage, mutationToast } from "./notify";

export function useInitializePaymentMutation() {
  return useMutation({
    mutationFn: async ({
      email,
      program,
      callbackUrl,
    }: {
      email: string;
      program: string;
      callbackUrl?: string;
    }) => {
      const res = await initializePayment(email, program, { callbackUrl });

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res.data;
    },
    onError: (error) => {
      mutationToast.error(
        getErrorMessage(
          error,
          "Payment could not be started. Please try again.",
        ),
      );
    },
  });
}
