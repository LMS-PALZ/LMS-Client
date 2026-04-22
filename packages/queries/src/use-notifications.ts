import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@ssu/api";
import { notificationKeys } from "./keys";

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: notificationsApi.list,
    staleTime: 1000 * 60,
  });
}
