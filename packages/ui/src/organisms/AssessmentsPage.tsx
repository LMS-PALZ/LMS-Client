"use client";

import { AssignmentTable } from "../molecules/AsignmentTable";
import { useAssessmentsByProgram } from "@ssu/queries";
import { useState } from "react";
import { Button, DashboardEmptyState } from "@ssu/ui";
import { useRouter } from "next/navigation";
import { ClipboardList } from "lucide-react";

export function AssessmentsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const programId = localStorage.getItem("programId") ?? "";

  console.log("programId", programId);

  const { data } = useAssessmentsByProgram(programId, page, 8, status, search);

  return (
    <section className="flex flex-col gap-8 rounded-[18px] bg-[#FFFFFF] p-6">
      <div className="flex justify-end gap-3">
        <Button
          variant="primary"
          className="rounded-full px-6 bg-[#4C7D5B] text-[#F8F9FA]"
          onClick={() => router.push("/createasignment")}
        >
          + Create Assignment
        </Button>
      </div>
      {programId === "" ? (
        <DashboardEmptyState
          icon={ClipboardList}
          title="You haven’t create an assessment  yet"
          description="When you do, they’ll show up here"
        />
      ) : (
        <AssignmentTable
          students={data?.assessments ?? []}
          pagination={data?.pagination}
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          setPage={setPage}
        />
      )}
    </section>
  );
}
