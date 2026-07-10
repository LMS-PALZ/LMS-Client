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
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-[13px] font-semibold text-white">
            {row.original.studentId.first_name.charAt(0)}
            {row.original.studentId.last_name.charAt(0)}
          </span>
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
