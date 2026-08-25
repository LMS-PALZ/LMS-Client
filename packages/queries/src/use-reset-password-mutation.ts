import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@ssu/api";
import { getErrorMessage, mutationToast } from "./notify";

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: async (input: {
      password: string;
      confirmPassword: string;
    }) => {
      const email = localStorage.getItem("reset-email");

      if (!email) {
        throw new Error("Reset email not found");
      }

      const res = await resetPassword(email, input.password);

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res;
    },
    onSuccess: (data) => {
      localStorage.removeItem("reset-email");
      mutationToast.success(data.message || "Password reset successfully");
    },
    onError: (error) => {
      mutationToast.error(
        getErrorMessage(error, "Failed to reset password. Please try again."),
      );
    },
  });
}
