import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthUser } from "@ssu/types";
import { readSession, writeSession } from "@ssu/api";
import { useSyncExternalStore } from "react";
import { sessionKey } from "./keys";

/** True only after client hydration so server HTML matches the first client paint (localStorage is unreadable on the server). */
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
    /** True until the browser has hydrated and the session query has finished its initial fetch. */
    isLoading: !isClient || query.isLoading,
  };
}

export function useLogout() {
  const qc = useQueryClient();
  return () => {
    writeSession(null);
    void qc.invalidateQueries({ queryKey: sessionKey });
    void qc.setQueryData(sessionKey, null);
  };
}

export function useSetSession() {
  const qc = useQueryClient();
  return (user: AuthUser | null) => {
    writeSession(user);
    void qc.setQueryData(sessionKey, user);
  };
}
