"use client";

import {
  AssessmentListToolbar,
  AssessmentProgressInsight,
} from "@/components/assessments";
import { assignmentCardProps } from "@/lib/assignment-display";
import {
  useStudentOverallProgress,
  useStudentassignments,
  useMySubmissions,
} from "@ssu/queries";
import type { AssignmentListItem, AssignmentStatus } from "@ssu/types";
import {
  AlertBanner,
  AssignmentSummaryCard,
  Button,
  DashboardEmptyState,
  AssignmentGridSkeleton,
} from "@ssu/ui";
import { ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSignupStore } from "@ssu/store";

type AssessmentTab = "Assigned" | "Submitted";

const PAGE_SIZE = 8;

export function AssessmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTab = (searchParams.get("tab") ?? "").toLowerCase();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeTab, setActiveTab] = useState<AssessmentTab>(
    searchTab === "submitted" ? "Submitted" : "Assigned",
  );

  useEffect(() => {
    if (searchTab === "submitted") {
      setActiveTab("Submitted");
    } else if (searchTab === "assigned") {
      setActiveTab("Assigned");
    }
  }, [searchTab]);

  const programId = useSignupStore((state) => state.user?.programId ?? "");

  const assignments = useStudentassignments(programId);
  const { data: submissions, isLoading: submissionsLoading } = useMySubmissions(
    {
      enabled: activeTab === "Submitted",
    },
  );
  const { data: overallProgress } = useStudentOverallProgress(programId);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    if (activeTab === "Submitted") {
      const list = Array.isArray(submissions) ? submissions : [];

      const mapped: AssignmentListItem[] = list
        .map((s: any) => {
          const status: AssignmentStatus =
            s.status === "graded" ||
            s.status === "recorded" ||
            s.status === "scored"
              ? "graded"
              : "submitted";
          const item: AssignmentListItem = {
            id: s._id,
            title: s.assessmentId?.title ?? "Untitled",
            courseId: s.programId ?? "",
            courseName: s.assessmentId?.module ?? "Assessment",
            dueAt: s.assessmentId?.dueDate ?? "",
            status,
            moduleLabel: s.assessmentId?.module ?? "",
            weightPercent: s.assessmentId?.weight ?? 0,
            scoreDisplay: s.score !== null ? String(s.score) : "N/A",
          };
          return item;
        })
        .filter((a) => {
          const { filterValue } = assignmentCardProps(a);
          const matchesStatus =
            statusFilter === "all" || filterValue === statusFilter;
          const matchesSearch =
            !q ||
            a.title.toLowerCase().includes(q) ||
            (a.moduleLabel ?? "").toLowerCase().includes(q) ||
            a.courseName.toLowerCase().includes(q);
          return matchesStatus && matchesSearch;
        });

      return mapped;
    }

    const data = assignments.data ?? [];
    return data.filter((a) => {
      const { filterValue } = assignmentCardProps(a);
      const matchesTab =
        a.status === "not-started" ||
        a.status === "published" ||
        a.status === "draft" ||
        a.status === "closed" ||
        a.status === "archive";
      const matchesStatus =
        statusFilter === "all" || filterValue === statusFilter;
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        (a.moduleLabel ?? "").toLowerCase().includes(q) ||
        a.courseName.toLowerCase().includes(q);
      return matchesTab && matchesStatus && matchesSearch;
    });
  }, [assignments.data, submissions, statusFilter, searchQuery, activeTab]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const scorePercent = overallProgress?.percentage ?? 10;

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-bold text-neutral-900 sm:text-[24px]">
        Assessment
      </h1>

      {assignments.isError && (
        <AlertBanner variant="error">Could not load assessments.</AlertBanner>
      )}

      <AssessmentProgressInsight scorePercent={scorePercent} />

      <section className="space-y-4">
        <h2 className="text-[17px] font-bold text-neutral-900 sm:text-[18px]">
          Assignments
        </h2>

        <div className="flex items-center gap-2 rounded-[12px] bg-[#ECF0F6] p-[2px] w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("Assigned")}
            className={`rounded-[9px] px-5 py-2 text-[12px] font-medium transition ${
              activeTab === "Assigned"
                ? "bg-white text-[#1D1D1D] shadow-sm"
                : "text-[#6B7280]"
            }`}
          >
            Assigned
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("Submitted")}
            className={`rounded-[9px] px-5 py-2 text-[12px] font-medium transition ${
              activeTab === "Submitted"
                ? "bg-white text-[#1D1D1D] shadow-sm"
                : "text-[#6B7280]"
            }`}
          >
            Submitted
          </button>
        </div>

        <AssessmentListToolbar
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            setVisibleCount(PAGE_SIZE);
          }}
          searchQuery={searchQuery}
          onSearchQueryChange={(value) => {
            setSearchQuery(value);
            setVisibleCount(PAGE_SIZE);
          }}
        />

        {assignments.isLoading ||
        (activeTab === "Submitted" && submissionsLoading) ? (
          <AssignmentGridSkeleton
            count={8}
            columnsClassName="sm:grid-cols-2 lg:grid-cols-4"
          />
        ) : filtered.length === 0 ? (
          <DashboardEmptyState
            icon={ClipboardList}
            title="No assessments found"
            description="Try a different search or status filter."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {visible.map((a) => (
                <AssignmentSummaryCard
                  key={a.id}
                  {...assignmentCardProps(a).card}
                  onClick={() => router.push(`/assessments/${a.id}`)}
                />
              ))}
            </div>
            {hasMore ? (
              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-full border-[#D4EDDA] bg-[#F0FDF4] px-8 text-[#2D6A4F] hover:bg-[#DCFCE7]"
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                >
                  Load More
                </Button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
