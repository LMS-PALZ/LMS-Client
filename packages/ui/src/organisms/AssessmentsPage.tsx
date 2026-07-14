"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList } from "lucide-react";
import {
  useAdminPrograms,
  useAssessmentsByProgram,
  useSession,
} from "@ssu/queries";
import { Button } from "../atoms/Button";
import { DashboardEmptyState } from "../molecules/DashboardEmptyState";
import { AssignmentTable } from "../molecules/AsignmentTable";

function isTutorRole(role: string | undefined): boolean {
  const normalized = (role ?? "").toLowerCase().trim();
  return (
    normalized === "tutor" ||
    normalized === "trainer" ||
    normalized === "instructor"
  );
}

function readStoredProgramId(): string {
  if (typeof window === "undefined") return "";
  const raw = localStorage.getItem("programId")?.trim() ?? "";
  if (!raw || raw === "[object Object]") return "";
  return raw;
}

export function AssessmentsPage() {
  const router = useRouter();
  const { data: user, isLoading: isSessionLoading } = useSession();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [programId, setProgramId] = useState(readStoredProgramId);

  const asTutor = isTutorRole(user?.role);

  const { data: programsData, isLoading: isProgramsLoading } = useAdminPrograms(
    { page: 1, limit: 100 },
    {
      asTutor,
      tutorUserId: user?.id,
      tutorEmail: user?.email,
      accessToken: user?.accessToken,
      enabled: !isSessionLoading && Boolean(user),
    },
  );

  const programs = programsData?.items ?? [];
  const hasCourses = programs.length > 0;
  const canCreateAssessment = !asTutor || hasCourses;
  const fallbackProgramId = programs[0]?.id?.trim() ?? "";

  // Prefer an already-selected course. Only fall back to the first course once.
  useEffect(() => {
    if (programId) return;
    if (!fallbackProgramId) return;
    localStorage.setItem("programId", fallbackProgramId);
    setProgramId(fallbackProgramId);
  }, [programId, fallbackProgramId]);

  const { data, isError, error, isLoading } = useAssessmentsByProgram(
    programId,
    page,
    8,
    status,
    search,
  );

  const assessments = Array.isArray(data?.assessments) ? data.assessments : [];
  const pagination = data?.pagination;

  if (asTutor && !isProgramsLoading && !hasCourses && !programId) {
    return (
      <section className="flex flex-col gap-8 rounded-[18px] bg-[#FFFFFF] p-6">
        <DashboardEmptyState
          icon={ClipboardList}
          title="No course assigned yet"
          description="Once an admin assigns you to a course, you can create and manage assessments here."
        />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8 rounded-[18px] bg-[#FFFFFF] p-6">
      {canCreateAssessment ? (
        <div className="flex justify-end gap-3">
          <Button
            variant="primary"
            className="rounded-full px-6 bg-[#4C7D5B] text-[#F8F9FA]"
            onClick={() => router.push("/createassignment")}
          >
            + Create
          </Button>
        </div>
      ) : null}

      {isError ? (
        <DashboardEmptyState
          icon={ClipboardList}
          title="Unable to load assessments"
          description={
            error instanceof Error
              ? error.message
              : "Please refresh and try again."
          }
        />
      ) : !programId ? (
        <DashboardEmptyState
          icon={ClipboardList}
          title="You haven't created an assessment yet"
          description="When you do, they'll show up here"
        />
      ) : (
        <AssignmentTable
          students={assessments}
          programId={programId}
          pagination={pagination}
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          setPage={setPage}
          isLoading={isLoading}
        />
      )}
    </section>
  );
}
