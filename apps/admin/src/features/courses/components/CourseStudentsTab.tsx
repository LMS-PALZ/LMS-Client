"use client";

import { useMemo, useState } from "react";
import { useProgramApplicants } from "@ssu/queries";
import { Spinner } from "@ssu/ui";
import {
  buildApplicantYearOptions,
  matchesApplicantSearch,
  matchesApplicantStatusFilter,
  matchesApplicantYearFilter,
} from "../lib/student-utils";
import { StudentsPagination } from "./students/StudentsPagination";
import { StudentsTable } from "./students/StudentsTable";
import { StudentsToolbar } from "./students/StudentsToolbar";

interface CourseStudentsTabProps {
  programId: string;
  cohortName?: string;
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

  const yearOptions = useMemo(
    () => buildApplicantYearOptions(data?.items ?? []),
    [data?.items],
  );

  const filteredApplicants = useMemo(() => {
    return (data?.items ?? []).filter(
      (applicant) =>
        matchesApplicantStatusFilter(applicant, statusFilter) &&
        matchesApplicantYearFilter(applicant, yearFilter) &&
        matchesApplicantSearch(applicant, search),
    );
  }, [data?.items, statusFilter, yearFilter, search]);

  const pagination = data?.pagination;
  const total = pagination?.total ?? filteredApplicants.length;
  const totalPages = pagination?.totalPages ?? 1;

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
      <StudentsToolbar
        total={total}
        statusFilter={statusFilter}
        yearFilter={yearFilter}
        yearOptions={yearOptions}
        search={search}
        onStatusFilterChange={setStatusFilter}
        onYearFilterChange={setYearFilter}
        onSearchChange={setSearch}
        onSearchClear={() => setSearch("")}
      />

      {filteredApplicants.length === 0 ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-[18px] border border-dashed border-[#E2E8F0] bg-[#FAFBFC] text-[14px] text-[#94A3B8]">
          No students match your search or filter.
        </div>
      ) : (
        <StudentsTable
          applicants={filteredApplicants}
          cohortName={cohortName}
        />
      )}

      {total > 0 && (
        <StudentsPagination
          page={page}
          totalPages={totalPages}
          total={total}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      )}
    </div>
  );
}
