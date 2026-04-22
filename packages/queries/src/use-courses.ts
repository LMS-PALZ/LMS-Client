import { useQuery, useQueryClient } from "@tanstack/react-query";
import { coursesApi } from "@ssu/api";
import { courseKeys } from "./keys";

export function useEnrolledCourses() {
  return useQuery({
    queryKey: courseKeys.enrolled(),
    queryFn: coursesApi.getEnrolled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => coursesApi.getById(id),
    enabled: !!id,
  });
}

export function useInvalidateCourses() {
  const qc = useQueryClient();
  return () => void qc.invalidateQueries({ queryKey: courseKeys.all });
}
