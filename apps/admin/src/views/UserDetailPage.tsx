"use client";

import { adminPath } from "@ssu/config/portal-paths";
import { useAdminUser } from "@ssu/queries";
import {
  AlertBanner,
  Badge,
  DetailPageSkeleton,
  GoBack,
  PageHeader,
} from "@ssu/ui";
import { displayName, displayValue } from "@ssu/utils";
import { useParams } from "next/navigation";

export function UserDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const q = useAdminUser(id);
  if (q.isLoading) {
    return (
      <div className="space-y-4">
        <GoBack fallbackHref={adminPath("/users")} />
        <DetailPageSkeleton />
      </div>
    );
  }
  if (q.isError || !q.data) {
    return (
      <div className="space-y-4">
        <GoBack fallbackHref={adminPath("/users")} />
        <AlertBanner variant="error">User not found.</AlertBanner>
      </div>
    );
  }
  const u = q.data;
  return (
    <div className="space-y-6">
      <GoBack fallbackHref={adminPath("/users")} />
      <PageHeader
        title={displayName(u.firstName, u.lastName)}
        breadcrumbs={[
          { label: "Users", href: adminPath("/users") },
          { label: displayValue(u.email) },
        ]}
      />
      <div className="rounded-xl border bg-white p-6 shadow-card space-y-3 text-body text-neutral-800">
        <p>
          <span className="text-neutral-500">Email:</span>{" "}
          {displayValue(u.email)}
        </p>
        <p className="flex items-center gap-2">
          <span className="text-neutral-500">Role:</span>{" "}
          <Badge variant={u.role}>{displayValue(u.role)}</Badge>
        </p>
        <p className="flex items-center gap-2">
          <span className="text-neutral-500">Status:</span>{" "}
          <Badge
            variant={
              u.status === "active"
                ? "active"
                : u.status === "pending"
                  ? "pending"
                  : "suspended"
            }
          >
            {displayValue(u.status)}
          </Badge>
        </p>
      </div>
    </div>
  );
}
