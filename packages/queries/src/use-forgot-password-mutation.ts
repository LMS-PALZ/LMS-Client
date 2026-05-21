import { useMutation } from "@tanstack/react-query";
import { forgetPassword } from "@ssu/api";

export function useForgotPasswordMutation(
  onSuccessRedirect?: (path: string) => void,
) {
  return useMutation({
    mutationFn: async (input: { email: string }) => {
      const res = await forgetPassword(input.email);

      return res;
    },

    onSuccess: (data, variables) => {
      if (!data.ok) {
        console.error("Forgot password failed:", data.message);

        return;
      }

      localStorage.setItem("reset-email", variables.email);

      onSuccessRedirect?.("/reset-password");
    },
  });
}
