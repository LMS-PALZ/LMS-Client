import type { ProgramApplicant } from "@ssu/types";
import type { ApplicantStatusDisplay } from "../types/ui";

export const STUDENT_STATUS_OPTIONS = [
  "All statuses",
  "Completed",
  "In progress",
  "Rejected",
] as const;

export const STUDENT_ROWS_PER_PAGE_OPTIONS = ["10", "20", "50"] as const;

export function mapApplicantStatus(status: string): ApplicantStatusDisplay {
  switch (status.toLowerCase()) {
    case "accepted":
      return { label: "Completed", className: "bg-[#DBF1DC] text-[#1F6E2A]" };
    case "rejected":
      return { label: "Rejected", className: "bg-[#FEE2E2] text-[#B91C1C]" };
    case "pending":
    default:
      return { label: "In progress", className: "bg-[#E0F2FE] text-[#0369A1]" };
  }
}

export function matchesApplicantStatusFilter(
  applicant: ProgramApplicant,
  statusFilter: string,
): boolean {
  if (statusFilter === "All statuses") return true;
  return mapApplicantStatus(applicant.status).label === statusFilter;
}

export function matchesApplicantYearFilter(
  applicant: ProgramApplicant,
  year: string,
): boolean {
  if (year === "All years") return true;
  const createdYear = new Date(applicant.createdAt).getFullYear();
  return String(createdYear) === year;
}

export function matchesApplicantSearch(
  applicant: ProgramApplicant,
  query: string,
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return (
    applicant.studentName.toLowerCase().includes(normalized) ||
    applicant.studentEmail.toLowerCase().includes(normalized)
  );
}

export function buildApplicantYearOptions(
  applicants: ProgramApplicant[],
): string[] {
  const years = new Set<string>();
  for (const applicant of applicants) {
    const year = new Date(applicant.createdAt).getFullYear();
    if (!Number.isNaN(year)) years.add(String(year));
  }
  return [
    "All years",
    ...Array.from(years).sort((a, b) => Number(b) - Number(a)),
  ];
}
