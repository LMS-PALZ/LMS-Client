import { googleClassroomApi } from "@ssu/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const googleClassroomKeys = {
  all: ["google-classroom"] as const,
  status: () => [...googleClassroomKeys.all, "status"] as const,
  courses: () => [...googleClassroomKeys.all, "courses"] as const,
  coursework: (courseId: string) =>
    [...googleClassroomKeys.all, "coursework", courseId] as const,
};

export function useGoogleConnectionStatus() {
  return useQuery({
    queryKey: googleClassroomKeys.status(),
    queryFn: () => googleClassroomApi.getConnectionStatus(),
    retry: false,
  });
}

export function useGoogleClassroomCourses(enabled = true) {
  return useQuery({
    queryKey: googleClassroomKeys.courses(),
    queryFn: () => googleClassroomApi.listCourses(),
    enabled,
    retry: false,
  });
}

export function useGoogleClassroomCoursework(courseId: string, enabled = true) {
  return useQuery({
    queryKey: googleClassroomKeys.coursework(courseId),
    queryFn: () => googleClassroomApi.listCoursework(courseId),
    enabled: enabled && Boolean(courseId),
    retry: false,
  });
}

export function useConnectGoogle() {
  return useMutation({
    mutationFn: async () => {
      googleClassroomApi.connect();
    },
  });
}

export function useDisconnectGoogle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => googleClassroomApi.disconnect(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: googleClassroomKeys.all });
    },
  });
}
