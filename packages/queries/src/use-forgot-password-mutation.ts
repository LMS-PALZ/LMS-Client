import { useMutation } from "@tanstack/react-query";

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async (input: { email: string }) => {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          ok: false,
          message: data.message || "Failed to send reset email",
        };
      }

      return {
        ok: true,
        message: data.message || "Reset email sent successfully",
      };
    },
  });
}
