import { referenceDataApi } from "@ssu/api";
import { useQuery } from "@tanstack/react-query";

export const referenceDataKeys = {
  all: ["reference-data"] as const,
  years: () => [...referenceDataKeys.all, "years"] as const,
  states: () => [...referenceDataKeys.all, "states"] as const,
};

export function useBirthYears() {
  return useQuery({
    queryKey: referenceDataKeys.years(),
    queryFn: () => referenceDataApi.listBirthYears(),
    staleTime: 1000 * 60 * 60,
  });
}

export function useNigeriaStates() {
  return useQuery({
    queryKey: referenceDataKeys.states(),
    queryFn: () => referenceDataApi.listNigeriaStates(),
    staleTime: 1000 * 60 * 60,
  });
}
