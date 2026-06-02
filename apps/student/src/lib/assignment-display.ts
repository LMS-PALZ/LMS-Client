import type { AssignmentListItem, AssignmentStatus } from "@ssu/types";

export type AssessmentCardStatusVariant =
  | "todo"
  | "graded"
  | "pendingReview"
  | "notSubmitted";

export function formatAssignmentDueDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatAssignmentDueDateLong(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return `${day}${suffix} ${month}, ${year}`;
}

export function formatSessionTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase()
    .replace(" ", "");
}

export function formatSessionDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });
}

export function assignmentStatusDisplay(status: AssignmentStatus): {
  label: string;
  variant: AssessmentCardStatusVariant;
  filterValue: string;
} {
  switch (status) {
    case "graded":
      return { label: "Graded", variant: "graded", filterValue: "graded" };
    case "submitted":
      return {
        label: "Pending review",
        variant: "pendingReview",
        filterValue: "pending-review",
      };
    case "overdue":
      return {
        label: "Not submitted",
        variant: "notSubmitted",
        filterValue: "not-submitted",
      };
    case "returned":
      return {
        label: "Returned",
        variant: "pendingReview",
        filterValue: "pending-review",
      };
    default:
      return { label: "To do", variant: "todo", filterValue: "to-do" };
  }
}

/** Detail page: API status wins for graded/submitted; local submit → pending review only while still open. */
export function resolveAssignmentDetailStatus(
  assignment: AssignmentListItem,
  isLocallySubmitted: boolean,
) {
  if (assignment.status === "graded" || assignment.status === "submitted") {
    return assignmentStatusDisplay(assignment.status);
  }
  if (isLocallySubmitted) {
    return assignmentStatusDisplay("submitted");
  }
  return assignmentStatusDisplay(assignment.status);
}

export function isAssignmentWorkLocked(
  assignment: AssignmentListItem,
  isLocallySubmitted: boolean,
): boolean {
  return (
    assignment.status === "graded" ||
    assignment.status === "submitted" ||
    isLocallySubmitted
  );
}

export function assignmentCardProps(assignment: AssignmentListItem) {
  const status = assignmentStatusDisplay(assignment.status);
  return {
    card: {
      title: assignment.title,
      moduleLabel: assignment.moduleLabel ?? assignment.courseName,
      dueDate: formatAssignmentDueDate(assignment.dueAt),
      weightPercent: assignment.weightPercent ?? 25,
      scoreDisplay:
        assignment.scoreDisplay ??
        (assignment.status === "graded" ? "0%" : "N/A"),
      statusLabel: status.label,
      statusVariant: status.variant,
    },
    filterValue: status.filterValue,
  };
}

export const ASSESSMENT_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "to-do", label: "To do" },
  { value: "graded", label: "Graded" },
  { value: "pending-review", label: "Pending review" },
  { value: "not-submitted", label: "Not submitted" },
] as const;
