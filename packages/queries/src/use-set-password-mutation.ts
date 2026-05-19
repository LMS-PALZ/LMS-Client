import { useMutation } from "@tanstack/react-query";
import { setPassword } from "@ssu/api";
import { useSignupStore } from "@ssu/store";

export function useSetPasswordMutation() {
  const user = useSignupStore((state) => state.user);
  console.log("Using email for set password:", user?.email);

  return useMutation({
    mutationFn: async (input: { password: string }) => {
      const email = user?.email;

      if (!email) {
        throw new Error("Email not found. Please restart the signup process.");
      }

      const res = await setPassword(email, input.password);

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res;
    },
  });
}
