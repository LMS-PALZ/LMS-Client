import { useMutation } from "@tanstack/react-query";
import { forgetPassword } from "@ssu/api";
import { getErrorMessage, mutationToast } from "./notify";

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async (input: { email: string }) => forgetPassword(input.email),
    onSuccess: (data, variables) => {
      if (!data.ok) {
        mutationToast.error(data.message);
        return;
      }
      localStorage.setItem("reset-email", variables.email);
      mutationToast.success(
        data.message || "Check your email for reset instructions",
      );
    },
    onError: (error) => {
      mutationToast.error(
        getErrorMessage(error, "Failed to send reset email. Please try again."),
      );
    },
  });
}
