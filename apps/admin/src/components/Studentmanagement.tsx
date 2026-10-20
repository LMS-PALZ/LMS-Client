"use client";

import { Button, DataTableSkeleton, useAdminModal } from "@ssu/ui";
import { useAdminPrograms, useStudentList } from "@ssu/queries";
import type { AdminRegisterStudentFormValues } from "@ssu/schema";
import type { Student } from "@ssu/types";
import { UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { RegisterStudent } from "@/views/StudentManagement/RegisterStudent";
import { Card } from "./Card";
import { StatusDialog } from "./StatusDialog";
import { Table } from "./Table";
import {
  ALL_PROGRAMS_TAB,
  ProgramTabs,
  type ProgramTab,
} from "./students/ProgramTabs";

const PAGE_SIZE = 10;

export function StudentManagement() {
  const { openModal, closeModal } = useAdminModal();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [programSelection, setSelectedProgram] =
    useState<ProgramTab>(ALL_PROGRAMS_TAB);

  const { data: programsData, isLoading: isProgramsLoading } = useAdminPrograms(
    {
      page: 1,
      limit: 100,
    },
  );

  const programs = useMemo<ProgramTab[]>(
    () =>
      (programsData?.items ?? []).map((program) => ({
        id: program.id,
        title: program.title,
        slug: program.slug,
      })),
    [programsData?.items],
  );

  const selectedProgram =
    isProgramsLoading ||
    programSelection.id === ALL_PROGRAMS_TAB.id ||
    programs.some((program) => program.id === programSelection.id)
      ? programSelection
      : ALL_PROGRAMS_TAB;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const publishedPrograms = useMemo(
    () =>
      (programsData?.items ?? []).filter(
        (program) => String(program.status).toLowerCase() === "published",
      ),
    [programsData?.items],
  );

  const openRegisterModal = (
    defaultValues?: Partial<AdminRegisterStudentFormValues>,
  ) => {
    const preselectedProgramId = publishedPrograms.some(
      (program) => program.id === selectedProgram.id,
    )
      ? selectedProgram.id
      : "";

    openModal(
      "Student Information",
      <RegisterStudent
        programs={publishedPrograms}
        defaultValues={{ programId: preselectedProgramId, ...defaultValues }}
        onClose={closeModal}
        onSuccess={(values, programTitle) => {
          openModal(
            "",
            <StatusDialog
              variant="success"
              title="Student registered!"
              description={`${values.first_name} ${values.last_name} has been enrolled in ${programTitle}. An onboarding link has been sent to ${values.email}.`}
              onDismiss={closeModal}
            />,
          );
        }}
        onError={(message, values) => {
          openModal(
            "",
            <StatusDialog
              variant="error"
              title="Registration failed"
              description={message}
              dismissLabel="Close"
              confirmLabel="Try again"
              onDismiss={closeModal}
              onConfirm={() => openRegisterModal(values)}
            />,
          );
        }}
      />,
    );
  };

  const programFilter =
    selectedProgram.id === ALL_PROGRAMS_TAB.id ? "" : selectedProgram.title;

  const { data, isLoading, isFetching } = useStudentList(
    page,
    PAGE_SIZE,
    search,
    status,
    role,
    programFilter,
  );

  const students = (data?.items ?? []) as Student[];
  const serverPagination = data?.pagination;
  const totalPages = Math.max(1, Number(serverPagination?.totalPages ?? 1));
  const currentPage = Number(serverPagination?.page ?? page);

  const pagination = {
    page: currentPage,
    totalPages,
    total: Number(serverPagination?.total ?? students.length),
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };

  const showTableLoader = isLoading || (isFetching && !data);

  const hasActiveFilters = Boolean(search.trim() || status.trim());
  const emptyMessage =
    selectedProgram.id === ALL_PROGRAMS_TAB.id
      ? hasActiveFilters
        ? "No students match your search or status filter."
        : "No students enrolled yet."
      : hasActiveFilters
        ? `No students in ${selectedProgram.title} match your search or status filter.`
        : `No students enrolled in ${selectedProgram.title} yet.`;

  return (
    <section className="flex flex-col gap-8 rounded-[18px] bg-[#FFFFFF] p-6">
      <section className="rounded-[12px] bg-[#FAFAFA] p-2">
        <Card />
      </section>

      <ProgramTabs
        programs={programs}
        selectedId={selectedProgram.id}
        isLoading={isProgramsLoading}
        onSelect={(program) => {
          if (program.id === selectedProgram.id) return;
          setSelectedProgram(program);
          setSearch("");
          setStatus("");
          setPage(1);
        }}
      />

      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          {showTableLoader || isProgramsLoading ? (
            <div
              className="h-11 w-[180px] animate-pulse rounded-[30px] bg-[#EEF2F6]"
              aria-hidden
            />
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => openRegisterModal()}
              className="flex items-center gap-2 rounded-[30px] py-2 text-[var(--color-surface)]"
            >
              <UserPlus size={18} />
              Register Student
            </Button>
          )}
        </div>

        {showTableLoader ? (
          <DataTableSkeleton
            rows={8}
            columns={5}
            className="border-0 bg-transparent p-0 shadow-none"
          />
        ) : (
          <Table
            students={students}
            pagination={pagination}
            search={search}
            setSearch={handleSearchChange}
            status={status}
            setStatus={handleStatusChange}
            role={role}
            setRole={setRole}
            setPage={setPage}
            emptyMessage={emptyMessage}
          />
        )}
      </div>
    </section>
  );
}
