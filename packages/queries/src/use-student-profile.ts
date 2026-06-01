import { fetchStudentProfile, isStudentAuthenticated } from "@ssu/api";
import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { studentProfileKey } from "./keys";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useStudentProfile() {
  const isClient = useIsClient();
  const authed = isClient && isStudentAuthenticated();

  return useQuery({
    queryKey: studentProfileKey,
    queryFn: async () => {
      const res = await fetchStudentProfile();
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: authed,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
