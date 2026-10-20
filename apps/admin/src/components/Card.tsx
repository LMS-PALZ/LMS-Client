"use client";

import { Users, UserCheck, Clock3, Flag } from "lucide-react";
import { StatCard } from "@ssu/ui";
import { useStudentList } from "@ssu/queries";
import { AdminStatsCardsSkeleton } from "@/components/skeletons";

interface StudentStatsMeta {
  totalEnrolled?: number;
  totalActiveStudents?: number;
  totalPendingStudents?: number;
  activeThisWeek?: { count?: number; percent?: number };
  flaggedStudents?: number;
}

export function Card() {
  // Unfiltered, so table search, status, program and paging never change the stats.
  const { data, isLoading } = useStudentList(1, 1);
  const meta = data?.meta as StudentStatsMeta | undefined;

  if (isLoading && !meta) {
    return <AdminStatsCardsSkeleton />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={UserCheck}
        label="Active students"
        value={meta?.totalActiveStudents ?? 0}
        description="Finished onboarding"
      />
      <StatCard
        icon={Clock3}
        label="Pending students"
        value={meta?.totalPendingStudents ?? 0}
        description="Still onboarding"
      />
      <StatCard
        icon={Users}
        label="Active this week"
        value={meta?.activeThisWeek?.count ?? 0}
        description={`${meta?.activeThisWeek?.percent ?? 0}%`}
      />
      <StatCard
        icon={Flag}
        label="Flagged Students"
        value={meta?.flaggedStudents ?? 0}
        description="Missed live classes"
      />
    </div>
  );
}
