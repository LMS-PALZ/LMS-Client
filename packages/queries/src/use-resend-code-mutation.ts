import { useMutation } from "@tanstack/react-query";
import { resendOtp } from "@ssu/api";
import { useSignupStore } from "@ssu/store";
import { getErrorMessage, mutationToast } from "./notify";

export function useResendCodeMutation() {
  const user = useSignupStore((state) => state.user);

  return useMutation({
    mutationFn: async () => {
      const email = user?.email;

      if (!email) {
        throw new Error("User email not found. Please restart signup.");
      }

      const res = await resendOtp(email);
      return res;
    },
    onSuccess: (data) => {
      if (!data.ok) {
        mutationToast.error(data.message);
        return;
      }
      mutationToast.success(data.message || "Verification code sent");
    },
    onError: (error) => {
      mutationToast.error(
        getErrorMessage(error, "Could not resend code. Please try again."),
      );
    },
  });
}
