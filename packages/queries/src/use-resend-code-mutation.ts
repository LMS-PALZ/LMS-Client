import { useMutation } from "@tanstack/react-query";
import { resendOtp } from "@ssu/api";

export function useResendCodeMutation() {
  return useMutation({
    mutationFn: async () => {
      const email = localStorage.getItem("user-email");

      if (!email) {
        throw new Error("User email not found");
      }
      console.log("Resend code mutation - resending to:", email);
      const res = await resendOtp(email);
      console.log("Resend code mutation response:", res);
      return res;
    },
  });
}
