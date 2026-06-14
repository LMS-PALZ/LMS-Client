"use client";

import { DataTable } from "@ssu/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { Admins } from "@ssu/types";
import { useMemo } from "react";
import { StatusBadge } from "./StatusBadge";

const AVATAR_COLORS = [
  "bg-[#86EFAC] text-[#033207]",
  "bg-[#E2E8F0] text-[#033207]",
  "bg-[#2BADFF] text-[#033207]",
  "bg-[#F87171] text-[#033207]",
  "bg-[#FCE4EC] text-[#033207]",
  "bg-[#86EFAC] text-[#033207]",
  "bg-[#FFF8E1] text-[#033207]",
  "bg-[#EDE7F6] text-[#033207]",
];

function getInitials(name: string): string {
  if (!name) return "";

  const parts = name.trim().split(" ");

  const first = parts[0]?.charAt(0).toUpperCase() ?? "";
  const last =
    parts.length > 1 ? parts[parts.length - 1]?.charAt(0).toUpperCase() : "";

  return `${first}${last}`;
}
function getAvatarColor(): string {
  const index = Math.floor(Math.random() * AVATAR_COLORS.length);
  return AVATAR_COLORS[index];
}

interface Props {
  admins: Admins[];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function AdminTable({ admins }: Props) {
  const avatarColors = useMemo(
    () =>
      admins.reduce<Record<string, string>>((acc, admin) => {
        acc[admin.id] = getAvatarColor();
        return acc;
      }, {}),
    [admins],
  );

  const columns: ColumnDef<Admins, any>[] = [
    {
      accessorKey: "name",
      header: "Admin",
      cell: ({ row }) => {
        const { name, id } = row.original;
        const initials = getInitials(name);
        const avatarColor = avatarColors[id] ?? AVATAR_COLORS[0];

        return (
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold ${avatarColor}`}
            >
              {initials}
            </span>
            <span>{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "course",
      header: "Role",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{row.original.role}</span>
        </div>
      ),
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },

    {
      accessorKey: "date",
      header: "Date Joined",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {formatDate(row.original.inviteAcceptedAt)}
          </span>
        </div>
      ),
    },

    {
      id: "actions",
      header: "",
      cell: () => (
        <button
          type="button"
          className="text-[13px] text-[#4E845F] hover:opacity-80"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={admins}
      searchable
      roleOptions={["All", "super admin", "admin"]}
      statusOptions={["All", "active", "suspended", "pending"]}
    />
  );
}
