"use client";

import { useMemo, useState } from "react";
import { useProgramApplicants } from "@ssu/queries";
import type { ProgramApplicant } from "@ssu/types";
import { CustomSelect, SearchInput, Spinner } from "@ssu/ui";
import { cn } from "@ssu/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCourseListDate } from "../lib/course-utils";

const STATUS_OPTIONS = ["All statuses", "Completed", "In progress", "Rejected"];

const ROWS_PER_PAGE_OPTIONS = ["10", "20", "50"];

const AVATAR_COLORS = [
  "bg-[#86EFAC] text-[#033207]",
  "bg-[#E2E8F0] text-[#033207]",
  "bg-[#2BADFF] text-[#033207]",
  "bg-[#F87171] text-[#033207]",
  "bg-[#FCE4EC] text-[#033207]",
  "bg-[#FFF8E1] text-[#033207]",
  "bg-[#EDE7F6] text-[#033207]",
];

interface CourseStudentsTabProps {
  programId: string;
  cohortName?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.charAt(0).toUpperCase() ?? "";
  const last =
    parts.length > 1 ? parts[parts.length - 1]?.charAt(0).toUpperCase() : "";
  return `${first}${last}`;
}

function avatarColorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[hash] ?? AVATAR_COLORS[0];
}

function mapApplicantStatus(status: string): {
  label: string;
  className: string;
} {
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

function matchesStatusFilter(
  applicant: ProgramApplicant,
  statusFilter: string,
): boolean {
  if (statusFilter === "All statuses") return true;
  const mapped = mapApplicantStatus(applicant.status).label;
  return mapped === statusFilter;
}

function matchesYearFilter(applicant: ProgramApplicant, year: string): boolean {
  if (year === "All years") return true;
  const createdYear = new Date(applicant.createdAt).getFullYear();
  return String(createdYear) === year;
}

function matchesSearch(applicant: ProgramApplicant, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return (
    applicant.studentName.toLowerCase().includes(normalized) ||
    applicant.studentEmail.toLowerCase().includes(normalized)
  );
}

export function CourseStudentsTab({
  programId,
  cohortName,
}: CourseStudentsTabProps) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [yearFilter, setYearFilter] = useState("All years");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useProgramApplicants(programId, {
    page,
    limit: rowsPerPage,
  });

  const yearOptions = useMemo(() => {
    const years = new Set<string>();
    for (const applicant of data?.items ?? []) {
      const year = new Date(applicant.createdAt).getFullYear();
      if (!Number.isNaN(year)) years.add(String(year));
    }
    return [
      "All years",
      ...Array.from(years).sort((a, b) => Number(b) - Number(a)),
    ];
  }, [data?.items]);

  const filteredApplicants = useMemo(() => {
    return (data?.items ?? []).filter(
      (applicant) =>
        matchesStatusFilter(applicant, statusFilter) &&
        matchesYearFilter(applicant, yearFilter) &&
        matchesSearch(applicant, search),
    );
  }, [data?.items, statusFilter, yearFilter, search]);

  const pagination = data?.pagination;
  const total = pagination?.total ?? filteredApplicants.length;
  const totalPages = pagination?.totalPages ?? 1;
  const start = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, total);

  if (isLoading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-[14px] text-[#94A3B8]">
        {error instanceof Error
          ? error.message
          : "Failed to load enrolled students."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-[14px] font-medium text-[#1D1D1D]">
          ({total}) Students
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-[160px]">
            <CustomSelect
              placeholder="All statuses"
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              className="h-11 rounded-[14px] text-[14px]"
            />
          </div>
          <div className="w-full sm:w-[120px]">
            <CustomSelect
              placeholder="All years"
              options={yearOptions}
              value={yearFilter}
              onChange={setYearFilter}
              className="h-11 rounded-[14px] text-[14px]"
            />
          </div>
          <SearchInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onClear={() => setSearch("")}
            placeholder="Search a student"
            className="w-full sm:w-[260px]"
            aria-label="Search students"
          />
        </div>
      </div>

      {filteredApplicants.length === 0 ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-[18px] border border-dashed border-[#E2E8F0] bg-[#FAFBFC] text-[14px] text-[#94A3B8]">
          No students match your search or filter.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[18px] border border-[#EEF2F6]">
          <table className="w-full text-left">
            <thead className="bg-[#F7F9FB] text-[13px] text-[#6B7280]">
              <tr>
                <th className="px-5 py-3 font-medium">Students</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Cohort</th>
                <th className="px-5 py-3 font-medium">Enrollment date</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map((applicant) => {
                const status = mapApplicantStatus(applicant.status);
                return (
                  <tr
                    key={applicant.id}
                    className="border-t border-[#EEF2F6] text-[14px] text-[#1D1D1D]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold",
                            avatarColorForId(applicant.id),
                          )}
                        >
                          {getInitials(applicant.studentName)}
                        </div>
                        <span className="font-medium">
                          {applicant.studentName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#6B7280]">
                      {cohortName ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-[#6B7280]">
                      {formatCourseListDate(applicant.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {total > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-[#94A3B8]">
            Showing {start}-{end} of {total}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-[#F7F9FB] disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-medium transition",
                      pageNumber === page
                        ? "bg-[#4C7D5B] text-white"
                        : "text-[#6B7280] hover:bg-[#F7F9FB]",
                    )}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                type="button"
                aria-label="Next page"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) => Math.min(current + 1, totalPages))
                }
                className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-[#F7F9FB] disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-[13px] text-[#6B7280]">
              <span>Rows per page</span>
              <div className="w-[72px]">
                <CustomSelect
                  placeholder="10"
                  options={ROWS_PER_PAGE_OPTIONS}
                  value={String(rowsPerPage)}
                  onChange={(value) => {
                    setRowsPerPage(Number(value));
                    setPage(1);
                  }}
                  className="h-9 rounded-[10px] text-[13px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
