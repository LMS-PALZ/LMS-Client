import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminlogin, login, writeSession } from "@ssu/api";
import { sessionKey, studentProfileKey } from "./keys";
import { getErrorMessage, mutationToast } from "./notify";

export type LoginPortal = "student" | "admin" | "tutor";

export function useLoginMutation(portal: LoginPortal = "student") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      if (portal === "admin" || portal === "tutor") {
        return adminlogin(input.email, input.password);
      }
      return login(input.email, input.password);
    },
    onSuccess: (data) => {
      if (!data.ok) {
        if (data.code === "pending_approval") {
          mutationToast.warning(data.message);
        } else {
          mutationToast.error(data.message);
        }
        return;
      }

      writeSession(data.data);
      const token =
        "accessToken" in data && typeof data.accessToken === "string"
          ? data.accessToken
          : null;
      if (token) {
        localStorage.setItem("token", token);
      }
      void qc.setQueryData(sessionKey, data.data);
      void qc.invalidateQueries({ queryKey: sessionKey });
      if (portal === "student") {
        void qc.invalidateQueries({ queryKey: studentProfileKey });
      }
      mutationToast.success(data.message || "Logged in successfully");
    },
    onError: (error) => {
      mutationToast.error(
        getErrorMessage(error, "Login failed. Please try again."),
      );
    },
  });
}
