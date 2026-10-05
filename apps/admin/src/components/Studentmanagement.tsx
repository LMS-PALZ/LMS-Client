"use client";

import { DataTableSkeleton } from "@ssu/ui";
import { useAdminPrograms, useStudentList } from "@ssu/queries";
import type { Student } from "@ssu/types";
import { useEffect, useMemo, useState } from "react";
import { Card } from "./Card";
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
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [selectedProgram, setSelectedProgram] =
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

  useEffect(() => {
    if (isProgramsLoading) return;

    if (selectedProgram.id === ALL_PROGRAMS_TAB.id) return;

    const stillAvailable = programs.some(
      (program) => program.id === selectedProgram.id,
    );
    if (!stillAvailable) {
      setIsProgramPending(true);
      setSelectedProgram(ALL_PROGRAMS_TAB);
    }
  }, [isProgramsLoading, programs, selectedProgram]);

  useEffect(() => {
    setPage(1);
  }, [selectedProgram?.id, search, status]);

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
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          role={role}
          setRole={setRole}
          setPage={setPage}
          emptyMessage={emptyMessage}
        />
      )}
    </section>
  );
}
