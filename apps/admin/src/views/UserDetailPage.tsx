"use client";

import { useAdminUser } from "@ssu/queries";
import { AlertBanner, Badge, Button, PageHeader, Skeleton } from "@ssu/ui";
import Link from "next/link";
import { useParams } from "next/navigation";

export function UserDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const q = useAdminUser(id);
  if (q.isLoading) return <Skeleton className="h-40 w-full rounded-xl" />;
  if (q.isError || !q.data)
    return <AlertBanner variant="error">User not found.</AlertBanner>;
  const u = q.data;
  return (
    <div className="space-y-6">
      <PageHeader
        title={`${u.firstName} ${u.lastName}`}
        breadcrumbs={[{ label: "Users", href: "/users" }, { label: u.email }]}
        action={
          <Button variant="secondary" size="sm" asChild>
            <Link href="/users">Back</Link>
          </Button>
        }
      />
      <div className="rounded-xl border bg-white p-6 shadow-card space-y-3 text-body text-neutral-800">
        <p>
          <span className="text-neutral-500">Email:</span> {u.email}
        </p>
        <p className="flex items-center gap-2">
          <span className="text-neutral-500">Role:</span>{" "}
          <Badge variant={u.role}>{u.role}</Badge>
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
            {u.status}
          </Badge>
        </p>
      </div>
    </div>
  );
}
