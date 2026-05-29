"use client";

import { useAdminUsers, usePendingTrainers } from "@ssu/queries";
import {
  AlertBanner,
  PageHeader,
  Skeleton,
  StatCard,
  StatusBadge,
} from "@ssu/ui";
import { BookOpen, Megaphone, UserCheck, Users } from "lucide-react";
import Link from "next/link";

export function HomePage() {
  const usersQ = useAdminUsers();
  const pendingQ = usePendingTrainers();

  const userCount = usersQ.data?.length ?? 0;
  const pendingCount = pendingQ.data?.length ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader title="Admin dashboard" />
      <p className="text-body text-neutral-600 -mt-4">
        QA preview: full admin designs are in progress. Use the links below to
        explore available areas.
      </p>

      {(usersQ.isError || pendingQ.isError) && (
        <AlertBanner variant="error">Could not load admin data.</AlertBanner>
      )}

      <div className="rounded-xl border border-brand-green-200 bg-brand-green-50 px-4 py-3 text-small text-brand-green">
        <StatusBadge variant="enrolled" className="mb-2">
          QA build
        </StatusBadge>
        <p>
          This dashboard uses live mock data for navigation and layout review.
          Final visuals will follow the admin Figma screens.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {usersQ.isLoading ? (
          <Skeleton className="h-28 rounded-xl" />
        ) : (
          <StatCard label="Registered users" value={userCount} icon={Users} />
        )}
        {pendingQ.isLoading ? (
          <Skeleton className="h-28 rounded-xl" />
        ) : (
          <StatCard
            label="Pending trainers"
            value={pendingCount}
            icon={UserCheck}
            accent="amber"
          />
        )}
        <StatCard label="Programs" value="N/A" icon={BookOpen} />
        <StatCard label="Announcements" value="N/A" icon={Megaphone} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-5 shadow-card">
          <h2 className="text-h3 font-bold text-neutral-900 mb-3">
            Quick actions
          </h2>
          <ul className="space-y-2 text-small">
            <li>
              <Link
                href="/users"
                className="font-medium text-brand-green hover:underline"
              >
                Manage users ({userCount})
              </Link>
            </li>
            <li>
              <Link
                href="/trainers/pending"
                className="font-medium text-brand-green hover:underline"
              >
                Review trainer applications ({pendingCount})
              </Link>
            </li>
            <li>
              <Link
                href="/programs"
                className="font-medium text-brand-green hover:underline"
              >
                Programs
              </Link>
            </li>
            <li>
              <Link
                href="/announcements"
                className="font-medium text-brand-green hover:underline"
              >
                Announcements
              </Link>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border bg-white p-5 shadow-card">
          <h2 className="text-h3 font-bold text-neutral-900 mb-3">
            What QA can test
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-small text-neutral-600">
            <li>Sidebar navigation and page routing</li>
            <li>User list and trainer approval flows (mock API)</li>
            <li>Auth: login, forgot password, reset password</li>
            <li>Responsive layout on desktop and tablet widths</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
