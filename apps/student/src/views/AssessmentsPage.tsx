"use client";

import {
  AssessmentListToolbar,
  AssessmentProgressInsight,
} from "@/components/assessments";
import { assignmentCardProps } from "@/lib/assignment-display";
import { useStudentProgress, useStudentassignments } from "@ssu/queries";
import {
  AlertBanner,
  AssignmentSummaryCard,
  Button,
  DashboardEmptyState,
  AssignmentGridSkeleton,
} from "@ssu/ui";
import { ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const PAGE_SIZE = 8;

export function AssessmentsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const programId = localStorage.getItem("profileId") ?? "";
  const assignments = useStudentassignments(programId);
  const progress = useStudentProgress();

  const filtered = useMemo(() => {
    const data = assignments.data ?? [];
    const q = searchQuery.trim().toLowerCase();
    return data.filter((a) => {
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
  }, [assignments.data, statusFilter, searchQuery]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const scorePercent = progress.data?.overallScorePercent ?? 10;

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

        {assignments.isLoading ? (
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
                  onClick={() =>
                    router.push(`/assessments/${assignments?.data?.[0]?.id}`)
                  }
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
