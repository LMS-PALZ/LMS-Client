"use client";

import { usePendingTrainers } from "@ssu/queries";
import {
  AlertBanner,
  Button,
  CardSkeleton,
  EmptyState,
  PageHeader,
  PageHeaderSkeleton,
} from "@ssu/ui";
import { UserCheck } from "lucide-react";

export function PendingTrainersPage() {
  const q = usePendingTrainers();

  if (q.isLoading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton showBreadcrumbs />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} lines={3} className="min-h-[88px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trainer approvals"
        breadcrumbs={[{ label: "Admin" }, { label: "Pending trainers" }]}
      />
      {q.isError && (
        <AlertBanner variant="error">Unable to load applications.</AlertBanner>
      )}
      {!q.data?.length ? (
        <EmptyState icon={UserCheck} title="No pending applications" />
      ) : (
        <ul className="space-y-3">
          {q.data.map((t) => (
            <li
              key={t.id}
              className="flex flex-col gap-2 rounded-xl border bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-h4 text-neutral-900">
                  {t.firstName} {t.lastName}
                </p>
                <p className="text-small text-neutral-600">{t.email}</p>
                <p className="text-small text-neutral-500 mt-1">
                  Skills: {t.skills}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => window.alert("Demo: rejected")}
                >
                  Reject
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => window.alert("Demo: approved")}
                >
                  Approve
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
