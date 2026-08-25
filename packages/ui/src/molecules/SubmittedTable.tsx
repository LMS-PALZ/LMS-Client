"use client";

import { DataTable, StatusBadge } from "@ssu/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { StaffAssignmentsubmitted } from "@ssu/types";
import { EllipsisVertical } from "lucide-react";

interface StudentsTableProps {
  students: StaffAssignmentsubmitted[];
  weight: number;
  onViewSubmission?: (submission: StaffAssignmentsubmitted) => void;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function SubmittedTable({
  students,
  weight,
  onViewSubmission,
}: StudentsTableProps) {
  const columns: ColumnDef<StaffAssignmentsubmitted, any>[] = [
    {
      accessorKey: "student",
      header: "Student",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.profile.photo.url}
            alt={row.original.studentId.first_name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="text-[14px] font-medium text-[#1D1D1D]">
              {row.original.studentId.first_name}{" "}
              {row.original.studentId.last_name}
            </p>
            <p className="text-[12px] text-[#6B7280]">
              {row.original.studentId.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.score !== null
            ? `${row.original.score}/${weight}`
            : "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date Submitted",
      cell: ({ row }) => (
        <span className="text-sm">{formatDate(row.original.submittedAt)}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const handleClick = onViewSubmission
          ? () => onViewSubmission(row.original)
          : undefined;

        return (
          <button
            type="button"
            onClick={handleClick}
            disabled={!onViewSubmission}
            className={`text-[13px] text-[#4E845F] hover:opacity-80 ${
              !onViewSubmission ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <EllipsisVertical />
          </button>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={students ?? []} />;
}
