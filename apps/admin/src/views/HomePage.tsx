"use client";

import { useAdminUsers, usePendingTrainers } from "@ssu/queries";
import { AlertBanner, PageHeader, Skeleton, StatCard } from "@ssu/ui";
import { UserCheck, Users } from "lucide-react";
import Link from "next/link";

export function HomePage() {
  const usersQ = useAdminUsers();
  const pendingQ = usePendingTrainers();

  return (
    <div className="space-y-8">
      <PageHeader title="Overview" />
      {(usersQ.isError || pendingQ.isError) && (
        <AlertBanner variant="error">Could not load admin data.</AlertBanner>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {usersQ.isLoading ? (
          <Skeleton className="h-28 rounded-xl" />
        ) : (
          <StatCard
            label="Registered users"
            value={usersQ.data?.length ?? 0}
            icon={Users}
          />
        )}
        {pendingQ.isLoading ? (
          <Skeleton className="h-28 rounded-xl" />
        ) : (
          <StatCard
            label="Pending trainer applications"
            value={pendingQ.data?.length ?? 0}
            icon={UserCheck}
            accent="amber"
          />
        )}
      </div>
      <div className="rounded-xl border bg-white p-4 shadow-card">
        <h2 className="text-h3 text-neutral-900 mb-3">Shortcuts</h2>
        <ul className="space-y-2 text-small">
          <li>
            <Link
              href="/users"
              className="font-medium text-brand-green hover:underline"
            >
              Manage users
            </Link>
          </li>
          <li>
            <Link
              href="/trainers/pending"
              className="font-medium text-brand-green hover:underline"
            >
              Review trainer applications
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
