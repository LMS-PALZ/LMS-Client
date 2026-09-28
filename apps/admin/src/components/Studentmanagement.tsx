"use client";

import { DataTableSkeleton } from "@ssu/ui";
import { useAdminPrograms, useStudentList } from "@ssu/queries";
import type { Student } from "@ssu/types";
import { useEffect, useMemo, useState } from "react";
import { Card } from "./Card";
import { Table } from "./Table";
import { ProgramTabs, type ProgramTab } from "./students/ProgramTabs";

const PAGE_SIZE = 10;

function matchesProgram(student: Student, program: ProgramTab) {
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
  const [selectedProgram, setSelectedProgram] = useState<ProgramTab | null>(
    null,
  );
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

    if (!programs.length) {
      if (selectedProgram) setSelectedProgram(null);
      return;
    }

    const stillAvailable = selectedProgram
      ? programs.some((program) => program.id === selectedProgram.id)
      : false;

    if (!stillAvailable) {
      setIsProgramPending(true);
      setSelectedProgram(programs[0]);
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

  // Load students by search/status, then isolate by selected program on the client.
  const { data, isLoading, isFetching } = useStudentList(
    1,
    100,
    search,
    status,
    role,
    "",
    { enabled: Boolean(selectedProgram?.id) },
  );

  const programStudents = useMemo(() => {
    if (!selectedProgram || isProgramPending) return [];
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

  return (
    <section className="flex flex-col gap-8 rounded-[18px] bg-[#FFFFFF] p-6">
      <section className="rounded-[12px] bg-[#FAFAFA] p-2">
        <Card />
      </section>

      <ProgramTabs
        programs={programs}
        selectedId={selectedProgram?.id ?? ""}
        isLoading={isProgramsLoading}
        onSelect={(program) => {
          if (program.id === selectedProgram?.id) return;
          setIsProgramPending(true);
          setSelectedProgram(program);
          setSearch("");
          setStatus("");
          setPage(1);
        }}
      />

      {!selectedProgram && !isProgramsLoading ? (
        <p className="text-center text-[14px] text-[#94A3B8]">
          Select a program to view its students.
        </p>
      ) : showTableLoader ? (
        <DataTableSkeleton
          rows={8}
          columns={6}
          className="border-0 bg-transparent p-0 shadow-none"
        />
      ) : programStudents.length === 0 ? (
        <div className="rounded-[16px] border border-[#EEF2F6] bg-white px-6 py-16 text-center text-[14px] text-[#94A3B8]">
          No students enrolled in {selectedProgram?.title ?? "this program"}{" "}
          yet.
        </div>
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
        />
      )}
    </section>
  );
}
