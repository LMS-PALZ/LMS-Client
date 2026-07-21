"use client";

import { DataTable } from "@ssu/ui";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

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

interface AssessmentSubmission {
  id: string;
  studentName: string;
  avatar: string;
  title: string;
  type: string;
  submittedAt: string;
}

const data: AssessmentSubmission[] = [
  {
    id: "1",
    studentName: "Speed luka",
    avatar: "/images/avatar1.png",
    title: "Social Media Strategy: Viral Campaigns",
    type: "Assignment",
    submittedAt: "Jun 7, 2026",
  },
  {
    id: "2",
    studentName: "Anna mila",
    avatar: "/images/avatar2.png",
    title: "Social Media Strategy: Viral Campaigns",
    type: "Assignment",
    submittedAt: "Jun 7, 2026",
  },
  {
    id: "3",
    studentName: "Anna mila",
    avatar: "/images/avatar2.png",
    title: "Social Media Strategy: Viral Campaigns",
    type: "Assignment",
    submittedAt: "Jun 7, 2026",
  },
];

export function AssessmentGradingTable() {
  const router = useRouter();
  const avatarColors = useMemo(
    () =>
      data.reduce<Record<string, string>>((acc, submission) => {
        acc[submission.id] = getAvatarColor();
        return acc;
      }, {}),
    [],
  );

  const columns: ColumnDef<AssessmentSubmission, any>[] = [
    {
      accessorKey: "name",
      header: "Trainer",
      cell: ({ row }) => {
        const { studentName, id } = row.original;
        const initials = getInitials(studentName);
        const avatarColor = avatarColors[id] ?? AVATAR_COLORS[0];

        return (
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold ${avatarColor}`}
            >
              {initials}
            </span>
            <span>{studentName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <span className="text-sm">{row.original.title}</span>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <span className="text-sm">{row.original.type}</span>,
    },
    {
      accessorKey: "submittedAt",
      header: "Date submitted",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.submittedAt}</span>
      ),
    },
  ];

  const rows = Array.isArray(data) ? data : [];
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-[#202124]">
            Assessment for grading (20)
          </h2>

          <p className="mt-1 text-[13px] text-[#6B7280]">
            Recent submitted assessment by students
          </p>
        </div>

        <button
          onClick={() => router.push("/assessment")}
          className="text-[14px] font-medium text-[#4B7F5C]"
        >
          View all assessment
        </button>
      </div>

      <DataTable columns={columns} data={rows} />
    </section>
  );
}
