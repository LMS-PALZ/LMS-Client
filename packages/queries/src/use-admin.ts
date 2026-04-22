import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@ssu/api";
import { adminKeys } from "./keys";

export function useAdminUsers() {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: adminApi.listUsers,
    staleTime: 1000 * 60 * 2,
  });
}

export function usePendingTrainers() {
  return useQuery({
    queryKey: adminKeys.pendingTrainers(),
    queryFn: adminApi.listPendingTrainers,
    staleTime: 1000 * 60,
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: adminKeys.user(id),
    queryFn: () => adminApi.getUser(id),
    enabled: !!id,
  });
}
