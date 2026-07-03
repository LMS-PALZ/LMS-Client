"use client";

import { AssignmentTable } from "@/components/AsignmentTable";
import { useStudentList } from "@ssu/queries";
import { useState } from "react";
import { Button, DataTableSkeleton } from "@ssu/ui";
import { useRouter } from "next/navigation";

export function AssessmentsPage() {
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

  const router = useRouter();

  return (
    <section className="flex flex-col gap-8 rounded-[18px] bg-[#FFFFFF] p-6">
      <div className="flex justify-end gap-3">
        <Button
          variant="primary"
          className="rounded-full px-6 bg-[#4C7D5B] text-[#F8F9FA]"
          onClick={() => router.push("/createAssignment")}
        >
          + create assignment
        </Button>
      </div>
      {isLoading && !data ? (
        <DataTableSkeleton
          rows={8}
          columns={6}
          className="border-0 bg-transparent p-0 shadow-none"
        />
      ) : (
        <AssignmentTable
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
