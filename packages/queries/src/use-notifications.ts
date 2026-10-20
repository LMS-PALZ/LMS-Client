import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@ssu/api";
import { notificationKeys } from "./keys";
import { useSession } from "./use-session";

const STUDENT_REFRESH_MS = 60_000;
/** Staff notifications fetch modules for every program, so poll less often. */
const STAFF_REFRESH_MS = 5 * 60_000;

export function useNotifications() {
  const { data: user } = useSession();
  const refreshMs =
    user?.role === "students" ? STUDENT_REFRESH_MS : STAFF_REFRESH_MS;

  return useQuery({
    queryKey: [...notificationKeys.list(), user?.role ?? "anonymous"],
    queryFn: notificationsApi.list,
    enabled: Boolean(user),
    staleTime: refreshMs,
    refetchInterval: refreshMs,
  });
}
