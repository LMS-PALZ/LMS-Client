import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@ssu/api";

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

    onSuccess: () => {
      localStorage.removeItem("reset-email");
    },
  });
}
