"use client";

import { Users, UserCheck, Flag } from "lucide-react";
import { StatCard } from "@ssu/ui";
import { useStudentList } from "@ssu/queries";

const title = "Total enrolled";
const enrollstats = "Across 5 program";
const weeks = "Active this week";
const flags = "Flagged Students";
const missclss = "Missed live classes";

export function Card() {
  const { data: statsData } = useStudentList();
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <StatCard
        icon={Users}
        label={title}
        value={statsData?.meta?.totalEnrolled}
        description={enrollstats}
      />
      <StatCard
        icon={UserCheck}
        label={weeks}
        value={statsData?.meta?.activeThisWeek?.count}
        description={`${statsData?.meta?.activeThisWeek?.percent ?? 0}%`}
      />
      <StatCard
        icon={Flag}
        label={flags}
        value={statsData?.meta?.flaggedStudents}
        description={missclss}
      />
    </div>
  );
}
