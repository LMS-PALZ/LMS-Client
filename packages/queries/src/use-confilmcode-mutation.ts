import { useMutation } from "@tanstack/react-query";
import { verifyStudentEmail } from "@ssu/api";
import type { ConfirmCodeFormValues } from "@ssu/schema";
import { useSignupStore } from "@ssu/store";

export function useConfirmCodeMutation() {
  const user = useSignupStore((state) => state.user);
  const email = user?.email;

  return useMutation({
    mutationFn: async (input: ConfirmCodeFormValues) => {
      // const email = email;

      if (!email) {
        throw new Error("User email not found");
      }
      console.log("Confirm code mutation input:", input);
      const res = await verifyStudentEmail(email, input.code);
      console.log("Confirm code mutation response:", res);
      return res;
    },
    onSuccess: (data) => {
      if (!data.ok) return;
      // localStorage.removeItem("user-email");
    },
  });
}
