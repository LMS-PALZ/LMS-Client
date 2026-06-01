"use client";

import { useStudentAssignments } from "@ssu/queries";
import {
  AlertBanner,
  AssignmentSummaryCard,
  Button,
  DashboardEmptyState,
  SectionHeader,
  AssignmentGridSkeleton,
} from "@ssu/ui";
import { assignmentCardProps } from "@/lib/assignment-display";
import { ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Filter = "all" | "not-started" | "submitted" | "graded" | "overdue";

export function AssessmentsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const q = useStudentAssignments();

  const filtered = useMemo(() => {
    const data = q.data ?? [];
    if (filter === "all") return data;
    return data.filter((a) => a.status === filter);
  }, [q.data, filter]);

  return (
    <div className="space-y-6">
      <SectionHeader title="Assessments" />
      {q.isError && (
        <AlertBanner variant="error">Could not load assessments.</AlertBanner>
      )}
      <div className="flex flex-wrap gap-2">
        {(
          ["all", "not-started", "submitted", "graded", "overdue"] as const
        ).map((f) => (
          <Button
            key={f}
            type="button"
            variant={filter === f ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f.replace("-", " ")}
          </Button>
        ))}
      </div>
      {q.isLoading ? (
        <AssignmentGridSkeleton
          count={6}
          columnsClassName="sm:grid-cols-2 lg:grid-cols-3"
        />
      ) : filtered.length === 0 ? (
        <DashboardEmptyState
          icon={ClipboardList}
          title="No assessments yet"
          description="When you have assessments, they'll show up here"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <AssignmentSummaryCard
              key={a.id}
              {...assignmentCardProps(a)}
              onClick={() => router.push(`/assessments/${a.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
