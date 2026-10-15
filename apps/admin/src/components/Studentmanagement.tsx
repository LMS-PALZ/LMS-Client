"use client";

import { Button, DataTableSkeleton, useAdminModal } from "@ssu/ui";
import { useAdminPrograms, useStudentList } from "@ssu/queries";
import type { AdminRegisterStudentFormValues } from "@ssu/schema";
import type { Student } from "@ssu/types";
import { UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

function matchesProgram(student: Student, program: ProgramTab) {
  if (program.id === ALL_PROGRAMS_TAB.id) return true;

  const label = String(student.programTitle ?? "")
    .trim()
    .toLowerCase();
  if (!label) return false;

  const title = program.title.trim().toLowerCase();
  const slug = (program.slug ?? "").trim().toLowerCase();
  const parts = label
    .split(/[,|/]/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    label === title ||
    (slug !== "" && label === slug) ||
    parts.includes(title) ||
    (slug !== "" && parts.includes(slug)) ||
    label.includes(title) ||
    title.includes(label)
  );
}

export function StudentManagement() {
  const { openModal, closeModal } = useAdminModal();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [programSelection, setSelectedProgram] =
    useState<ProgramTab>(ALL_PROGRAMS_TAB);
  const [isProgramPending, setIsProgramPending] = useState(false);

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

  useEffect(() => {
    if (!isProgramPending) return;
    const timer = window.setTimeout(() => setIsProgramPending(false), 280);
    return () => window.clearTimeout(timer);
  }, [selectedProgram?.id, isProgramPending]);

  const { data, isLoading, isFetching } = useStudentList(
    1,
    100,
    search,
    status,
    role,
    "",
  );

  const programStudents = useMemo(() => {
    if (isProgramPending) return [];
    const items = (data?.items ?? []) as Student[];
    return items.filter((student) => matchesProgram(student, selectedProgram));
  }, [data?.items, selectedProgram, isProgramPending]);

  const totalPages = Math.max(1, Math.ceil(programStudents.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedStudents = programStudents.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const pagination = {
    page: safePage,
    totalPages,
    total: programStudents.length,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };

  const showTableLoader =
    isProgramPending || isLoading || (isFetching && !data);

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
          setIsProgramPending(true);
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
            students={pagedStudents}
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
