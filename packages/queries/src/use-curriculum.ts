import { curriculumApi } from "@ssu/api";
import { useQuery } from "@tanstack/react-query";

export const curriculumKeys = {
  all: ["curriculum"] as const,
};

export function useCurriculum() {
  return useQuery({
    queryKey: curriculumKeys.all,
    queryFn: () => curriculumApi.list(),
  });
}
