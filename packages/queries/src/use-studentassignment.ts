import type { AssignmentListItem, AssignmentStatus } from "@ssu/types";
import { useQuery } from "@tanstack/react-query";
import { getStudentassignments } from "@ssu/api";

function mapAssessmentStatus(
  status?: string,
  dueDate?: string,
): AssignmentStatus {
  if (status === "published") {
    return "not-started";
  }

  if (status === "closed") {
    if (!dueDate) return "overdue";
    return new Date(dueDate).getTime() < Date.now() ? "overdue" : "not-started";
  }

  return "not-started";
}

export function useStudentassignments(programId: string) {
  return useQuery<AssignmentListItem[]>({
    queryKey: ["studentassignments", programId],
    queryFn: async () => {
      const res = await getStudentassignments(programId);

      if (!res.ok) throw new Error(res.message);

      const list = Array.isArray(res.data) ? res.data : [];

      return list.map((item: any) => ({
        id: item._id ?? item.id ?? "",
        title: item.title ?? "Untitled assessment",
        courseId: item.classroomId ?? item.programId ?? "",
        courseName: item.module ?? "Assessment",
        dueAt: item.dueDate ?? "",
        status: mapAssessmentStatus(item.status, item.dueDate),
        moduleLabel: item.module,
        weightPercent: item.weight ?? 0,
        scoreDisplay: "N/A",
      }));
    },
    enabled: !!programId,
  });
}
