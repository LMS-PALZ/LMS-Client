import { useMutation } from "@tanstack/react-query";
import {
  readStoredPaymentReference,
  setPassword,
  verifyPayment,
} from "@ssu/api";
import { useSignupStore } from "@ssu/store";
import { assertSignupPaymentComplete } from "./use-signup-payment-verification";
import { getErrorMessage, mutationToast } from "./notify";

export function useSetPasswordMutation() {
  const user = useSignupStore((state) => state.user);

  return useMutation({
    mutationFn: async (input: { password: string }) => {
      const email = user?.email;

      if (!email) {
        throw new Error("Email not found. Please restart the signup process.");
      }

      const reference = readStoredPaymentReference();
      if (!reference) {
        throw new Error(
          "Payment not verified. Complete payment before setting a password.",
        );
      }

      const paymentRes = await verifyPayment(reference);
      if (!paymentRes.ok) {
        throw new Error(paymentRes.message);
      }
      assertSignupPaymentComplete(paymentRes.data);

      const res = await setPassword(email, input.password);

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res;
    },
    onSuccess: (data) => {
      mutationToast.success(data.message || "Password set successfully");
    },
    onError: (error) => {
      mutationToast.error(
        getErrorMessage(error, "Failed to set password. Please try again."),
      );
    },
  });
}
