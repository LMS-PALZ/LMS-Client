"use client";

// import { adminPath } from "@ssu/config/portal-paths";
import { useAdminUsers, usePendingTrainers } from "@ssu/queries";
import {
  AlertBanner,
  PageHeader,
  StatCard,
  StatCardSkeleton,
  StatusBadge,
} from "@ssu/ui";
import { BookOpen, UserCheck, Users } from "lucide-react";

export function HomePage() {
  const usersQ = useAdminUsers();
  const pendingQ = usePendingTrainers();

  const userCount = usersQ.data?.length ?? 0;
  const pendingCount = pendingQ.data?.length ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader title="Admin dashboard" />

      {(usersQ.isError || pendingQ.isError) && (
        <AlertBanner variant="error">Could not load admin data.</AlertBanner>
      )}

      <StatusBadge variant="enrolled" className="mb-2">
        QA build
      </StatusBadge>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {usersQ.isLoading ? (
          <StatCardSkeleton />
        ) : (
          <StatCard label="Registered users" value={userCount} icon={Users} />
        )}
        {pendingQ.isLoading ? (
          <StatCardSkeleton />
        ) : (
          <StatCard
            label="Pending trainers"
            value={pendingCount}
            icon={UserCheck}
            accent="amber"
          />
        )}
        <StatCard label="Programs" value="N/A" icon={BookOpen} />
      </div>
    </div>
  );
}
