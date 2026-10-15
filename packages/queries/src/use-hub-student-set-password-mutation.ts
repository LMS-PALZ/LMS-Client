import { useMutation } from "@tanstack/react-query";
import { setPassword } from "@ssu/api";
import { getErrorMessage, mutationToast } from "./notify";

/** Sets the password for a student enrolled by an admin (no signup payment). */
export function useHubStudentSetPasswordMutation() {
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const res = await setPassword(input.email, input.password);

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res;
    },
    onSuccess: (data) => {
      mutationToast.success(data.message || "Password set successfully");
    },
    onError: (error) => {
      mutationToast.error(
        getErrorMessage(error, "Failed to set password. Please try again."),
      );
    },
  });
}
