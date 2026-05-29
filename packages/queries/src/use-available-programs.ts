import { programsApi } from "@ssu/api";
import { useQuery } from "@tanstack/react-query";

export const programKeys = {
  all: ["programs"] as const,
  available: () => [...programKeys.all, "available"] as const,
};

export function useAvailablePrograms() {
  return useQuery({
    queryKey: programKeys.available(),
    queryFn: () => programsApi.listAvailable(),
    staleTime: 1000 * 60 * 10,
  });
}
