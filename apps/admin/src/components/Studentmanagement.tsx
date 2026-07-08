"use client";

import { DataTableSkeleton } from "@ssu/ui";
import { useStudentList } from "@ssu/queries";
import { useState } from "react";
import { Card } from "./Card";
import { Table } from "./Table";

export function StudentManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [course, setCourse] = useState("");

  const { data, isLoading } = useStudentList(
    page,
    10,
    search,
    status,
    role,
    course,
  );

  return (
    <section className="flex flex-col gap-8 rounded-[18px] bg-[#FFFFFF] p-6">
      <section className="p-2 bg-[#FAFAFA] rounded-[12px]">
        <Card />
      </section>

      {isLoading && !data ? (
        <DataTableSkeleton
          rows={8}
          columns={6}
          className="border-0 bg-transparent p-0 shadow-none"
        />
      ) : (
        <Table
          students={data?.items ?? []}
          pagination={data?.pagination}
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          role={role}
          setRole={setRole}
          course={course}
          setCourse={setCourse}
          setPage={setPage}
        />
      )}
    </section>
  );
}
