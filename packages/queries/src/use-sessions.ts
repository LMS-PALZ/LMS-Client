import { useQuery } from "@tanstack/react-query";
import { sessionsApi } from "@ssu/api";

export const sessionKeys = {
  upcoming: () => ["sessions", "upcoming"] as const,
  detail: (id: string) => ["sessions", id] as const,
};

export function useUpcomingSessions() {
  return useQuery({
    queryKey: sessionKeys.upcoming(),
    queryFn: sessionsApi.listUpcoming,
    staleTime: 1000 * 60,
  });
}

export function useSessionDetail(id: string) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => sessionsApi.getById(id),
    enabled: !!id,
  });
}
