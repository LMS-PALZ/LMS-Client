"use client";

import type { AdminUserRow } from "@ssu/api";
import { useAdminUsers } from "@ssu/queries";
import {
  AlertBanner,
  Badge,
  Button,
  DataTable,
  EmptyState,
  PageHeader,
  Skeleton,
} from "@ssu/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { Users } from "lucide-react";
import Link from "next/link";

const columns: ColumnDef<AdminUserRow>[] = [
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
  },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={row.original.role}>{row.original.role}</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "active"
            ? "active"
            : row.original.status === "pending"
              ? "pending"
              : "suspended"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Button variant="secondary" size="sm" asChild>
        <Link href={`/users/${row.original.id}`}>View</Link>
      </Button>
    ),
  },
];

export function UsersPage() {
  const q = useAdminUsers();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        breadcrumbs={[{ label: "Admin" }, { label: "Users" }]}
      />
      {q.isError && (
        <AlertBanner variant="error">Unable to load users.</AlertBanner>
      )}
      {q.isLoading ? (
        <Skeleton className="h-48 w-full rounded-xl" />
      ) : !q.data?.length ? (
        <EmptyState
          icon={Users}
          title="No users"
          description="Demo list is empty."
        />
      ) : (
        <DataTable columns={columns} data={q.data} searchable />
      )}
    </div>
  );
}
