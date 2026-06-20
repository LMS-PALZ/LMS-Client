import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminlogin, login, writeSession } from "@ssu/api";
import { sessionKey } from "./keys";
import { mutationToast } from "./notify";

export type LoginPortal = "student" | "admin" | "tutor";

export function useLoginMutation(portal: LoginPortal = "student") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const res =
        portal === "admin" || portal === "tutor"
          ? await adminlogin(input.email, input.password)
          : await login(input.email, input.password);

      if (!res.ok) {
        const error = new Error(res.message) as Error & { code: string };
        error.code = res.code;
        throw error;
      }
      return res;
    },
    onSuccess: (data) => {
      writeSession(data.data);
      localStorage.setItem("token", data.data.accessToken);
      void qc.setQueryData(sessionKey, data.data);
    },

    onError: (error: Error) => {
      mutationToast.error(error.message ?? "Login failed. Please try again.");
    },
  });
}
