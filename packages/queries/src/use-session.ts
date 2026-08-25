import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthUser } from "@ssu/types";
import { clearStudentAuth, readSession, writeSession } from "@ssu/api";
import { useSignupStore } from "@ssu/store";
import { useSyncExternalStore } from "react";
import { notificationKeys, sessionKey, studentProfileKey } from "./keys";
import { mutationToast } from "./notify";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useSession() {
  const isClient = useIsClient();
  const query = useQuery({
    queryKey: sessionKey,
    queryFn: async (): Promise<AuthUser | null> => readSession(),
    enabled: isClient,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    ...query,
    isLoading: !isClient || query.isLoading,
  };
}

export function useLogout() {
  const qc = useQueryClient();
  return () => {
    clearStudentAuth();
    useSignupStore.getState().clearUser();
    qc.setQueryData(sessionKey, null);
    void qc.invalidateQueries({ queryKey: sessionKey });
    void qc.invalidateQueries({ queryKey: studentProfileKey });
    void qc.invalidateQueries({ queryKey: notificationKeys.all });
    mutationToast.info("You have been logged out");
  };
}

export function useSetSession() {
  const qc = useQueryClient();
  return (user: AuthUser | null) => {
    writeSession(user);
    void qc.setQueryData(sessionKey, user);
  };
}
