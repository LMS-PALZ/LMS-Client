import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@ssu/api";
import { notificationKeys } from "./keys";
import { useSession } from "./use-session";

export function useNotifications() {
  const { data: user } = useSession();
  const isStudent = user?.role === "students";

  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: notificationsApi.list,
    enabled: Boolean(isStudent),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
