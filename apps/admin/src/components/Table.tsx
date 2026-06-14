"use client";

import { DataTable } from "@ssu/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "@ssu/types";
import { useMemo } from "react";
import { StatusBadge } from "./StatusBadge";
import { useRouter } from "next/navigation";

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
  students: Student[];
}

export function Table({ students }: Props) {
  const router = useRouter();

  const avatarColors = useMemo(
    () =>
      students.reduce<Record<string, string>>((acc, student) => {
        acc[student.id] = getAvatarColor();
        return acc;
      }, {}),
    [students],
  );

  const columns: ColumnDef<Student, any>[] = [
    {
      id: "select",
      header: () => <input type="checkbox" />,
      cell: () => <input type="checkbox" />,
    },
    {
      accessorKey: "name",
      header: "Student",
      cell: ({ row }) => {
        const { firstName, lastName, id } = row.original;
        const initials = getInitials(`${firstName} ${lastName}`);
        const avatarColor = avatarColors[id] ?? AVATAR_COLORS[0];

        return (
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold ${avatarColor}`}
            >
              {initials}
            </span>
            <span>
              {firstName} {lastName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "program",
      header: "Program",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{row.original.programTitle}</span>
        </div>
      ),
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{row.original.progressPercent}%</span>
        </div>
      ),
    },
    {
      accessorKey: "attendance",
      header: "Attendance",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{row.original.attendance.display}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.statusLabel} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => router.push(`/students/${row.original.id}`)}
          className="text-[13px] text-[#4E845F] hover:opacity-80"
        >
          View
        </button>
      ),
    },
  ];

  return <DataTable columns={columns} data={students ?? []} searchable />;
}
