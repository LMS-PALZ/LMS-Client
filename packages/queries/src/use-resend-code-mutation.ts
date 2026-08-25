import { useMutation } from "@tanstack/react-query";
import { resendOtp } from "@ssu/api";
import { getErrorMessage, mutationToast } from "./notify";

interface UseResendCodeMutationProps {
  email: string;
}

export function useResendCodeMutation({ email }: UseResendCodeMutationProps) {
  return useMutation({
    mutationFn: async () => {
      if (!email) {
        throw new Error("User email not found");
      }

      return resendOtp(email);
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
