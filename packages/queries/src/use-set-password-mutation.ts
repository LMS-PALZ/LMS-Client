import { useMutation } from "@tanstack/react-query";
import { setPassword } from "@ssu/api";
import { useSignupStore } from "@ssu/store";

export function useSetPasswordMutation() {
  const user = useSignupStore((state) => state.user);

  return useMutation({
    mutationFn: async (input: {
      password: string;
      confirmPassword: string;
    }) => {
      const email = user?.email;
      if (!email) {
        throw new Error("Reset email not found");
      }

      const res = await setPassword(email, input.password);

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res;
    },
  });
}
