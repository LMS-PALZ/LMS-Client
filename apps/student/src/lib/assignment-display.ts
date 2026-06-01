import type { AssignmentListItem, AssignmentStatus } from "@ssu/types";

export function formatAssignmentDueDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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
  variant: "todo" | "notSubmitted" | "due" | "enrolled";
} {
  switch (status) {
    case "overdue":
      return { label: "Not submitted", variant: "notSubmitted" };
    case "submitted":
      return { label: "Submitted", variant: "enrolled" };
    case "graded":
      return { label: "Graded", variant: "enrolled" };
    case "returned":
      return { label: "Returned", variant: "due" };
    default:
      return { label: "To do", variant: "todo" };
  }
}

export function assignmentCardProps(assignment: AssignmentListItem) {
  const status = assignmentStatusDisplay(assignment.status);
  return {
    title: assignment.title,
    moduleLabel: assignment.moduleLabel ?? "Understanding The Market",
    dueDate: formatAssignmentDueDate(assignment.dueAt),
    weightPercent: assignment.weightPercent ?? 25,
    scoreDisplay:
      assignment.scoreDisplay ??
      (assignment.status === "graded" ? "0%" : "N/A"),
    statusLabel: status.label,
    statusVariant: status.variant,
  };
}
