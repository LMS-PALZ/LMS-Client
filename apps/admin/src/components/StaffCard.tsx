"use client";

import { Users, UserCheck, Flag } from "lucide-react";
import { StatCard } from "@ssu/ui";
import { StaffAnalysis } from "@ssu/queries";

const allStaff = "Administrators";
const allTutors = "Active Trainers";
const allPending = "Pending Invites";

export function StaffCard() {
  const { data: analysisData } = StaffAnalysis();

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <StatCard
        icon={Users}
        label={allStaff}
        value={analysisData?.totalAdmins}
      />
      <StatCard
        icon={UserCheck}
        label={allTutors}
        value={analysisData?.totalInstructors}
      />
      <StatCard
        icon={Flag}
        label={allPending}
        value={analysisData?.pendingInvites}
      />
    </div>
  );
}
