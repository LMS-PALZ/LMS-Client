import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@ssu/api";
import { notificationKeys } from "./keys";
import { useSession } from "./use-session";

export function useNotifications() {
  const { data: user } = useSession();

  return useQuery({
    queryKey: [...notificationKeys.list(), user?.role ?? "anonymous"],
    queryFn: notificationsApi.list,
    enabled: Boolean(user),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
