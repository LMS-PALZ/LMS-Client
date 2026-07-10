import type { AssignmentListItem, AssignmentStatus } from "@ssu/types";
import { useQuery } from "@tanstack/react-query";
import { getStudentassignments } from "@ssu/api";

function mapAssessmentStatus(status?: string): AssignmentStatus {
  const normalized = status?.trim().toLowerCase();

  if (normalized === "published") {
    return "published";
  }

  if (normalized === "draft") {
    return "draft";
  }

  if (normalized === "archive" || normalized === "archived") {
    return "archive";
  }

  if (normalized === "closed") {
    return "closed";
  }

  if (
    normalized === "submitted" ||
    normalized === "pending review" ||
    normalized === "pending-review"
  ) {
    return "submitted";
  }

  if (normalized === "graded") {
    return "graded";
  }

  if (normalized === "returned") {
    return "returned";
  }

  if (normalized === "overdue") {
    return "overdue";
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
        status: mapAssessmentStatus(item.status),
        moduleLabel: item.module,
        weightPercent: item.weight ?? 0,
        scoreDisplay: "N/A",
      }));
    },
    enabled: !!programId,
  });
}
