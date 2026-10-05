"use client";

import { Users, UserCheck, Clock3, Flag } from "lucide-react";
import { StatCard } from "@ssu/ui";
import { useStudentList } from "@ssu/queries";
import { useMemo } from "react";
import { AdminStatsCardsSkeleton } from "@/components/skeletons";

export function Card() {
  const { data: statsData, isLoading } = useStudentList(1, 100);

  const counts = useMemo(() => {
    const items = statsData?.items ?? [];
    let active = 0;
    let pending = 0;
    for (const student of items) {
      const status = String(student.status ?? "")
        .trim()
        .toLowerCase();
      if (status === "active") active += 1;
      else if (status === "pending") pending += 1;
    }
    return { active, pending };
  }, [statsData?.items]);

  if (isLoading && !statsData) {
    return <AdminStatsCardsSkeleton />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={UserCheck}
        label="Active students"
        value={counts.active}
        description="Finished onboarding"
      />
      <StatCard
        icon={Clock3}
        label="Pending students"
        value={counts.pending}
        description="Still onboarding"
      />
      <StatCard
        icon={Users}
        label="Active this week"
        value={statsData?.meta?.activeThisWeek?.count}
        description={`${statsData?.meta?.activeThisWeek?.percent ?? 0}%`}
      />
      <StatCard
        icon={Flag}
        label="Flagged Students"
        value={statsData?.meta?.flaggedStudents}
        description="Missed live classes"
      />
    </div>
  );
}
